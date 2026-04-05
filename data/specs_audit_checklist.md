# specs_audit_checklist.md
## Vellum Design Governance — Sequential Audit Protocol
## Agent: Senior Critic (Temp 0) — Execute checks in order. Stop at first P0. Do not skip.

---

### AUDIT EXECUTION RULES

- Run checks in sequence: Gate 1 → Gate 2 → ... → Gate 8.
- On any P0 violation: halt, record violation, issue REJECTED. Do not continue to next gate.
- On P1 violations: record warning, continue to next gate.
- On P2 violations: log only, continue.
- A design PASSES only when all 8 gates complete with zero P0 violations.
- Moondream2 image description feeds into Gates 1, 2, 3, 4. Text-based spec audit feeds all gates.

---

### GATE 1 — CONTRAST & COLOR (WCAG 2.1 P4)

```
CHECK 1.1: All body text (< 18pt regular / < 14pt bold) achieves CR ≥ 4.5:1
CHECK 1.2: All large text (≥ 18pt regular / ≥ 14pt bold) achieves CR ≥ 3.0:1
CHECK 1.3: All UI components and graphical objects achieve CR ≥ 3.0:1 against adjacent color
CHECK 1.4: No pure #000000 used as surface background on area > 100×100dp
CHECK 1.5: No pure #FFFFFF used as large surface background in light theme
CHECK 1.6: Information is not conveyed by color alone (shape/label backup exists)
CHECK 1.7: Palette is safe for deuteranopia and protanopia (no red/green-only differentiation)
```
MOONDREAM TRIGGERS: "dark background", "light text", "color coding", "red and green", "white background"

---

### GATE 2 — TYPOGRAPHY (M3 P3 + WCAG 1.4.12)

```
CHECK 2.1: No UI text rendered below 11sp
CHECK 2.2: Primary body/reading text ≥ 14sp
CHECK 2.3: Line-height ≥ 1.2× font-size on all text
CHECK 2.4: Line-height ≤ 1.8× font-size on body blocks
CHECK 2.5: Font weight ≥ 400 on all UI text < 18sp
CHECK 2.6: Negative letter-spacing applied only to text ≥ 36sp
CHECK 2.7: All-caps labels have letter-spacing ≥ +0.08em
CHECK 2.8: Dynamic Type supported if target platform = iOS
```
MOONDREAM TRIGGERS: "small text", "tiny labels", "light weight font", "all caps", "cramped lines"

---

### GATE 3 — SPACING & GRID (M3 P3)

```
CHECK 3.1: All layout dimensions are multiples of 8pt (exceptions: 1px/2px borders only)
CHECK 3.2: Interactive component height ≥ 48dp (Android/web) or 44pt (iOS)
CHECK 3.3: No content extends into device safe area insets
CHECK 3.4: Screen horizontal margin ≥ 16dp (Compact) / 24dp (Medium/Expanded)
CHECK 3.5: Column count matches breakpoint (4 / 8 / 12 for Compact / Medium / Expanded)
CHECK 3.6: Gutter matches breakpoint (16dp Compact / 24dp Medium / 24dp Expanded)
```
MOONDREAM TRIGGERS: "elements near edge", "uneven spacing", "cramped layout", "notch area", "content cut off"

---

### GATE 4 — ELEVATION & SHADOWS (M3 P3)

```
CHECK 4.1: Scrim present behind all modal surfaces (Bottom Sheet modal, Dialog, Modal Drawer)
CHECK 4.2: Scrim color = #000000 at 32% opacity
CHECK 4.3: No shadow applied to text elements, icons, or dividers
CHECK 4.4: Elevation does not exceed Level 5 (12dp)
CHECK 4.5: Z-index hierarchy respected (modal ≥ 1000, snackbar ≥ 1300, scrim = 800)
```
MOONDREAM TRIGGERS: "overlay", "modal", "popup", "shadow on text", "layered elements"

---

