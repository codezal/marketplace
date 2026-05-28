---
name: review
description: Start a code review. No arg → current diff. Arg "branch <base>" → branch diff. Arg "<PR#>" → GitHub PR. Arg "<file>" → single file.
---

# /review

Invokes the code-review agent.

When this command is invoked, the following prompt is sent to the model:

```
Call the code-reviewer agent. Target: $ARGS

If the target is empty: review the current working tree diff
(`git diff` and `git diff --staged`).
If it is in the form "branch <base>": review `git diff <base>...HEAD`.
If it is a bare number (PR id): review via `gh pr view <num>` + `gh pr diff <num>`.
If it is a file path: review the ENTIRE file (no diff).

Stay faithful to the code-reviewer format: path:line lines + the final rollup.
No praise, no scope creep, no refactor suggestions.
```
