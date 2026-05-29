# Anti-Slop: Banned Patterns + Final Rubric

"AI slop" is the generic, context-free look that screams *auto-generated*. This file is the gate. If the build trips a banned pattern without a deliberate, stated reason, fix it before shipping.

## Banned by default (override only with an explicit concept reason)

### Typography
- ❌ Inter, Roboto, Arial, Open Sans, Lato, or bare `system-ui` as the *display* face.
- ❌ Space Grotesk as a reflex choice (it became the new default — vary).
- ❌ One font at one size doing everything; no real type scale.
- ❌ Centered everything with no hierarchy.

### Color
- ❌ **Purple/violet gradient on white** (the #1 tell).
- ❌ Indigo-500 → purple-500 button gradients.
- ❌ Evenly-distributed rainbow with no dominant color.
- ❌ Pure `#000` on pure `#fff` with zero warmth/temperature decision.

### Layout & components
- ❌ Three identical feature cards in a row with an emoji, a bold line, two grey lines.
- ❌ Hero = centered H1 + subtitle + two buttons, nothing else.
- ❌ Generic SaaS template rhythm: hero → 3 cards → testimonial → CTA, all centered.
- ❌ Default rounded-2xl + soft drop-shadow on every box, uniformly.
- ❌ Untouched component-library defaults with no theming.

### Detail
- ❌ Flat solid-color backgrounds everywhere (no atmosphere/texture/depth).
- ❌ Emoji as the entire icon system.
- ❌ `lorem ipsum` where real copy belongs; only the happy-path state built.
- ❌ No hover/focus/active states; no empty/loading/error states.

## Final self-review rubric (score honestly)

For each: **pass / fix**. Any "fix" → fix it, then re-score.

**Direction**
- [ ] A specific aesthetic direction was chosen and written down.
- [ ] Every section visibly serves that direction (no off-concept defaults).
- [ ] The "one memorable thing" is present and actually memorable.

**Typography**
- [ ] Display face is distinctive and not on the banned list (or justified).
- [ ] Real modular type scale; deliberate line-height, measure, tracking.

**Color**
- [ ] Cohesive palette via tokens; one dominant color + sparing accents.
- [ ] Not a purple-on-white gradient. Light/dark chosen on purpose.

**Composition & detail**
- [ ] Layout has intention (asymmetry/space/density), not template rhythm.
- [ ] Backgrounds have atmosphere/depth, not flat fills.
- [ ] Consistent radius/shadow/spacing from tokens (no magic numbers).

**Engineering quality**
- [ ] AA contrast, visible focus, keyboard nav, reduced-motion (`references/accessibility.md`).
- [ ] Responsive at 360 / 768 / 1280; touch targets ≥44px; no h-scroll.
- [ ] Animations transform/opacity only; one orchestrated load moment.
- [ ] Real content + empty/loading/error states; interactions wired.

**The mirror test**
- [ ] If you saw this in a portfolio, would you believe a human designer made it on purpose? If not — what's the one change that flips that answer? Make it.

> Slop is the average of everything. Craft is a specific choice, executed precisely, and then made accessible and fast.