### GATE 5 — ACCESSIBILITY: FOCUS & INTERACTION (WCAG 2.1 P4)

```
CHECK 5.1: Visible focus indicator present on all interactive elements
CHECK 5.2: Focus trap implemented in all modal dialogs and bottom sheets
CHECK 5.3: Tab order follows visual reading order (left→right, top→bottom)
CHECK 5.4: Skip navigation link present on web layouts
CHECK 5.5: All interactive elements reachable via keyboard alone
CHECK 5.6: Touch targets ≥ 48×48dp (Android/web) or 44×44pt (iOS)
```
MOONDREAM TRIGGERS: "button", "input field", "interactive", "tap target", "form element"

---

### GATE 6 — ACCESSIBILITY: SEMANTICS & ARIA (WCAG 4.1.2 P4)

```
CHECK 6.1: All interactive elements have explicit ARIA role if not using semantic HTML
CHECK 6.2: Icon-only buttons have aria-label or aria-labelledby
CHECK 6.3: All form inputs have associated <label> or aria-label
CHECK 6.4: All non-decorative images have non-empty alt text
CHECK 6.5: Decorative images have alt="" (empty, not missing)
CHECK 6.6: Dynamic content changes announced via aria-live regions
CHECK 6.7: Modal dialogs have role="dialog", aria-modal="true", aria-labelledby
```
MOONDREAM TRIGGERS: "icon button", "image", "form", "popup", "notification area"

---

### GATE 7 — MOTION & ANIMATION (WCAG 2.3.3 P4)

```
CHECK 7.1: All animations gated behind @media (prefers-reduced-motion: no-preference)
CHECK 7.2: No animation duration > 500ms on critical UI feedback (e.g. button press)
CHECK 7.3: Parallax effects or large-motion animations offer static alternative
CHECK 7.4: Looping animations can be paused by user
```
MOONDREAM TRIGGERS: "animation", "transition", "moving element", "parallax", "looping"

---

### GATE 8 — RAMS PRINCIPLES AUDIT (P1 warnings only — never blocks)

```
CHECK 8.1 (Rams P2/P5): Does every visual element serve a functional purpose?
CHECK 8.2 (Rams P6): Does the design accurately represent the product's actual capability?
CHECK 8.3 (Rams P7): Does the design use trend-dependent styling likely to age within 3 years?
CHECK 8.4 (Rams P8): Is every detail intentional and justified (no arbitrary choices)?
CHECK 8.5 (Rams P10): Have all non-essential elements been removed?
```
NOTE: Gate 8 failures = P1 WARN only. Design proceeds to APPROVED_WITH_WARNING.

---

### AUDIT SUMMARY OUTPUT FORMAT

```
GATE_RESULTS: {
  gate_1_color_contrast: PASS | FAIL (list violations),
  gate_2_typography: PASS | FAIL (list violations),
  gate_3_spacing_grid: PASS | FAIL (list violations),
  gate_4_elevation: PASS | FAIL (list violations),
  gate_5_focus_interaction: PASS | FAIL (list violations),
  gate_6_aria_semantics: PASS | FAIL (list violations),
  gate_7_motion: PASS | FAIL (list violations),
  gate_8_rams: PASS | WARN (list warnings)
}
FINAL_STATUS: REJECTED | APPROVED_WITH_WARNING | APPROVED
```

---

### MOONDREAM2 INTEGRATION PROTOCOL

- Moondream describes image → Critic receives text description.
- Critic scans description for TRIGGER KEYWORDS listed in each gate.
- On trigger match: Critic requests specific numeric check from Architect's spec output.
- If numeric check impossible from image description alone: Critic issues P1 WARN with flag `VISUAL_AUDIT_INCOMPLETE — manual verification required`.
- Moondream color descriptions ("dark blue", "light gray") must be matched against hex tokens in the Client Brief. If no match found: flag `COLOR_TOKEN_UNVERIFIED`.
