# specs_grid_and_spacing.md
## Source: Material Design 3 (M3) + Apple HIG — Grid & Spacing Technical Rules

---

### 8-PT GRID SYSTEM — CORE RULES

- **Base unit**: 8pt (= 8px at 1x density; 16px at 2x Retina; 24px at 3x)
- **All layout dimensions** (width, height, padding, margin, gap) must be multiples of 8: 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 96, 128...
- **Exception**: icon stroke widths, border widths, divider lines — use 1px, 1.5px, 2px (sub-grid, not subject to 8pt rule)
- **Component minimum height**: always a multiple of 8; M3 minimum touch target = 48×48dp (= 6 × 8pt)
- **Apple HIG**: base unit = 4pt for some micro-spacing (see below); layout grid base = 8pt aligned
- **Density**: compact density reduces all spacing by 8pt increments (e.g., 48dp button → 40dp); never below 32dp height for interactive components
- **Rule**: never mix arbitrary pixel values (e.g., 13px, 22px) in layout-level spacing — only sub-grid (1px/2px) exceptions for borders

---

### MICRO-SPACING (4PT) vs MACRO-SPACING HIERARCHY

#### Micro-Spacing — 4pt
- **4pt**: icon-to-label gap within a single component; badge offset; inline element gap inside chips/tags
- **4pt**: internal padding of dense components (e.g., menu item inline icon gap)
- **4pt**: tooltip internal padding (horizontal)
- **Apple HIG**: 4pt = minimum spacing between stacked labels in a list cell

#### Standard Spacing — 8pt
- **8pt**: internal padding for compact components (dense list items, small chips)
- **8pt**: gap between icon and text in navigation items
- **8pt**: vertical spacing between closely related form fields

#### Medium Spacing — 16pt
- **16pt**: standard horizontal screen margin (Compact/mobile — 360dp width)
- **16pt**: internal padding for standard card components
- **16pt**: gap between unrelated list sections
- **16pt**: vertical padding inside `BottomSheet` header

#### Macro-Spacing — 32pt
- **32pt**: section-to-section vertical gap on a content page
- **32pt**: top padding below system navigation bar in content areas
- **32pt**: minimum padding between floating action button and screen edge

#### Macro-Spacing — 64pt
- **64pt**: top/bottom padding for hero/display sections
- **64pt**: vertical margin between major layout zones (e.g., hero → content)
- **Apple HIG**: 64pt = top safe area approximate on iPhone with Dynamic Island at 1x

---

### LAYOUT BREAKPOINTS — M3 MATHEMATICAL DEFINITIONS

| Window Class | Width Range | Columns | Gutter | Margin | Min Body Width |
|---|---|---|---|---|---|
| **Compact** | 0–599dp | 4 | 16dp | 16dp | — |
| **Medium** | 600–839dp (tablet portrait) | 8 | 24dp | 24dp | — |
| **Expanded** | 840dp+ (desktop/landscape) | 12 | 24dp | 24dp | — |

- **Column width formula**: `column_width = (screen_width − (2 × margin) − ((n_columns − 1) × gutter)) / n_columns`
  - Compact example: `(360 − 32 − 48) / 4 = 70dp` per column
  - Expanded example at 1280dp: `(1280 − 48 − 264) / 12 = 80.67dp` per column
- **M3 max content width**: 1440dp — center content beyond this; never stretch to full width
- **Apple HIG breakpoints** (UIKit size classes):
  - `Compact width`: < 768pt (iPhone portrait, iPad split ≤ 1/3)
  - `Regular width`: ≥ 768pt (iPad full, iPhone landscape on Plus/Pro Max)
  - `Compact height`: < 568pt (iPhone landscape)

---

### SAFE AREA MATH — MOBILE

#### iOS Safe Areas
- **Status bar height**: 20pt (older devices); 44pt (notch); 54pt (Dynamic Island)
- **Home indicator / bottom safe area**: 34pt (swipe gesture devices); 0pt (button home)
- **Safe area insets** (CSS env() values):
  - `env(safe-area-inset-top)` — top; `env(safe-area-inset-bottom)` — bottom
  - `env(safe-area-inset-left)` — landscape left; `env(safe-area-inset-right)` — landscape right
- **Rule**: all interactive content must not be placed within safe area insets without applying the inset as padding
- **Minimum bottom padding on scrollable content**: `max(16pt, env(safe-area-inset-bottom))`

#### Android Safe Areas (M3)
- **Status bar**: 24dp (default Material); varies by OEM (24–28dp)
- **Navigation bar height**:
  - Gesture navigation: 0dp (transparent) + 32dp gesture zone (non-interactive padding)
  - 3-button navigation: 48dp
  - 2-button navigation: 48dp
- **Rule**: `WindowInsetsCompat.getInsets(Type.systemBars())` provides runtime values; hardcode fallback = 48dp bottom

#### Web / Desktop Safe Areas
- **Browser chrome offset**: no `env()` equivalent; use `100dvh` (dynamic viewport height) not `100vh`
- **Desktop minimum margin**: 24dp on Expanded breakpoint; 16dp on Medium

---

### GUTTER RULES

- **Mobile (Compact)**: 16dp gutter between columns; 16dp margin on each side
- **Tablet (Medium)**: 24dp gutter; 24dp margin
- **Desktop (Expanded)**: 24dp gutter; 24dp margin (or custom up to 32dp)
- **Gutter ≠ padding**: gutter is the space BETWEEN columns; component internal padding is separate
- **Card-to-card gap in a grid**: = gutter value (16 or 24dp) — do not add additional margins
- **List item**: no horizontal gutter; uses margin-based inset — 16dp from screen edge for leading content, 16dp trailing
- **Apple HIG grouped list inset**: 16pt from leading/trailing edges in `insetGrouped` style; 0pt in `grouped` (full-width)

---

### COMPONENT SPACING REFERENCE (M3 SPECIFIC)

- **Button internal padding**: 24dp horizontal, 10dp vertical (height = 40dp)
- **Button with icon**: leading icon gap = 8dp; trailing padding = 24dp
- **FAB**: 56×56dp standard; 40×40dp small; 96×96dp large; margin from edge = 16dp
- **Card**: internal padding = 16dp all sides; corner radius = 12dp (Medium shape)
- **Dialog**: horizontal margin = 40dp from screen edge (Compact); internal padding = 24dp
- **Bottom Sheet**: horizontal internal padding = 16dp; top drag handle: 32dp wide × 4dp tall, centered, 22dp from top edge
- **Navigation Bar height**: 80dp total; icon area = 32dp; label below icon; 12dp top padding
- **Navigation Rail width**: 80dp; item height = 56dp
- **Navigation Drawer width**: 360dp (standard); 240dp minimum
- **Top App Bar height**: 64dp (standard); 152dp (large); 112dp (medium)
- **List item height**: 48dp (one-line); 64dp (two-line); 88dp (three-line)
- **Chip height**: 32dp; internal horizontal padding = 16dp; icon gap = 8dp
