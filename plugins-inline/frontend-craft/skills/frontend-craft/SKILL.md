---
name: frontend-craft
description: Create distinctive, production-grade frontend interfaces with high design quality — accessible, responsive, and performant. Use when the user asks to build, redesign, or review web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics, then self-reviews against an explicit rubric.
license: Apache-2.0
---

# Frontend Craft

Build frontend interfaces that look **intentionally designed**, not auto-generated. Implement real, working, production-grade code with exceptional attention to aesthetic detail — and back the beauty with accessibility, responsiveness, and performance.

The user provides a brief: a component, page, application, or interface. They may include purpose, audience, framework, or constraints. If the brief is thin, infer a strong point of view rather than producing something generic.

This skill ships reference packs in `references/`. Pull the relevant one into context when you need depth:

| Need | Read |
|---|---|
| Pick/realize an aesthetic flavor (fonts, palette, motion recipe) | `references/aesthetic-directions.md` |
| Token architecture (CSS vars, type scale, spacing, radius, shadow) | `references/design-tokens.md` |
| Animation patterns, easing, page-load orchestration | `references/motion.md` |
| WCAG 2.1 AA checklist before handoff | `references/accessibility.md` |
| The banned-pattern list + final self-review rubric | `references/anti-slop.md` |

---

## Process

Follow this loop. Do not skip step 1, and do not skip step 5.

### 1. Commit to a direction (before any code)

Decide and state, in one or two lines, the conceptual spine of the design:

- **Purpose** — what problem does this interface solve, for whom?
- **Tone** — pick an *extreme* and commit: brutally minimal, maximalist, retro-futuristic, organic, luxury/refined, playful, editorial/magazine, brutalist/raw, art-deco/geometric, soft/pastel, industrial. (See `references/aesthetic-directions.md` for fully-specified recipes.)
- **Constraints** — framework, performance budget, a11y target, browser support.
- **The one memorable thing** — what will someone remember 5 minutes after closing the tab? Name it explicitly and make sure the build delivers it.

**Intentionality beats intensity.** Refined minimalism and bold maximalism both win; timid middle-ground does not.

### 2. Set up tokens, then build

Define design tokens first (`references/design-tokens.md`), then build on them — never hardcode scattered hex values and pixel numbers. The result must be:

- Production-grade and functional (no placeholder `onClick={}` stubs, no `lorem ipsum` where real copy belongs).
- Cohesive — every element traceable to the step-1 direction.
- Meticulous — spacing rhythm, optical alignment, consistent radii and shadows.

### 3. Aesthetics — the craft layer

- **Typography** — distinctive, characterful choices. Pair a display face with a refined body face. Avoid the defaults (Inter, Roboto, Arial, system stacks) unless the *concept* demands neutrality. Set real type scale, line-height, measure (45–75ch), and tracking. Typography is the single highest-leverage lever.
- **Color & theme** — a cohesive palette via CSS variables. A dominant color with sharp, sparing accents beats an evenly-distributed rainbow. Decide light/dark deliberately; vary across builds — never converge on the same palette every time.
- **Motion** — high-impact moments over scattered fidgets. One well-orchestrated page load with staggered reveals creates more delight than ten random hover wiggles. CSS-only for plain HTML; Motion (Framer) for React when available. Respect `prefers-reduced-motion`. (`references/motion.md`)
- **Spatial composition** — unexpected layouts. Asymmetry, overlap, diagonal flow, grid-breaking elements. Generous negative space *or* controlled density — pick one on purpose.
- **Backgrounds & detail** — atmosphere over flat fills: gradient meshes, noise/grain, geometric patterns, layered transparency, dramatic shadows, decorative borders, custom cursors. Detail is what reads as "designed."

### 4. Accessible, responsive, performant — non-negotiable

Beauty that excludes users or janks on a mid-range phone is not production-grade.

- **Accessibility** — semantic HTML, visible focus states, `alt` text, labelled controls, AA contrast (4.5:1 text / 3:1 large & UI), keyboard reachability, `prefers-reduced-motion`. Full list: `references/accessibility.md`.
- **Responsive** — design mobile-first; verify at 360, 768, 1280, 1920. No horizontal scroll. Touch targets ≥ 44×44px. Fluid type/space via `clamp()`.
- **Performance** — `font-display: swap` + preload critical fonts; animate only `transform`/`opacity`; lazy-load offscreen media; avoid layout thrash; keep the critical path lean.

### 5. Self-review against the rubric (before declaring done)

Run the build against `references/anti-slop.md`. Be honest. If any line fails, fix it — don't ship and apologize. Minimum bar:

- [ ] No banned generic fonts/palettes used by default.
- [ ] A clearly-stated aesthetic direction, executed consistently.
- [ ] The "one memorable thing" is actually present.
- [ ] Tokens used (no scattered magic values).
- [ ] AA contrast, focus states, keyboard nav, reduced-motion all handled.
- [ ] Looks correct at 360px and 1280px+.
- [ ] Animations use transform/opacity; one orchestrated load moment.
- [ ] Real content/states (empty, loading, error) — not just the happy path.

---

## Framework notes

- **Plain HTML/CSS/JS** — single file is fine; CSS-only motion; system-free fonts via `@font-face` or a CDN with preload.
- **React** — function components, Motion for animation, CSS Modules / Tailwind / vanilla-extract for styles. Keep state minimal and local.
- **Vue / Svelte** — scoped styles, transition primitives, the same token discipline.
- Match implementation complexity to the vision: maximalist → elaborate code and effects; minimalist → restraint, precision, and obsessive spacing/typography.

---

You are capable of extraordinary creative work. Don't hold back — commit fully to a distinctive vision, then make it accessible, responsive, and fast. That combination is what "better than generic" means.
