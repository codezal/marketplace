# code-refiner

Make recently changed code **clearer and more maintainable without changing what it does** — and *prove* behavior is preserved instead of hoping it is. A Codezal-native plugin that tidies code on demand, in any language, conforming to *your* project's conventions.

## Why it exists

The usual "simplify my code" agent has three weak spots: it **hardcodes one stack's rules** (ES modules, `function` over arrow, React patterns), it **assumes** its rewrites are behavior-preserving, and it edits **silently**. `code-refiner` fixes all three:

1. **Project-agnostic.** It detects conventions from `CLAUDE.md`/`AGENTS.md` and neighboring files — no rules imported from another stack.
2. **Verified, not assumed.** Deep mode runs your tests/typecheck/build *before and after* and reverts anything it can't keep green-to-green.
3. **Safety-tiered & scoped.** Every move is tagged SAFE (mechanical) or REVIEW (behavior-risky); the fast pass touches only SAFE moves, only on recently changed code.

## What it ships

| Type | Name | Purpose |
|---|---|---|
| Command | `/refine [target]` | Fast, **SAFE-only** tidy-up of the current diff (or a file/branch). |
| Command | `/refine-deep [target]` | Multi-lens refactor behind a **verification gate**. |
| Agent | `code-refiner` | Fast subagent: detects conventions, applies safe moves, reports. |
| Agent | `code-refiner-deep` | Refactoring subagent: baselines checks, refines, re-verifies, reverts regressions. |
| Hook | `PostToolUse` (opt-in) | After edits, *suggests* `/refine` — never rewrites. Off by default. |
| References | `references/*.md` | The move taxonomy, the clarity guardrails, the verification protocol. |

### Reference packs

- **`taxonomy.md`** — every simplification move, tagged SAFE vs REVIEW, with the reason each is (or isn't) behavior-preserving.
- **`guardrails.md`** — where simplification stops: no nested ternaries, no clever one-liners, behavior is sacred, scope stays surgical, conventions are detected not dictated.
- **`verification.md`** — discover the check suite, baseline it, verify incrementally, enforce green-to-green, and be honest when coverage is thin.

## Scope targets (both commands)

```
/refine                      # current working-tree diff (default)
/refine branch main          # everything on this branch vs main
/refine src/util/parse.ts    # one whole file
/refine-deep                 # same targets, deep + verified
```

## The proactive hook (opt-in)

A `PostToolUse` hook fires after `Write`/`Edit`/`MultiEdit`. It is **silent by default** and only ever *suggests* running `/refine` — it never reads or modifies your code. Enable it for a session by exporting:

```bash
export CODE_REFINER_AUTO=1
```

With it unset (the default), the plugin is purely command-driven.

## How it's "better" than a plain simplifier agent

1. **Works in any codebase** — convention detection instead of one hardcoded stack.
2. **A safety contract** — SAFE/REVIEW tiers mean the fast pass can't change behavior, and the deep pass must *prove* it didn't.
3. **A verification gate** — tests/typecheck run before and after; regressions are auto-reverted; green-to-green or it doesn't ship.
4. **Honest reporting** — it states what it verified and admits what it couldn't, so you never get a false guarantee.
5. **Two clear entry points + an opt-in nudge** — fast vs deep on demand, plus a safe proactive channel — not silent ambient rewriting.

## Permissions

Read/write/edit files, run shell commands (to verify), and read git (to scope diffs). No network access. See the manifest for the exact set.

## License

Apache-2.0. See `LICENSE` and `NOTICE`. Independent, clean-room implementation — no third-party code or prose is included.
