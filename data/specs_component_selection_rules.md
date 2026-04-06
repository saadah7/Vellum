# specs_component_selection_rules.md
## Vellum Design Governance — Component Selection Decision Trees
## Agent: Architect (Temp 0.7) — Use before proposing any component. One component per use case.

---

### RULE: NEVER propose a component without running its decision tree first.
### RULE: Output the component name + the decision path that selected it.

---

### TREE 1 — OVERLAY / TEMPORARY SURFACE SELECTION

```
User needs to: show temporary content above current screen
  ↓
Is user action REQUIRED before continuing?
  YES → Is content a simple confirmation (1–2 sentences + 2 buttons)?
    YES → DIALOG (Alert Dialog)
    NO  → Is content a complex form or multi-step flow?
      YES → DIALOG (Full Dialog, max 560dp width)
      NO  → BOTTOM SHEET (Modal)
  NO ↓

Is content related to the current item/context (e.g. more options for a list item)?
  YES → Is action list short (≤ 6 items, no form fields)?
    YES → MENU (Dropdown or Context Menu)
    NO  → BOTTOM SHEET (Modal)
  NO ↓

Is content supplementary info shown on hover/focus (≤ 2 lines)?
  YES → TOOLTIP
  NO ↓

Is content a persistent panel that coexists with main content?
  YES → SIDE SHEET (Standard) or NAVIGATION DRAWER (Standard)
  NO ↓

Default for temporary non-blocking content → BOTTOM SHEET (Standard, non-modal)
```

---

### TREE 2 — NAVIGATION PATTERN SELECTION

```
Platform = iOS native?
  YES →
    Destinations ≤ 5?
      YES → TAB BAR (bottom, HIG)
      NO  → TAB BAR (5 visible) + overflow in "More" or split into sections
    Never use: FAB, Navigation Rail, Navigation Drawer on iOS native
  NO (web / PWA / Android) ↓

Window class = Compact (0–599dp)?
  YES → Destinations ≤ 5?
    YES → NAVIGATION BAR (bottom, M3)
    NO  → NAVIGATION DRAWER (modal, triggered by hamburger)
  NO ↓

Window class = Medium (600–839dp)?
  YES → NAVIGATION RAIL (side, 80dp wide, icons + optional labels)
  NO ↓

Window class = Expanded (840dp+)?
  YES → NAVIGATION DRAWER (standard, persistent, 360dp)
         OR NAVIGATION RAIL if content is simple / destinations ≤ 5
```

---

### TREE 3 — BUTTON TYPE SELECTION

```
Action is the PRIMARY action on screen (one per screen)?
  YES → Is it a floating persistent action (e.g. Compose, Add)?
    YES → FAB (56dp) or Extended FAB (with label)
          NOT on iOS native — use large filled Button in toolbar instead
    NO  → FILLED BUTTON (highest emphasis)
  NO ↓

Action is important but not the only action?
  YES → FILLED TONAL BUTTON (secondary emphasis, primary-container fill)
  NO ↓

Action is an alternative or supporting action alongside a primary?
  YES → OUTLINED BUTTON (medium emphasis, no fill)
  NO ↓

Action is low emphasis / destructive / cancel?
  YES → TEXT BUTTON (lowest emphasis, no fill, no border)
  NO ↓

Action is within a dense layout (toolbar, card header, chip row)?
  YES → ICON BUTTON (24dp icon, 48dp tap area) or FILLED ICON BUTTON
  NO ↓

Default → OUTLINED BUTTON
```

---

### TREE 4 — INPUT / FORM FIELD SELECTION

```
User enters free-form text (single line)?
  YES → Is the field within a dense list or table?
    YES → OUTLINED TEXT FIELD (compact)
    NO  → FILLED TEXT FIELD (standard, preferred by M3)
  NO ↓

User enters free-form text (multi-line)?
  YES → TEXTAREA (Text Field with minLines ≥ 3, no maxLines)
  NO ↓

User selects ONE option from a SHORT list (≤ 5 options, always visible)?
  YES → RADIO GROUP (all options visible simultaneously)
  NO ↓

User selects ONE option from a LONG list (> 5 options)?
  YES → SELECT / DROPDOWN (collapsed by default)
  NO ↓

User selects MULTIPLE options from a short list (≤ 8 options, always visible)?
  YES → CHECKBOX GROUP
  NO ↓

User selects MULTIPLE options from a long list?
  YES → MULTI-SELECT DROPDOWN or CHIP GROUP (filter chips)
  NO ↓

User toggles a single binary state (on/off)?
  YES → Is it an immediate action (takes effect without form submit)?
    YES → SWITCH
    NO  → CHECKBOX (single)
  NO ↓

User selects a value along a continuous range?
  YES → SLIDER (continuous) or SLIDER (discrete, with steps)
  NO ↓

User enters a date?
  YES → Is precision required (specific date)?
    YES → DATE PICKER (modal calendar)
    NO  → DATE INPUT (text field with date format hint)
  NO ↓

Default → FILLED TEXT FIELD
```

