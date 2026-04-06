# specs_component_state_machines.md
## Vellum Design Governance — Full State Definitions Per Component
## Agent: Architect (Temp 0.7) — Every component must implement ALL defined states.
## Agent: Senior Critic (Temp 0) — Audit output for missing states = P1 WARN.

---

### STATE LAYER SYSTEM (M3 — applies to ALL interactive components)

State layers are semi-transparent overlays applied ON TOP of the component's base color.

| State | Overlay Color | Opacity | Applied To |
|---|---|---|---|
| Enabled | — | 0% | Base state, no overlay |
| Hovered | `on-surface` or `on-primary` | 8% | On hover |
| Focused | `on-surface` or `on-primary` | 12% | On keyboard focus |
| Pressed | `on-surface` or `on-primary` | 12% | On press/click |
| Dragged | `on-surface` or `on-primary` | 16% | On drag |
| Disabled (container) | `on-surface` | 12% | Container fill |
| Disabled (content) | `on-surface` | 38% | Text/icon color |

---

### BUTTON STATE MACHINE

```
States: [enabled, hovered, focused, pressed, disabled, loading]

enabled:
  fill: role-appropriate (filled=primary, tonal=secondary-container, outlined=transparent, text=transparent)
  label: on-role-color
  border: none (filled/tonal) | outline-1dp (outlined)
  elevation: Level 0

hovered:
  fill: enabled-fill + 8% on-primary overlay
  elevation: Level 1 (filled/tonal only)
  cursor: pointer

focused:
  fill: enabled-fill + 12% on-primary overlay
  focus-ring: 3dp secondary color, offset 2dp
  elevation: Level 0

pressed:
  fill: enabled-fill + 12% on-primary overlay
  elevation: Level 0 (drops back from hover)
  ripple: radial from press point, 12% opacity

disabled:
  fill: on-surface at 12% opacity
  label: on-surface at 38% opacity
  border: on-surface at 12% (outlined only)
  pointer-events: none
  cursor: not-allowed

loading:
  fill: same as disabled
  label: hidden
  icon: circular progress (16dp) centered in button
  pointer-events: none
  min-width: preserved from enabled state (no layout shift)
```

---

### TEXT FIELD STATE MACHINE

```
States: [enabled, hovered, focused, error, disabled, populated]

enabled:
  container: surface-container-highest fill
  indicator-line: on-surface-variant (1dp bottom border, filled style)
  label: on-surface-variant (floating or resting depending on content)
  input-text: on-surface
  supporting-text: on-surface-variant

hovered:
  indicator-line: on-surface (2dp — thickens on hover)
  label: on-surface-variant

focused:
  indicator-line: primary (2dp)
  label: primary (shrinks to 12sp, moves to top)
  cursor: text

error:
  indicator-line: error (2dp)
  label: error
  supporting-text: error color
  trailing-icon: error icon (✕ or ⚠)
  REQUIRED: aria-invalid="true" + aria-describedby pointing to error message

disabled:
  container: on-surface at 4% opacity
  indicator-line: on-surface at 38% opacity
  label: on-surface at 38% opacity
  input-text: on-surface at 38% opacity
  pointer-events: none

populated (has value, not focused):
  label: remains at 12sp top position
  indicator-line: on-surface-variant (1dp)
  clear-button: visible if clearable variant
```

---

### CHECKBOX STATE MACHINE

```
States: [unchecked, checked, indeterminate, unchecked-disabled, checked-disabled, hovered, focused, pressed]

unchecked:
  box: transparent fill, on-surface-variant border (2dp)
  icon: none

checked:
  box: primary fill, primary border
  icon: checkmark (white/on-primary)

indeterminate:
  box: primary fill, primary border
  icon: dash/minus (white/on-primary)
  aria-checked: "mixed"

hovered (any state):
  state-layer: 8% on-surface or on-primary overlay (40dp circle)

focused (any state):
  state-layer: 12% overlay (40dp circle)
  focus-ring: 3dp secondary

pressed (any state):
  state-layer: 12% overlay (40dp circle, ripple)

*-disabled:
  box: on-surface at 38% opacity
  icon: on-surface at 38% opacity
  pointer-events: none
```

---

### SWITCH STATE MACHINE

```
States: [off, on, off-hovered, on-hovered, off-focused, on-focused, off-pressed, on-pressed, off-disabled, on-disabled]

off (default):
  track: surface-variant fill, outline border (2dp)
  thumb: outline color (16dp diameter)
  thumb-position: left (translateX: 4dp)

on:
  track: primary fill, no border
  thumb: on-primary color (24dp diameter — grows on activation)
  thumb-position: right (translateX: track-width - 28dp)
  icon: optional checkmark inside thumb

off-hovered:
  state-layer: 8% on-surface (40dp circle around thumb)

on-hovered:
  state-layer: 8% primary (40dp circle around thumb)

*-pressed:
  thumb: 28dp diameter (expands further on press)
  state-layer: 12%

*-disabled:
  track: on-surface at 12% opacity
  thumb: on-surface at 38% opacity
  pointer-events: none
```

