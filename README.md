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
  changes, the version the user installed stays fixed.
- For updates, the `sha` must be bumped and clients must pull then accept
  the new version via an "Update" button.
- High-risk permissions (`shell.exec`, `mcp.register`, `hooks.register`)
  trigger a red warning in the install approval modal before install.

## Built-in Plugins

| Plugin | Description |
|---|---|
| [codezal-test-plugin](plugins-inline/codezal-test-plugin/) | Reference test plugin proving the plugin system loads correctly. |
| [code-reviewer](plugins-inline/code-reviewer/) | Codezal-native code review plugin. Quick single-pass `/review` + deep multi-perspective `/review-deep`. |
