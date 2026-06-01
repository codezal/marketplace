# Debugging method — reproduce → isolate → diagnose → fix → verify

The five phases every debug pass moves through. The fast `/debug` path runs them
lightly on a clear failure; `/debug-deep` runs them in full on a stubborn one.
The order is not optional: skipping reproduction to jump to a fix is the single
most common way debugging goes wrong.

---

## 1. Reproduce

**Goal: make the failure happen on demand.** Until you can trigger it, you have
nothing to test a hypothesis against.

- Run the failing test or command with `run_command` and read the *real* output —
  the stack trace, the assertion diff, the exit code. Quote it; don't paraphrase.
- Capture the exact conditions: inputs, command, branch, environment.
- **Intermittent?** The repro itself is the first target. Pin the nondeterminism:
  - random seed not fixed → set it
  - test-ordering dependence → run the test in isolation, then in the failing order
  - time/date dependence → freeze the clock
  - concurrency → reduce parallelism, add ordering, stress in a loop
  - external state (DB, network, filesystem) → control or stub it
- If you genuinely cannot reproduce, stop and report what you need. A fix for an
  unreproduced bug cannot be verified, so it isn't a fix.

> Output compaction (Brief Mode) and shell-output filtering (Kompakt Shell) are
> handled by Codezal at the system level — run commands plainly and read what
> comes back; you don't need to wrap or trim them yourself.

## 2. Isolate

**Goal: shrink the failure to its smallest trigger and map the path to the fault.**

- **Minimize the input.** Remove everything that isn't required to still fail.
  A one-line repro points at the cause; a full app run hides it.
- **Map the failure path with Code Map — don't grep blindly:**
  - `code_search` — find the failing symbol from the stack trace.
  - `code_trace <entry> <fault>` — the actual call path from where execution
    starts to where it breaks, including dynamic hops grep can't follow.
  - `code_callers <symbol>` — who reaches this code, and with what.
  - `code_callees <symbol>` — what this code depends on that could be the source.
- **Bisect the timeline.** If the bug appeared in a known good→bad range, use
  `git bisect` to find the introducing commit — often faster than reading.
- **Instrument only where structure can't reach** — framework callbacks, dynamic
  dispatch, async boundaries. Add a temporary log/assert, run, then remove it.

## 3. Diagnose

**Goal: state the root cause as a claim you could be proven wrong about.**

- Separate **cause** from **symptom**. The crash site is usually the symptom;
  the cause is where the bad state was created or allowed to pass.
- Build the **evidence chain**: bad output ← the state that produced it ← the
  line that created that state ← why every layer in between let it through.
- If two causes remain plausible and no evidence separates them, that's a signal
  to run one more discriminating experiment (see `hypothesis.md`) — not to pick
  the more convenient one.

## 4. Fix

**Goal: the smallest change that corrects the cause.**

- Fix at the origin of the bad state, not at the blow-up site.
- Change one thing. If the correct fix is large or risky, propose it and say so
  rather than sprawling.
- Don't smuggle in refactors, reformatting, or unrelated "while I'm here" edits —
  those destroy the signal and belong to a different pass.

## 5. Verify

**Goal: prove the fix, don't assume it.**

- **Regression test first.** Add (or identify) a test that *fails before* your fix
  and *passes after*. A fix without a failing-then-passing test is unproven.
- Re-run the original reproduction — it must no longer fail.
- Run the project's check suite (tests, typecheck, build) so the fix didn't break
  a neighbor.
- **Find siblings.** Use `code_search` to locate other sites with the same root
  cause. One bug is rarely alone.

### Discovering the project's checks

Detect commands instead of assuming them. Read `CLAUDE.md` / `AGENTS.md`,
`package.json` scripts, `Makefile`, CI config, and test directory layout to learn
the real test runner, typecheck, and build commands, then run those. Don't impose
another stack's tooling.
