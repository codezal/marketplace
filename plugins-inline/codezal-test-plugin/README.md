# codezal-test-plugin

Reference test plugin for the Codezal plugin system. Use it to verify
plugin installation, agent registration, and slash-command registration
work end-to-end.

- **Version:** 0.1.0
- **Author:** Codezal
- **License:** Apache-2.0
- **Channel:** codezal-curated (verified)
- **Permissions:** `agents.register`, `commands.register`

## What it ships

| Type | Name | Purpose |
|---|---|---|
| Slash command | `/hello` | Prints a liveness-check message. |
| Agent | `hello-agent` | Confirms the plugin system is active and summarises optional input. |

## Install

1. Open Codezal → **Settings → Plugins**.
2. The default marketplace (`https://github.com/codezal/marketplace`) is
   pre-seeded on first launch. If it is missing, paste that URL into
   **Add Marketplace** and click **Add**.
3. Find **codezal-test-plugin** under the marketplace catalog → click **Install**.
4. Review the requested permissions (only `agents.register` + `commands.register`
   here — no high-risk permissions) → click **Install**.

## Usage

### Slash command

In any session composer, type:

```
/hello
```

You should see the model reply: *"Plugin system is working."*

### Agent

Invoke the agent directly in a prompt:

```
@hello-agent please summarise: <some text>
```

The agent will:

1. Print "Codezal plugin system is active — I am served from the `codezal-test-plugin` plugin."
2. Summarise the provided text in one sentence.

## Uninstall

Settings → Plugins → **codezal-test-plugin** row → trash icon → confirm.

The plugin directory `~/.codezal/plugins/codezal-test-plugin/` is removed
and the slash command + agent are unregistered immediately (hot-reload).

## Disable without uninstalling

Settings → Plugins → row toggle (**On** / **Off**). Disabled plugins stay
on disk but their contributions are unregistered.

## Source

Inline — the plugin source lives inside this marketplace repository at
[`plugins-inline/codezal-test-plugin/`](.). No external clone is performed.

## Troubleshooting

- **Slash menu does not show `/hello` after install** — reload the window
  (Cmd+R / Ctrl+R). The plugin registry emits a change event but
  ensure no Composer was open from a previous build.
- **Install fails with `forbidden path: .codezal-plugin/plugin.json`** —
  you are on an outdated Codezal build. Update to a version that includes
  the explicit fs scope for hidden plugin directories.
