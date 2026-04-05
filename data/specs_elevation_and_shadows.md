# specs_elevation_and_shadows.md
## Source: Material Design 3 (M3) + Apple HIG + CSS Standards — Elevation & Shadow Technical Rules

---

### M3 ELEVATION LEVELS — CSS BOX-SHADOW MATH

#### Elevation Level Definitions
| Level | dp Value | Component Examples |
|---|---|---|
| Level 0 | 0dp | Surface, Background, Cards (resting) |
| Level 1 | 1dp | Cards (hover), Menus, Autocomplete dropdowns |
| Level 2 | 3dp | FAB (resting), Chips (drag), Drawers |
| Level 3 | 6dp | FAB (hover), Dialogs, Date Pickers |
| Level 4 | 8dp | Navigation Bar (scrolled), Banner |
| Level 5 | 12dp | Bottom Sheet (full), Navigation Drawer |

#### CSS Box-Shadow Values Per Level

**M3 uses TWO shadow layers** (key light + ambient light):
- **Key light shadow**: higher offset, higher blur, lower spread — directional
- **Ambient shadow**: lower offset, lower blur, wider spread — fills in

```css
/* Level 0 — no elevation */
box-shadow: none;

/* Level 1 — 1dp */
box-shadow:
  0px 1px 2px rgba(0,0,0,0.30),   /* key */
  0px 1px 3px 1px rgba(0,0,0,0.15); /* ambient */

/* Level 2 — 3dp */
box-shadow:
  0px 1px 2px rgba(0,0,0,0.30),
  0px 2px 6px 2px rgba(0,0,0,0.15);

/* Level 3 — 6dp */
box-shadow:
  0px 4px 8px 3px rgba(0,0,0,0.15),
  0px 1px 3px rgba(0,0,0,0.30);

/* Level 4 — 8dp */
box-shadow:
  0px 6px 10px 4px rgba(0,0,0,0.15),
  0px 2px 3px rgba(0,0,0,0.30);

/* Level 5 — 12dp */
box-shadow:
  0px 8px 12px 6px rgba(0,0,0,0.15),
  0px 4px 4px rgba(0,0,0,0.30);
```

#### Shadow Parameter Breakdown
- **Offset X**: always 0px (M3 — vertical-only key light)
- **Offset Y** (key): Level 1 = 1px, Level 2 = 1px, Level 3 = 4px, Level 4 = 6px, Level 5 = 8px
- **Blur radius** (key): Level 1 = 2px, Level 2 = 2px, Level 3 = 8px, Level 4 = 10px, Level 5 = 12px
- **Spread** (ambient): Level 1 = 1px, Level 2 = 2px, Level 3 = 3px, Level 4 = 4px, Level 5 = 6px
- **Key shadow opacity**: 0.30 (30%) at all levels
- **Ambient shadow opacity**: 0.15 (15%) at all levels
- **Dark theme**: reduce all opacities by 50% (key → 0.15, ambient → 0.08); rely more on tonal surface color shifts

#### Apple HIG Shadow Reference (UIKit / SwiftUI)
- **`.shadow(radius:x:y:)` SwiftUI** approximate equivalents:
  - Subtle (card resting): `radius: 3, x: 0, y: 1` with `opacity: 0.12`
  - Medium (sheet): `radius: 8, x: 0, y: 4` with `opacity: 0.16`
  - Heavy (modal): `radius: 20, x: 0, y: 8` with `opacity: 0.24`
- **Apple does not use multi-layer shadows in UIKit** — single shadow layer with Gaussian blur
- **macOS window shadow**: system-rendered; do not apply custom shadows to `NSWindow` — override only for custom panels

---

### SCRIMS & OVERLAY SYSTEM

#### Scrim Definition
- **Scrim**: a semi-transparent overlay applied behind elevated surfaces to focus attention and block interaction with content beneath
- **Primary scrim color**: `#000000` (pure black) — ONLY context where pure black is permitted
- **Standard scrim opacity**: **32%** (`rgba(0,0,0,0.32)`)
- **M3 scrim token**: `--md-sys-color-scrim: #000000` at 32% opacity

#### Scrim Usage Rules by Component
| Component | Scrim Applied | Scrim Opacity |
|---|---|---|
| Modal Bottom Sheet | Yes | 32% |
| Modal Side Sheet | Yes | 32% |
| Full-screen Dialog | Yes | 32% |
| Standard Dialog | Yes | 32% |
| Navigation Drawer (modal) | Yes | 32% |
| Navigation Drawer (standard) | No | — |
| Menu / Dropdown | No | — |
| Tooltip | No | — |
| Snackbar | No | — |
| Date Picker (modal) | Yes | 32% |

#### Scrim CSS Implementation
```css
.scrim {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.32);
  z-index: /* see z-index table below */;
  pointer-events: all; /* blocks interaction */
}
```

