# debug

Find out **why** code is broken and fix the cause — not the symptom — and *prove*
the fix with a regression test instead of hoping. A Codezal-native plugin that
debugs by evidence: reproduce first, locate the fault with Code Map, isolate the
root cause one variable at a time, fix it, verify it.

## Why it exists

The usual "fix this bug" agent has three weak spots: it **theorizes before it
reproduces**, it **greps around guessing** at where the failure lives, and it
**patches the symptom** so the error message disappears while the bad state
survives. `debug` fixes all three:

1. **Reproduction-first.** No fix is proposed for a failure that hasn't been made
   to happen on demand. Intermittent repros get pinned down before anything else.
2. **Structural localization.** It follows the real execution path with Code Map
   (`code_trace` / `code_callers` / `code_callees`) instead of scanning files for
   strings — so it finds where bad state *originates*, not just where it crashes.
3. **Cause over symptom, proven.** It fixes the origin of the fault and gates the
   fix behind a regression test that fails before and passes after, plus the
   project's check suite.

## What it ships

| Type | Name | Purpose |
|---|---|---|
| Command | `/debug [failure]` | Fast, evidence-based triage of a single concrete failure. |
| Command | `/debug-deep [failure]` | Hypothesis-driven root-cause investigation for stubborn or intermittent bugs. |
| Agent | `debug` | Fast subagent: reproduce, locate, diagnose, minimal fix, regression check. |
| Agent | `debug-deep` | Investigation subagent: reliable repro, ranked hypotheses, bisection, evidence chain, verified fix. |
| References | `references/*.md` | The method, the hypothesis loop, and the pitfalls to refuse. |

### Reference packs

- **`method.md`** — the five phases: reproduce → isolate → diagnose → fix →
  verify, with the Code Map tools to use at each step.
- **`hypothesis.md`** — falsifiable hypotheses, ranking by likelihood × cost,
  one variable per experiment, the ledger, and what to do when you can't isolate.
- **`pitfalls.md`** — symptom-patching, shotgun debugging, theorizing before
  reproducing, declaring victory with no regression test, and the rest.

## Usage

```
/debug TypeError: cannot read 'id' of undefined in OrderList
/debug "test_checkout_total fails after the discount refactor"
/debug-deep "auth flakes ~1 in 20 runs, only in CI"
/debug-deep                      # then paste the stack trace / describe the break
```

## How it's "better" than a plain bug-fixer agent

1. **It reproduces before it theorizes** — the real error drives the diagnosis,
   not a guess from reading code.
2. **It localizes with the Code Map** — `code_trace` / `code_callers` follow the
   actual call path, including dynamic hops that text search can't.
3. **It fixes the cause, not the symptom** — and refuses the swallow-the-exception
   shortcuts that make errors vanish without fixing anything.
4. **It proves the fix** — a regression test that fails before and passes after,
   plus the project's own checks; siblings of the same root cause get found too.
5. **It's honest when stuck** — a documented hypothesis ledger and the next
   experiment beats a confident wrong root cause.

## Codezal-native

Built for the Codezal runtime. It uses the **Code Map** tools (`code_search`,
`code_trace`, `code_callers`, `code_callees`) for structural localization, and
relies on **Kompakt Shell** output filtering and **Brief Mode** compression at
the system level — so it runs commands plainly and leans on structure instead of
re-implementing any of that itself.

## Permissions

Read/write/edit files, run shell commands (to reproduce and verify), and read
git (to scope and bisect history). No network access. See the manifest for the
exact set.

## License

Apache-2.0. See `LICENSE` and `NOTICE`. Independent, clean-room implementation —
no third-party code or prose is included.
