# specs_focus_management.md
## Vellum Design Governance — Focus Management, Traps & Skip Links
## Agent: Senior Critic (Temp 0) — Gate 5/6 enforcement. All P0 = REJECTED.

---

### FOCUS TRAP RULES (WCAG 2.1.2 — P0)

#### When a Focus Trap is REQUIRED
- Modal Dialog: YES — focus must not leave dialog until dismissed
- Bottom Sheet (modal): YES
- Navigation Drawer (modal): YES
- Date Picker (modal): YES
- Alert/Confirmation Dialog: YES
- Full-screen overlay: YES

#### When a Focus Trap is FORBIDDEN
- Navigation Drawer (standard/persistent): NO trap — user can tab past it
- Tooltip: NO trap
- Snackbar: NO trap
- Dropdown Menu: NO trap — Escape closes, but focus is not trapped
- Bottom Sheet (standard/non-modal): NO trap

#### Focus Trap Implementation Requirements
```
ON modal open:
  1. Store reference to previously focused element (trigger button)
  2. Move focus to first focusable element inside modal
     - Priority: close button > first form field > first actionable element > modal container itself
  3. Tab key cycles ONLY within modal (forward)
  4. Shift+Tab cycles ONLY within modal (backward)
  5. Escape key closes modal AND returns focus to stored trigger element

ON modal close:
  1. Return focus to stored trigger element
  2. If trigger element no longer exists: focus nearest logical ancestor
  3. NEVER drop focus to body or document root

FOCUSABLE ELEMENTS (include in trap cycle):
  - <a href>
  - <button> (not disabled)
  - <input> (not disabled, not type="hidden")
  - <select> (not disabled)
  - <textarea> (not disabled)
  - [tabindex="0"]
  - [contenteditable]

NON-FOCUSABLE (exclude from trap cycle):
  - [disabled]
  - [tabindex="-1"]
  - display: none
  - visibility: hidden
  - <details> (summary is focusable, content is not until open)
```

#### Focus Trap Audit Rules
```
CHECK: modal open → focus moves inside modal automatically
  FAIL → P0: focus_not_moved_to_modal

CHECK: Tab key does not exit modal while open
  FAIL → P0: focus_trap_missing

CHECK: Escape closes modal and returns focus to trigger
  FAIL → P0: focus_not_restored_on_close

CHECK: No modal closes without restoring focus to a logical element
  FAIL → P0: focus_dropped_on_close
```

---

### FOCUS ORDER RULES (WCAG 1.3.2, 2.4.3 — P0/P1)

#### Required Focus Order
- Logical sequence: matches visual reading order (left → right, top → bottom in LTR)
- Header/navigation → main content → sidebar → footer
- Within a form: label → input pairs, in visual order, top to bottom
- Within a card grid: row by row, left to right
- Within a modal: heading → form fields → action buttons → close button (or close first if visually first)

#### Focus Order Anti-Patterns (violations)
```
FORBIDDEN: Visual order ≠ DOM order without tabindex correction → P1: focus_order_illogical
FORBIDDEN: Positive tabindex (tabindex > 0) anywhere → P0: tab_order_positive_tabindex
FORBIDDEN: Focus jumping to off-screen element → P0: focus_to_offscreen_element
FORBIDDEN: Focus appearing on non-interactive element (div, span, p) without role → P1: focus_on_non_interactive
FORBIDDEN: Focus skipping visible interactive elements → P0: focus_skip_interactive
```

---

### SKIP NAVIGATION LINKS (WCAG 2.4.1 — P1 on web)

#### Requirements
- Web layouts must include a skip link as the FIRST focusable element in the DOM
- Target: skip to `#main-content` (or equivalent main landmark)
- Visible on focus, hidden at rest (acceptable pattern)
- Required on: web app, PWA, web-rendered mobile
- Not required on: iOS native, Android native (platform handles via accessibility APIs)

#### Implementation
```html
<!-- First element in <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--md-sys-color-primary);
  color: var(--md-sys-color-on-primary);
  padding: 8px 16px;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
}
</style>

<main id="main-content" tabindex="-1">
  <!-- tabindex="-1" allows programmatic focus, not tab-accessible -->
</main>
```

#### Skip Link Audit
```
CHECK: First focusable DOM element = skip link (web target)
  FAIL → P1: skip_link_missing

CHECK: Skip link target exists (#main-content or equivalent)
  FAIL → P1: skip_link_target_missing

CHECK: Skip link visible on keyboard focus
  FAIL → P1: skip_link_not_visible_on_focus
```

---

### PROGRAMMATIC FOCUS MANAGEMENT

#### Page/View Transitions (SPA / Navigation)
```
ON route change in SPA:
  1. Move focus to <h1> of new view OR page container with tabindex="-1"
  2. Announce route change via aria-live="polite" region
  3. Do NOT leave focus on navigation trigger (link/button that caused route change)

ON async content load (lazy load, infinite scroll):
  1. If new content inserted ABOVE current focus: do not move focus
  2. If new content inserted AT END: announce via aria-live, do not auto-move focus
  3. If content replaces focused element: move focus to replacement element

ON error state (form validation):
  1. Move focus to first error message OR summary error container
  2. Each error message must be associated with its input via aria-describedby
  3. Do NOT auto-clear errors while user is typing
```

#### Dynamic Component Focus Rules
```
Accordion open → focus stays on accordion trigger (do not jump to content)
Toast/Snackbar appear → focus stays on current element (announce via aria-live)
Loading spinner appear → focus stays; announce "loading" via aria-live="polite"
Loading complete → return focus to trigger element or newly loaded content
Inline edit activate → move focus to edit input immediately
Inline edit confirm/cancel → return focus to the cell/element that was edited
```

---

### FOCUS INDICATOR VISUAL SPECIFICATIONS

- Never suppress without replacement: `outline: none` → P0 if no custom style defined
- M3 web: 3px outline, `--md-sys-color-secondary`, offset 2px, border-radius matches component
- HIG iOS: system default (blue ring) — do not override unless accessibility settings demand
- Contrast requirement: focus indicator vs. adjacent background ≥ 3:1 (WCAG 2.4.11)
- Size requirement: focus indicator area ≥ component perimeter × 2px

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "no visible border on selected element" → CHECK focus indicator suppressed
- "modal open" → CHECK focus trap active
- "popup visible" → CHECK focus moved into popup
- "form visible" → CHECK focus order matches visual order
- "navigation at top" → CHECK skip link present as first DOM element
