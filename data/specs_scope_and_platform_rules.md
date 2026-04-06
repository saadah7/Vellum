# specs_scope_and_platform_rules.md
## Vellum Design Governance — Platform Scope Boundaries & Rule Applicability Matrix
## Agent: Architect (Temp 0.7) — Declare platform at session start. All rules filtered by platform.
## Agent: Senior Critic (Temp 0) — Apply only rules scoped to declared platform.

---

### PLATFORM DECLARATION (required at session start)

Every Vellum session must declare one of the following platform targets before any design work begins. The Architect reads this from the client brief or prompts the user if absent.

```
PLATFORM_TARGETS:
  android         → Android native app (Kotlin / Compose)
  ios             → iOS/iPadOS native app (Swift / SwiftUI / UIKit)
  web             → Web app / PWA (browser-based)
  cross-platform  → Must satisfy Android + iOS + web simultaneously
  macos           → macOS native app (SwiftUI / AppKit)
  watch           → watchOS app (SwiftUI)

WINDOW_CLASS (declare separately):
  compact         → 0–599dp / iPhone portrait / small screen
  medium          → 600–839dp / tablet portrait / large phone landscape
  expanded        → 840dp+ / tablet landscape / desktop

DEFAULT if undeclared: web, compact
```

---

### RULE APPLICABILITY MATRIX

Each spec file applies differently per platform. Critic only runs checks relevant to the declared platform.

| Spec File | Android | iOS | Web | Cross-Platform | macOS |
|---|---|---|---|---|---|
| specs_typography_scaling.md | ✓ M3 sp | ✓ HIG pt + Dynamic Type | ✓ M3 rem | ✓ Both | ✓ HIG |
| specs_grid_and_spacing.md | ✓ M3 8pt | ✓ HIG 8pt | ✓ M3 8pt | ✓ Both | ✓ HIG |
| specs_color_and_contrast.md | ✓ M3 tokens | ✓ HIG semantic | ✓ M3 tokens | ✓ WCAG always | ✓ HIG |
| specs_elevation_and_shadows.md | ✓ M3 levels | ✗ system shadows | ✓ M3 CSS | ✓ Android/web only | ✗ |
| specs_design_principles_rams.md | ✓ | ✓ | ✓ | ✓ | ✓ |
| specs_priority_hierarchy.md | ✓ | ✓ | ✓ | ✓ | ✓ |
| specs_violation_severity_matrix.md | ✓ | ✓ | ✓ | ✓ | ✓ |
| specs_audit_checklist.md | ✓ all gates | ✓ all gates | ✓ all gates | ✓ all gates | ✓ gates 1–3,5–8 |
| specs_conflict_resolution_logic.md | ✓ | ✓ | ✓ | ✓ mandatory | ✓ |
| specs_touch_and_keyboard_targets.md | ✓ 48dp | ✓ 44pt | ✓ 48px | ✓ Both | ✗ pointer only |
| specs_focus_management.md | ✓ | ✓ | ✓ | ✓ | ✓ |
| specs_aria_and_semantics.md | ✗ native a11y APIs | ✗ UIAccessibility | ✓ mandatory | ✓ web portion | ✗ AX APIs |
| specs_color_blind_safe_palettes.md | ✓ | ✓ | ✓ | ✓ | ✓ |
| specs_reduced_motion_rules.md | ✓ Animator scale | ✓ reduceMotion | ✓ CSS media query | ✓ All | ✓ |
| specs_dynamic_type_scaling.md | ✓ sp units | ✓ Dynamic Type mandatory | ✓ rem + 200% zoom | ✓ Both | ✓ |
| specs_component_selection_rules.md | ✓ M3 trees | ✓ HIG overrides apply | ✓ M3 trees | ✓ platform-split | ✓ HIG |
| specs_component_state_machines.md | ✓ | ✓ | ✓ | ✓ | ✓ |
| specs_design_token_schema.md | ✓ M3 tokens | ✓ HIG semantic colors | ✓ CSS custom props | ✓ Both | ✓ HIG |
| specs_responsive_behaviour.md | ✓ | ✓ size classes | ✓ CSS breakpoints | ✓ | ✓ |
| specs_cross_system_conflicts.md | ✗ Android only | ✗ iOS only | ✗ web only | ✓ mandatory | ✓ |
| specs_content_and_copy_rules.md | ✓ | ✓ | ✓ | ✓ | ✓ |
| specs_motion_and_animation.md | ✓ M3 easing | ✓ Spring timing | ✓ CSS M3 easing | ✓ platform-split | ✓ Spring |
| specs_iconography.md | ✓ Material Symbols | ✓ SF Symbols | ✓ Material Symbols | ✓ platform-split | ✓ SF Symbols |

