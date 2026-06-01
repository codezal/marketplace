# Hypothesis-driven debugging

Stubborn bugs are won by method, not by inspiration. The method is a loop:
form falsifiable hypotheses, rank them, test the cheapest discriminating one,
record the result, repeat until the cause is proven. This is the core of
`/debug-deep`.

---

## What makes a hypothesis usable

A usable hypothesis is **falsifiable** and **specific** — it predicts something
you can check, and a single experiment can prove it wrong.

| Not a hypothesis | A hypothesis |
|---|---|
| "The cache is broken." | "`getUser` returns a stale record because the cache key omits the tenant id, so tenant B reads tenant A's entry." |
| "Race condition somewhere." | "Two requests enter `reserveStock` before either decrements, because the check and the write aren't atomic." |
| "Bad input." | "The parser drops the last row when the file has no trailing newline." |

If you can't state what experiment would disprove it, refine it until you can.

## Rank by likelihood × cost-to-test

Don't test in the order hypotheses occurred to you. Score each by **how likely it
is** times **how cheaply it can be discriminated**, and run the experiment that
*splits the remaining space fastest* — the one whose result rules out the most,
whichever way it goes. A cheap test that eliminates half the possibilities beats
an expensive test of your favourite theory.

## One variable per experiment

Change exactly one thing, re-run, observe. If you change three things and the
failure goes away, you've learned nothing about which mattered — and you may have
introduced a second bug that masks the first. Discipline here is what separates
diagnosis from flailing.

## Keep a ledger

Track every experiment so you don't loop or forget what's been excluded:

```markdown
| # | Hypothesis | Experiment | Result | Status |
|---|---|---|---|---|
| 1 | key omits tenant id | log key for 2 tenants | keys identical | ruled IN |
| 2 | TTL too long | set TTL=0 | still stale | ruled OUT |
```

"Ruled out" is progress. Half of debugging is shrinking the space of what it
*could* be.

## Techniques that generate evidence cheaply

- **Binary search the space.** Disable half the suspect code (feature flag,
  early return, comment a block); does the failure persist? Each split halves the
  search. `git bisect` is binary search over history.
- **Differential analysis.** Compare a passing case with a failing case and
  shrink the difference until one change flips the outcome — that change sits on
  the causal path.
- **Trace the data, not just the code.** Follow the bad *value* backward to its
  origin with `code_callers` / `code_trace`. Where did this wrong value first
  appear? That's upstream of the symptom.
- **Rubber-duck the invariant.** State what the code assumes is always true at the
  fault point. Bugs live where an assumed invariant is silently violated.

## When you can't isolate it

If experiments run out before the cause is proven, don't fabricate a conclusion.
Report:

1. the reliable reproduction (or the remaining nondeterminism),
2. the ledger — what's ruled in and out,
3. the narrowed search space,
4. the next discriminating experiment you'd run.

A precise "not yet isolated, here's the boundary" is a real result and a
hand-off someone else can pick up. A confident wrong root cause is worse than
none — it sends the next person down a dead end.
