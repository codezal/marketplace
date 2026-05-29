# Motion

Motion is seasoning, not the meal. One orchestrated moment beats ten random twitches. Every animation must respect `prefers-reduced-motion`.

## The two rules that prevent jank

1. **Animate only `transform` and `opacity`.** They run on the compositor. Animating `width`, `height`, `top`, `left`, `margin`, `box-shadow`, or `background` forces layout/paint and stutters on mid-range phones.
2. **Reserve space.** Never animate layout-affecting properties to avoid content jumping; use `transform` so surrounding flow stays put.

## Easing

Default to expressive ease-out for entrances; symmetric for state changes.

```css
--ease-out:cubic-bezier(.16,1,.3,1);    /* entrances, reveals */
--ease-in-out:cubic-bezier(.65,0,.35,1); /* toggles, moves */
/* Linear only for continuous loops (spinners, marquees). */
```

Durations: micro 120–160ms, standard 220–280ms, expressive 450–550ms. Longer than ~600ms feels slow unless deliberately cinematic.

## The signature page-load (highest ROI)

Stagger reveals on first paint. This single moment defines perceived quality.

```css
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.reveal{animation:rise var(--dur-slow) var(--ease-out) both}
.reveal:nth-child(1){animation-delay:.00s}
.reveal:nth-child(2){animation-delay:.06s}
.reveal:nth-child(3){animation-delay:.12s}
.reveal:nth-child(4){animation-delay:.18s}
```

For React, prefer Motion (Framer):
```jsx
<motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
  transition={{duration:.52,ease:[.16,1,.3,1],delay:i*.06}} />
```
Or a `staggerChildren` parent variant.

## Micro-interactions worth having

- **Buttons**: `transform:translateY(-1px)` + shadow lift on hover; `scale(.98)` on active.
- **Cards**: subtle lift + border-color shift; move the shadow, not the size.
- **Links**: animated underline via `background-size` transition (not `border`).
- **Inputs**: focus ring grows with `box-shadow` token; label floats with transform.

## Scroll & advanced (use sparingly)

- `IntersectionObserver` to add a `.reveal` class as sections enter — don't animate everything, just first-view of key sections.
- Parallax: translate by a fraction of scroll on ONE hero element. More than one = seasickness.
- Prefer the native scroll-driven animations (`animation-timeline:view()`) where support allows, with a static fallback.

## Accessibility — required, not optional

```css
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms!important;
    animation-iteration-count:1!important;
    transition-duration:.01ms!important;
    scroll-behavior:auto!important;
  }
}
```
Reduced-motion should still leave the UI fully usable and content visible (no element stuck at `opacity:0`). Test it.

## Smell test

- Anything animating `width/height/top/left`? Replace with `transform`.
- Page-load fade present and staggered, or static and flat?
- Reduced-motion path verified, with no permanently-hidden content?
