# specs_cross_system_conflicts.md
## Vellum Design Governance — M3 vs. HIG Direct Contradiction Map
## Agent: Architect (Temp 0.7) — Look up before proposing any cross-platform pattern.
## Agent: Senior Critic (Temp 0) — Use to verify platform-appropriate decisions.

---

### FORMAT: Each entry = [M3 Rule] vs. [HIG Rule] → [Vellum Resolution]

---

### NAVIGATION

**Conflict N1: Primary navigation position**
- M3: Navigation Bar at BOTTOM of screen (Android/web)
- HIG: Tab Bar at BOTTOM of screen (iOS) — same position, same concept, different name
- Resolution: Same outcome. Use "Navigation Bar" for Android/web output, "Tab Bar" for iOS output. Not a functional conflict.

**Conflict N2: Back navigation**
- M3: Back arrow button in Top App Bar (leading icon)
- HIG: Back button (text label, previous screen name) in Navigation Bar top-left
- Resolution: Platform-specific — implement both for cross-platform. iOS: text back button. Android/web: icon back button.

**Conflict N3: Back gesture**
- M3 (Android): Swipe from left edge OR bottom gesture navigation
- HIG: Swipe from left edge (UINavigationController standard)
- Resolution: Same gesture, different implementation. Both required on their respective platforms.

**Conflict N4: Floating Action Button**
- M3: FAB is a primary action pattern — encouraged
- HIG: No FAB concept in HIG. Closest = large filled button in toolbar or `UIBarButtonItem`
- Resolution: FAB → FORBIDDEN on iOS native. Use large filled button in toolbar or as inline CTA.
  - Vellum flag: `fab_forbidden_ios_native` → P0 REJECTED if FAB proposed for iOS native target

**Conflict N5: Navigation Drawer**
- M3: Navigation Drawer (side panel, 360dp) — standard pattern at Expanded breakpoint
- HIG: No Navigation Drawer. Uses split view (`UISplitViewController`) on iPad.
- Resolution: Navigation Drawer → iOS iPad only via UISplitViewController. Never a floating drawer on iOS.

---

### CONTROLS & INPUTS

**Conflict C1: Segmented control placement**
- M3: No direct equivalent. Uses Chip Group (filter chips) or Tab Row for segmented choice.
- HIG: Segmented Control (`UISegmentedControl`) — horizontal pill-shaped selector
- Resolution: iOS native → UISegmentedControl. Android/web → Filter Chip Group or Tab Row.

**Conflict C2: Switch default position**
- M3: Switch — thumb moves LEFT (off) to RIGHT (on). Track changes from outline to filled.
- HIG: Toggle Switch — same left=off, right=on. Visual style differs (rounder, iOS green default).
- Resolution: Functional logic identical. Visual implementation per platform conventions.

**Conflict C3: Pull-to-refresh**
- M3: Supports pull-to-refresh on scrollable content. Uses circular indicator.
- HIG: Supports pull-to-refresh natively via `UIRefreshControl`. Uses system spinner.
- Resolution: Both support the pattern. Use platform-native component on each. Do not build custom on iOS.

**Conflict C4: Date Picker visual style**
- M3: Calendar grid (modal) + input field option. Uses M3 color tokens.
- HIG: Spinner/wheel picker OR calendar grid (iOS 14+). System-rendered.
- Resolution: iOS native → use `UIDatePicker` (system). Web/Android → M3 Date Picker.

**Conflict C5: Text Field style**
- M3: Filled Text Field (surface-container-highest background, bottom indicator line) or Outlined Text Field
- HIG: Rounded rect text field (border all sides). No "filled" variant in HIG.
- Resolution: iOS native → HIG rounded rect. Android/web → M3 Filled or Outlined.

**Conflict C6: Slider**
- M3: Continuous or discrete slider. Thumb is a small circle. Value label appears above thumb on drag.
- HIG: Slider with optional tick marks. Thumb is a white circle with shadow. No above-thumb label.
- Resolution: iOS → UISlider (system). Android/web → M3 Slider. Do not mimic HIG thumb style on web.

---

### TYPOGRAPHY

**Conflict T1: Type scale units**
- M3: sp (scalable pixels) — scale with system font size setting
- HIG: pt (points) — scale with Dynamic Type text style
- Resolution: Not a conflict on native platforms (each uses own unit). Web: use rem.

