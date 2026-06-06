# Cruft taxonomy

The catalog of what code-cleaner looks for, by category and **confidence tier**.
Fast `/clean` reports **CONFIRMED** findings only, in the recent-change scope.
`/clean-deep` covers every category repo-wide and reports all three tiers.

This plugin is **read-only** — it reports and ranks, it never removes. Tiers
describe how safe a finding would be *to remove*, so the user can act with the
right level of caution.

## Confidence tiers

- **CONFIRMED** — proven dead: zero references repo-wide via the Code Map
  (`code_callers` / `code_search`), no dynamic/string reference found by a
  `grep` sweep, and not on the entrypoint/public-API exclusion list
  (`confidence.md`). Safe to recommend for removal.
- **LIKELY** — looks dead but carries a stated caveat (exported from a barrel/
  `index`, reachable only from tests, behind a feature flag). Needs a human call.
- **RISKY** — reachable by dynamic dispatch, reflection, DI, route/string
  lookup, or is a framework entrypoint. Report for awareness; advise against
  removal.

When evidence is missing or ambiguous, **tier down**. No Code Map evidence →
cannot be CONFIRMED.

---

## Categories

| Category | What it is | How to confirm | Typical tier |
|---|---|---|---|
| Unused import | imported, referenced nowhere in the file | re-read the file; the name appears only on the import line | CONFIRMED |
| Orphaned local | a function/const/type nothing references | `code_callers` empty + name `grep` clean repo-wide | CONFIRMED |
| Unreachable code | block after unconditional `return`/`throw`, `if (false)` | local control-flow read | CONFIRMED |
| Unused export | exported symbol with no importer | `code_callers` empty **and** dynamic-ref sweep clean **and** not public API | LIKELY→CONFIRMED |
| Unreferenced file | a module imported by nothing | `code_callers`/`code_search` on its exports all empty; not an entrypoint | LIKELY→CONFIRMED |
| Unused dependency | package declared but imported nowhere | `grep` the import specifier across the repo → none | LIKELY→CONFIRMED |
| Misplaced dependency | prod dep used only in tests/build | all import sites are test/build files | LIKELY |
| Duplication | near-identical block/function in 2+ places | `code_search` + `grep` for the shape (heuristic, not exhaustive) | LIKELY |
| Circular dependency | import cycle between modules | trace with `code_callees`/`code_callers` | RISKY (smell, not removal) |
| Re-export chain | `export … from` hops with no own logic | follow the chain by reading | LIKELY (collapse, not delete) |
| Boundary violation | layer importing across an architectural boundary | check against the project's stated layering | RISKY (smell) |
| Complexity hotspot | oversized/deeply-nested fn, high fan-in/out | rank via Code Map | attention only — never a removal candidate |

---

## Decision rule

1. Find the candidate.
2. Run the **confidence protocol** (`confidence.md`): Code Map references →
   dynamic/string sweep → entrypoint exclusions.
3. Assign the tier from the evidence, not from how dead it *looks*.
4. Report it with its evidence. **Do not remove it** — that is the user's call.

If you cannot gather the evidence a tier requires, tier down or move the
finding to the report's "Not fully confirmed" section.
