# Design Tokens

Define tokens first, build on them. Tokens are the difference between "designed" and "a pile of magic numbers." Never scatter raw hex/px through the code.

## Core principle

Everything visual flows from a small set of named variables. Change the brand by changing the tokens, not by find-replacing hex codes.

## Token layers

```css
:root {
  /* 1. PRIMITIVES — raw values, never used directly in components */
  --gray-50:#f8f8f7; --gray-900:#1a1a18;
  --brand-500:#7c2d2d; --brand-600:#641f1f;

  /* 2. SEMANTIC — what the value means; components use THESE */
  --color-bg:        var(--gray-50);
  --color-fg:        var(--gray-900);
  --color-accent:    var(--brand-500);
  --color-accent-ink:#fff;
  --color-border:    color-mix(in oklch, var(--color-fg) 12%, transparent);

  /* 3. TYPE SCALE — modular, ratio ~1.25 (major third) */
  --font-display:"Fraunces", serif;
  --font-body:"Söhne", system-ui, sans-serif;
  --step--1:clamp(.8rem,.77rem + .15vw,.9rem);
  --step-0: clamp(1rem,.95rem + .25vw,1.125rem);
  --step-1: clamp(1.25rem,1.15rem + .5vw,1.5rem);
  --step-2: clamp(1.56rem,1.4rem + .8vw,2rem);
  --step-3: clamp(1.95rem,1.7rem + 1.3vw,2.7rem);
  --step-4: clamp(2.44rem,2rem + 2.2vw,3.6rem);
  --step-5: clamp(3.05rem,2.4rem + 3.4vw,4.8rem);
  --leading-tight:1.1; --leading-body:1.6;

  /* 4. SPACING — one scale, used everywhere (rem, 4px base) */
  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem;
  --space-6:1.5rem; --space-8:2rem; --space-12:3rem; --space-16:4rem;
  --space-24:6rem;  --space-32:8rem;

  /* 5. RADIUS / SHADOW / MOTION */
  --radius-sm:.375rem; --radius-md:.75rem; --radius-lg:1.25rem; --radius-full:999px;
  --shadow-sm:0 1px 2px rgb(0 0 0/.06);
  --shadow-md:0 8px 24px -8px rgb(0 0 0/.18);
  --shadow-lg:0 24px 60px -16px rgb(0 0 0/.28);
  --ease-out:cubic-bezier(.16,1,.3,1);
  --ease-in-out:cubic-bezier(.65,0,.35,1);
  --dur-fast:140ms; --dur-base:260ms; --dur-slow:520ms;
}
```

## Rules

1. **Components reference semantic tokens**, never primitives or raw values.
2. **One spacing scale.** If a gap isn't on the scale, you probably guessed — snap it.
3. **One type scale.** Body sizes come from `--step-*`. No random `font-size:15px`.
4. **Dark mode = re-map semantics**, not a second component tree:
   ```css
   @media (prefers-color-scheme:dark){
     :root{ --color-bg:var(--gray-900); --color-fg:var(--gray-50); }
   }
   ```
5. **Prefer `oklch()` / `color-mix()`** for borders, hovers, tints — derive from the accent instead of hand-picking ten shades.
6. **Type measure**: body text container `max-width: 70ch`.

## Tailwind variant

Map the same tokens into `theme.extend` (colors, fontFamily, fontSize with clamp, spacing, borderRadius, boxShadow, transitionTimingFunction). The discipline is identical; only the syntax changes.

## Smell test

If a reviewer greps the CSS and finds `#`-hex or `px` font-sizes sprinkled through components instead of `var(--…)`, the token layer failed.