**Conflict T2: Font family**
- M3: Roboto (default) + brand typeface override permitted
- HIG: SF Pro (mandatory for iOS system UI) — third-party fonts permitted in app content
- Resolution: iOS system UI components must use SF Pro. App content body text can use brand font.
  - Vellum rule: Never specify SF Pro as a web font or Android font.

**Conflict T3: Large title style**
- M3: Display Large (57sp) — for hero/marketing contexts
- HIG: Large Title (.largeTitle, 34pt) — for Navigation Bar large title mode
- Resolution: Different use cases. M3 Display is marketing/hero. HIG Large Title is navigation. Not interchangeable.

**Conflict T4: Button label case**
- M3: Sentence case for button labels (not ALL CAPS)
- HIG: Sentence case for button labels (same)
- Resolution: No conflict. Both use sentence case.

---

### COLOR & THEMING

**Conflict CO1: Dark mode implementation**
- M3: Separate dark theme token set. Surface Tone 6 (`#141218`) as dark background.
- HIG: Semantic colors adapt automatically (`UIColor.systemBackground` changes in dark mode). Asset Catalog light/dark variants.
- Resolution: iOS native → use semantic HIG colors. Web/Android → use M3 dark theme tokens.
  - Forbidden on iOS: hardcoding M3 dark surface `#141218` instead of `UIColor.systemBackground`.

**Conflict CO2: Accent/tint color**
- M3: Primary color (Tone 40 light / Tone 80 dark) drives all interactive element tinting
- HIG: `tintColor` / `UIColor.tintColor` applies globally to interactive elements
- Resolution: Functionally equivalent. M3 primary → maps to iOS tintColor. Set tintColor once at UIWindow level.

**Conflict CO3: Error color**
- M3: Error role = Tone 40 red (`#B3261E` baseline)
- HIG: `UIColor.systemRed` — adapts to light/dark mode
- Resolution: iOS native → `UIColor.systemRed`. Web/Android → `md.sys.color.error`.

---

### MOTION & ANIMATION

**Conflict M1: Default easing**
- M3: Emphasized easing `cubic-bezier(0.05, 0.7, 0.1, 1.0)` for large surface transitions
- HIG: Spring animations preferred. `UISpringTimingParameters`. Damping ~0.7–0.8.
- Resolution: iOS native → use spring animations. Web/Android → M3 Emphasized easing. Do not replicate spring physics in CSS for Android/web.

**Conflict M2: Transition duration**
- M3: Large surface enter = 500ms; exit = 400ms
- HIG: Modal present = ~350ms spring; dismiss = ~300ms
- Resolution: Platform-specific. Do not apply M3 durations to iOS native transitions.

---

### ICONS & IMAGERY

**Conflict I1: Icon style**
- M3: Material Symbols (outlined, rounded, or sharp variants). Variable font with weight/fill axes.
- HIG: SF Symbols. Monoline style. Always matches system font weight.
- Resolution: iOS native → SF Symbols only (matching `.font` modifier weight). Web/Android → Material Symbols.
  - Forbidden: Using Material Symbols on iOS native (visual inconsistency with system).
  - Forbidden: Using SF Symbols on web (not available as web font).

**Conflict I2: Icon size**
- M3: Standard icon = 24dp. Navigation icon = 24dp. Small icon = 20dp. Large icon = 40dp+.
- HIG: SF Symbol size follows text style. `UIImage.SymbolConfiguration` with `.font` style.
- Resolution: iOS → symbol configuration. Web/Android → explicit dp sizes.

---

### VELLUM QUICK-LOOKUP TABLE

| Topic | iOS Native | Android / Web | Cross-Platform |
|---|---|---|---|
| Navigation | Tab Bar | Navigation Bar | Both required |
| Back button | Text label | Icon button | Platform split |
| FAB | FORBIDDEN | Permitted | iOS = toolbar button |
| Drawer | Split View | Navigation Drawer | Platform split |
| Date picker | UIDatePicker | M3 Date Picker | Platform split |
| Text field style | Rounded rect | Filled / Outlined | Platform split |
| Icons | SF Symbols | Material Symbols | NEVER mix |
| Dark mode | Semantic colors | M3 dark tokens | NEVER hardcode |
| Motion | Spring | M3 Emphasized easing | NEVER share |
| Error color | UIColor.systemRed | md.sys.color.error | Different values |
| Font | SF Pro (UI) | Roboto / brand | NEVER use SF Pro on web |
