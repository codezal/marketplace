# code-cleaner

Find what your codebase no longer needs — **dead code, unused imports, unused
dependencies, and duplication** — and get a ranked, evidence-backed cleanup
plan. A Codezal-native plugin that is **read-only**: it reports and ranks, it
never edits or deletes. Language-agnostic, so it covers a mixed repo (e.g. a
TypeScript frontend *and* a Rust backend) — not just JS/TS.

## Why it exists

Dead-code finders have one dangerous failure mode: **false positives**. A
symbol that looks unused but is reached by a dynamic import, a string lookup,
or a framework hook is not dead — deleting it breaks the build. `code-cleaner`
is built around avoiding exactly that:

1. **Read-only.** It has no write tool and never deletes. Removal is always
   your call; the plugin hands you a plan, not a diff.
2. **Confirmed, not guessed.** Every finding is tiered CONFIRMED / LIKELY /
   RISKY, and CONFIRMED requires Code Map proof (zero callers) **plus** a
   dynamic/string-reference sweep **plus** an entrypoint exclusion check.
3. **Language-agnostic.** It detects the project's stacks, entrypoints, and
   conventions from `CLAUDE.md`/`AGENTS.md` and the manifests — no hardcoded
   JS/TS assumptions.

## What it ships

| Type | Name | Purpose |
|---|---|---|
| Command | `/clean [target]` | Fast, **CONFIRMED-only** scan of the current diff (or a file/branch). |
| Command | `/clean-deep [target]` | Repo-wide, multi-lens audit with tiers and a removal plan. |
| Agent | `code-cleaner` | Fast subagent: finds high-confidence cruft in scope, reports. |
| Agent | `code-cleaner-deep` | Audit subagent: sweeps every lens repo-wide, tiers and ranks. |
| References | `references/*.md` | The cruft taxonomy, the confidence protocol, the report contract. |

### Reference packs

- **`taxonomy.md`** — every cruft category, by confidence tier, with how to confirm each.
- **`confidence.md`** — the three-step proof (Code Map references → dynamic/string sweep → entrypoint exclusions) and the false-positive guardrails.
- **`report.md`** — the output contract: tiered findings with evidence + a safest-first removal plan with a verification recipe per item.

## Scope targets

```
/clean                       # current working-tree diff (default)
/clean branch main           # everything on this branch vs main
/clean src/util/parse.ts     # one whole file
/clean-deep                  # whole repository, all lenses
/clean-deep src-tauri        # one subtree, deep
```

## How it's "better" than a plain dead-code finder

1. **Works in any codebase** — stack detection instead of a JS/TS-only engine; covers Rust, TS, and mixed repos.
2. **A confidence contract** — CONFIRMED/LIKELY/RISKY tiers backed by Code Map evidence, so you know which findings are safe to act on.
3. **False-positive guardrails** — dynamic imports, reflection, DI, route strings, and framework entrypoints are explicitly ruled out before anything is called dead.
4. **Read-only by design** — it never deletes; you get a plan with a verification recipe per item, and you stay in control.
5. **Two clear entry points** — fast scoped scan vs deep repo-wide audit, invoked on demand.

## Permissions

Read files, run shell commands (to scope diffs and read config), and read git.
**No file writes, no network.** See the manifest for the exact set.

## License

Apache-2.0. See `LICENSE` and `NOTICE`. Independent, clean-room implementation —
no third-party code or prose is included.
