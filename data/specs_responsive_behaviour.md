# specs_responsive_behaviour.md
## Vellum Design Governance — Breakpoint Collapse Rules & Responsive Adaptation
## Agent: Architect (Temp 0.7) — Apply transformation rules per breakpoint transition.

---

### BREAKPOINT DEFINITIONS (M3 Window Size Classes)

| Class | Width Range | Typical Device |
|---|---|---|
| Compact | 0–599dp | Phone portrait, small phone landscape |
| Medium | 600–839dp | Tablet portrait, large phone landscape, foldable unfolded |
| Expanded | 840dp+ | Tablet landscape, desktop, large foldable |

### CSS Implementation
```css
/* Compact: default (mobile-first) */
/* Medium: */
@media (min-width: 600px) { }
/* Expanded: */
@media (min-width: 840px) { }
/* Max content width (beyond 1440dp — center and cap) */
@media (min-width: 1440px) {
  .content-container { max-width: 1440px; margin: 0 auto; }
}
```

---

### NAVIGATION TRANSFORMATION RULES

```
Compact → Medium transition:
  Navigation Bar (bottom) → Navigation Rail (side, 80dp)
  Navigation Drawer (modal) → Navigation Rail OR Drawer (standard)
  Action: Rail replaces Bar; Bar hides at Medium+

Medium → Expanded transition:
  Navigation Rail → Navigation Drawer (standard, persistent, 360dp)
  Action: Drawer opens and stays open; Rail hides at Expanded+
  Exception: If destinations ≤ 3, Rail may remain at Expanded (simpler layouts)

iOS native — no transformation:
  Tab Bar persists across all size classes on iPhone
  iPad: Tab Bar (Compact width) → Sidebar/Split View (Regular width)

FAB transformation:
  Compact: FAB (56dp) bottom-right, 16dp from edges
  Medium: FAB moves to Navigation Rail bottom area (if Rail is present)
  Expanded: FAB collapses into Extended FAB OR relocates to top of content area
```

---

### LAYOUT GRID TRANSFORMATION RULES

```
Compact (4 columns):
  Margin: 16dp each side
  Gutter: 16dp
  Column width: (screen_width - 32 - 48) / 4
  Full-width component: spans 4 columns
  Half-width component: spans 2 columns

Medium (8 columns):
  Margin: 24dp each side
  Gutter: 24dp
  Column width: (screen_width - 48 - 168) / 8
  Full-width component: spans 8 columns
  Card grid: spans 4 columns each (2 per row)

Expanded (12 columns):
  Margin: 24dp each side
  Gutter: 24dp
  Column width: (screen_width - 48 - 264) / 12
  Full-width component: spans 12 columns (or max 10 for readability)
  Card grid: spans 3 or 4 columns each (3–4 per row)
  Content + sidebar: content = 8 col, sidebar = 4 col
  Max content width: 1440dp (center beyond this)
```

---

### COMPONENT TRANSFORMATION RULES PER BREAKPOINT

#### Cards
```
Compact:
  Layout: single column, full width (4 col span)
  Stack: vertical list
Medium:
  Layout: 2-column grid (2 × 4 col)
  Cards equal height within row
Expanded:
  Layout: 3 or 4-column grid (3 × 4 col or 4 × 3 col)
  Featured card: spans 2 columns at Expanded
```

#### Dialogs
```
Compact:
  Width: screen_width - 32dp (16dp margin each side minimum)
  Max width: 560dp
  Position: centered horizontally, ~33% from top vertically
Medium / Expanded:
  Width: fixed 560dp max (does not stretch to fill wide screens)
  Position: centered in viewport
```

#### Bottom Sheet
```
Compact:
  Width: full screen width
  Corner radius: 28dp top-left + top-right only
Medium / Expanded:
  Transition to: Side Sheet (right-anchored) OR Dialog
  Width: 400dp (side sheet) or 560dp (dialog)
  Do NOT use full-width Bottom Sheet at Expanded — P1 WARN: bottom_sheet_wrong_breakpoint
```

#### Top App Bar
```
Compact:
  Height: 64dp (standard) or 112dp (medium) or 152dp (large)
  Actions: max 2 trailing icon buttons
Medium / Expanded:
  Height: 64dp standard
  Actions: up to 3 trailing icon buttons
  Search: may expand inline (not modal)
  Title: may shift left with Navigation Drawer open (content shifts 360dp right)
```

#### Data Tables
```
Compact:
  Full-width, horizontal scroll if columns exceed viewport
  Minimum column width: 100dp
  Sticky first column (row label/identifier)
Medium:
  Show up to 5–6 columns without scroll
Expanded:
  All columns visible, no scroll needed for standard tables
  Dense mode: reduce row height to 36dp (from 52dp standard)
```

#### Forms
```
Compact:
  Single column, full-width fields
  Submit button: full-width
Medium:
  Single column OR 2-column for short fields (name: [first] [last])
  Submit button: right-aligned, intrinsic width
Expanded:
  Multi-column layout (2 or 3 fields per row)
  Labels may shift to left of fields (horizontal label layout)
  Submit button: right-aligned, fixed width
```

---

### IMAGE & MEDIA TRANSFORMATION RULES

```
Compact:
  Hero image: full width, 16:9 aspect ratio
  Thumbnail: 56dp or 72dp square (list item leading)
  Gallery: 2-column grid
Medium:
  Hero image: full width, 21:9 aspect ratio (wider crop)
  Gallery: 3-column grid
Expanded:
  Hero image: full width, max 1440dp, may be decorative side panel instead
  Gallery: 4-column grid
  Content + image: 2-column layout (text 8 col, image 4 col)
```

---

### TEXT COLUMN WIDTH RULES (Readability)

```
Optimal reading width: 60–80 characters per line (ch units)
Maximum body text width: 75ch (approx 680dp at 16sp)
Minimum body text width: 30ch

Compact: Body text spans full content width (4 columns) — acceptable
Medium: Body text may need max-width: 680px to prevent over-wide lines
Expanded: Body text MUST have max-width: 680px — never full 12-column span
  Long-form content at Expanded: 8 of 12 columns, centered
```

---

### TOUCH vs. POINTER ADAPTATION RULES

```
Touch (Compact, mobile):
  Tap targets: ≥ 48dp
  No hover states as primary affordance
  Swipe gestures: supported (back swipe, pull-to-refresh, swipe-to-dismiss)
  Tooltips: NOT used (no hover)

Pointer (Expanded, desktop):
  Click targets: ≥ 24px minimum
  Hover states: required affordance
  Right-click context menus: supported
  Tooltips: used freely (hover-triggered)
  Drag and drop: supported

Mixed (Medium, tablet):
  Design for touch primary
  Hover states: present but not required affordance
  Pointer events: enhanced when mouse detected
```

---

### RESPONSIVE AUDIT RULES (Critic)

```
CHECK: Navigation uses correct pattern per breakpoint (Bar→Rail→Drawer)
  FAIL → P0: navigation_wrong_breakpoint_pattern

CHECK: Full-width Bottom Sheet not used at Expanded breakpoint
  FAIL → P1: bottom_sheet_wrong_breakpoint

CHECK: Body text max-width constrained at Expanded (not full 12-col span)
  FAIL → P1: body_text_exceeds_readable_width

CHECK: Column count matches breakpoint definition
  FAIL → P1: column_count_breakpoint_mismatch

CHECK: All layout widths are within max-content-width 1440dp
  FAIL → P1: layout_exceeds_max_content_width

CHECK: Dialog width does not exceed 560dp at any breakpoint
  FAIL → P1: dialog_width_too_wide
```
