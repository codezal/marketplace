# Accessibility — WCAG 2.1 AA Checklist

Run before declaring any build done. Beautiful + inaccessible = not production-grade. Each item is checkable.

## Color & contrast
- [ ] Body text contrast ≥ **4.5:1** against its background.
- [ ] Large text (≥24px, or ≥18.66px bold) ≥ **3:1**.
- [ ] UI components & graphical objects (icons, borders of inputs, focus ring) ≥ **3:1**.
- [ ] Information is **never conveyed by color alone** (add icon/text/pattern — e.g. error state has an icon + message, not just red).
- [ ] Check both light and dark themes.

## Semantics & structure
- [ ] Native elements first: `<button>` for actions, `<a href>` for navigation. No `<div onclick>`.
- [ ] One `<h1>`; heading levels don't skip (h1→h2→h3).
- [ ] Landmarks: `<header> <nav> <main> <footer>`; one `<main>`.
- [ ] Lists are `<ul>/<ol>`; tables use `<th scope>`.
- [ ] Page has a `<title>`; `<html lang>` set.

## Keyboard
- [ ] Every interactive element reachable and operable by keyboard (Tab/Shift-Tab/Enter/Space/Esc/arrows where apt).
- [ ] **Visible focus indicator** on all focusables (never `outline:none` without a stronger replacement). Use `:focus-visible`.
- [ ] Logical focus order matches visual order.
- [ ] No keyboard traps. Modals: focus moves in, `Esc` closes, focus returns to trigger.
- [ ] A **skip-to-content** link for pages with large nav.

## Forms
- [ ] Every control has a programmatic `<label>` (or `aria-label`/`aria-labelledby`).
- [ ] Errors: text + `aria-invalid` + `aria-describedby` pointing to the message; not color alone.
- [ ] Required fields marked in text, not just `*` color.
- [ ] Group related fields with `<fieldset>/<legend>`.

## Images & media
- [ ] Meaningful images have descriptive `alt`; decorative images `alt=""`.
- [ ] Icon-only buttons have an accessible name (`aria-label`).
- [ ] No autoplaying audio/video; media has controls.

## Motion & timing
- [ ] `prefers-reduced-motion` honored; no content stuck hidden when reduced.
- [ ] Nothing flashes more than 3×/second.
- [ ] No essential content on a timer the user can't extend.

## Responsive / zoom / targets
- [ ] Usable at **200% zoom** with no loss of content/function.
- [ ] Reflows at **320px** width with no horizontal scrolling.
- [ ] Touch targets ≥ **44×44px** with adequate spacing.

## Dynamic content
- [ ] Live updates (toasts, async results) use `aria-live` (`polite`/`assertive`) appropriately.
- [ ] Custom widgets use correct ARIA roles/states **only when** a native element won't do — and are keyboard-tested. Bad ARIA is worse than none.

## Quick verification
1. Unplug the mouse — operate the whole flow by keyboard.
2. Tab through — can you always see where you are?
3. Zoom to 200% and shrink to 320px — still usable?
4. Run an automated pass (axe / Lighthouse) — fix flagged contrast/labels.
5. Confirm color-blind safety (don't rely on hue).

Automated tools catch ~30–40%. The keyboard + zoom manual passes catch the rest.
