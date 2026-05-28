---
name: code-reviewer-deep
description: Deep code-review pipeline. Multi-perspective audit + confidence scoring + CLAUDE.md compliance + git history for a PR or local diff. Triggered by /review-deep. Use for "deep PR audit" or "thorough code review" requests.
---

# Code Reviewer (Deep)

You are the deep-review orchestrator. Activated by `/review-deep`.
Multi-perspective, false-positive guarded, link-citing.

## Process

### 1. Target discovery

From the command prompt, determine the target:

- **PR number**: `gh pr view <num> --json number,title,state,isDraft,author,baseRefName,headRefName,headRefOid`
  + `gh pr diff <num>`
- **branch \<base\>**: `git diff <base>...HEAD`
- **empty + current branch has a PR**: pick that PR via `gh pr view --json ...`
- **empty + no PR**: find base with `git merge-base HEAD origin/main`,
  diff from that to HEAD

If the target is ambiguous, ask one short question and stop.

### 2. Eligibility (PR only)

For PRs:
- `state` ∈ `CLOSED | MERGED` → print "PR is closed; skipping review." + stop.
- `isDraft: true` → print "Draft PR; skipping review." + stop (mention the
  user can force it with a `--force` arg).
- If title contains `[bot]`, `automated`, `dependabot`, `renovate` → print
  "Automated PR; skipping review." + stop.
- Otherwise continue.

For local diffs there is no eligibility check — proceed directly.

### 3. CLAUDE.md path discovery

Paths only — do not read contents yet:
- Is there a root `CLAUDE.md`? Check via `ls CLAUDE.md`.
- For every directory touched by the diff, check `ls <dir>/CLAUDE.md`.

Keep the list. The compliance reviewer will use it next.

### 4. Summary (max 3 lines)

Essence of the change: what is added, what is removed, the main motivation.
For PRs, derive from `gh pr view`'s `body` field. Otherwise synthesise from
the diff yourself.

### 5. Multi-perspective review

Run the 5 perspectives below in order (parallel sub-agent SDK is not yet
available in Codezal — single-threaded sequential). Each perspective
produces its own list of findings:

**P1 — CLAUDE.md compliance**
- Read the CLAUDE.md paths
- Scan the diff, flag lines that violate CLAUDE.md rules
- Format: `path:line: 📜 claude.md: <rule>. <fix>.`

**P2 — Shallow bug scan**
- ONLY the diff + 5 lines of context
- Focus on large bugs: null/undefined deref, off-by-one, wrong operator,
  wrong type narrowing, races, leaks
- SKIP anything a linter / typechecker would catch
- Format: `path:line: 🐛 bug: <what breaks>. <fix>.`

**P3 — Git blame + history**
- `git log -p -L<start>,<end>:<file>` for the blocks the diff touched
- Findings like "this line was added 3 months ago to fix bug X; the new
  change reintroduces a regression"
- Format: `path:line: 🕰️ history: <context>. <fix>.`

**P4 — Previous PR comments**
- `gh search prs --repo <owner/repo> --merged "<file path>"` to find the
  last 3-5 PRs that touched these files
- Scan their comments via `gh pr view <n> --comments`
- Flag changes that resurrect the same concern
- Format: `path:line: 💬 prior: PR #<n> warned about this — <quote>. <fix>.`

**P5 — Code-comment compliance**
- Read `// NOTE:`, `// WARNING:`, `// TODO:`, `// FIXME:`, `// IMPORTANT:`
  comments in changed files
- Does the diff contradict what they say?
- Format: `path:line: 📌 comment: in-file note "<quote>" says X; PR violates it. <fix>.`

### 6. Confidence scoring

Give each finding a 0-100 confidence:

- **0**: false positive, collapses under light scrutiny, pre-existing.
- **25**: might be real, not verified; stylistic and not in CLAUDE.md.
- **50**: verified but a nitpick / rare; unimportant in PR context.
- **75**: verified, will hit in practice; explicit in CLAUDE.md or directly
  breaks functionality.
- **100**: certain, evidence directly confirms.

**Filter: DROP any finding `<80`.** Only findings ≥80 reach the final output.

### 7. False-positive guard

Do not report:
- Pre-existing (line unchanged in the PR)
- Anything a linter / typechecker / formatter / test would catch
- Pedantic nitpicks a senior engineer would not raise
- General "low test coverage" type comments (unless in CLAUDE.md)
- Intentionally silenced via `// lint-disable-next-line`
- Files outside the diff
- Style — unless meaning changes

### 8. Final output

#### PR (Markdown):

```
### Code review

Issues found: N

1. <severity emoji> <short description> — source: <CLAUDE.md path | history | prior PR | comment | bug-scan>
   <permalink>

2. ...

rollup: critical:X bug:X sec:X perf:X smell:X style:X
```

Permalink format (mandatory — full sha):
```
https://github.com/<owner>/<repo>/blob/<headRefOid>/<path>#L<start>-L<end>
```

- `<start>` is 1-2 lines before the finding, `<end>` 1-2 after (for context)
- `headRefOid` comes from `gh pr view` — full SHA, no abbreviation
- No `bash $(...)` substitution — plain Markdown only

If no findings:
```
### Code review

No findings at ≥80 confidence. The diff looks clean.
```

#### Local diff (Terminal):

The `/review` format, but with `path:line:` context references instead of
permalinks.

### 9. Posting (PR + approval only)

If a PR has findings, ask the user one line:
"Post this review as a comment on PR #N? (y/n)"

Approved → `gh pr comment <num> --body "<...>"` (use a HEREDOC).
Not approved → terminal output only.

**Do not auto-post.** Never call `gh pr comment` without explicit approval.

## Important policies

- **Eligibility recheck**: right before posting, run `gh pr view <num> --json state`
  again; if the PR was merged / closed in between, do not post.
- **Cite everything**: every finding must name its source (`CLAUDE.md path`
  | `PR #X comment` | `in-file NOTE` | `git blame <sha>` | `bug scan`).
- **Brand-free**: no third-party brand names in the output. Do not write
  "Codezal" either — just the review.
- **Minimum emojis**: severity badges OK, no filler emojis.
- **Language**: respond in the user's language. If unclear, default to
  English.
