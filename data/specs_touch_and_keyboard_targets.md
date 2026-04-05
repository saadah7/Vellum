# specs_touch_and_keyboard_targets.md
## Vellum Design Governance — Touch Target & Keyboard Interaction Rules
## Agent: Senior Critic (Temp 0) — Gate 5 enforcement. All P0 violations = REJECTED.

---

### TOUCH TARGET MINIMUMS

#### Android / Web (M3)
- Minimum touch target: **48×48dp** — applies to ALL interactive elements
- Minimum visual size can be smaller (e.g. 24dp icon) IF invisible tap area padding expands to 48dp
- Tap area padding formula: `padding = (48 - visual_size) / 2`
  - Example: 24dp icon → padding = (48 - 24) / 2 = 12dp on all sides
- Components that are already ≥ 48dp by spec: Button (40dp height — EXCEPTION: M3 uses 40dp visual, 48dp tap area via padding), FAB (56dp ✓), Navigation Bar items (48dp ✓), List items (48dp ✓)
- Minimum spacing between adjacent targets: **8dp** — prevents mis-taps
- WCAG 2.5.5 (AAA): 44×44 CSS pixels minimum — treat as P0 for Vellum regardless of AAA status

#### iOS / iPadOS (HIG)
- Minimum touch target: **44×44pt** — Apple mandatory
- Applies to: buttons, links, switches, sliders, tab bar items, navigation bar items
- Minimum spacing between adjacent targets: **8pt**
- Exception: Text links inline in body copy — minimum 44pt height via line-height, width = text width (acceptable)

#### Desktop / Web Pointer
- Minimum click target: **24×24 CSS pixels** (WCAG 2.5.8 AA, adopted 2023)
- Recommended: 32×32px for comfort
- Exception: Text links in body — no minimum size requirement beyond contrast

---

### TOUCH TARGET AUDIT RULES

```
CHECK: interactive_element.height >= 48dp (Android/web)
  FAIL → P0: touch_target_height_too_small
  FIX: Add vertical padding to reach 48dp. Do not increase font size.

CHECK: interactive_element.width >= 48dp (Android/web)
  FAIL → P0: touch_target_width_too_small
  FIX: Add horizontal padding or minimum width constraint.

CHECK: spacing between adjacent_targets >= 8dp
  FAIL → P1: touch_target_spacing_too_small
  FIX: Add margin or restructure layout.

CHECK: icon_only_button has invisible tap area >= 48×48dp
  FAIL → P0: icon_button_tap_area_insufficient
  FIX: Wrap in 48×48dp container with transparent background.
```

---

### KEYBOARD NAVIGATION RULES

#### Tab Order
- Tab order must follow visual reading order: **left → right, top → bottom**
- Exception: Modal/dialog — tab order must be trapped within the modal (see specs_focus_management.md)
- `tabindex="0"` — makes non-interactive element focusable (use sparingly)
- `tabindex="-1"` — removes from tab order but allows programmatic focus
- `tabindex > 0` — **FORBIDDEN** — breaks natural tab order. P0 violation.
- Positive tabindex rule: `tabindex > 0` detected → REJECTED: tab_order_positive_tabindex

#### Keyboard Shortcuts — Required Per Component
| Component | Required Keys |
|---|---|
| Button | Enter, Space |
| Link | Enter |
| Checkbox | Space (toggle) |
| Radio group | Arrow keys (within group), Tab (exit group) |
| Select / Dropdown | Enter (open), Arrow keys (navigate), Escape (close), Enter (select) |
| Dialog / Modal | Escape (close), Tab (cycle within) |
| Slider | Arrow keys (increment/decrement), Home (min), End (max) |
| Tab Bar | Arrow keys (switch tabs), Tab (exit tab bar) |
| Date Picker | Arrow keys (navigate calendar), Enter (select) |
| Autocomplete | Arrow keys (navigate suggestions), Enter (select), Escape (dismiss) |

#### Keyboard Audit Rules
```
CHECK: button activatable via Enter AND Space
  FAIL → P0: keyboard_button_activation_missing

CHECK: dropdown/menu navigable via arrow keys
  FAIL → P0: keyboard_arrow_nav_missing

CHECK: dialog closeable via Escape key
  FAIL → P0: keyboard_escape_dismiss_missing

CHECK: slider adjustable via arrow keys
  FAIL → P0: keyboard_slider_control_missing

CHECK: no positive tabindex values in DOM
  FAIL → P0: tab_order_positive_tabindex
```

---

### FOCUS INDICATOR SPECIFICATIONS

- Focus indicator must be **visible** — WCAG 2.4.7 (AA) and 2.4.11 (AA, 2023)
- WCAG 2.4.11 minimum: focus indicator area ≥ perimeter of component × 2 CSS pixels
- Minimum focus indicator contrast: **3:1** against adjacent colors (WCAG 2.4.11)
- M3 focus indicator: 3dp ring in `secondary` color, offset 2dp from component edge
- HIG focus indicator: System default blue ring (do not suppress with `outline: none` without replacement)
- **FORBIDDEN**: `outline: none` or `outline: 0` without a custom focus style replacement → P0: focus_indicator_suppressed

#### CSS Focus Pattern (Web — Required)
```css
/* Minimum compliant focus style */
:focus-visible {
  outline: 3px solid var(--md-sys-color-secondary);
  outline-offset: 2px;
  border-radius: 4px;
}
/* Never use :focus alone — triggers on mouse click too */
/* Never use outline: none without replacement */
```

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "small button" → CHECK touch target size
- "icon only" → CHECK tap area + aria-label
- "crowded elements" → CHECK target spacing ≥ 8dp
- "no border on focused element" → CHECK focus indicator presence
- "text link" → CHECK minimum 44pt height via line-height
- "slider" → CHECK keyboard arrow key support
- "dropdown" → CHECK arrow key navigation
