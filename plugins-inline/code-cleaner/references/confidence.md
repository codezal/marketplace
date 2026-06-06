# Confidence protocol

How code-cleaner proves a finding is dead before tiering it CONFIRMED. This is
the difference between a useful report and a dangerous one: **dead-code false
positives are the failure mode this plugin exists to avoid.** A symbol that
*looks* unused but is reached by a dynamic import, a string lookup, or a
framework hook is not dead — recommending its removal would break the build.

Apply all three steps. A finding is **CONFIRMED** only if all three pass.

## Step 1 — Code Map references (structural)

Use the Code Map, not text alone:

- `code_callers <symbol>` → must be **empty** (no call sites anywhere).
- `code_search <symbol>` → confirms the definition and any structural refs.
- For a whole file, run this for **every exported symbol**; the file is a
  candidate only if all come back empty.

The Code Map resolves real call sites across the repo — including ones a text
`grep` misses (renamed imports, type-only uses). Trust it over grep for
*structural* reach, but it does **not** see dynamic/string reach — that is Step 2.

## Step 2 — Dynamic & string sweep (text)

Structural analysis cannot see references built at runtime. `grep` the symbol
name across the repo and rule out:

- Dynamic `import()` / `require()` with a computed or string path.
- Reflection / metaprogramming: `Reflect`, `Object.keys`, `globalThis[...]`,
  Rust macros, proc-macro registration, `get_function_by_name`-style lookups.
- Dependency injection / registries keyed by string or token.
- Route tables, event names, command names, serialized identifiers, config keys.
- Names referenced from non-code: JSON/TOML/YAML manifests, templates, generated
  bindings.

Any hit here → the symbol is reachable → **not CONFIRMED** (tier RISKY).

## Step 3 — Entrypoint & public-API exclusions

Some symbols have **zero in-repo callers by design** — they are called by the
framework, the OS, or external consumers. These are never CONFIRMED dead:

- **Tauri commands** — `#[tauri::command]` handlers (invoked by name from the
  frontend via IPC).
- **Program entrypoints** — `main`, `lib.rs` public exports, `_start`, WASM
  exports, `index.*` barrels that define a package's public surface.
- **Package API** — anything in `package.json` `exports`/`main`/`bin`, or a
  Rust crate's `pub` items in a `lib` target consumed downstream.
- **Plugin / extension entries** — registered agents, commands, hooks,
  providers; anything the host loads by manifest.
- **Framework hooks** — route handlers, lifecycle callbacks, decorators,
  event subscribers, test fixtures the runner discovers by convention.
- **Test-only references** — reached *only* from tests: not dead, but a
  candidate for the "misplaced dependency / test-only" note, tier LIKELY.
- **Generated / vendored code** — do not flag; it is owned elsewhere.

Detect these from `CLAUDE.md`/`AGENTS.md`, the manifests, and the project's
conventions — don't hardcode one stack's list.

## Tiering from the evidence

| Step 1 (callers) | Step 2 (dynamic) | Step 3 (entrypoint) | Tier |
|---|---|---|---|
| empty | clean | not excluded | **CONFIRMED** |
| empty | clean | excluded (barrel/test-only) | **LIKELY** (state the caveat) |
| empty | hit | — | **RISKY** |
| unknown / not run | — | — | not CONFIRMED → "Not fully confirmed" |

When two readings disagree or you couldn't run a step, **tier down**. Never
promote a finding to CONFIRMED to make the report look more complete — an
honest LIKELY is worth more than a wrong CONFIRMED.
