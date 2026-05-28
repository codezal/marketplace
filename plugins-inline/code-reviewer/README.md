# code-reviewer

Codezal-native code review plugin. Ships two slash commands:

- **`/review`** — fast single-pass review of a diff / branch / PR / file.
- **`/review-deep`** — multi-perspective audit with confidence scoring,
  CLAUDE.md compliance checks, git history, and (optional) PR comment
  posting.

- **Version:** 0.2.0
- **Author:** Codezal
- **License:** Apache-2.0
- **Channel:** codezal-curated (verified)
- **Permissions:** `filesystem.read`, `git.exec`, `shell.exec`,
  `agents.register`, `commands.register`

> ⚠️ `shell.exec` is a **high-risk permission**. It lets the plugin run
> `git` and `gh` commands on your machine. The install approval modal
> shows a red warning and requires you to tick the confirmation checkbox.

## What it ships

| Type | Name | Purpose |
|---|---|---|
| Slash command | `/review` | Quick single-pass review. |
| Slash command | `/review-deep` | Multi-perspective deep audit. |
| Agent | `code-reviewer` | Severity-tagged review engine. |
| Agent | `code-reviewer-deep` | Deep pipeline orchestrator. |

## Install

1. Open Codezal → **Settings → Plugins**.
2. The default marketplace is pre-seeded. If missing, paste
   `https://github.com/codezal/marketplace` into **Add Marketplace**.
3. Find **code-reviewer** in the catalog → **Install**.
4. Tick the high-risk acknowledgement checkbox (`shell.exec`) → **Install**.

## Requirements

| Feature | Needs |
|---|---|
| `/review` (diff / branch / file) | `git` |
| `/review` (PR) | `gh` CLI + `gh auth login` |
| `/review-deep` (any mode) | `git` + `gh` (for PR detection) |
| `/review-deep` posting to PR | `gh auth login` with PR comment permission |

Install `gh` if needed:
```sh
# macOS
brew install gh

# Debian / Ubuntu
sudo apt install gh

# Windows
winget install --id GitHub.cli
```

Then: `gh auth login`.

## Usage — `/review`

```
/review                         # current diff (staged + unstaged)
/review branch main             # diff vs main branch
/review 42                      # GitHub PR #42
/review src/auth.ts             # entire file (no diff)
```

Output format:
```
src/auth.ts:42: 🔒 sec: JWT secret default fallback. Use `??  throw`.
src/auth.ts:78: 🐛 bug: expiresAt strict-less-than lets equality through. Use `<=`.
rollup: critical:0 bug:1 sec:1 perf:0 smell:0 style:0
```

Each finding is one line:
`<path>:<line>: <emoji> <severity>: <problem>. <fix>.`

Severities: `critical` 🔥, `bug` 🐛, `sec` 🔒, `perf` ⚡, `smell` 🧹, `style` 💅.

Silence = approval. No praise, no off-diff suggestions.

## Usage — `/review-deep`

```
/review-deep                    # auto: detect current branch's PR, or fall back to local diff vs main
/review-deep 42                 # GitHub PR #42
/review-deep branch main        # branch diff vs main
```

### Auto-detection order

1. `gh pr view --json ...` — if the current branch has a PR, that PR is used.
2. `gh pr list --head <branch>` — first match wins.
3. `git merge-base HEAD origin/main` — local branch diff is reviewed.
4. If none resolve, you are asked once.

### Pipeline

1. **Eligibility** — skip closed / draft / automated PRs.
2. **CLAUDE.md path discovery** — root + every touched directory.
3. **Summary** — 3-line gist (PR body or diff synthesis).
4. **Five-perspective review**
   - CLAUDE.md compliance
   - Shallow bug scan (diff-only, no scope creep)
   - Git blame + history context
   - Previous PR comments on the same files
   - In-file `NOTE` / `WARNING` / `TODO` compliance
5. **Confidence scoring 0-100** — anything `<80` is dropped.
6. **False-positive guard** — pre-existing, linter-catchable, pedantic
   nits, off-scope, intentionally silenced lines are all suppressed.
7. **Output** — Markdown with permalinks (full SHA) for PR mode,
   terminal-friendly path:line for local mode.
8. **PR comment posting** — only after explicit user approval. Never
   automatic.

### PR output sample

```
### Code review

Issues found: 2

1. 🐛 bug — JWT expiry uses strict-less-than; tokens at exact expiry slip through.
   Source: P2 shallow bug scan.
   https://github.com/owner/repo/blob/<sha>/src/auth.ts#L76-L80

2. 📜 claude.md — function-level docstrings violate "no docstrings" rule.
   Source: P1 CLAUDE.md compliance (src/CLAUDE.md).
   https://github.com/owner/repo/blob/<sha>/src/util.ts#L12-L18

rollup: critical:0 bug:1 sec:0 perf:0 smell:0 style:0
```

If clean:
```
### Code review

No findings at ≥80 confidence. The diff looks clean.
```

## Disable / uninstall

Settings → Plugins → `code-reviewer` → toggle **Off** to keep installed
but inert, or trash icon to remove the directory entirely.

## Source

Inline — code lives at
[`plugins-inline/code-reviewer/`](.). No external clone.

## Troubleshooting

- **`gh: command not found`** — install GitHub CLI (see Requirements).
- **`gh pr view` fails with auth error** — run `gh auth login`.
- **`/review` slash command not appearing** — reload the window
  (Cmd+R / Ctrl+R) so the Composer picks up the new registry entry.
- **`/review-deep` keeps asking for the target** — your branch is not
  pushed and has no PR. Either push it (`git push -u origin HEAD`) or
  pass `branch <base>` explicitly.
- **Review never posts to the PR** — that is by design. The agent asks
  for approval and prints the comment to terminal first; you opt in.
