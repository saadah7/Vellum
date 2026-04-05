# specs_typography_scaling.md
## Source: Material Design 3 (M3) + Apple HIG — Typography Technical Rules

---

### TYPE SCALE — MATHEMATICAL RATIOS

- **Major Third ratio**: 1.25x — multiply each step by 1.25 ascending
- **Perfect Fourth ratio**: 1.333x — used for more dramatic scale contrast
- **M3 Named Scale Steps** (sp = scalable pixels, 1sp = 1dp at default density):
  - `Display Large`: 57sp / Line-height 64sp / Tracking −0.25px
  - `Display Medium`: 45sp / Line-height 52sp / Tracking 0px
  - `Display Small`: 36sp / Line-height 44sp / Tracking 0px
  - `Headline Large`: 32sp / Line-height 40sp / Tracking 0px
  - `Headline Medium`: 28sp / Line-height 36sp / Tracking 0px
  - `Headline Small`: 24sp / Line-height 32sp / Tracking 0px
  - `Title Large`: 22sp / Line-height 28sp / Tracking 0px
  - `Title Medium`: 16sp / Line-height 24sp / Tracking +0.15px
  - `Title Small`: 14sp / Line-height 20sp / Tracking +0.1px
  - `Label Large`: 14sp / Line-height 20sp / Tracking +0.1px
  - `Label Medium`: 12sp / Line-height 16sp / Tracking +0.5px
  - `Label Small`: 11sp / Line-height 16sp / Tracking +0.5px
  - `Body Large`: 16sp / Line-height 24sp / Tracking +0.5px
  - `Body Medium`: 14sp / Line-height 20sp / Tracking +0.25px
  - `Body Small`: 12sp / Line-height 16sp / Tracking +0.4px

---

### LINE-HEIGHT RATIOS

- **Display/Headline**: line-height ratio ≈ 1.12–1.22x font-size (tight, editorial)
- **Title**: line-height ratio ≈ 1.27–1.43x font-size
- **Body Large**: line-height ratio = 1.5x font-size (24/16 = 1.5) — WCAG optimal for readability
- **Body Medium**: line-height ratio = 1.43x font-size (20/14)
- **Body Small**: line-height ratio = 1.33x font-size (16/12)
- **Label**: line-height ratio = 1.33–1.45x font-size
- **Caption/Label Small**: line-height ratio = 1.45x (16/11)
- **Apple HIG rule**: minimum line-height = font-size × 1.2 for any text; body ≥ 1.4x; never exceed 1.8x for body blocks

---

### TRACKING / LETTER-SPACING RULES

- **Display Large**: −0.25px (negative tracking — tighten at large sizes)
- **Display Medium/Small, Headline all**: 0px (neutral, no tracking adjustment)
- **Title Medium**: +0.15px
- **Title Small**: +0.1px
- **Label Medium**: +0.5px (positive tracking — open at small sizes for legibility)
- **Label Small**: +0.5px
- **Body Large**: +0.5px
- **Body Medium**: +0.25px
- **Body Small**: +0.4px
- **Rule**: tracking decreases (goes negative) as font-size increases above 36sp; tracking increases (goes positive) as font-size decreases below 16sp
- **Apple HIG cap**: do not apply positive tracking above 20pt; optical kerning always enabled for display sizes ≥ 40pt
- **All-caps labels**: apply minimum +0.08em tracking regardless of size
- **CSS unit conversion**: 1px tracking ≈ 0.0625em at 16px base; use `letter-spacing: 0.03125em` for +0.5px at 16px

---

### FONT-WEIGHT HIERARCHY & USE CASES

- **Weight 900 (Black)**: reserved for purely decorative/hero display; never body copy
- **Weight 700 (Bold)**:
  - Use: `Display Large/Medium`, `Headline Large/Medium`, emphasis within `Body`
  - M3 role: primary visual hierarchy anchor
  - Apple HIG: Bold = system default for titles in `UINavigationBar`, `UIAlertController` titles
- **Weight 600 (Semibold)**:
  - Use: `Headline Small`, `Title Large`, `Label Large` (active/selected state)
  - M3 role: secondary emphasis, interactive labels, tab bar selected items
  - Apple HIG: Semibold = `.headline` text style weight; used in form labels, list section headers
- **Weight 500 (Medium)**:
  - Use: `Title Medium`, `Title Small`, `Label Medium`
  - M3 role: tertiary emphasis, button labels, chip labels
  - Apple HIG: Medium = `.subheadline`; used in supplemental UI text
- **Weight 400 (Regular)**:
  - Use: `Body Large`, `Body Medium`, `Body Small`, `Display Small` (when used decoratively)
  - M3 role: all reading/content text; never for interactive controls
  - Apple HIG: Regular = `.body`, `.callout` text styles; all paragraph content
- **Weight 300 (Light)**: avoid in UI text < 18sp; permitted only for decorative display ≥ 48sp on high-contrast surfaces
- **Forbidden**: weight switching within a single typographic role across states (e.g., do NOT change weight on hover for body text — use color instead)
- **M3 Button label weight**: Medium (500) at 14sp / +1.25px tracking — fixed, no bold on press
- **Apple HIG Dynamic Type**: all weights must scale proportionally; Bold at size `xSmall` = system weight 700; at `accessibility5` size, system may override to 700 regardless of specification

---

### FONT-SIZE MINIMUMS (ACCESSIBILITY)

- **M3 minimum**: 11sp (`Label Small`) — never render UI text below 11sp
- **Apple HIG minimum**: 11pt at default Dynamic Type size; minimum tap target for text links = 44×44pt
- **WCAG 1.4.3**: "large text" threshold = 18pt (24px) regular weight OR 14pt (18.67px) bold weight — different contrast ratios apply at these thresholds
- **Body text floor**: never below 14sp/pt for primary reading content in either system

---

### TYPEFACE SPECIFICATIONS

- **M3 Reference font**: Google Fonts `Roboto` — but system font substitution permitted
- **M3 variable font requirement**: use `font-variation-settings` for weight/width axes when available; reduces HTTP requests
- **Apple HIG system font**: `SF Pro` (iOS/macOS); `SF Compact` (watchOS); do not substitute custom fonts in system UI chrome
- **Fallback stack (M3 web)**: `font-family: Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Minimum contrast for text on tinted surfaces**: applies same as color spec — 4.5:1 for body, 3:1 for large text (see specs_color_and_contrast.md)
