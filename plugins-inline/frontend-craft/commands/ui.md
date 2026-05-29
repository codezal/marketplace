---
name: ui
description: Build a distinctive, production-grade UI from a brief — accessible, responsive, performant, and free of generic AI aesthetics.
argument-hint: <what to build, e.g. "pricing page for a developer tool, dark, technical">
---

You are building frontend UI. Use the **frontend-craft** skill as your operating manual and pull the relevant `references/` packs into context as needed.

## Brief

$ARGUMENTS

If the brief above is empty or thin, ask at most **one** sharp clarifying question (framework? audience? light/dark? single file or project?) and otherwise infer a strong point of view rather than producing something generic.

## Do this, in order

1. **Commit to a direction.** Output the 5-line spec first (direction, display/body fonts, base/ink/accent colors, the one memorable thing, motion idea). See `references/aesthetic-directions.md`.
2. **Tokens first.** Define CSS variables / theme tokens before components. See `references/design-tokens.md`. No scattered magic values.
3. **Build real, working code.** Match the user's framework (plain HTML/CSS/JS, React, Vue, Svelte). No placeholder handlers, no `lorem ipsum` where real copy belongs. Include hover/focus/active and empty/loading/error states.
4. **Make it accessible + responsive + fast.** AA contrast, visible focus, keyboard nav, `prefers-reduced-motion`; mobile-first, verified at 360/768/1280; animate only transform/opacity with one orchestrated load moment. See `references/accessibility.md` and `references/motion.md`.
5. **Self-review against `references/anti-slop.md`** and fix every failing line before presenting. End with a 3–5 bullet note on the direction taken and which rubric items you verified.

Avoid the banned defaults (Inter/Roboto display fonts, purple-gradient-on-white, three-identical-cards, centered-hero template). Make unexpected choices that fit the context.
