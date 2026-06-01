---
name: debug
description: Fast failure triage. Arg = an error message, failing test name, stack trace, or short description of the broken behavior. Reproduces, locates the failing code via Code Map, names the most likely root cause, and proposes (or applies) the smallest fix with a regression check.
argument-hint: "<error, failing test, stack trace, or what's broken>"
---

# /debug

Invokes the debug agent for a fast, evidence-based triage of a single failure.

When this command is invoked, the following prompt is sent to the model:

```
Call the debug agent. Failure: $ARGUMENTS

If the failure description is empty, ask one sharp question: the exact error
text, the failing command/test, or the observed-vs-expected behavior. Do not
guess at what's broken.

Follow the fast path in references/method.md:
1. Reproduce the failure deterministically (run the failing command/test via
   run_command). If you cannot reproduce it, say so and stop — an unreproduced
   bug cannot be diagnosed.
2. Locate the failing symbol from the stack trace / error using code_search,
   then code_trace / code_callers to see how execution reaches it. Do not grep
   blindly through the tree.
3. State the single most likely root cause as a falsifiable claim, with the
   evidence that supports it.
4. Apply the smallest fix that addresses the CAUSE (not the symptom), or — if
   the fix is risky or ambiguous — propose it and hand off to /debug-deep.
5. Add or point to a regression test that fails before and passes after, and
   re-run it.

Stay surgical: change only what the cause requires. End with the debug report:
reproduction, root cause + evidence, the fix, what you verified, and any
related instances worth checking in /debug-deep.
```
