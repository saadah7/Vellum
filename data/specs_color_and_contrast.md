# specs_color_and_contrast.md
## Source: Material Design 3 (M3) + Apple HIG + WCAG 2.1 — Color & Contrast Technical Rules

---

### WCAG 2.1 CONTRAST RATIO MATHEMATICS

#### Contrast Ratio Formula
- **Formula**: `CR = (L1 + 0.05) / (L2 + 0.05)` where L1 = lighter luminance, L2 = darker luminance
- **Relative Luminance formula**: `L = 0.2126 × R_lin + 0.7152 × G_lin + 0.0722 × B_lin`
- **Linearization**: if channel value `C_srgb ≤ 0.04045`: `C_lin = C_srgb / 12.92`; else: `C_lin = ((C_srgb + 0.055) / 1.055) ^ 2.4`
- **Channel normalization**: divide 8-bit value by 255 before linearization (e.g., R=128 → 128/255 = 0.502)

#### Compliance Thresholds
- **WCAG AA — Normal text** (< 18pt regular / < 14pt bold): minimum CR = **4.5:1**
- **WCAG AA — Large text** (≥ 18pt regular / ≥ 14pt bold): minimum CR = **3.0:1**
- **WCAG AA — UI components & graphical objects**: minimum CR = **3.0:1** against adjacent color
- **WCAG AAA — Normal text**: minimum CR = **7.0:1**
- **WCAG AAA — Large text**: minimum CR = **4.5:1**
- **M3 target**: all text on `surface` achieves ≥ 4.5:1 (AA); design tokens engineered for 7:1 on primary roles
- **Apple HIG**: minimum 4.5:1 for all text; recommends 7:1 for critical labels; VoiceOver display accommodations may override

#### Common Reference Contrast Ratios
- `#000000` on `#FFFFFF` = **21:1** (maximum possible)
- `#767676` on `#FFFFFF` = **4.54:1** (barely AA normal)
- `#595959` on `#FFFFFF` = **7.0:1** (AAA normal)
- `#949494` on `#FFFFFF` = **2.99:1** (FAIL for normal text)

---

### M3 TONAL PALETTE SYSTEM

#### HCT Color Space (Hue–Chroma–Tone)
- **M3 uses HCT** (not HSL/HSV) — mathematically perceptually uniform
- **Tone axis**: 0 = absolute black, 100 = absolute white; 50 = mid-luminance
- **Tonal palette generation**: pick a source color → extract hue (H) + chroma (C) → generate 13 tone stops: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100

