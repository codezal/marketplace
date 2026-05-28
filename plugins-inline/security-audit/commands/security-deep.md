---
name: security-deep
description: Deep multi-perspective security audit. Pattern + dataflow + history + threat model. Structured Markdown report.
---

Run the `security-auditor-deep` agent.

Flags accepted after the command:

- `--threshold <severity>` — minimum severity to include (critical|high|medium|low|info). Default `low`.
- `--scope <path|diff|pr|branch>` — explicit scope. Default: auto-detect.
- `--policy <path>` — explicit security-policy file. Default: cascading lookup.

Auto-detect scope priority: PR → branch → staged → worktree → repo.

Produce a Markdown report with per-finding blocks (why exploitable, reproduction, fix, notes) and a threat model appendix. Ask before posting to PR — never auto-post.
