# About Section Flicker on Scroll

- Reporter: Codex
- Date: 2025-10-02
- Component: `components/about.tsx`

## Problem Statement
After completing the keyboard unlock flow and scrolling from the hero section to `#about`, the viewport briefly appears empty before the About content fades in. The blank frame makes the entire page feel like it is “reloading” even though the route does not change.

## Observations
- Home route only renders `LandingShell` and `PortfolioContent`, so any remount would have to come from their children (`app/page.tsx`).
- Other sections (e.g. Experience, Projects, Skills) keep their content visible while animations run, whereas About explicitly toggles opacity.
- The keyboard intro does not run again, confirming the glitch is visual rather than a full component reset.

## Hypothesis Log

### Hypothesis 1 — Portfolio container remounts when new section becomes active
- **Expectation:** If `LandingShell` or `PortfolioContent` remounts, React would replay all child animations, explaining the reload-like effect.
- **Validation:** Reviewed `components/landing-shell.tsx:16-86` and confirmed `showPortfolio` stays `true` after the initial transition; no subsequent state writes flip it back. There is also no key change on the `<main>` or `{children}` wrapper.
- **Result:** Rejected. The portfolio tree stays mounted after the keyboard gate.

### Hypothesis 2 — Navigation observer side-effects cause a rerender cascade
- **Expectation:** Recreating the IntersectionObserver on every `activeSection` change (`components/navigation.tsx:23-121`) might force dependent sections to reset.
- **Validation:** The navigation effect only updates local state (`activeSection`, `underlineStyle`) and cleans up previous observers. No shared context or parent state is touched, so other sections are unaffected beyond normal React re-rendering.
- **Result:** Rejected. Navigation state changes are isolated to the sidebar.

### Hypothesis 3 — About section hides itself until IntersectionObserver fires
- **Expectation:** If About sets `opacity: 0` until its observer fires, the user would see an empty viewport during the scroll handoff, mimicking a reload.
- **Validation:**
  - `components/about.tsx:9-16` sets `canAnimate` to `true` immediately after mount.
  - The heading and body wrappers compute their classes as `canAnimate && !isVisible ? "opacity-0" : isVisible ? "animate-fade-in-up" : ""` (`components/about.tsx:44-58`), which evaluates to `opacity-0` once `canAnimate` flips to `true` and before the observer marks the section visible.
  - With a `threshold` of `0.1` on the IntersectionObserver (`components/about.tsx:26-36`), the callback does not run until 10% of the section intersects the viewport (per MDN IntersectionObserver docs). Until that moment, all content remains fully transparent even though it occupies layout space.
  - Other sections either rely on `motion-safe:` variants or keep their content visible, so the blank frame is unique to About.
- **Result:** Accepted. The deliberate opacity toggle leaves the viewport empty long enough for users to interpret it as a reload.

## Root Cause
The About component enforces `opacity-0` after mount and only removes it when its IntersectionObserver reaches the 10% threshold. Because the section already fills the viewport (`app/globals.css` scroll snap styles), scrolling into it produces a momentary blank screen before the fade-in animation starts, creating the perceived "everything reloaded" glitch.

## Next Steps (Optional)
- Consider rendering the section with reduced opacity (e.g. `opacity-30`) or a background placeholder until the observer fires, or replace the state machine with the `motion-safe:` pattern used by other sections so content stays visible while the animation runs.
