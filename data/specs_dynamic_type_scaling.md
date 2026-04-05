# specs_dynamic_type_scaling.md
## Vellum Design Governance — Dynamic Type, Text Scaling & Accessibility Size Classes
## Agent: Senior Critic (Temp 0) — Gate 2 enforcement. Missing scaling support on iOS = P0 REJECTED.

---

### PLATFORM APPLICABILITY

| Platform | System | Mandatory? |
|---|---|---|
| iOS / iPadOS | Apple Dynamic Type | YES — P0 if absent |
| macOS | Larger Text accessibility setting | YES — P1 if absent |
| Android | Font Scale (0.85× to 2.0×) | YES — P0 if layout breaks at 2.0× |
| Web | Browser zoom (up to 400%) + OS text size | YES — WCAG 1.4.4 (AA) — P0 if broken at 200% |

---

### APPLE DYNAMIC TYPE — TEXT STYLES & SIZE TABLE

All iOS text must use named text styles (`UIFont.preferredFont(forTextStyle:)`), not hardcoded point values.

| Text Style | Default Size | xSmall | Small | Medium | Large (default) | xLarge | xxLarge | xxxLarge |
|---|---|---|---|---|---|---|---|---|
| `.largeTitle` | 34pt | 31pt | 32pt | 33pt | 34pt | 36pt | 38pt | 40pt |
| `.title1` | 28pt | 25pt | 26pt | 27pt | 28pt | 30pt | 32pt | 34pt |
| `.title2` | 22pt | 19pt | 20pt | 21pt | 22pt | 24pt | 26pt | 28pt |
| `.title3` | 20pt | 17pt | 18pt | 19pt | 20pt | 22pt | 24pt | 26pt |
| `.headline` | 17pt | 14pt | 15pt | 16pt | 17pt | 19pt | 21pt | 23pt |
| `.body` | 17pt | 14pt | 15pt | 16pt | 17pt | 19pt | 21pt | 23pt |
| `.callout` | 16pt | 13pt | 14pt | 15pt | 16pt | 18pt | 20pt | 22pt |
| `.subheadline` | 15pt | 12pt | 13pt | 14pt | 15pt | 17pt | 19pt | 21pt |
| `.footnote` | 13pt | 12pt | 12pt | 12pt | 13pt | 15pt | 17pt | 19pt |
| `.caption1` | 12pt | 11pt | 11pt | 12pt | 12pt | 14pt | 16pt | 18pt |
| `.caption2` | 11pt | 11pt | 11pt | 11pt | 11pt | 13pt | 15pt | 17pt |

#### Accessibility Size Classes (AX sizes — very large text users)

| Text Style | AX1 | AX2 | AX3 | AX4 | AX5 |
|---|---|---|---|---|---|
| `.largeTitle` | 44pt | 48pt | 52pt | 56pt | 60pt |
| `.title1` | 38pt | 43pt | 48pt | 53pt | 58pt |
| `.body` | 28pt | 33pt | 40pt | 47pt | 53pt |
| `.caption1` | 22pt | 26pt | 29pt | 33pt | 40pt |
| `.caption2` | 20pt | 24pt | 27pt | 31pt | 38pt |

---

### IOS DYNAMIC TYPE IMPLEMENTATION RULES

```swift
// CORRECT: Scales automatically
label.font = UIFont.preferredFont(forTextStyle: .body)
label.adjustsFontForContentSizeCategory = true

// CORRECT: Custom font with Dynamic Type scaling
label.font = UIFontMetrics(forTextStyle: .body).scaledFont(for: customFont)
label.adjustsFontForContentSizeCategory = true

// FORBIDDEN: Hardcoded point values
label.font = UIFont.systemFont(ofSize: 17) // Does not scale — P0 violation

// SwiftUI — automatic, no action needed
Text("Hello")
  .font(.body) // scales automatically in SwiftUI
```

#### Layout Rules for Dynamic Type
- All containers must expand vertically to accommodate larger text — NO fixed-height text containers
- `numberOfLines = 0` for all UILabels unless explicitly a single-line component
- Minimum height constraints: use `>=` not `==`
- Horizontal truncation (`lineBreakMode = .byTruncatingTail`): acceptable ONLY in single-line components with explicit reason
- Avoid fixed-width constraints on text containers — use leading/trailing anchors with margins

