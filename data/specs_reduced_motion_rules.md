# specs_reduced_motion_rules.md
## Vellum Design Governance — Motion Gating & prefers-reduced-motion Rules
## Agent: Senior Critic (Temp 0) — Gate 7 enforcement. Ungated animations = P0 REJECTED.

---

### CORE RULE (WCAG 2.3.3 AAA — Treated as P0 by Vellum)

All non-essential animations and transitions must be disabled or reduced when the user has set `prefers-reduced-motion: reduce` in their OS accessibility settings.

```
FORBIDDEN: Any CSS animation or transition that plays without checking prefers-reduced-motion
FORBIDDEN: JavaScript animation library (GSAP, Framer Motion, etc.) that ignores OS motion preference
REQUIRED: Every animation rule wrapped in @media (prefers-reduced-motion: no-preference)
```

---

### MOTION CLASSIFICATION — WHAT MUST BE GATED

#### Class A — ALWAYS gate (P0 if ungated)
- Page transitions (slide, fade, scale between routes)
- Parallax scrolling effects
- Auto-playing carousels / slideshows
- Looping decorative animations
- Hero section animations on load
- Scroll-triggered reveal animations
- Spinning/rotating loaders (decorative)
- Any animation > 250ms duration

#### Class B — Gate recommended (P1 if ungated)
- Hover state transitions (< 150ms, opacity/color only)
- Focus ring appearance transition
- Accordion open/close (height transition)
- Dropdown menu appear/disappear
- Tooltip fade-in (< 150ms)

#### Class C — Never gate (functional, required)
- Progress bar fill (communicates loading state)
- Determinate spinner rotation (communicates active process)
- Form validation shake (< 100ms, communicates error — reduce amplitude but keep)
- Cursor/caret blink (OS-controlled)

---

### IMPLEMENTATION PATTERN

#### CSS — Correct Pattern
```css
/* Default: no motion */
.card {
  transition: none;
  transform: none;
}

/* Motion: only when user has not requested reduced motion */
@media (prefers-reduced-motion: no-preference) {
  .card {
    transition: transform 250ms cubic-bezier(0.2, 0, 0, 1),
                box-shadow 250ms cubic-bezier(0.2, 0, 0, 1);
  }
  .card:hover {
    transform: translateY(-4px);
  }
}
```

#### CSS — Forbidden Pattern
```css
/* FORBIDDEN: Animation defined outside media query */
.card {
  transition: transform 250ms ease; /* ungated — P0 violation */
}
```

#### CSS — Reduced Motion Alternative (not just "off")
```css
/* For essential animations: provide reduced alternative */
@media (prefers-reduced-motion: reduce) {
  .page-transition {
    transition: opacity 100ms ease; /* fade instead of slide */
    animation: none;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .page-transition {
    transition: transform 300ms cubic-bezier(0.2, 0, 0, 1);
  }
}
```

#### JavaScript — Correct Pattern
```javascript
// Check before applying animation
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  element.animate([
    { transform: 'translateY(0)' },
    { transform: 'translateY(-8px)' }
  ], { duration: 300, easing: 'ease-out' });
}

// React / Framer Motion
import { useReducedMotion } from 'framer-motion';
const shouldReduceMotion = useReducedMotion();
const variants = shouldReduceMotion
  ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
```

#### iOS (SwiftUI) — Correct Pattern
```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

var body: some View {
  content
    .animation(reduceMotion ? .none : .spring(response: 0.3), value: isExpanded)
}
```

#### Android (Compose) — Correct Pattern
```kotlin
val animationScale = Settings.Global.getFloat(
  context.contentResolver,
  Settings.Global.ANIMATOR_DURATION_SCALE, 1.0f
)
val duration = if (animationScale == 0f) 0 else (300 * animationScale).toInt()
```

---

### LOOPING ANIMATION RULES

- All looping animations must be pauseable by user interaction
- Auto-playing video/animation looping > 5 seconds must have pause/stop control visible
- Looping animations in viewport must not loop indefinitely without user consent (WCAG 2.2.2)
- Acceptable: looping spinner during active loading (functional, expected to stop)
- Forbidden: looping background animation with no stop control

```
CHECK: Looping animations have pause/stop mechanism
  FAIL → P1: looping_animation_no_pause_control

CHECK: Auto-playing content > 5 seconds has stop control
  FAIL → P0: wcag_2.2.2_auto_play_no_stop_control
```

---

### DURATION & EASING CONSTRAINTS (M3 Motion System)

Even when motion IS enabled (prefers-reduced-motion: no-preference), apply these limits:

| Animation Type | Max Duration | Easing |
|---|---|---|
| Component enter (expand, appear) | 300ms | `cubic-bezier(0.2, 0, 0, 1)` — Emphasized Decelerate |
| Component exit (collapse, disappear) | 250ms | `cubic-bezier(0.4, 0, 1, 1)` — Emphasized Accelerate |
| Simple state change (color, opacity) | 200ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Large surface enter (dialog, bottom sheet) | 500ms | `cubic-bezier(0.05, 0.7, 0.1, 1.0)` — Emphasized |
| Large surface exit | 400ms | `cubic-bezier(0.3, 0.0, 0.8, 0.15)` — Emphasized Accelerate |
| Micro-interaction (button press, ripple) | 100–150ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Skeleton loading shimmer | 1500ms | `linear` (looping) |

```
CHECK: No animation duration exceeds 500ms (except large surface enter: max 500ms)
  FAIL → P1: animation_duration_too_long

CHECK: Easing is not linear on enter/exit (except shimmer loops)
  FAIL → P1: animation_easing_linear_on_state_change
```

---

### AUDIT CHECKLIST (Critic Gate 7)

```
CHECK: All CSS transitions and animations defined inside @media (prefers-reduced-motion: no-preference)
  FAIL → P0: wcag_2.3.3_motion_not_gated

CHECK: JavaScript animations check window.matchMedia('prefers-reduced-motion: reduce') before running
  FAIL → P0: js_animation_motion_not_gated

CHECK: No looping decorative animation runs without pause control
  FAIL → P1: looping_animation_no_pause_control

CHECK: Page/route transitions gated by prefers-reduced-motion
  FAIL → P0: page_transition_not_gated

CHECK: Parallax effects disabled when prefers-reduced-motion: reduce
  FAIL → P0: parallax_not_gated

CHECK: SwiftUI animations use accessibilityReduceMotion (iOS target)
  FAIL → P0: ios_reduce_motion_not_checked
```

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "animation" / "transition" / "moving" → CHECK prefers-reduced-motion gate exists
- "looping" / "spinning" / "rotating" → CHECK pause control present + motion gated
- "parallax" / "scroll effect" → CHECK reduced-motion gate
- "loading spinner" → Determine if decorative (gate) or functional (permitted ungated)
- "hero animation" / "entrance effect" → CHECK motion gate — Class A, always required
