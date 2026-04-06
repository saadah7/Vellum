# specs_iconography.md
## Vellum Design Governance — Icon Size Grid, Stroke Weight, Optical Rules & Platform Split
## Agent: Architect (Temp 0.7) — Select correct icon system per platform before specifying any icon.
## Agent: Senior Critic (Temp 0) — Reject platform-wrong icon system.

---

### PLATFORM ICON SYSTEM SPLIT (non-negotiable)

| Platform | Icon System | Format | FORBIDDEN |
|---|---|---|---|
| iOS native | SF Symbols | Symbol config (.font style) | Material Symbols, custom SVG replacing SF |
| macOS native | SF Symbols | NSImage(systemSymbolName:) | Material Symbols |
| Android | Material Symbols | Vector Drawable / Compose ImageVector | SF Symbols |
| Web | Material Symbols | SVG / Icon font / variable font | SF Symbols (not available as web font) |
| Cross-platform (React Native, Flutter) | Material Symbols OR custom SVG | SVG | SF Symbols on non-Apple |

---

### MATERIAL SYMBOLS — SIZE GRID (Android / Web)

#### Standard Sizes
```
20dp — Small: dense UIs, inline text icons, chip leading icons, badge icons
24dp — Standard: default for all UI icons (navigation, actions, list items)
40dp — Large: hero/empty state icons, onboarding illustrations
48dp — XL: feature icons, large empty states
```

#### Size Rules
- Navigation bar icons: **24dp** (mandatory M3)
- Navigation rail icons: **24dp**
- FAB icon: **24dp** (standard FAB) / **24dp** (small FAB) — icon size constant, container changes
- Top app bar action icons: **24dp**
- List item leading icon: **24dp** standard / **18dp** dense
- Chip leading icon: **18dp**
- Button with icon: **18dp** icon (not 24dp — scaled down in button context)
- Empty state illustration icon: **96dp–120dp** (M3 large illustration)
- Badge icon: **16dp**

#### Optical Size Axis (Material Symbols Variable Font)
Material Symbols is a variable font with 4 axes:
```
FILL:   0 (outline) → 1 (filled)   — use filled for selected/active states
WGHT:   100–700    — match to text weight in context (default: 400)
GRAD:   -25–200    — subtle weight variation for emphasis (default: 0)
opsz:   20–48      — optical size — MUST match rendered size in dp
  opsz=20 at 20dp, opsz=24 at 24dp, opsz=40 at 40dp, opsz=48 at 48dp
```

CSS variable font usage:
```css
.icon {
  font-family: 'Material Symbols Outlined';
  font-variation-settings: 'FILL' 0, 'WGHT' 400, 'GRAD' 0, 'opsz' 24;
  font-size: 24px;
}

/* Active/selected state */
.icon.active {
  font-variation-settings: 'FILL' 1, 'WGHT' 400, 'GRAD' 0, 'opsz' 24;
}
```

#### Material Symbols Style Variants
- **Outlined**: Default — line-based, 24dp stroke weight matches Roboto
- **Rounded**: Softer — matches rounded shape tokens
- **Sharp**: Geometric — matches sharp/angular design languages
- Rule: Pick ONE variant per product — never mix styles in the same interface

---

### SF SYMBOLS — SIZE SYSTEM (iOS / macOS)

#### Symbol Scale
SF Symbols scale with text — specified by configuration, not dp values:
```swift
// Standard scale sizes
UIImage.SymbolConfiguration(scale: .small)   // ~20pt equivalent
UIImage.SymbolConfiguration(scale: .medium)  // ~24pt equivalent (default)
UIImage.SymbolConfiguration(scale: .large)   // ~28pt equivalent
```

#### Font-based sizing (preferred — scales with Dynamic Type)
```swift
// Match symbol weight to surrounding text weight
let config = UIImage.SymbolConfiguration(font: UIFont.preferredFont(forTextStyle: .body))
let icon = UIImage(systemName: "star.fill", withConfiguration: config)

// Custom point size
let config = UIImage.SymbolConfiguration(pointSize: 24, weight: .regular)
```

#### SF Symbol Weight Rules
- Icon weight must match text weight in the same component
- Navigation bar icons: match `.body` text style weight
- Tab bar icons: `.regular` weight when unselected, `.semibold` when selected
- Large hero icons: `.ultralight` or `.thin` for decorative; `.regular` for functional

#### SF Symbol Fill States
- Unselected: outline variant (e.g. `star`, `heart`, `bookmark`)
- Selected/active: filled variant (e.g. `star.fill`, `heart.fill`, `bookmark.fill`)
- Destructive: `trash.fill` or `xmark.circle.fill` with systemRed tint
- Rule: always use the `.fill` suffixed name for active states — never simulate with opacity

---

### STROKE WEIGHT RULES (SVG / Custom Icons)

When using custom SVG icons (not Material Symbols or SF Symbols):

