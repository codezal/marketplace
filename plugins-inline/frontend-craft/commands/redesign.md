---
name: redesign
description: Take existing UI and elevate it to a distinctive, production-grade design without breaking its functionality.
argument-hint: <path to file/component, or paste the markup/screenshot context>
---

You are redesigning existing UI. Use the **frontend-craft** skill and its `references/` packs.

## Target

$ARGUMENTS

If a file path is given, read it. If markup is pasted, work from that. If nothing is provided, ask the user to point you at the file or paste the current code.

## Do this, in order

1. **Diagnose first.** Read the current UI and list, in 3–6 bullets, exactly what makes it read as generic or unrefined — name the slop patterns from `references/anti-slop.md` it trips (e.g. "Inter display + purple gradient", "three identical cards", "flat backgrounds, no hierarchy").
2. **Choose a direction** that fits the product's purpose and audience. Output the 5-line spec (`references/aesthetic-directions.md`). State what you're keeping vs. changing.
3. **Preserve behavior.** Keep the same functionality, routes, data, and component API/props. This is a visual + structural-quality redesign, not a rewrite of logic. Call out explicitly if a markup change is needed for accessibility.
4. **Rebuild on tokens** (`references/design-tokens.md`): typography, color, spacing, motion. Replace scattered magic values with variables.
5. **Raise the engineering floor:** fix contrast/focus/keyboard/reduced-motion gaps, make it responsive, ensure transform/opacity-only animation. (`references/accessibility.md`, `references/motion.md`)
6. **Show before → after reasoning** and self-review against `references/anti-slop.md`. Present the diff or the full updated file, plus a short list of the specific upgrades made.

Bias toward a clear, confident transformation over a timid touch-up — but never sacrifice working functionality for looks.