---

### TREE 5 — CONTENT CONTAINER SELECTION

```
Content is a standalone item in a list/grid (tappable, self-contained)?
  YES → Is it tappable to navigate to detail?
    YES → CARD (filled or outlined, elevation Level 0–1)
    NO  → LIST ITEM (no elevation)
  NO ↓

Content is a persistent surface below other content (page background)?
  YES → SURFACE (no elevation, surface-container token)
  NO ↓

Content is a status message (success, error, warning, info)?
  YES → Is it persistent / blocks content?
    YES → BANNER (below top app bar, dismissible)
    NO  → Is it brief (≤ 2 lines, auto-dismiss in 4–8s)?
      YES → SNACKBAR
      NO  → INLINE MESSAGE (within form or content area)
  NO ↓

Content is a compact tag/label/filter (selectable, dismissible)?
  YES → Is it a filter that toggles on/off?
    YES → FILTER CHIP
    NO  → Is it an input that can be removed?
      YES → INPUT CHIP
      NO  → Is it an action trigger?
        YES → ACTION CHIP (or ASSIST CHIP for suggestions)
        NO  → SUGGESTION CHIP
  NO ↓

Content is a category label (non-interactive)?
  YES → BADGE (numeric) or STATUS INDICATOR (semantic color dot + label)
  NO ↓

Default → CARD
```

---

### TREE 6 — PROGRESS / LOADING INDICATOR SELECTION

```
Operation has known duration/progress (0–100%)?
  YES → Is it a full page/screen-level operation?
    YES → LINEAR PROGRESS BAR (top of screen or below top app bar)
    NO  → Is it within a specific component (card, button)?
      YES → CIRCULAR PROGRESS INDICATOR (determinate, within component)
      NO  → LINEAR PROGRESS BAR (within content area)
  NO (indeterminate) ↓

Operation blocks ALL interaction?
  YES → CIRCULAR PROGRESS INDICATOR (indeterminate, centered, with scrim)
  NO ↓

Operation is background / non-blocking?
  YES → Is it visible in a specific container (card, list item)?
    YES → CIRCULAR PROGRESS INDICATOR (small, 24dp, within component)
    NO  → SKELETON LOADER (placeholder content shape matching final layout)
  NO ↓

Operation is within a button (e.g. submit in progress)?
  YES → Replace button label with CIRCULAR PROGRESS (16dp) + disable button
  NO ↓

Default → CIRCULAR PROGRESS INDICATOR (indeterminate)
```

---

### TREE 7 — LIST vs. GRID SELECTION

```
Content items are primarily text-based (title + subtitle + optional leading element)?
  YES → Items have equal importance / no dominant visual?
    YES → LIST (single, two-line, or three-line)
    NO  → Does one item need to be featured/larger?
      YES → FEATURED CARD + LIST below
      NO  → LIST
  NO ↓

Content items are primarily image/visual-based?
  YES → Are items equal size with no dominant item?
    YES → GRID (equal columns, image-led cards)
    NO  → STAGGERED GRID (varying heights, Masonry)
  NO ↓

Content is mixed (some image, some text-only)?
  YES → LIST with leading image thumbnail (56×56dp or 72×72dp)
  NO ↓

Default → LIST
```

---

### FORBIDDEN COMBINATIONS (Critic will REJECT these pairings)

- FAB + iOS native app → REJECTED: fab_forbidden_ios_native
- Navigation Drawer (persistent) + Compact window class → REJECTED: drawer_wrong_breakpoint
- Alert Dialog with > 2 action buttons → REJECTED: dialog_too_many_actions (use Full Dialog)
- Tooltip on touch-only interface (no hover) → REJECTED: tooltip_touch_only_unusable
- Switch for settings that require confirmation before taking effect → P1 WARN: switch_requires_confirmation (use Checkbox + explicit save)
- Snackbar with action button label > 2 words → P1 WARN: snackbar_action_too_long
- Radio group with > 5 options visible simultaneously → P1 WARN: radio_group_too_many_options (use Select)
- Nested scrolling containers (scroll inside scroll) → REJECTED: nested_scroll_forbidden
