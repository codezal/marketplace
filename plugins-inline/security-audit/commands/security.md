---
name: security
description: Fast security scan over a diff, file, or directory. One line per finding with CWE / OWASP mapping.
---

Run the `security-auditor` agent.

If the user passes a path or git ref as argument, scan that. Otherwise auto-detect:

1. If currently on a non-default branch with a diff against the default branch, scan that diff.
2. Else if there are staged changes, scan staged.
3. Else if there are unstaged changes, scan the working tree.
4. Else ask the user what to scan — do not silently scan the whole repo.

Stay terse. One line per finding. Severity-tagged. No praise, no scope creep. Reply in the user's language.
