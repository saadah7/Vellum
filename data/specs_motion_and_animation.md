# specs_motion_and_animation.md
## Vellum Design Governance — Easing Curves, Duration Scale & Motion Triggers
## Agent: Architect (Temp 0.7) — Select motion token before specifying any transition.
## Agent: Senior Critic (Temp 0) — Verify easing + duration against tables. Gate 7 enforcement.

---

### CORE RULE

Every animation in a design proposal must specify:
1. Duration (ms) — from duration scale table
2. Easing — from named easing token
3. Properties animated — only transform and opacity for performance
4. Reduced-motion gate — Class A/B/C from specs_reduced_motion_rules.md

---

### M3 EASING TOKENS — NAMED CURVES

#### Standard Easing (simple, small components)
```
md.sys.motion.easing.standard
  → cubic-bezier(0.2, 0, 0, 1)
  Use: default for most component state changes (color, opacity, small transforms)

md.sys.motion.easing.standard-decelerate
  → cubic-bezier(0, 0, 0, 1)
  Use: elements entering the screen (decelerating to rest)

md.sys.motion.easing.standard-accelerate
  → cubic-bezier(0.3, 0, 1, 1)
  Use: elements exiting the screen (accelerating out)
```

#### Emphasized Easing (large surfaces, expressive transitions)
```
md.sys.motion.easing.emphasized
  → cubic-bezier(0.05, 0.7, 0.1, 1.0)
  Use: large surface transitions, shared element transitions, hero animations
  Note: produces characteristic "overshoot" feel — expressive, intentional

md.sys.motion.easing.emphasized-decelerate
  → cubic-bezier(0.05, 0.7, 0.1, 1.0)  [same as emphasized for enter]
  Use: large surface ENTERING (dialog open, bottom sheet expand)

md.sys.motion.easing.emphasized-accelerate
  → cubic-bezier(0.3, 0.0, 0.8, 0.15)
  Use: large surface EXITING (dialog close, bottom sheet collapse)
```

#### Linear (special cases only)
```
md.sys.motion.easing.linear
  → cubic-bezier(0, 0, 1, 1)
  Use: looping animations (shimmer, spinner), color crossfades, opacity fades where no spatial movement
  FORBIDDEN: for enter/exit transitions — always use decelerate/accelerate
```

#### iOS Spring (iOS native target only)
```
ios.motion.spring.default
  → UISpringTimingParameters(dampingRatio: 0.7, initialVelocity: 0)
  Use: all interactive element transitions on iOS native

ios.motion.spring.snappy
  → UISpringTimingParameters(dampingRatio: 0.85, initialVelocity: 0)
  Use: button press, toggle, quick UI feedback

ios.motion.spring.bouncy
  → UISpringTimingParameters(dampingRatio: 0.5, initialVelocity: 0.5)
  Use: expressive moments — onboarding, celebration states (use sparingly)
```

---

### DURATION SCALE (M3)

```
md.sys.motion.duration.short1  →  50ms   (micro: ripple start, state layer appear)
md.sys.motion.duration.short2  →  100ms  (icon swap, checkmark draw)
md.sys.motion.duration.short3  →  150ms  (tooltip appear, hover state)
md.sys.motion.duration.short4  →  200ms  (chip appear, simple opacity change)
md.sys.motion.duration.medium1 →  250ms  (standard component enter/exit: menu, dropdown, snackbar)
md.sys.motion.duration.medium2 →  300ms  (navigation transition, tab switch)
md.sys.motion.duration.medium3 →  350ms  (card expand, accordion open)
md.sys.motion.duration.medium4 →  400ms  (large surface exit: dialog close, sheet collapse)
md.sys.motion.duration.long1   →  450ms  (large surface enter: dialog open)
md.sys.motion.duration.long2   →  500ms  (bottom sheet full expand, page transition)
md.sys.motion.duration.long3   →  550ms  (complex shared element transition)
md.sys.motion.duration.long4   →  600ms  (maximum — hero/onboarding only)
md.sys.motion.duration.extra-long1 → 700ms  (multi-step reveal, staggered list)
md.sys.motion.duration.extra-long4 → 1000ms (reserved for loading/skeleton shimmer cycles)
```

**Hard limit**: No UI transition exceeds 600ms. Skeleton shimmer loops at 1500ms are exempt (looping, not transitional).

---

### MOTION ASSIGNMENT TABLE — COMPONENT × EVENT

