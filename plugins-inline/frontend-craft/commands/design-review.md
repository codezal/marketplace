---
name: design-review
description: Critique a UI against the frontend-craft rubric — aesthetics, accessibility, responsiveness, performance — with specific, actionable fixes.
argument-hint: <path to file/component, a URL, or paste the markup>
---

You are reviewing UI quality. Use the **frontend-craft** skill's rubric. Be specific and honest; this is a critique, not a compliment.

## Under review

$ARGUMENTS

Read the file if a path is given; work from pasted markup otherwise. If nothing is provided, ask for the file or code. (You cannot render; reason from the code/markup and stated context.)

## Output format

Score each area **Pass / Needs work / Fail** with a one-line reason, then give concrete fixes. Reference exact lines/selectors where possible.

1. **Direction & cohesion** — is there a clear aesthetic point of view, or is it generic? (`references/anti-slop.md`)
2. **Typography** — face choices, scale, line-height, measure, tracking. (`references/design-tokens.md`)
3. **Color & theme** — palette cohesion, dominant+accent, contrast, light/dark.
4. **Composition & detail** — layout intention, spacing rhythm, backgrounds/depth, consistent radius/shadow.
5. **Accessibility** — run the AA checklist; flag contrast, focus, keyboard, labels, reduced-motion. (`references/accessibility.md`)
6. **Responsive** — behavior at 360/768/1280, touch targets, overflow.
7. **Performance & motion** — animated properties, load orchestration, font loading. (`references/motion.md`)

## Close with

- **Top 3 highest-impact fixes** (ranked).
- **Banned-pattern hits** from `references/anti-slop.md`, if any.
- A one-line verdict: would this pass the "made by a human on purpose" mirror test?

Skip praise-padding. Every finding should be something the author can act on.
