---
name: clean
description: Fast, read-only cruft scan. No arg → current diff. Arg "branch <base>" → branch diff. Arg "<file>" → single file. Reports only high-confidence (CONFIRMED) dead code, unused imports, and obvious duplication. Never edits files.
---

# /clean

Invokes the code-cleaner agent for a fast, read-only scan of the highest-confidence cruft.

When this command is invoked, the following prompt is sent to the model:

```
Call the code-cleaner agent. Target: $ARGS

If the target is empty: scan the current working-tree changes
(`git diff` and `git diff --staged`) — recently modified code only.
If it is in the form "branch <base>": scan the diff `git diff <base>...HEAD`.
If it is a file path: scan that ENTIRE file.

Report ONLY CONFIRMED-tier findings (see references/confidence.md): cruft you
have proven dead by confirming zero references across the repo with the Code
Map (code_callers / code_search) AND ruling out dynamic/string references and
framework entrypoints. This is a READ-ONLY pass — do NOT edit, delete, or
write any file. Detect the project's stack and conventions from
CLAUDE.md/AGENTS.md and neighboring files; do not assume JS/TS.

End with the code-cleaner report (see references/report.md): findings grouped
by category with file:line and the evidence for each, plus a safest-first
removal plan the user can act on. Hand lower-confidence (LIKELY/RISKY)
findings to /clean-deep rather than reporting them here.
```