| Component | Event | Duration Token | Easing Token | Properties |
|---|---|---|---|---|
| Button | Hover enter | short3 (150ms) | standard | background-color (state layer) |
| Button | Press | short2 (100ms) | standard | background-color (ripple) |
| Button | Disabled | short4 (200ms) | standard | opacity |
| FAB | Hover | short3 (150ms) | standard | box-shadow, background |
| FAB | Extended → collapsed | medium2 (300ms) | emphasized | width, opacity (label) |
| Card | Hover elevation | short3 (150ms) | standard | box-shadow |
| Card | Expand (detail) | medium3 (350ms) | emphasized | height, opacity |
| Dialog | Open | long1 (450ms) | emphasized-decelerate | transform (scale 0.8→1), opacity |
| Dialog | Close | medium4 (400ms) | emphasized-accelerate | transform (scale 1→0.8), opacity |
| Scrim | Appear | medium1 (250ms) | standard-decelerate | opacity (0→0.32) |
| Scrim | Disappear | medium1 (250ms) | standard-accelerate | opacity (0.32→0) |
| Bottom Sheet | Expand | long2 (500ms) | emphasized-decelerate | transform (translateY) |
| Bottom Sheet | Collapse | medium4 (400ms) | emphasized-accelerate | transform (translateY) |
| Navigation Bar | Item select | short4 (200ms) | standard | indicator width, icon/label color |
| Snackbar | Enter | medium1 (250ms) | emphasized-decelerate | transform (translateY from bottom) |
| Snackbar | Exit | medium1 (250ms) | emphasized-accelerate | transform (translateY to bottom) |
| Menu / Dropdown | Open | short4 (200ms) | standard-decelerate | transform (scaleY 0→1 from top), opacity |
| Menu / Dropdown | Close | short3 (150ms) | standard-accelerate | opacity |
| Tooltip | Appear | short3 (150ms) | standard-decelerate | opacity |
| Tooltip | Disappear | short2 (100ms) | standard-accelerate | opacity |
| Accordion | Open | medium2 (300ms) | standard-decelerate | height (0→auto via max-height) |
| Accordion | Close | medium1 (250ms) | standard-accelerate | height |
| Chip | Select | short4 (200ms) | standard | background, checkmark opacity |
| Switch | Toggle | short4 (200ms) | emphasized | transform (thumb translateX), background |
| Checkbox | Check | short3 (150ms) | standard | checkmark draw (stroke-dashoffset) |
| Page transition | Enter | medium2 (300ms) | emphasized-decelerate | transform (translateX from right), opacity |
| Page transition | Exit | medium2 (300ms) | emphasized-accelerate | transform (translateX to left), opacity |
| Skeleton shimmer | Loop | extra-long4 (1500ms) | linear | background-position (shimmer sweep) |
| Progress bar | Fill | proportional | linear | width |
| Ripple | Expand | medium1 (250ms) | standard | transform (scale), opacity |

---

### STAGGERED ANIMATION RULES

When animating multiple sibling elements (list items, cards entering screen):
- Stagger delay: **30–50ms per item**
- Maximum total stagger: **300ms** (cap after 6–8 items — remaining animate together)
- Direction: top-to-bottom for vertical lists; left-to-right for horizontal
- Each item: same duration + easing (only delay staggers)

```css
/* Example: 5-item staggered list */
.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 40ms; }
.list-item:nth-child(3) { animation-delay: 80ms; }
.list-item:nth-child(4) { animation-delay: 120ms; }
.list-item:nth-child(5) { animation-delay: 160ms; }
/* Duration per item: 250ms (medium1) — last item finishes at 160+250=410ms total */
```

---

### PERFORMANCE RULES — ANIMATABLE PROPERTIES

**Always safe to animate (GPU composited — no layout/paint):**
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur only — use sparingly, causes repaint on some browsers)

**Avoid animating (triggers layout recalculation):**
- `width`, `height` — use `transform: scaleX/scaleY` instead
- `top`, `left`, `right`, `bottom` — use `transform: translate` instead
- `margin`, `padding` — use `transform` instead
- `max-height` — acceptable for accordion ONLY with `overflow: hidden`
- `box-shadow` — acceptable for elevation changes (short durations only)
- `background-color` — acceptable for state layer changes (short durations only)

**FORBIDDEN in animation:**
- `font-size` — never animate
- `border-radius` — avoid except for FAB extend/collapse
- Animating layout properties on lists > 10 items without `will-change: transform`

---

### CSS IMPLEMENTATION TEMPLATE

```css
/* Token map — add to :root */
:root {
  --md-motion-duration-short3: 150ms;
  --md-motion-duration-medium1: 250ms;
  --md-motion-duration-long1: 450ms;
  --md-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0);
  --md-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0.0, 0.8, 0.15);
}

/* Dialog open — correct implementation */
@media (prefers-reduced-motion: no-preference) {
  .dialog[open] {
    animation: dialog-enter var(--md-motion-duration-long1)
               var(--md-motion-easing-emphasized-decelerate) forwards;
  }
  @keyframes dialog-enter {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }
}
```

---

### MOTION AUDIT RULES (Critic — Gate 7)

```
CHECK: All animations reference named duration token (not arbitrary ms value)
  FAIL → P2: arbitrary_animation_duration

CHECK: Enter transitions use decelerate easing, exit transitions use accelerate easing
  FAIL → P1: easing_direction_mismatch

CHECK: No animation exceeds 600ms duration (except shimmer/skeleton)
  FAIL → P1: animation_duration_too_long

CHECK: Only transform and opacity animated on performance-critical components
  FAIL → P1: non_performant_property_animated

CHECK: All animations gated with prefers-reduced-motion (see specs_reduced_motion_rules.md)
  FAIL → P0: wcag_2.3.3_motion_not_gated

CHECK: iOS target uses spring timing, not cubic-bezier
  FAIL → P1: ios_cubic_bezier_instead_of_spring

CHECK: Stagger total duration ≤ 300ms (last stagger delay)
  FAIL → P1: stagger_delay_too_long
```

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "transition" / "animation" / "moving element" → CHECK gating + duration + easing token
- "list appearing" / "items fading in" → CHECK stagger rules
- "modal opening" → CHECK emphasized-decelerate + long1 duration
- "spinner" / "loading" → CHECK linear easing + not gated (functional)
- "ripple" / "press effect" → CHECK medium1 + standard easing