```
Icon size 16dp: stroke-width = 1.5px
Icon size 20dp: stroke-width = 1.5px
Icon size 24dp: stroke-width = 2px   (standard)
Icon size 32dp: stroke-width = 2px
Icon size 40dp: stroke-width = 2.5px
Icon size 48dp: stroke-width = 2.5px
Icon size 96dp+: stroke-width = 3px  (empty state illustration)
```

- Stroke cap: `round` (friendly) or `square` (formal) — consistent within product
- Stroke join: `round` — always
- Fill: none (outline icons) or solid (filled state)
- FORBIDDEN: stroke-width < 1px (disappears at low DPI) → P1: icon_stroke_too_thin
- FORBIDDEN: stroke-width > 3px at 24dp (visually heavy) → P1: icon_stroke_too_thick

---

### ICON OPTICAL CORRECTIONS

#### Geometric vs. Optical Size
A circle and a square at the same bounding box do NOT appear the same size. Circles appear smaller due to less filled area at corners.

Corrections for icons within a consistent grid:
- **Circle**: extend 1–2px beyond square bounding box on all sides
- **Triangle/arrow pointing up**: raise 1px (optical center is lower than geometric)
- **Vertical rectangle**: narrow by 1px each side vs. square width
- **Cross/plus**: ensure horizontal and vertical bars equal visual weight

#### Padding within Touch Target
- Icon visual: 24dp
- Minimum touch target: 48dp
- Required padding: `(48 - 24) / 2 = 12dp` transparent padding on all sides
- Never shrink the icon to fit a small container — maintain 24dp and expand the container

#### Icon Color Rules
- Interactive icon (action): `md.sys.color.on-surface-variant` (default) / `md.sys.color.primary` (active)
- Destructive action icon: `md.sys.color.error`
- Disabled icon: `md.sys.color.on-surface` at 38% opacity
- Icon inside filled button: `md.sys.color.on-primary`
- Icon inside tonal button: `md.sys.color.on-secondary-container`
- Decorative icon (non-interactive): `md.sys.color.on-surface-variant` at 60% opacity
- FORBIDDEN: Icon using raw hex color — use token → P1: icon_raw_hex_color

---

### ICON + LABEL SPACING RULES

```
Button icon + label gap:        8dp (M3 standard)
Chip icon + label gap:          8dp
Navigation item icon + label gap: 4dp (vertical, icon above label)
Navigation rail icon + label gap: 4dp (vertical)
List item icon + text gap:      16dp
Menu item icon + text gap:      12dp
Inline icon within text:        4dp from adjacent text
```

---

### ICON ANIMATION RULES (state transitions)

| Transition | Animation | Duration | Easing |
|---|---|---|---|
| Outline → Filled (select) | FILL axis 0→1 (variable font) or crossfade | 200ms | standard |
| Icon swap (different icon) | Opacity crossfade (old→0, new→1) | 150ms | standard |
| Icon rotation (expand/collapse) | transform: rotate(180deg) | 200ms | emphasized |
| Icon scale (emphasis) | transform: scale(1→1.2→1) | 150ms | standard |
| Icon color change | color transition | 150ms | standard |
| Error icon appear | scale(0→1) + opacity(0→1) | 200ms | emphasized-decelerate |

---

### FORBIDDEN ICON PATTERNS (Critic enforcement)

```
FORBIDDEN: Material Symbols on iOS native UI → P0: wrong_icon_system_ios
FORBIDDEN: SF Symbols referenced in web/Android output → P0: wrong_icon_system_web
FORBIDDEN: Icon smaller than 16dp in any UI → P1: icon_too_small
FORBIDDEN: Icon touch target < 48×48dp → P0: icon_tap_area_insufficient (see specs_touch_and_keyboard_targets.md)
FORBIDDEN: Icon-only button without aria-label → P0: aria_label_missing_icon_button
FORBIDDEN: Mixing Material Symbols variants (outlined + rounded) in same screen → P1: icon_style_mixed
FORBIDDEN: Custom SVG stroke-width < 1px at any size → P1: icon_stroke_too_thin
FORBIDDEN: Icon color as raw hex → P1: icon_raw_hex_color
FORBIDDEN: Emoji as UI icon in professional interface → P1: emoji_as_ui_icon
FORBIDDEN: Raster (PNG/JPG) icon at < 3x resolution for any UI icon → P1: icon_raster_low_res
```

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "small icon" / "tiny icon" → CHECK size ≥ 16dp, tap area ≥ 48dp
- "icon without text" / "icon button" → CHECK aria-label + tap area
- "icon style inconsistent" → CHECK single variant used throughout
- "icon too bold" / "icon too light" → CHECK stroke-width against size grid
- "navigation icons" → CHECK 24dp size + correct icon system for platform
- "filled icon" / "outlined icon" → CHECK FILL axis state matches selection state
