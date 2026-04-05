# specs_priority_hierarchy.md
## Vellum Design Governance — Authority Ranking & Override Rules
## Agent: Senior Critic (Temp 0) — Read before any audit decision

---

### MASTER AUTHORITY STACK (descending — higher number wins all conflicts)

- **P4 — WCAG 2.1 AA/AAA**: Highest authority. Legal/ethical compliance. Never overridden by any design system or aesthetic preference. Any WCAG violation = automatic REJECTED status regardless of other spec compliance.
- **P3 — Material Design 3 (M3)**: Primary visual system authority for cross-platform rules (color tokens, elevation math, grid). Overrides HIG on non-iOS-specific decisions.
- **P2 — Apple Human Interface Guidelines (HIG)**: Authority on iOS/macOS-specific interaction patterns, native component behavior, and Dynamic Type. Defers to M3 on shared visual rules.
- **P1 — Dieter Rams (10 Principles)**: Philosophical authority. Applied as a secondary audit layer when a design passes P4/P3/P2 but violates fundamental design reasoning. Cannot override WCAG, M3, or HIG mathematical rules — only flags "design quality" concerns.
- **P0 — Client Brief**: Highest practical authority on brand-specific overrides (custom color palette, custom typeface). BUT: Client Brief cannot override WCAG (P4). A client requesting pure #000000 background = REJECTED; client requesting a custom blue = permitted if contrast ratios pass.

---

### OVERRIDE DECISION TREE

```
Is the conflict a WCAG 2.1 violation?
  YES → REJECT. Authority = P4. No override permitted.
  NO ↓

Is the conflict between M3 and HIG?
  YES → Is the target platform iOS/macOS only?
    YES → HIG wins (P2)
    NO  → M3 wins (P3)
  NO ↓

Is the conflict between any spec and the Client Brief?
  YES → Does the Client Brief override cause a WCAG violation?
    YES → REJECT. Client Brief loses to WCAG (P4).
    NO  → Client Brief wins (P0 practical authority).
  NO ↓

Is the conflict a Rams principle vs. a mathematical spec rule?
  YES → Mathematical spec rule wins. Flag Rams violation as P1 warning only.
  NO ↓

Default: Apply M3 (P3).
```

---

### SPECIFIC CONFLICT RESOLUTIONS (pre-resolved for Critic speed)

- **M3 uses 8pt grid / HIG uses 4pt micro-spacing**: Both valid — 4pt is sub-unit of 8pt. Not a conflict.
- **M3 allows pure black scrim (#000000) / Rams P10 says "as little as possible"**: M3 wins. Scrim is functional. Rams flag = informational only.
- **WCAG requires 4.5:1 / Client Brief uses brand color that fails**: WCAG wins. Issue REJECTED. Suggest nearest brand-compliant tone that passes.
- **HIG says no FAB on iOS / M3 specifies FAB**: If target = iOS native app → HIG wins, no FAB. If target = web/PWA/Android → M3 wins, FAB permitted.
- **HIG Dynamic Type vs. M3 fixed sp scale**: iOS native → HIG Dynamic Type mandatory. Web/Android → M3 sp scale applies.
- **Client Brief specifies weight 300 (Light) at 14sp body**: WCAG does not prohibit weight 300 if contrast passes. M3 prohibits weight < 400 for body UI text. M3 wins → REJECTED if weight 300 on body < 18sp.
- **Client Brief requests gradient background on large surface**: Rams P5 (unobtrusive) = P1 flag only. Not a REJECT unless WCAG contrast fails at the lightest gradient stop.

---

### SEVERITY CLASSIFICATION BY AUTHORITY LEVEL

| Authority | Violation Type | Critic Action |
|---|---|---|
| P4 WCAG | Contrast, touch target, focus, ARIA | REJECTED — mandatory |
| P3 M3 | Grid deviation, forbidden hex, wrong elevation | REJECTED — mandatory |
| P2 HIG | Platform-wrong pattern, wrong nav paradigm | REJECTED if platform is iOS/macOS |
| P1 Rams | Non-essential element, fashionable choice | WARNING — does not block APPROVED |
| P0 Client | Brand override causing spec deviation | APPROVED with CAVEAT if WCAG passes |

---

### MOONDREAM2 VISUAL AUDIT MAPPING

- When Moondream describes: "pure black background" → Critic checks: is surface area > 100×100dp? If YES → P3 violation (forbidden hex).
- When Moondream describes: "white text on light background" → Critic checks contrast. If CR < 4.5:1 → P4 WCAG violation.
- When Moondream describes: "gradient fill on large card surface" → Critic flags P1 Rams warning (non-essential, P10 violated).
- When Moondream describes: "small text, approximately 10px" → Critic checks: < 11sp minimum → P3 M3 violation.
- When Moondream describes: "no visible focus indicator" → P4 WCAG 2.4.7 violation → REJECTED.
