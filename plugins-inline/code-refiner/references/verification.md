# Verification — proving behavior is preserved

`code-refiner-deep`'s core promise: behavior is *verified* unchanged, not
assumed. This pack is how. The guarantee is only ever as strong as the
checks that cover the touched code — be honest about that in the report.

## 1. Discover the check suite

Look, in order, for how this project verifies itself:

1. **`CLAUDE.md` / `AGENTS.md`** — explicit test/build/lint commands. Prefer
   these; they reflect the user's real workflow.
2. **Manifest scripts** — `package.json` `scripts` (`test`, `typecheck`,
   `build`, `lint`), `Makefile` targets, `justfile`, `tox.ini`, `noxfile`.
3. **Toolchain by ecosystem:**
   | Ecosystem | Typecheck / compile | Tests |
   |---|---|---|
   | TS/JS | `tsc --noEmit` | `vitest`, `jest`, `node --test` |
   | Python | `mypy`, `pyright` | `pytest`, `unittest` |
   | Rust | `cargo check` | `cargo test` |
   | Go | `go build ./...` | `go test ./...` |
   | Java/Kotlin | `gradle compileJava` | `gradle test`, `mvn test` |
   | Ruby | — | `rspec`, `rake test` |

Run these plainly via `run_command`. Codezal filters noisy shell output —
tests, build, lint, git — at the system level (Kompakt Shell), so you never
need to wrap or trim the commands yourself.

## 2. Baseline before touching anything

Run the discovered checks **first** and record the result (pass/fail counts).
This is the contract you must not break.

- **Baseline green** → you may apply REVIEW-tier moves behind re-verification.
- **Baseline red, or no usable check** → SAFE-tier only. State clearly that
  behavior preservation is *unverified*. Optionally offer to add a
  characterization test for the touched code before refactoring.

## 3. Verify incrementally

- Apply SAFE moves in a batch; re-run the cheapest relevant check (typecheck
  or the narrowest test target).
- Apply each REVIEW move (or a tiny batch) and **re-run the checks that cover
  it** before continuing. A new failure means the move was not behavior-
  preserving → revert it immediately and move on.
- Scope the runner when you can (single file/test path) for speed; run the
  full suite at the end.

## 4. Green-to-green gate

A change ships only if every check that passed at baseline still passes at
the end. "Compiles" is not "passes" — a green typecheck with no tests proves
types line up, not that logic is intact; say so.

## 5. When checks are thin or absent

- Do a **manual semantic diff**: read the before/after and argue, per change,
  why outputs/effects/errors are identical. Apply only what you can defend.
- For pure functions with no tests, a quick disposable scratch comparison
  (old vs new on representative inputs) can substitute — note it as informal.
- Never edit existing tests to make them pass. If a change requires changing
  a test, the behavior changed — stop and surface it; don't refactor it away.

## Reporting verification

State the exact commands run, the before/after results, and whether it was
green-to-green. If coverage of the touched code is partial, say the
preservation guarantee covers only the exercised paths. Honesty here is the
whole value of the deep mode.
