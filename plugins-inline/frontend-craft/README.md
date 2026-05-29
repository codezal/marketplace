# frontend-craft

Build **distinctive, production-grade** frontend interfaces — and keep them accessible, responsive, and fast. A Codezal-native plugin that helps the assistant produce UI that looks intentionally designed instead of auto-generated, then holds the result to an explicit quality rubric.

## Why it exists

Most AI-generated UI converges on the same look: Inter font, a purple gradient on white, three identical feature cards, a centered hero. `frontend-craft` exists to escape that — it forces a committed aesthetic direction up front, builds on a real design-token system, and **self-reviews** the output against a banned-pattern list and a WCAG AA checklist before declaring done.

## What it ships

| Type | Name | Purpose |
|---|---|---|
| Skill | `frontend-craft` | The operating manual: process, aesthetics, a11y/responsive/perf, self-review. Auto-loads for frontend work. |
| Command | `/ui <brief>` | Build a component/page/app from a brief. |
| Command | `/redesign <target>` | Elevate existing UI without breaking its functionality. |
| Command | `/design-review <target>` | Critique a UI against the rubric with ranked, actionable fixes. |
| Agent | `frontend-designer` | End-to-end subagent: picks a direction, sets tokens, writes code, self-reviews. |
| References | `references/*.md` | Depth packs pulled in on demand (see below). |

### Reference packs

- **`aesthetic-directions.md`** — 8 fully-specified flavors (editorial, brutalist, luxury, retro-futuristic, organic, minimal, maximalist, art-deco) with font/color/motion recipes.
- **`design-tokens.md`** — token architecture: primitives → semantics, type scale, spacing, radius, shadow, dark-mode remapping (CSS + Tailwind).
- **`motion.md`** — jank-free animation: transform/opacity rule, easing, the signature staggered page-load, reduced-motion.
- **`accessibility.md`** — a checkable WCAG 2.1 AA list + a 5-step manual verification.
- **`anti-slop.md`** — the banned-pattern list and the final self-review rubric (incl. the "made by a human on purpose" mirror test).

## How it's "better" than a plain design skill

A typical design skill is a single passive prompt. `frontend-craft` adds:

1. **Actionable entry points** — three slash commands and a delegating agent, not just ambient guidance.
2. **A token-first workflow** — structure, not just taste.
3. **Engineering floor baked in** — accessibility, responsiveness, and performance are part of "done," not afterthoughts.
4. **A self-review gate** — an explicit rubric the build must pass, so quality is verified, not assumed.
5. **On-demand depth** — reference packs keep the core skill lean while making detail available when needed.

## Usage

```
/ui pricing page for a developer CLI tool, dark, technical, monospace accents
/redesign src/components/Hero.tsx
/design-review src/app/page.tsx
```

Or just ask in natural language — "build a settings panel with a luxury feel" — and the skill activates automatically.

## Permissions

Read/write/edit files and run shell commands (to scaffold files and verify builds). No network access. See the manifest for the exact permission set.

## License

Apache-2.0. See `LICENSE` and `NOTICE`.
