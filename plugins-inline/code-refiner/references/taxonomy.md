# Simplification taxonomy

The catalog of moves code-refiner can make, each tagged by safety tier.
Fast `/refine` applies **SAFE** only. `/refine-deep` may apply **REVIEW**
moves, but only behind the verification gate (`verification.md`).

## Tiers

- **SAFE** — mechanically behavior-preserving. The transformation provably
  cannot change outputs, side effects, error behavior, or timing. Apply
  freely; cheap verification (re-read, formatter, typecheck) is enough.
- **REVIEW** — *intended* to preserve behavior but capable of changing it if
  an assumption is wrong (effect order, aliasing, overloaded operators,
  exceptions, concurrency). Allowed only with passing before/after checks
  that cover the affected code; revert on any regression.

When unsure which tier a move is, treat it as REVIEW. When unsure whether a
REVIEW move is correct and you can't verify it, don't make it.

---

## SAFE moves

| Move | Example | Why it's safe |
|---|---|---|
| Remove orphaned symbol | delete an import/var/helper *your* edit just made unused | nothing references it |
| Drop redundant comment | remove `// increment i` above `i++` | comments don't execute |
| Guard clause / early return | `if (!x) return; …` instead of wrapping the body in `if (x) { … }` | identical branch outcomes, no else-fallthrough |
| De-nest a ternary | replace `a ? b : c ? d : e` with `if/else` or `switch` | same value, fewer surprises |
| Name a magic literal | `const MAX_RETRIES = 3` for a repeated `3` | pure substitution, no eval-order change |
| Idiomatic equivalent | `a?.b` for `a && a.b`; `xs.map(...)` for an index loop that only maps | semantics identical in the project's language |
| Collapse duplicate-but-pure expression | hoist `f(x)` used twice **iff `f` is pure and order is unchanged** | same result, same effects |
| Whitespace/grouping inside edited lines | regroup a boolean expression you're already changing | formatting only |

## REVIEW moves (deep only, verified)

| Move | Risk to check |
|---|---|
| Extract / inline a function | changes call sites, `this`/closure capture, exception boundaries |
| Unify near-identical branches | the branches may differ in a subtle effect you missed |
| Replace a loop with a higher-order pipeline | short-circuit, early `break`/`return`, exceptions, laziness |
| Simplify a data structure | every read/write site must be updated and re-verified |
| Rename an exported/public symbol | all callers (and dynamic/string refs) must move together |
| Reorder statements | only safe if there is no data/effect dependency — prove it |
| Remove "dead" code | confirm truly unreachable across the *whole* repo, incl. reflection/exports |
| Hoist an expression with side effects | evaluation count/order changes — usually NOT preservable |

---

## Decision rule

```
Is the change purely textual / provably value-and-effect-identical?
  yes → SAFE  → /refine may apply it
  no  → REVIEW → /refine-deep only, and only if before/after checks cover it
                 and stay green; otherwise defer it to the report.
```

A move that makes code *shorter* but *less clear* (nested ternary, dense
one-liner, clever trick) is not a simplification — see `guardrails.md`.