---

### FAB STATE MACHINE

```
States: [enabled, hovered, focused, pressed, extended, lowered]

enabled:
  container: primary-container fill
  icon: on-primary-container
  elevation: Level 3 (6dp)
  shape: 16dp corner radius (Large rounded)

hovered:
  state-layer: 8% on-primary-container
  elevation: Level 4 (8dp)

focused:
  state-layer: 12% on-primary-container
  elevation: Level 3
  focus-ring: visible

pressed:
  state-layer: 12% on-primary-container
  elevation: Level 3 (no drop on press)
  ripple: from press point

extended (with label):
  min-width: 80dp
  padding: 16dp horizontal
  gap between icon and label: 12dp
  label: label-large (14sp, weight 500)

lowered (scrolled state — content scrolled beneath):
  elevation: Level 1 (1dp) — FAB lowers when content scrolls under it
  Re-elevates on scroll stop
```

---

### DIALOG STATE MACHINE

```
States: [closed, opening, open, closing]

closed:
  display: none
  scrim: none
  focus: on trigger element

opening:
  scrim: fade-in 0→32% opacity, 250ms, cubic-bezier(0.2,0,0,1)
  container: scale 0.8→1.0 + fade 0→1, 250ms, cubic-bezier(0.05,0.7,0.1,1.0)
  focus: moves to first focusable inside dialog on animation end

open:
  scrim: #000000 at 32% opacity, z-index: 800
  container: z-index: 1000, elevation Level 3
  focus: trapped inside dialog
  Escape: triggers closing state

closing:
  container: scale 1.0→0.8 + fade 1→0, 200ms, cubic-bezier(0.4,0,1,1)
  scrim: fade-out 32→0%, 200ms
  focus: returns to stored trigger element on animation end
```

---

### BOTTOM SHEET STATE MACHINE

```
States: [hidden, peek, half-expanded, full-expanded, closing]

hidden:
  translateY: 100% (off screen)
  scrim: none (modal) or none (standard)

peek (optional, if peek height defined):
  translateY: screen-height - peek-height
  scrim: #000000 at 16% (modal only)
  drag-handle: visible (32dp × 4dp, centered, 22dp from top)

half-expanded:
  translateY: screen-height × 0.5
  scrim: #000000 at 24% (modal only)

full-expanded:
  translateY: max(top-safe-area, 56dp from top)
  scrim: #000000 at 32% (modal only)
  elevation: Level 1

closing:
  translateY: 100%, 250ms, cubic-bezier(0.4,0,1,1)
  scrim: fade to 0%
  focus: returns to trigger element
```

---

### CHIP STATE MACHINE

```
States: [enabled, selected, hovered, focused, pressed, disabled]

enabled (filter chip):
  container: surface fill, outline border
  label: on-surface-variant
  leading-icon: none or optional

selected (filter chip):
  container: secondary-container fill, no border
  label: on-secondary-container
  leading-icon: checkmark (✓)
  aria-pressed: "true"

hovered:
  state-layer: 8% on-surface or on-secondary-container

focused:
  state-layer: 12%
  focus-ring: 3dp secondary

pressed:
  state-layer: 12% + ripple

disabled:
  container: on-surface at 12%
  label: on-surface at 38%
  pointer-events: none
```

---

### NAVIGATION BAR ITEM STATE MACHINE (M3 Bottom Nav)

```
States: [unselected, selected, hovered, focused, pressed]

unselected:
  icon: on-surface-variant (24dp)
  label: on-surface-variant (label-medium 12sp)
  indicator: none

selected:
  icon: on-secondary-container (24dp), inside secondary-container pill (64dp × 32dp)
  label: on-surface, weight 500 (label-medium)
  indicator: secondary-container fill, 64dp × 32dp, 16dp corner radius

hovered (unselected):
  state-layer: 8% on-surface (entire item area)
  indicator: appears at 8% opacity (ghost)

hovered (selected):
  state-layer: 8% on-secondary-container (within indicator)

focused:
  state-layer: 12%
  focus-ring: on indicator or entire item

pressed:
  state-layer: 12% + ripple from press point
```

---

### MISSING STATE AUDIT RULES (Critic)

```
CHECK: Button implements all 6 states (enabled, hovered, focused, pressed, disabled, loading)
  MISSING state → P1: button_state_incomplete

CHECK: Text field implements error state with aria-invalid + error message
  MISSING → P0: text_field_error_state_missing

CHECK: Dialog implements opening/closing animation + focus trap
  MISSING → P0: dialog_state_incomplete

CHECK: All interactive components implement disabled state with 38% opacity content
  MISSING → P1: disabled_state_not_implemented

CHECK: Switch/Checkbox implement pressed state with expanded hit area (40dp circle)
  MISSING → P1: pressed_state_hit_area_missing
```
