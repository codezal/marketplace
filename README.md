# Codezal Marketplace

Official plugin **index / registry** repository for the Codezal application.
Plugin binaries are **not hosted here** — only metadata and SHA-pinned
references to upstream sources (npm / pypi / homebrew pattern).

## Structure

```
index.json            # master list of all plugins
plugins/<name>.json   # per-plugin manifest (source, attribution, permissions…)
plugins-inline/       # optional: plugins authored inside this repo (by Codezal)
schemas/              # JSON Schema files
```

## Channels

- **codezal-curated** — verified by Codezal. `verified: true`. Green badge in UI.
- **community** — submitted by third parties. `verified: false`. Yellow warning
  in UI, "use at your own risk".
- **local** — plugin on the user's disk (for development).

## Plugin Submission Process

1. Fork this repo.
2. Keep your plugin in an upstream GitHub repo (your own, or a compatibly
   licensed public repo).
3. Create `plugins/<name>.json` — `source.sha` must be pinned.
4. Add an entry to `index.json` (`channel: "community"`).
5. Open a PR. A Codezal maintainer reviews. `verified: true` only after
   stricter audit, for the curated channel.

### Required fields

- `name` (kebab-case)
- `version` (semver)
- `description`
- `license` (SPDX id, e.g. `Apache-2.0`, `MIT`)
- `author.name`
- `permissions[]` (may be empty array)
- `source` (`git-subdir` / `git-repo` / `inline` — `sha` pinned)
- `attribution` (mandatory if repackaging upstream code — `originalAuthor`,
  `originalRepo`, `modified`)

### License compliance

- If repackaging from Apache-2.0 upstream, LICENSE + NOTICE must live inside
  the plugin directory.
- Trademark use is FORBIDDEN — names like "Anthropic", "Claude" etc. may
  appear in plugin manifests **only inside attribution metadata fields**,
  never as the plugin name or branding.

## Plugin Source Types

### `git-subdir`
Use a subdirectory of an upstream repo as the plugin. Most common.
```json
"source": {
  "type": "git-subdir",
  "repo": "owner/repo",
  "path": "plugins/my-plugin",
  "sha": "<commit-sha>",
  "ref": "main"
}
```

### `git-repo`
The entire upstream repo is the plugin.
```json
"source": {
  "type": "git-repo",
  "repo": "owner/repo",
  "sha": "<commit-sha>"
}
```

### `inline`
Plugin lives inside this marketplace repo (`plugins-inline/<name>/`).
```json
"source": { "type": "inline", "path": "plugins-inline/my-plugin" }
```

## Security

- Every plugin manifest has a PINNED `sha` — even if the upstream branch
  changes, the version the user installed stays fixed. The app re-checks the
  resolved `HEAD` against the manifest `sha` after checkout and aborts on
  mismatch (TOCTOU guard).
- For updates, the `sha` must be bumped and clients must pull then accept
  the new version via an "Update" button.
- High-risk permissions (`shell.exec`, `mcp.register`, `hooks.register`)
  trigger a red warning in the install approval modal before install.
  Dangerous permission **combinations** (e.g. `network.fetch` +
  `providers.register`, `shell.exec` + `network.fetch`) raise dedicated
  exfiltration / RCE warnings.
- MCP `stdio` commands and hook commands are validated: shell metacharacters,
  path traversal, and destructive patterns (`rm -rf /`, `curl | sh`, …) are
  rejected before registration.

### Network egress allowlist

A plugin requesting `network.fetch` should declare the hosts it may reach.
The app shows these at install and enforces them on the plugin's `fetch` and on
any `http`/`sse` MCP endpoints it registers.

```json
"permissions": ["network.fetch"],
"network": { "allowedHosts": ["api.openai.com", "*.anthropic.com"] }
```

- Exact host, `*.suffix` (apex + subdomains), or `*` (all — discouraged, raised
  as a loud warning).
- Absent / empty `allowedHosts` = deny all (fail-closed).

### Manifest signing (Ed25519)

Curated manifests are signed so a compromised marketplace cannot rewrite
`source.sha`, `permissions`, or `network.allowedHosts`. The app embeds the
Codezal public key and verifies the signature for the `codezal-curated`
channel; an invalid signature **blocks** install.

```bash
npm run keygen          # one-time: generate .keys/ keypair (gitignored)
npm run sign:all        # sign every curated manifest
npm run verify:all      # verify all signatures
```

The **private key never enters the repo** (`.keys/` is gitignored). Only the
public key is embedded in the app (`src/lib/plugins/signing.ts`). Rotating the
key invalidates every prior signature — re-sign afterward. The canonical form
signed is the manifest JSON with sorted keys and the `signature` field removed;
the app's `canonicalManifest()` must match `scripts/lib/canonical.mjs`
byte-for-byte.

### Audit log

The app keeps an append-only JSON-lines audit log at `~/.codezal/audit.log`
recording install / uninstall / enable / disable, permission denials, network
denials, and signature results — viewable under Settings → Plugins.

## Built-in Plugins

| Plugin | Description |
|---|---|
| [code-reviewer](plugins-inline/code-reviewer/) | Codezal-native code review plugin. Quick single-pass `/review` + deep multi-perspective `/review-deep`. |
| [security-audit](plugins-inline/security-audit/) | Codezal-native security auditor. Fast `/security` scan (CWE + OWASP mapping) + deep `/security-deep` audit (dataflow, history, threat model). Read-only. |
| [frontend-craft](plugins-inline/frontend-craft/) | Codezal-native frontend design plugin. Builds distinctive, accessible, production-grade UI and reviews it against a quality rubric. `/ui`, `/redesign`, `/design-review`. |
| [code-refiner](plugins-inline/code-refiner/) | Codezal-native code simplification plugin. Fast safe-only `/refine` + verified multi-lens `/refine-deep` that proves behavior is unchanged. Project-agnostic, opt-in proactive hook. |
| [debug](plugins-inline/debug/) | Codezal-native debugging plugin. Evidence-based: reproduce → isolate → root-cause → fix → regression-test. Fast `/debug` triage + hypothesis-driven `/debug-deep`. Localizes faults with Code Map (`code_trace`/`code_callers`). |
