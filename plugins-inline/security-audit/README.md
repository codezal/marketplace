# security-audit

Codezal-native security auditor for application code. Scans for OWASP Top 10 vulnerabilities, common CWE patterns, leaked secrets, and weak cryptography across TypeScript / JavaScript, Python, Ruby, Go, Rust, and PHP.

## What you get

Two slash commands and two agents:

| Command | Agent | Use for |
|---------|-------|---------|
| `/security` | `security-auditor` | Fast pass. One line per finding, severity-tagged, CWE + OWASP id. Designed for the inner edit loop. |
| `/security-deep` | `security-auditor-deep` | Full audit. Pattern + dataflow + git history + threat model. Structured Markdown report with reproductions and fixes. |

Both stay read-only. Neither writes files, edits source, or runs git commands that change state.

## When to use which

**`/security`** — every time you finish a feature, before pushing, after merging an external PR. Cheap and quiet. Returns severity-tagged lines like:

```
src/api/login.ts:42: 🛑 critical [CWE-89] [A03:2021]: SQL built by string concatenation with `req.body.email`. Use parameterized query.
```

**`/security-deep`** — pre-release, post-incident, large PRs (≥ 200 lines changed), onboarding into a new repo, periodic full-repo audits. Produces a Markdown report with per-finding blocks: why exploitable, reproduction, fix, history annotation, threat model. Asks before posting to a PR.

## Installation

The plugin is delivered via the Codezal marketplace. In Codezal: **Settings → Plugins → Install `security-audit@codezal-curated`**.

Required permissions:

- `filesystem.read` — read source files to scan
- `git.exec` — run `git diff`, `git log`, `gh pr view` for scope detection
- `agents.register` — register `security-auditor` and `security-auditor-deep`
- `commands.register` — register `/security` and `/security-deep`

No `shell.exec`, no `filesystem.write`, no `network.fetch`.

## Detection coverage

The agent uses the catalogs in `patterns/`:

- **`patterns/web.md`** — SQL/command injection, XSS, path traversal, SSRF, open redirect, CSRF, JWT misuse, deserialization.
- **`patterns/secrets.md`** — provider-specific signatures (AWS, GitHub, Stripe, Google, OpenAI, Anthropic, Discord, npm, …), generic high-entropy patterns, false-positive guards.
- **`patterns/crypto.md`** — weak hashes (MD5/SHA1 for passwords), broken ciphers (DES/3DES/RC4/ECB), missing IV/nonce, `Math.random()` for security tokens, TLS verification disabled, key-size weakness, timing-attack-prone comparisons.

Every finding includes a **CWE id** (`CWE-79`, `CWE-89`, …) and, where applicable, an **OWASP Top 10 mapping** (`A01:2021`, `A03:2021`, …). Findings the auditor cannot defend at high confidence are dropped — false positives cost more trust than missed mediums.

## Scope auto-detection

`/security` and `/security-deep` figure out what to scan in this order:

1. **PR** — if the current branch has an open, non-draft PR (`gh pr view`), scan its diff.
2. **Branch** — else if you're on a non-default branch with commits ahead, scan `git diff <default>...HEAD`.
3. **Staged** — else if `git diff --cached` is non-empty, scan the staged diff.
4. **Worktree** — else if `git diff` is non-empty, scan the working tree.
5. **Repo** — else the agent asks before scanning the whole repo.

Override with a path argument: `/security src/api` or `/security-deep --scope src/auth`.

## Configuration

### Inline silencer

Suppress a single finding from the file:

```ts
// security-ok: input is shell-escaped via execFile, not exec
child_process.execFile("rg", [pattern, dir])
```

The reason after `security-ok:` is required. Bare silencers are still reported.

### Project policy

Optional cascading file:

- `<scope>/.codezal/security-policy.md` (closest to the scanned dir)
- `<repo>/.codezal/security-policy.md`

Policy lets you:

- Bump severities (e.g. `pattern: "DEBUG\\s*=\\s*True"` → ignore in `tests/`)
- Add custom secret regexes (internal tokens)
- Allowlist a CWE for specific paths with a documented reason

The auditor echoes a policy hash and override count in the report header so reviewers can see what shaped the result.

### Deep flags

```
/security-deep --threshold high
/security-deep --scope src/auth
/security-deep --policy custom-policy.md
```

`--threshold` filters findings below the level out of the report (not out of the count summary).

## Output examples

### `/security`

```
src/api/login.ts:42: 🛑 critical [CWE-89] [A03:2021]: SQL built by string concatenation. Use parameterized query.
src/utils/hash.ts:14: 🔴 high [CWE-327] [A02:2021]: MD5 used for password hash. Replace with `argon2.hash(pw)`.
src/admin/upload.ts:88: 🟠 medium [CWE-22] [A01:2021]: `path.join(uploadsDir, req.params.name)` without traversal guard.
config/prod.env:3: 🛑 critical [CWE-798] [A02:2021]: AWS access key committed. Rotate immediately, scrub history with `git filter-repo`.
---
4 findings: 2 critical, 1 high, 1 medium, 0 low, 0 info
Scanned: 12 files in staged diff
```

### `/security-deep`

Structured Markdown report — one H2 per finding with:

- File, severity, confidence
- Reach × Impact × Exploitability matrix
- "Why this is exploitable" prose
- HTTP / shell reproduction snippet
- Concrete fix code block
- History annotation (`introduced in this PR` / `regression from <sha>` / `pre-existing`)
- Cross-references to related findings

Plus an appendix with the full threat-model matrix and any policy suppressions.

## What it does NOT report

To keep signal-to-noise high:

- Lint / formatting / style
- Performance issues
- Test coverage gaps
- "Code could be cleaner" suggestions
- Architectural opinions
- Outdated dependency versions (use a dedicated SCA tool — `npm audit`, `pip-audit`, `cargo audit`)

## Limitations

- **Heuristic, not provably sound.** Pattern matching plus light dataflow reasoning catches the common attack surface but cannot prove a program is secure. Pair with a real SAST tool (Semgrep, CodeQL) for compliance-grade assurance.
- **No CVE lookup.** The plugin does not contact NVD / GHSA. Dependency-CVE checking is out of scope.
- **No autofix.** Findings ship with concrete suggested code, but the user applies them.
- **English-language patterns.** The catalogs are English; the agent's *response* mirrors the user's language. Patterns themselves are language-agnostic regex.

## Tips

- Pin a security policy in CI: run `/security` against the PR diff, fail the job if any `critical` finding is present, post the report as a PR comment.
- Use `--threshold medium` on `/security-deep` for everyday review and `--threshold low` for release audits.
- Combine with `/review` (code-reviewer plugin) — `/review` covers correctness, `/security` covers safety. They do not duplicate work.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| "No scope detected, please pass a path." | Clean working tree, not on a branch, no PR. | Pass a path: `/security src/`. |
| Lots of false-positive secret hits in fixtures. | Test data uses realistic-looking values. | Move into `tests/`, `__mocks__/`, `fixtures/`, or `examples/` — those dirs are auto-skipped. Or set a project policy. |
| Critical finding suppressed by silencer the auditor disagrees with. | The silencer reason is weak. | Either strengthen the reason or remove the silencer; the auditor will re-flag. |
| `gh pr view` fails. | Not authenticated. | `gh auth login`. |

## Author

Codezal — `https://github.com/codezal`

## Version

`0.1.0`

## License

Apache-2.0. See `LICENSE` and `NOTICE`. OWASP and CWE references are cited under fair use; no third-party content is reproduced verbatim.
