# specs_color_blind_safe_palettes.md
## Vellum Design Governance — Color Vision Deficiency Rules & Safe Palette Verification
## Agent: Senior Critic (Temp 0) — Gate 1 enforcement. Deuteranopia/protanopia failures = P0 REJECTED.

---

### COLOR VISION DEFICIENCY TYPES — AUDIT SCOPE

- **Deuteranopia**: Green-blind (~1% male population). Cannot distinguish red from green.
- **Protanopia**: Red-blind (~1% male population). Red appears very dark/black.
- **Tritanopia**: Blue-blind (<0.01% population). Blue/yellow confusion. Lower priority — audit as P1 only.
- **Achromatopsia**: Full color blindness (~0.003%). Audit for luminance contrast only (WCAG already covers this).
- **Combined prevalence**: ~8% of males, ~0.5% of females affected by red-green deficiency — treat as mandatory audit.

---

### CORE RULE (WCAG 1.4.1 — P0)

Information must NEVER be conveyed by color alone. A second visual differentiator is always required:
- Shape (different icons, not just color-coded icons)
- Pattern (hatching, texture)
- Text label
- Position
- Size

```
FORBIDDEN: Red dot = error, Green dot = success — with no other differentiator
FORBIDDEN: Red line vs. Green line on chart — with no label or pattern difference
FORBIDDEN: "Fields in red are required" — color-only instruction
CORRECT: Red dot + "Error" label + ✕ icon
CORRECT: Red line (dashed) vs. Green line (solid) on chart + legend labels
CORRECT: Required fields marked with * (asterisk) + "* Required" legend
```

---

### SIMULATED COLOR PERCEPTION — AUDIT THRESHOLDS

#### Deuteranopia Simulation (Critic verification method)
For any two colors used to convey distinct information:
1. Convert both colors to their deuteranopia-simulated equivalents
2. Compute luminance contrast between simulated colors
3. If CR < 3.0:1 between simulated colors AND no secondary differentiator → P0: color_blind_fail_deuteranopia

**Deuteranopia simulation approximation (matrix transform on linear RGB):**
```
R' = 0.625 × R + 0.375 × G + 0.000 × B
G' = 0.700 × R + 0.300 × G + 0.000 × B  (approximate)
B' = 0.000 × R + 0.300 × G + 0.700 × B
```
(Full Vienot 1999 matrix for production use — simplified here for Critic heuristic)

#### Common Failing Pairs (pre-computed — Critic uses lookup table)
| Color A | Color B | Deuteranopia CR | Status |
|---|---|---|---|
| `#FF0000` (Red) | `#00FF00` (Green) | ~1.0:1 | P0 FAIL |
| `#CC0000` (Dark Red) | `#006600` (Dark Green) | ~1.1:1 | P0 FAIL |
| `#FF6B6B` (Light Red) | `#51CF66` (Light Green) | ~1.3:1 | P0 FAIL |
| `#E03131` (M3 Error) | `#2F9E44` (Success Green) | ~1.2:1 | P0 FAIL — requires shape/label |
| `#B3261E` (M3 Error-40) | `#1D9E75` (M3 Teal-40) | ~2.1:1 | P0 FAIL — requires shape/label |
| `#1971C2` (Blue) | `#E03131` (Red) | ~2.8:1 deuteranopia | P1 WARN — borderline |
| `#1971C2` (Blue) | `#F08C00` (Orange) | ~4.2:1 deuteranopia | PASS |

---

### SAFE COLOR COMBINATIONS (Approved for information-carrying use without secondary differentiator)

- **Blue + Orange**: High contrast in all CVD simulations. Safe for charts, status indicators.
- **Blue + Yellow**: Safe for deuteranopia/protanopia. Tritanopia risk — add label for AAA.
- **Blue + Red**: Borderline — luminance difference sufficient but add shape differentiator.
- **Purple + Yellow/Gold**: Generally safe across CVD types.
- **Dark Navy + Light Teal**: Safe — sufficient luminance even after simulation.
- **Black + White**: Always safe (luminance-only, unaffected by CVD).
- **Teal + Coral (M3 tertiary pairing)**: P1 WARN — verify with simulation. Add labels.

---

### M3 STATUS COLOR SAFE USAGE RULES

M3 uses `Error` (red family) and `Primary`/`Secondary` (often blue/purple) for status — these are only safe when paired with:

```
Error state:
  REQUIRED: Error icon (✕ or ⚠) + aria-label="Error" + error message text
  FORBIDDEN: Red color change alone without icon or text

Success state:
  REQUIRED: Checkmark icon (✓) + "Success" label or text
  FORBIDDEN: Green color change alone

Warning state:
  REQUIRED: Warning icon (⚠) + label text
  FORBIDDEN: Amber/orange color change alone

Disabled state:
  REQUIRED: Reduced opacity (38%) — opacity itself is a non-color differentiator
  ACCEPTABLE: Reduced opacity alone (no color change needed)
```

---

### CHART & DATA VISUALIZATION RULES

- Never use red/green as the only differentiating colors in any chart
- Line charts: use different line styles (solid, dashed, dotted) + color + labels at line ends
- Bar charts: use patterns (hatching) OR labels on bars + color
- Pie/donut charts: always use text labels OR legend with distinct shapes + color
- Heatmaps: use blue-to-orange or blue-to-red gradient (not green-to-red)
  - Preferred heatmap gradient: `#2166AC` (blue) → `#F7F7F7` (neutral) → `#D6604D` (red-orange)

---

### FOCUS & INTERACTIVE STATE COLOR RULES

- Focus indicator must not rely on color alone: use outline/ring shape as primary indicator
- Hover state: acceptable as color-only IF the element also has a visible change in border, underline, or shape
- Selected state (chip, tab, radio): color change MUST be paired with checkmark, underline, or fill change
- Error field border: red border MUST be paired with error icon + error message text

---

### AUDIT CHECKLIST (Critic Gate 1 — Color Vision)

```
CHECK: No two colors convey distinct information without a secondary differentiator
  FAIL → P0: wcag_1.4.1_color_only

CHECK: Error states include icon + text label in addition to color
  FAIL → P0: error_state_color_only

CHECK: Success states include icon + text label in addition to color
  FAIL → P0: success_state_color_only

CHECK: Charts use pattern/style + label in addition to color
  FAIL → P0: chart_color_only_differentiation

CHECK: Red/green pairing not used as sole differentiator
  FAIL → P0: color_blind_fail_deuteranopia

CHECK: Blue/orange or other CVD-safe pairs used where possible
  PASS: color_blind_safe_palette_compliant
```

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "red and green" / "red circle, green circle" → CHECK secondary differentiator present
- "color-coded chart" / "colored lines" / "legend" → CHECK non-color differentiators
- "error message" / "success message" → CHECK icon + text label present alongside color
- "status indicator" / "badge" / "dot" → CHECK shape or label supplement
- "form validation" → CHECK red border + error icon + error text (not color alone)