Legend: ✓ = applies | ✗ = does not apply (platform uses different system) | "Both" = must satisfy both systems

---

### PLATFORM-SPECIFIC FORBIDDEN RULES (Critic enforcement)

#### iOS Native — FORBIDDEN patterns
```
FAB component → P0: fab_forbidden_ios_native
Material Symbols icons → P0: wrong_icon_system_ios
M3 dark surface #141218 hardcoded → P0: ios_hardcoded_dark_surface
Navigation Drawer (floating) → P0: nav_drawer_forbidden_ios (use Split View)
CSS custom properties for color → P0: css_tokens_on_ios_native (use UIColor / SwiftUI Color)
cubic-bezier easing → P1: ios_cubic_bezier_instead_of_spring
UILabel with hardcoded font size → P0: dynamic_type_not_implemented
```

#### Android Native — FORBIDDEN patterns
```
SF Symbols → P0: wrong_icon_system_android
UIColor / HIG semantic colors → P0: hig_color_on_android
Spring timing parameters → P1: spring_timing_on_android (use M3 easing)
Tab Bar (HIG) — use Navigation Bar (M3) → P1: hig_nav_pattern_on_android
```

#### Web — FORBIDDEN patterns
```
SF Symbols (not available as web resource) → P0: wrong_icon_system_web
user-scalable=no in viewport meta → P0: wcag_1.4.4_zoom_disabled
px units for body text sizes → P1: text_size_in_px_not_scalable
hardcoded HIG color names (UIColor.label) → P0: hig_color_on_web
```

#### macOS Native — FORBIDDEN patterns
```
Mobile touch targets (48dp) applied to pointer UI → P1: mobile_touch_target_on_desktop
Bottom navigation bar → P1: mobile_nav_pattern_on_macos
FAB → P1: fab_on_macos (use toolbar button)
ARIA attributes → P0: aria_on_macos_native (use NSAccessibility / AX attributes)
```

---

### CROSS-PLATFORM DECLARATION RULES

When `platform: cross-platform`, ALL of the following are mandatory:

```
1. Declare which spec wins per conflict → use specs_cross_system_conflicts.md mandatory
2. Document platform variants explicitly:
   Each component must specify: [ios_variant, android_variant, web_variant]
3. No shared component spec that violates either platform's rules
4. WCAG applies universally — no platform exemption
5. Platform-specific forbidden rules apply to their respective variants
6. Icon system must be split: SF Symbols for iOS/macOS, Material Symbols for Android/web
7. Motion must be split: Spring for iOS/macOS, M3 easing for Android/web
8. Color tokens must be split: HIG semantic for iOS/macOS, M3 tokens for Android/web
```

---

### SCOPE BOUNDARIES — WHAT VELLUM DOES NOT GOVERN

Vellum governs design decisions. The following are out of scope:

```
OUT OF SCOPE:
- Code implementation details (Vellum outputs design specs, not code)
- Backend API design
- Database schema
- Business logic
- Content strategy beyond UI copy rules
- Brand identity creation (Vellum applies brand — does not create it)
- User research or usability testing
- Marketing materials (print, social, video)
- 3D / AR / VR design (no specs loaded)
- Game UI design (no specs loaded)
- Hardware/industrial design

IN SCOPE:
- All digital UI surfaces (mobile, tablet, desktop, web)
- Design token selection and verification
- Component choice and state specification
- Accessibility compliance (WCAG 2.1)
- Typography, color, spacing, elevation, motion, iconography
- Copy tone, length, and truncation within UI components
- Cross-platform conflict resolution
- Audit and compliance verification
```

---

### FEATURE FLAG SYSTEM (per session)

Vellum supports disabling specific audit gates per session via client brief flags:

```json
{
  "client_brief": {
    "feature_flags": {
      "enforce_wcag_aaa": false,        // Default false — AAA = P1 WARN only
      "enforce_wcag_aaa": true,         // If true — AAA failures = P0 REJECTED
      "enforce_rams_audit": true,       // Default true — Gate 8 active
      "enforce_rams_audit": false,      // If false — Gate 8 skipped entirely
      "strict_token_mode": true,        // Default true — raw hex = P1
      "strict_token_mode": false,       // If false — raw hex allowed (client prototyping mode)
      "moondream_audit": true,          // Default false — requires image upload
      "max_revisions": 3                // Default 3 — adjustable 1–5
    }
  }
}
```

**Flags that cannot be disabled regardless of client brief:**
- WCAG AA contrast enforcement (P0 always)
- Touch target minimums (P0 always)
- Focus trap on modals (P0 always)
- ARIA on icon-only buttons (P0 always)
- Keyboard navigation on interactive components (P0 always)
- prefers-reduced-motion gating (P0 always)