```
CHECK (iOS): All UILabel/Text uses preferredFont(forTextStyle:) or UIFontMetrics scaling
  FAIL → P0: dynamic_type_not_implemented

CHECK (iOS): adjustsFontForContentSizeCategory = true on all UILabel, UITextField, UITextView
  FAIL → P0: adjusts_font_content_size_false

CHECK (iOS): No fixed-height constraints on text-containing views
  FAIL → P1: fixed_height_text_container
```

---

### ANDROID FONT SCALE RULES

Android users can set font scale from 0.85× to 2.0× in Settings → Accessibility → Font Size.

- ALL text sizes must be defined in `sp` units (not `dp` or `px`) — sp scales with font size preference
- `dp` units: layout dimensions — do NOT scale with font
- `sp` units: text sizes — DO scale with font
- At 2.0× font scale: all text doubles in size — layouts must accommodate without overlap or truncation

```xml
<!-- CORRECT: sp for text -->
<TextView android:textSize="16sp" />

<!-- FORBIDDEN: dp or px for text size -->
<TextView android:textSize="16dp" /> <!-- Does not scale — P0 violation -->
<TextView android:textSize="16px" /> <!-- Does not scale — P0 violation -->
```

#### Android Layout Rules for Large Text
- Use `wrap_content` for TextView height — NEVER fixed dp height for text views
- Use `ConstraintLayout` with percentage-based widths rather than fixed dp widths for text containers
- Test layouts at 2.0× font scale in Android Studio — no text must overlap or be clipped
- Navigation bar labels: permitted to hide label at 2.0× if icon remains with proper content description

```
CHECK (Android): All text sizes in sp
  FAIL → P0: android_text_size_not_sp

CHECK (Android): Layout does not break at 2.0× font scale
  FAIL → P0: android_layout_breaks_large_font

CHECK (Android): No fixed-height constraints on TextViews
  FAIL → P1: android_fixed_height_textview
```

---

### WEB BROWSER ZOOM & TEXT SCALING RULES (WCAG 1.4.4 — P0)

WCAG 1.4.4: Text must be resizable up to **200% without loss of content or functionality**.
WCAG 1.4.10 (Reflow): Content must reflow at **400% zoom** (320 CSS px viewport) without requiring horizontal scrolling for vertical content.

#### Implementation Rules
- All font sizes in `rem` or `em` — never `px` for body/UI text
  - Exception: decorative display text may use `px` if content loss at 200% is acceptable P1 WARN
- `1rem` = 16px at browser default — user can override root font size
- Container widths: use `max-width` + `width: 100%` — never fixed `px` widths that cause overflow
- Viewport meta tag must NOT disable user scaling:

```html
<!-- FORBIDDEN: Disables pinch zoom — P0 WCAG 1.4.4 violation -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

<!-- CORRECT -->
<meta name="viewport" content="width=device-width, initial-scale=1">
```

#### Text Scaling Audit (Web)
```
CHECK: No viewport meta with user-scalable=no or maximum-scale=1
  FAIL → P0: wcag_1.4.4_zoom_disabled

CHECK: Body text sizes in rem/em (not px)
  FAIL → P1: text_size_in_px_not_scalable

CHECK: Layout reflows at 320px viewport width without horizontal scroll
  FAIL → P0: wcag_1.4.10_reflow_broken

CHECK: Content and functionality preserved at 200% zoom
  FAIL → P0: wcag_1.4.4_content_lost_at_200pct
```

---

### MINIMUM TEXT SIZE FLOOR AT ALL SCALE LEVELS

Regardless of user scale setting, these minimums must hold:
- iOS: `.caption2` at xSmall = 11pt — this is the system-enforced floor; never go below
- Android: Minimum rendered size at 0.85× scale: floor at 11sp × 0.85 = ~9.4sp — acceptable
- Web: Minimum `font-size: 0.6875rem` (11px at default) — never set `font-size` below this in CSS

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "small text" / "tiny text" → CHECK minimum size floor + Dynamic Type compliance
- "fixed layout" / "rigid container" → CHECK for fixed-height text containers
- "text overflow" / "text cut off" / "ellipsis" → CHECK for Dynamic Type / font scale issues
- "crowded at large size" → CHECK layout accommodates 2.0× font scale
