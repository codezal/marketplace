---
name: review-deep
description: Deep code review — multi-agent pipeline + confidence scoring + CLAUDE.md compliance + git history. Auto-detects the current branch's PR; falls back to local branch diff. Supports --threshold N.
---

# /review-deep

Deep / multi-perspective review pipeline. `/review` is single-pass and fast;
this command is thorough, multi-angle, false-positive guarded.

When this command is invoked, the following prompt is sent to the model:

```
Call the code-reviewer-deep agent. Argument: $ARGS (may be empty)

The agent parses out a `--threshold N` flag if present (N in 0-100,
default 80). Examples:
  /review-deep                    → target auto, threshold 80
  /review-deep 42                 → PR 42, threshold 80
  /review-deep 42 --threshold 70  → PR 42, threshold 70
  /review-deep branch main --threshold 90

Target discovery order (after stripping --threshold):
1. If $ARGS is a number → that GitHub PR (`gh pr view <num>` + `gh pr diff <num>`)
2. If $ARGS is "branch <base>" → branch diff (`git diff <base>...HEAD`)
3. If $ARGS is empty:
   a. Try `gh pr view --json number,title,state,isDraft,author` → if the
      current branch has a PR, use it
   b. Else try `gh pr list --head $(git branch --show-current) --json number,title`
      → use any result
   c. Else use the local branch diff (`git merge-base HEAD origin/main`,
      diff from that to HEAD)
   d. If none of these resolves, ask one short question:
      "PR number, or 'branch <base>'?"

Pipeline (orchestrated by the code-reviewer-deep agent):
- Eligibility: skip closed / draft / automated / already-reviewed PRs
- Context: paths of root + per-directory CLAUDE.md (paths only, not content)
- Summary: 3-line gist of the change
- Multi-perspective review (parallel in spirit):
  · CLAUDE.md compliance
  · Shallow bug scan (diff only, no scope creep)
  · Git blame + history context
  · Previous PR comments
  · In-file NOTE/TODO/WARNING compliance
- Confidence scoring: each finding 0-100, drop anything <80
- Final output: short, link-citing, severity-tagged. Compatible with
  the code-reviewer format (path:line + emoji + severity + problem + fix)
  but with context links added.

If it is a PR: ASK the user before posting the review via
`gh pr comment <num> --body "..."`. Never auto-post.
Use permalinks in the canonical form:
  https://github.com/<owner>/<repo>/blob/<full-sha>/<path>#L<start>-L<end>

If it is a local diff: terminal output only, no posting.

No praise. No pre-existing issues. No linter / typecheck / test findings
(CI catches those). No off-scope advice.
```