#### Key Tonal Roles & Their Tone Values
- **Primary** = Tone 40 (light scheme) / Tone 80 (dark scheme)
- **On Primary** = Tone 100 (light) / Tone 20 (dark)
- **Primary Container** = Tone 90 (light) / Tone 30 (dark)
- **On Primary Container** = Tone 10 (light) / Tone 90 (dark)
- **Secondary** = Tone 40 (light) / Tone 80 (dark)
- **Secondary Container** = Tone 90 (light) / Tone 30 (dark)
- **Tertiary** = Tone 40 (light) / Tone 80 (dark)
- **Error** = Tone 40 (#B3261E in baseline) (light) / Tone 80 (dark)
- **Error Container** = Tone 90 (light) / Tone 30 (dark)
- **Surface** = Tone 98 (light) / Tone 6 (dark)
- **Surface Variant** = Tone 90 (light) / Tone 30 (dark)
- **On Surface** = Tone 10 (light) / Tone 90 (dark)
- **On Surface Variant** = Tone 30 (light) / Tone 80 (dark)
- **Outline** = Tone 50 (light) / Tone 60 (dark)
- **Outline Variant** = Tone 80 (light) / Tone 30 (dark)
- **Inverse Surface** = Tone 20 (light) / Tone 90 (dark)
- **Inverse On Surface** = Tone 95 (light) / Tone 20 (dark)
- **Inverse Primary** = Tone 80 (light) / Tone 40 (dark)

#### Baseline M3 Palette (Purple seed — default Material You)
- `primary-40`: `#6750A4`
- `primary-80`: `#D0BCFF`
- `primary-90`: `#EADDFF`
- `secondary-40`: `#625B71`
- `secondary-80`: `#CCC2DC`
- `tertiary-40`: `#7D5260`
- `error-40`: `#B3261E`
- `surface-98` (light): `#FEF7FF`
- `surface-6` (dark): `#141218`

---

### SURFACE ELEVATION COLOR SYSTEM (M3)

#### Elevation Overlay (Dark Theme — Primary Color Overlaid on Surface)
- **Mechanism**: as elevation increases, a semi-transparent primary color is composited over the surface color
- **Overlay opacity by level** (applied as `rgba(primary_color, opacity)` over `surface`):
  - **Level 0** (0dp): 0% overlay → pure `surface` color
  - **Level 1** (1dp): 5% overlay
  - **Level 2** (3dp): 8% overlay
  - **Level 3** (6dp): 11% overlay
  - **Level 4** (8dp): 12% overlay
  - **Level 5** (12dp): 14% overlay
- **Light theme**: no overlay; elevation conveyed by shadow only
- **CSS implementation (dark)**:
  ```css
  background: color-mix(in srgb, var(--md-sys-color-primary) 5%, var(--md-sys-color-surface));
  ```
- **M3 surface tones** (alternative to overlay — preferred in M3 rev 2023+):
  - Level 0: `surface` (Tone 98 light / Tone 6 dark)
  - Level 1: `surface-container-lowest` (Tone 100 / Tone 4)
  - Level 2: `surface-container-low` (Tone 96 / Tone 10)
  - Level 3: `surface-container` (Tone 94 / Tone 12)
  - Level 4: `surface-container-high` (Tone 92 / Tone 17)
  - Level 5: `surface-container-highest` (Tone 90 / Tone 22)

---

### FORBIDDEN HEX CODES & COLOR RULES

#### Pure Extremes — Forbidden on Large Surfaces
- **`#000000` (Pure Black)**: FORBIDDEN as background for surfaces > 100×100dp — use `#141218` (M3 dark surface) or minimum Tone 4–6
- **`#FFFFFF` (Pure White)**: FORBIDDEN as large surface background in light theme — use `#FEF7FF` (Tone 98–99) or equivalent
- **Rationale**: pure white causes halation/glare (Apple HIG); pure black causes OLED smearing and loses shadow definition
- **Exception**: `#000000` permitted for scrims/overlays (see specs_elevation_and_shadows.md); `#FFFFFF` permitted for text on dark surfaces

#### Forbidden Color Combinations (Contrast Failures)
- `#FF0000` on `#FFFFFF` = CR 3.99:1 → FAILS AA for normal text
- `#00FF00` on `#FFFFFF` = CR 1.37:1 → FAILS all levels
- `#FFFF00` on `#FFFFFF` = CR 1.07:1 → FAILS all levels
- `#0000FF` on `#FFFFFF` = CR 8.59:1 → PASSES (but saturated blue — avoid for body text)
- `#FF6B6B` on `#FFFFFF` = CR ≈ 3.1:1 → FAILS AA normal
- `#A0A0A0` on `#FFFFFF` = CR ≈ 3.95:1 → FAILS AA normal
- `#767676` on `#FFFFFF` = CR 4.54:1 → PASSES AA (minimum safe mid-gray on white)

#### State Layer Opacity Rules (M3)
- **Hover state**: apply `on-surface` or `on-primary` at **8% opacity** over component
- **Pressed/Ripple**: **12% opacity**
- **Focused**: **12% opacity**
- **Dragged**: **16% opacity**
- **Selected** (e.g., chip): use `secondary-container` fill, not opacity layer
- **Disabled text**: `on-surface` at **38% opacity**
- **Disabled container**: `on-surface` at **12% opacity**

#### Apple HIG Color Constraints
- **Semantic colors only** in iOS UI chrome: use `UIColor.label`, `UIColor.systemBackground`, `UIColor.secondarySystemBackground` — never hardcode hex for system UI
- **Dark mode**: all colors must have both light/dark variants defined in Asset Catalog; no single-mode hardcoded values
- **Vibrance**: on `UIBlurEffect` surfaces, use `UIVibrancyEffect` — do not render plain text directly on blur layers
- **Accessibility — Increase Contrast**: support `UIAccessibility.isDarkerSystemColorsEnabled` — provide alternate palette with CR ≥ 7:1

---

### TONAL PALETTE GENERATION ALGORITHM (SIMPLIFIED)

1. Input: source HEX color → convert to HCT
2. Extract H (hue 0–360) and C (chroma, keep source value, max ~84 for saturated)
3. Generate tones: for each T in [0,10,20,30,40,50,60,70,80,90,95,99,100] → HCT(H, C, T) → convert back to HEX
4. Neutrals (Surface/Background): use same H, but C reduced to 4–8 (near-achromatic)
5. Neutral Variant (Surface Variant, Outline): C = 8–16
6. Error: fixed HCT hue ≈ 25 (red), chroma ≈ 84, tone-adjusted
