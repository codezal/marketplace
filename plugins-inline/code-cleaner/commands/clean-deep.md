---
name: clean-deep
description: Deep, repo-wide cruft & architecture audit. No arg → whole repo. Arg "<path>" → subtree. Reports dead code, unused deps, duplication, circular deps, and complexity hotspots — each with a confidence tier and a verification recipe. Read-only: never edits or deletes.
---

# /clean-deep

Invokes the code-cleaner-deep agent for a repo-wide, multi-lens cruft audit.

When this command is invoked, the following prompt is sent to the model:

```
Call the code-cleaner-deep agent. Target: $ARGS

If the target is empty: audit the whole repository.
If it is a path: audit that directory subtree.

Cover every lens (see references/taxonomy.md): dead code, unused imports,
unused or misplaced dependencies, duplication, architecture smells (circular
deps, re-export chains, boundary violations), and complexity hotspots.
Confirm each finding against the Code Map (code_callers / code_callees /
code_search) and tier it CONFIRMED / LIKELY / RISKY per
references/confidence.md — never report a deletion candidate you did not
verify. This is a READ-ONLY audit — do NOT edit, delete, or write any file.

Detect the project's stack(s) and conventions first; this repo may mix
languages (e.g. a TypeScript frontend and a Rust backend) — cover all of
them, do not assume JS/TS. End with the code-cleaner-deep report
(references/report.md): findings by category with tiers and evidence, a
safest-first removal plan where each item carries the exact check to run
before removing it, and an honest note on what you could not confirm.
```
