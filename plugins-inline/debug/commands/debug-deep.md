---
name: debug-deep
description: Hypothesis-driven root-cause investigation for a stubborn or intermittent bug. Reproduces reliably, builds a ranked hypothesis tree, maps the failure path with Code Map, bisects git history when useful, isolates the true cause with evidence, fixes it, and proves the fix with a regression test.
argument-hint: "<error, failing test, stack trace, or what's broken — plus any context>"
---

# /debug-deep

Invokes the debug-deep agent for a full root-cause investigation behind an evidence gate.

When this command is invoked, the following prompt is sent to the model:

```
Call the debug-deep agent. Failure: $ARGUMENTS

This is the deep path for bugs that are stubborn, intermittent, or whose first
fix didn't hold. Follow references/method.md and references/hypothesis.md in
full:

1. REPRODUCE — make the failure happen on demand. If it's intermittent, find
   the conditions that make it reliable (seed, ordering, concurrency, data,
   environment). A flaky repro is the first thing to fix, not work around.
2. ISOLATE — shrink the failure to its smallest trigger. Use code_trace and
   code_callers/code_callees to map the exact path execution takes to the
   fault, and code_search to find every site that shares the pattern. Use
   `git bisect` (via git) when the bug was introduced by a known-good→bad range.
3. HYPOTHESIZE — write 2–4 falsifiable hypotheses, rank by likelihood × cost-
   to-test, and test the cheapest discriminating one first. Record what each
   test rules in or out. Do not change more than one variable at a time.
4. DIAGNOSE — state the root cause with the evidence chain that proves it.
   Distinguish the cause from its symptoms; name why earlier code paths let it
   through.
5. FIX & VERIFY — fix the cause, add a regression test that fails before and
   passes after, run the project's full check suite (tests, typecheck, build),
   and search for sibling instances of the same root cause elsewhere.

End with the debug-deep report: reliable reproduction, the hypothesis ledger
(tested / ruled out), root cause + evidence, the fix, the regression test,
verification results, and any related instances. If you could not isolate the
cause, report exactly how far you got and the next discriminating experiment —
never ship a symptom patch dressed up as a fix.
```