#### Scrim Animation
- **Enter**: fade-in 0ms delay, duration = 250ms, easing = `cubic-bezier(0.2, 0, 0, 1)` (M3 Emphasized Decelerate)
- **Exit**: fade-out 0ms delay, duration = 200ms, easing = `cubic-bezier(0.4, 0, 1, 1)` (M3 Emphasized Accelerate)

#### Apple HIG Overlay / Dimming
- **`.dimmingView`** (UIKit): `UIColor.black` at alpha `0.3`–`0.4` depending on presentation style
- **`.pageSheet`**: dimming alpha = 0.3
- **`.formSheet`**: dimming alpha = 0.3
- **`.fullScreen`**: no dimming (covers all content)
- **Blur overlay** (instead of dim): `UIBlurEffect(style: .systemUltraThinMaterialDark)` — chroma reduces by ~40%

---

### Z-INDEX HIERARCHY (WEB / CSS STANDARD)

#### Layer Stack — Lowest to Highest
```
z-index: 0      — Base content layer (body, main)
z-index: 10     — Sticky table headers, inline floating elements
z-index: 100    — Sticky position elements (position: sticky)
z-index: 200    — Dropdown menus, Autocomplete popups
z-index: 300    — Tooltips
z-index: 400    — Navigation Bar (Top App Bar — fixed)
z-index: 500    — Navigation Drawer (standard, side panel)
z-index: 600    — FAB (Floating Action Button)
z-index: 700    — Bottom Navigation Bar
z-index: 800    — Scrim (modal backdrop)
z-index: 900    — Modal Bottom Sheet
z-index: 1000   — Dialogs / Modal windows
z-index: 1100   — Navigation Drawer (modal, over scrim)
z-index: 1200   — Date Pickers, Time Pickers (modal)
z-index: 1300   — Snackbar / Toast (above modals)
z-index: 1400   — System overlays (loading spinners, full-screen takeovers)
z-index: 2147483647 — Browser maximum (reserved for browser UI, do not use)
```

#### Component-Specific Z-Index Rules
- **Buttons (non-FAB)**: z-index: auto (in-flow); FAB: z-index: 600
- **Top App Bar (fixed)**: z-index: 400; must be above content scroll but below modals
- **Navigation Rail/Drawer (standard)**: z-index: 500; does not require scrim
- **Navigation Drawer (modal)**: z-index: 1100; requires scrim at z-index: 800
- **Snackbar**: z-index: 1300 — always above dialogs so system feedback is visible
- **Tooltip**: z-index: 300 — above content, below navigation chrome
- **Menu (dropdown from button)**: z-index: 200; clip to viewport if near edge

#### Stacking Context Rules
- Any element with `position: fixed` or `position: sticky` + z-index creates a new stacking context
- `transform`, `opacity < 1`, `filter`, `will-change` all create new stacking contexts — child z-index is scoped
- **FAB rule**: FAB must be a sibling of the scrim at DOM level, not a child of content — ensures correct z-order
- **Portal pattern**: Modals/Dialogs must be rendered into a DOM portal at `document.body` level to escape ancestor stacking contexts

---

### ELEVATION INTERACTION STATES (M3)

- **Cards at rest**: Level 0 (no shadow) — distinguish via surface-container color
- **Cards on hover**: Level 1 (add shadow)
- **Cards on press**: Level 0 (remove shadow — pressed = flat)
- **FAB at rest**: Level 3 (6dp)
- **FAB on hover**: Level 4 (8dp)
- **FAB on press**: Level 3 (unchanged in M3; color state layer applies instead)
- **Dialogs**: always Level 3 (6dp) — static, no hover state
- **Bottom Sheet**: Level 1 when peeking; Level 2 when fully expanded
- **Navigation Bar**: Level 0 at top of scroll; Level 2 when content scrolls beneath

#### Shadow Transition CSS
```css
transition: box-shadow 250ms cubic-bezier(0.2, 0, 0, 1);
/* M3 standard motion — Emphasized Decelerate for enter, Emphasized Accelerate for exit */
```

---

### ADDITIONAL ELEVATION CONSTRAINTS

- **Never apply elevation to**: text, icons, dividers, background surfaces — elevation is for surfaces only
- **Max elevation in M3**: Level 5 (12dp) — do not exceed; use scrim instead of higher elevation for focus
- **Tonal surface alternative**: in dark theme, prefer tonal surface color shift (see specs_color_and_contrast.md) OVER increasing shadow opacity
- **Elevation on colored surfaces**: when `primary-container` is the surface, apply shadow using `primary` color at 25% opacity instead of black
- **Apple HIG**: avoid custom shadows on standard `UITableViewCell`, `UICollectionViewCell` — use `.shadow` modifier only on card-like custom views
- **Performance**: use `will-change: box-shadow` only on elements with frequent shadow animation; remove after animation completes
- **Compositing**: shadows with `border-radius` > 0 must use `box-shadow` not `filter: drop-shadow()` — `drop-shadow` ignores border-radius clipping
