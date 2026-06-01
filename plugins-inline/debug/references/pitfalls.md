# Debugging pitfalls — the anti-patterns to refuse

These are the recurring ways debugging goes wrong. Each wastes time or, worse,
ships a bug that looks fixed. Recognize them and stop.

---

## Fixing the symptom, not the cause

The most expensive mistake. The error surfaces at line X, so you "fix" line X —
add a null check, wrap a `try/catch`, loosen the assertion — and the error
message disappears. But the bad state still exists; it just fails somewhere else
later, harder to trace. **Always fix where the bad state originates.** If you
find yourself making an error *message* go away rather than making the *cause*
impossible, stop.

Tell-tales of symptom-patching:
- adding `try/catch` that swallows the exception instead of preventing it
- a null/undefined guard at the crash site with no explanation of why the value
  was null
- loosening a test assertion until it passes
- adding a retry to mask a deterministic failure

## Shotgun debugging

Changing several things at once and re-running, hoping the failure clears.
Sometimes it does — and now you don't know which change fixed it, whether you
introduced a new bug, or whether you can remove the others. **One variable per
experiment.** Always.

## Theorizing before reproducing

Reading code and constructing an elaborate theory of the bug before you've seen
it fail even once. The theory is usually wrong, and you can't test it anyway.
**Reproduce first.** The real error message routinely contradicts the theory you
would have built from reading alone.

## Trusting "should" over "does"

"This should work," "that can't be null," "this path isn't reachable." Bugs live
exactly in the gap between *should* and *does*. The running program is the
authority, not your mental model. Verify the assumption — print the value, run
the path, check the branch — don't assert it.

## Blaming the environment / the library first

"It's a compiler bug," "the framework is broken," "it's a flaky machine." Almost
always it's the code. Treat third-party fault as the *last* hypothesis, reached
only after your own code is ruled out with evidence — not the first reflex that
spares your code from scrutiny.

## Declaring victory without a regression test

The fix appears to work, so you close it — with no test that fails before and
passes after. The bug returns in three weeks and no one knows it regressed.
**A fix without a failing-then-passing test is unproven and unprotected.**

## Tolerating a flaky reproduction

"It only fails sometimes, so I'll fix what looks suspicious and hope." An
intermittent repro means every experiment is unreliable and any "fix" is a coin
flip. **Make it deterministic first** (seed, ordering, clock, concurrency,
external state) — that work is part of the fix, not a detour.

## Grepping when you should be tracing

Scanning the tree for a string to guess where execution goes. Text search finds
*mentions*; it can't follow a call path through dynamic dispatch, callbacks, or
inheritance. Use `code_trace` / `code_callers` / `code_callees` to see how the
code is *actually* reached — then read the few files that matter.

## Scope creep mid-debug

"While I'm in here, let me also refactor this / rename that / fix that other
smell." Now your fix and unrelated churn are tangled in one diff, the regression
test is unclear, and review is harder. **Stay surgical.** Note other issues;
fix the bug in front of you.
