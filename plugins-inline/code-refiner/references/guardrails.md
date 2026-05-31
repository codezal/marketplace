# Guardrails — where simplification stops

Simpler means *easier to read, change, and debug* — not *fewer lines*. These
are the lines code-refiner must not cross. When a "simplification" trips a
guardrail, reject it (or, for a genuine improvement that needs a judgment
call, surface it in the report instead of applying it).

## Clarity floor — never trade readability for brevity

- **No nested ternaries.** Two or more `?:` in one expression → use `if/else`
  or `switch`. One simple ternary is fine.
- **No dense one-liners** that pack multiple operations a reader must unpack.
  A named intermediate is worth the line.
- **No clever tricks** — bitwise hacks for arithmetic, abusing `||`/`&&` for
  control flow, implicit coercions — unless the project already does this and
  it's idiomatic there.
- **Keep helpful abstractions.** A well-named function used once can still
  earn its place by naming an idea. Don't inline it just to cut a line.
- **Don't merge concerns.** Two responsibilities in one function/component is
  not "simpler" because it's one unit — split stays split.

## Behavior is sacred

- Same public API, return values, thrown errors, side effects, log output,
  and observable timing/order. If any of these would change, it is a
  **behavior change**, not a refinement — out of scope, surface it.
- Treat error/exception paths, async/await ordering, and concurrency as
  high-risk. Don't restructure them without tests that exercise them.
- Don't change number formatting, locale, precision, or serialization shape.

## Scope discipline

- Refine **only recently changed code** by default. Don't widen scope to
  "while I'm here" cleanups.
- Don't reformat or re-style untouched lines/regions. Respect the existing
  formatter; produce no churn outside the change.
- Remove only the orphans **your** edits created. Pre-existing dead code →
  report it, don't delete it (the user didn't ask, and it may be referenced
  in ways you can't see).
- No new dependencies. No new files. No feature additions. No speculative
  configurability or error handling for impossible states.

## Convention discipline

- **Detect, don't dictate.** Conform to the project's actual conventions
  (from `CLAUDE.md`/`AGENTS.md` and neighboring files). Never impose rules
  from another stack — no "prefer `function` over arrow", no framework-
  specific patterns — unless the project already follows them.
- If two local styles conflict, match the nearest/most-recent neighbor and
  note the inconsistency rather than picking a third style.

## The test

Every change must trace to a clear readability or maintainability win **with
behavior provably unchanged**. If you can't say in one line why it's clearer,
or you can't show behavior is preserved, don't make it.
