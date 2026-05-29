# Aesthetic Directions

A library of fully-specified directions. Each entry is a *starting recipe*, not a cage — adapt to the brief. The goal is to leave the generic default behind on the first decision.

Pick ONE per build. Never blend three. Vary your pick across builds — do not default to the same flavor every time.

---

## 1. Editorial / Magazine
- **Feel**: print layout on the web. Confident hierarchy, big headlines, columns.
- **Type**: serif display (e.g. Fraunces, Playfair Display, GT Sectra) + clean grotesque body (e.g. Söhne, Neue Haas). Huge size jump display→body.
- **Color**: paper/ink base (`#faf8f3` / `#1a1a1a`) + one editorial accent (oxblood, cobalt).
- **Layout**: 12-col grid, asymmetric, pull-quotes, drop caps, generous margins.
- **Motion**: restrained — text fades up on load, subtle parallax on hero image.

## 2. Brutalist / Raw
- **Feel**: unpolished on purpose. Exposed structure, hard edges.
- **Type**: monospace or heavy grotesque (Space Mono, Archivo Expanded). All-caps labels.
- **Color**: high-contrast B/W + one alarm color (electric blue, hazard yellow).
- **Layout**: visible borders/dividers, raw grids, no rounded corners, dense.
- **Motion**: instant or snappy; no easing softness. Hover = hard invert.

## 3. Luxury / Refined
- **Feel**: quiet expensive. Restraint signals quality.
- **Type**: high-contrast serif (Canela, Ogg) + minimal sans. Wide letter-spacing on small caps.
- **Color**: deep neutral (charcoal, bottle green, navy) + warm metallic accent (champagne, brass). Lots of negative space.
- **Layout**: centered or generous single-column, slow rhythm, large imagery.
- **Motion**: slow, soft easing (cubic-bezier(.16,1,.3,1)), fade + subtle scale.

## 4. Retro-Futuristic / Synth
- **Feel**: 80s computing meets neon.
- **Type**: geometric display (Monument Extended, Eurostile-like) + mono accents.
- **Color**: dark base + neon gradient (magenta→cyan), glow/bloom.
- **Layout**: grid lines, scanline overlays, chrome/glass panels.
- **Motion**: glow pulses, flicker, gradient shift, CRT-style transitions.

## 5. Organic / Natural
- **Feel**: warm, hand-made, soft.
- **Type**: humanist serif/sans (Tiempos, Aktiv) + occasional script accent.
- **Color**: earth palette (clay, sage, sand, terracotta), low saturation.
- **Layout**: blob shapes, soft curves, overlapping organic forms, generous radius.
- **Motion**: gentle ease, floating elements, subtle sway.

## 6. Minimal / Swiss
- **Feel**: clarity above all. Nothing decorative survives.
- **Type**: one neutral grotesque, two weights, tight scale. (This is the rare case where Helvetica-likes are *intentional*.)
- **Color**: white/near-white + black + ONE accent. Color used as information, not decoration.
- **Layout**: strict grid, alignment obsession, abundant whitespace.
- **Motion**: almost none; a single crossfade. Precision is the delight.

## 7. Maximalist / Chaos
- **Feel**: more is more. Visual overload, controlled.
- **Type**: clashing-on-purpose pairings, mixed sizes, rotated text.
- **Color**: saturated, many colors, stickers, patterns, gradients stacked.
- **Layout**: collage, overlap, sticker-bomb, marquee, broken grid.
- **Motion**: lots — but choreographed, not random. Marquees, hover explosions.

## 8. Art-Deco / Geometric
- **Feel**: symmetry, gold, geometric ornament.
- **Type**: geometric display with high contrast (Poiret-like) + clean body.
- **Color**: black/deep teal + gold, symmetrical accents.
- **Layout**: centered symmetry, geometric dividers, framed sections.
- **Motion**: symmetrical reveals, line-draw animations.

---

## How to specify your pick

When you choose, write it down before coding:

```
Direction: Editorial / Magazine
Display: Fraunces 72/700  ·  Body: Söhne 18/400
Base: #faf8f3  Ink: #1a1a1a  Accent: #7c2d2d (oxblood)
Memorable thing: oversized drop-cap hero that bleeds off the left margin
Motion: staggered text fade-up on load (60ms steps), parallax hero
```

That five-line spec is the contract the rest of the build must honor.
