# Report contract

How code-cleaner presents findings. The report is the whole deliverable — the
plugin never edits, so the report's clarity *is* its value. Every finding
carries a location, a tier, and the evidence behind the tier; every removal
suggestion carries the check the user should run first.

## Principles

- **Evidence, not assertion.** "Unused" is not a finding; "`code_callers` empty
  + no dynamic refs + not an entrypoint" is. Cite it.
- **Tier every finding.** CONFIRMED / LIKELY / RISKY (see `confidence.md`).
  Never present a finding untiered.
- **Safest first.** Order the removal plan so the lowest-risk, highest-confidence
  items are at the top.
- **Plan, don't perform.** Suggest removals with a verification recipe; never
  remove. The user acts.
- **Honest gaps.** Anything you couldn't fully confirm goes in a separate
  section — don't hide it and don't inflate it.

## `/clean` (fast) format

```
## code-cleaner — <target>

Scope: <files scanned>   Stack: <detected>

### CONFIRMED findings
- <file:line> — <category>: <symbol/what> — <evidence: callers=0, no dynamic refs, not an entrypoint>.
- ...
(or: "No CONFIRMED cruft in scope.")

### Removal plan (safest first)
1. <file:line> <symbol> — verify with: `<command>` → then remove.
2. ...

### Deferred to /clean-deep
- <lower-confidence or cross-file candidate> — <why it needs the deep pass>.
```

## `/clean-deep` (repo-wide) format

```
## code-cleaner-deep — <target>

Scope: <modules audited>   Stacks: <e.g. TypeScript, Rust>

### Findings
#### Dead code
- <file:line> — <symbol/block> [TIER] — <evidence or caveat>.
#### Unused imports
- ...
#### Dependency hygiene
- ...
#### Duplication (heuristic)
- <fileA:line> ↔ <fileB:line> — <what is duplicated>.
#### Architecture smells
- <cycle / boundary violation> — <the path>.
#### Complexity hotspots (attention only)
- <file:line> — <metric>.

### Removal plan (safest first)
1. <item> — <why safe / caveat> — verify with: `<exact command>` then delete.
2. ...

### Not fully confirmed
- <candidate> — <missing evidence / why a human must decide>.

### Net
Candidates: N (CONFIRMED x / LIKELY y / RISKY z).  Est. removable LOC: ~X (CONFIRMED only).
```

## Verification recipes (examples)

Give the user the cheapest check that would catch a wrong removal:

- Remove an export → re-run typecheck / build (`tsc --noEmit`, `cargo check`).
- Remove a dependency → build + run the test suite.
- Remove a file → build; grep its basename across configs and dynamic imports.
- Collapse duplication → run the tests covering both sites.

Always phrase these as *the user's* next step, not something the plugin will do.
