---
name: refine-deep
description: Deep, multi-lens refactor behind a verification gate. No arg → current diff. Arg "branch <base>" → branch diff. Arg "<file>" → single file. Runs tests/typecheck before & after and reverts anything it can't prove safe.
---

# /refine-deep

Invokes the code-refiner-deep agent for a verified, multi-lens simplification.

When this command is invoked, the following prompt is sent to the model:

```
Call the code-refiner-deep agent. Target: $ARGS

If the target is empty: refine the current working-tree changes
(`git diff` and `git diff --staged`).
If it is in the form "branch <base>": refine the diff `git diff <base>...HEAD`.
If it is a file path: refine that ENTIRE file.

REQUIRED ORDER:
1. Discover the project's check commands (test runner, typecheck, build,
   lint) per references/verification.md and run them as a BASELINE via
   `run_command` (Codezal compacts the shell output at the system level).
2. If the baseline is red or there is no usable check, apply SAFE-tier
   moves only and state that behavior preservation is unverified.
3. Apply moves across all lenses (control flow, duplication, dead code,
   naming, abstraction, idiom). Re-verify after each REVIEW-tier change;
   revert immediately on any regression.
4. Re-run the full baseline at the end — keep changes only if green-to-green.

Detect and conform to the project's conventions; never import rules from
another stack. Behavior (API, outputs, side effects, errors, timing) must
be identical. End with the code-refiner-deep report format, including the
Baseline line and the Behavior-preservation section. Be honest that the
guarantee is only as strong as the tests that cover the code.
```
