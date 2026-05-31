---
name: refine
description: Fast, safe code tidy-up. No arg → current diff. Arg "branch <base>" → branch diff. Arg "<file>" → single file. Applies only behavior-preserving (SAFE) moves.
---

# /refine

Invokes the code-refiner agent for a fast, safe-only simplification pass.

When this command is invoked, the following prompt is sent to the model:

```
Call the code-refiner agent. Target: $ARGS

If the target is empty: refine the current working-tree changes
(`git diff` and `git diff --staged`) — recently modified code only.
If it is in the form "branch <base>": refine the diff `git diff <base>...HEAD`.
If it is a file path: refine that ENTIRE file.

Apply ONLY SAFE-tier moves (see references/taxonomy.md) — changes that
cannot alter behavior. Detect the project's own conventions from
CLAUDE.md/AGENTS.md and neighboring files; do not impose outside rules.
Preserve behavior exactly and stay surgical.

End with the code-refiner report: per-file changes + move names, LOC delta,
what you verified, and a Deferred list of behavior-risky opportunities for
/refine-deep. If you could not verify behavior preservation, say so plainly.
```
