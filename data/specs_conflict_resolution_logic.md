# specs_conflict_resolution_logic.md
## Vellum Design Governance — Spec Conflict Resolution Decision Trees
## Agent: Senior Critic (Temp 0) + Architect (Temp 0.7) — Reference when two specs contradict

---

### CORE RULE

When two specs produce contradictory rules for the same design decision, apply the resolution tree below. Never average between specs. Never leave the conflict unresolved. Always output a single winner and log the losing spec as a caveat.

---

### CONFLICT CLASS A — M3 vs. HIG (Same visual rule, different values)

#### Navigation Pattern
```
Decision: Which navigation paradigm to use?
  Platform = iOS native app?
    YES → HIG wins:
      - Use Tab Bar (bottom, 5 items max)
      - No FAB permitted
      - Back gesture = swipe-right, not back button
    NO (web / PWA / Android) → M3 wins:
      - Use Navigation Bar (bottom) for ≤ 5 destinations
      - Use Navigation Rail for Medium breakpoint
      - Use Navigation Drawer for Expanded breakpoint
      - FAB permitted
```

#### Typography Scale
```
Decision: Which type scale to apply?
  Platform = iOS native?
    YES → HIG Dynamic Type mandatory:
      - Use UIFont.preferredFont(forTextStyle:) — never hardcode pt values
      - Scale multipliers per accessibility size class (see specs_dynamic_type_scaling.md)
    NO → M3 sp scale applies:
      - Fixed sp values from specs_typography_scaling.md
      - Scale only via system font size setting on Android
```

#### Color System
```
Decision: Which color token system?
  Platform = iOS native?
    YES → HIG semantic colors mandatory for system UI chrome:
      UIColor.label, UIColor.systemBackground, UIColor.secondarySystemBackground
      Custom colors: use Asset Catalog with light/dark variants
    NO → M3 tonal palette system:
      CSS custom properties from specs_design_token_schema.md
      HCT-derived tonal roles
```

#### Spacing Unit
```
Decision: 4pt or 8pt as base unit?
  Both valid — not a true conflict:
    - 4pt = micro-spacing (within component, icon gaps)
    - 8pt = layout-level spacing (margins, gutters, component heights)
  Rule: 4pt is a sub-unit of 8pt. Both can coexist. Apply 4pt only for values < 8pt.
```

---

### CONFLICT CLASS B — WCAG vs. Client Brief (Compliance vs. Brand)

#### Brand Color Fails Contrast
```
Client Brief specifies brand color X as primary text color.
Compute CR of X against its intended background.
  CR ≥ 4.5:1? → APPROVED. Use X as specified.
  CR < 4.5:1 and text is normal size? → REJECTED.
    Resolution: Find nearest HCT tone of X that achieves CR ≥ 4.5:1.
    Output: "Brand color adjusted from Tone [N] to Tone [M] for WCAG AA compliance."
  CR ≥ 3.0:1 and text qualifies as large (≥ 18pt regular / ≥ 14pt bold)? → APPROVED with P1 WARN for AAA gap.
```

#### Brand Font Too Light
```
Client Brief specifies font weight 300 (Light) as primary body weight.
  Body text < 18sp?
    YES → REJECTED. M3 prohibits weight < 400 on UI body text < 18sp.
    Resolution: Use weight 400 (Regular) for body. Permit weight 300 for display text ≥ 36sp only.
  Body text ≥ 18sp?
    YES → APPROVED if contrast passes. P1 WARN for accessibility risk at small sizes.
```

#### Brand Requires Pure White Background
```
Client Brief specifies #FFFFFF as background.
  M3 spec: forbidden on large surfaces.
  Resolution:
    Web/Android: Substitute #FAFAFA (near-white, imperceptibly different).
    If client insists on strict #FFFFFF: APPROVED_WITH_WARNING. Log forbidden_hex_white_surface as P1.
    Note: Pure white on large surfaces is M3 P0 only — not WCAG. Client override is permitted for P3 violations if client explicitly acknowledges.
```

---

### CONFLICT CLASS C — Rams Principles vs. M3/HIG Rules

#### Rams P5 (Unobtrusive) vs. M3 Expressive Color
```
M3 Dynamic Color assigns a vibrant primary-40 to action buttons.
Rams P5 says: neutral and restrained.
  Resolution: M3 wins on color math. Rams P5 generates P1 WARN only.
  Architect note: "Consider reducing primary chroma if brand brief permits — Rams P5 alignment."
```

#### Rams P10 (As Little As Possible) vs. Required M3 Components
```
Architect removes Bottom Sheet handle bar to reduce visual noise.
Rams P10: remove non-essentials.
M3: handle bar is required for Bottom Sheet discoverability.
  Resolution: M3 wins. Handle bar is functional. Cannot be removed on Rams grounds.
```

#### Rams P7 (Long-lasting) vs. Client Brief Trend Request
```
Client Brief requests glassmorphism card style.
Rams P7: avoid fashionable design.
  Resolution: Rams P7 = P1 WARN only. Client Brief has override authority (P0).
  Output: APPROVED_WITH_WARNING — rams_fashionable_design_risk.
```

---

### CONFLICT CLASS D — M3 vs. M3 (Internal spec version conflicts)

#### Surface Elevation: Overlay vs. Tonal Surface (M3 2021 vs. M3 2023)
```
M3 2021: Use primary color overlay at 5–14% on dark surfaces.
M3 2023+: Use tonal surface-container tokens instead.
  Resolution: Always use tonal surface-container tokens (2023 spec).
  Overlay method is deprecated — apply only if tonal tokens unavailable in target system.
```

---

### CONFLICT CLASS E — Multi-Platform Target (iOS + Android + Web simultaneously)

```
If design must work across iOS + Android + Web:
  Step 1: Apply WCAG rules universally (P4 — no platform exception).
  Step 2: Apply M3 as baseline visual system.
  Step 3: Identify iOS-specific overrides (navigation, Dynamic Type, safe areas).
  Step 4: Document platform-specific variants explicitly:
    component_variant: [ios, android, web]
  Step 5: Do NOT design one layout that tries to satisfy HIG navigation + M3 FAB simultaneously.
    Force a choice: FAB is web/Android only. Tab Bar is iOS only.
```

---

### CONFLICT LOGGING FORMAT

```
CONFLICT_DETECTED: {
  spec_a: "M3 — Navigation Bar",
  spec_b: "HIG — Tab Bar",
  platform: "iOS",
  winner: "HIG",
  reason: "Platform = iOS native. HIG takes authority on platform-specific navigation.",
  loser_caveat: "M3 Navigation Bar spec still applies to web/Android build of same product."
}
```
