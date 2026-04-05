# specs_violation_severity_matrix.md
## Vellum Design Governance — Violation Triage & Critic Response Protocol
## Agent: Senior Critic (Temp 0) — Binary classification table

---

### SEVERITY LEVELS

- **P0 — BLOCK**: Critic issues `REJECTED`. Loop continues. Architect must refactor. Counts toward 3-revision limit.
- **P1 — WARN**: Critic issues `APPROVED_WITH_WARNING`. Output proceeds but warning is appended to response.
- **P2 — LOG**: Critic issues `APPROVED`. Violation logged to audit trail only. Does not surface to user unless requested.

---

### VIOLATION MATRIX — COLOR & CONTRAST

| Violation | Severity | Critic Response |
|---|---|---|
| Normal text CR < 4.5:1 (WCAG AA) | **P0** | REJECTED: contrast_fail. Provide failing CR value and required minimum. |
| Large text CR < 3.0:1 (WCAG AA) | **P0** | REJECTED: large_text_contrast_fail. |
| UI component CR < 3.0:1 (WCAG AA) | **P0** | REJECTED: ui_component_contrast_fail. |
| Normal text CR < 7.0:1 (WCAG AAA) | **P1** | WARN: aaa_not_met. Recommend upgrade. |
| Pure `#000000` on surface > 100×100dp | **P0** | REJECTED: forbidden_hex_black_surface. Suggest M3 dark surface `#141218`. |
| Pure `#FFFFFF` as large surface background | **P0** | REJECTED: forbidden_hex_white_surface. Suggest M3 `#FEF7FF` (Tone 98). |
| Tonal role mismatch (e.g. Primary at Tone 60 not 40/80) | **P1** | WARN: tonal_role_deviation. |
| State layer opacity wrong (e.g. hover at 15% not 8%) | **P1** | WARN: state_layer_opacity_mismatch. |
| Disabled text above 38% opacity | **P1** | WARN: disabled_opacity_too_high. |
| Color-only information encoding (no shape/label backup) | **P0** | REJECTED: wcag_1.4.1_color_only. |
| Deuteranopia-unsafe palette (red/green only differentiation) | **P0** | REJECTED: color_blind_fail_deuteranopia. |

---

### VIOLATION MATRIX — TYPOGRAPHY

| Violation | Severity | Critic Response |
|---|---|---|
| Font size < 11sp in any UI text | **P0** | REJECTED: below_minimum_font_size. |
| Body text < 14sp | **P1** | WARN: body_text_below_recommended. |
| Line-height < 1.2× font-size | **P0** | REJECTED: line_height_too_tight. WCAG 1.4.12. |
| Line-height > 1.8× for body blocks | **P1** | WARN: line_height_excessive. |
| Letter-spacing on body text > +0.5px | **P1** | WARN: tracking_excessive_body. |
| Negative tracking below 36sp | **P0** | REJECTED: negative_tracking_small_text. |
| Font weight 300 on UI text < 18sp | **P0** | REJECTED: weight_too_light_small. |
| Weight switching within same role across states | **P1** | WARN: weight_state_inconsistency. |
| Missing Dynamic Type support on iOS target | **P0** | REJECTED: dynamic_type_not_implemented. |
| All-caps label without +0.08em tracking | **P1** | WARN: allcaps_tracking_missing. |

---

### VIOLATION MATRIX — SPACING & GRID

| Violation | Severity | Critic Response |
|---|---|---|
| Layout dimension not multiple of 8pt | **P1** | WARN: off_grid_dimension. Provide nearest 8pt value. |
| Interactive component height < 48dp | **P0** | REJECTED: touch_target_too_small. WCAG 2.5.5. |
| Touch target < 44×44pt (iOS) | **P0** | REJECTED: ios_touch_target_fail. |
| Internal component padding < 4pt | **P1** | WARN: micro_spacing_violation. |
| Content extending into safe area insets | **P0** | REJECTED: safe_area_violation. |
| Card internal padding ≠ 16dp | **P2** | LOG: card_padding_deviation. |
| Dialog horizontal margin < 40dp from edge | **P1** | WARN: dialog_margin_too_narrow. |
| FAB margin from screen edge < 16dp | **P1** | WARN: fab_margin_violation. |
| Column count wrong for breakpoint | **P1** | WARN: column_count_breakpoint_mismatch. |
| Gutter value wrong for breakpoint | **P1** | WARN: gutter_breakpoint_mismatch. |

---

### VIOLATION MATRIX — ELEVATION & SHADOWS

| Violation | Severity | Critic Response |
|---|---|---|
| Shadow applied to text, icon, or divider | **P1** | WARN: shadow_on_non_surface. |
| Elevation exceeds Level 5 (12dp) | **P1** | WARN: elevation_exceeds_maximum. |
| No scrim on modal Bottom Sheet | **P0** | REJECTED: scrim_missing_modal. |
| Scrim opacity ≠ 32% | **P1** | WARN: scrim_opacity_incorrect. |
| Z-index: modal < 1000 | **P0** | REJECTED: modal_zindex_too_low. |
| Snackbar z-index < dialog z-index | **P0** | REJECTED: snackbar_zindex_below_modal. |
| Shadow not transitioning on elevation change | **P2** | LOG: shadow_transition_missing. |
| Box-shadow applied to element with `transform` ancestor | **P1** | WARN: stacking_context_shadow_conflict. |

---

### VIOLATION MATRIX — ACCESSIBILITY

| Violation | Severity | Critic Response |
|---|---|---|
| No visible focus indicator | **P0** | REJECTED: wcag_2.4.7_focus_visible. |
| Focus trap missing in modal/dialog | **P0** | REJECTED: wcag_2.1.2_focus_trap_missing. |
| ARIA role missing on interactive element | **P0** | REJECTED: wcag_4.1.2_aria_role_missing. |
| ARIA label missing on icon-only button | **P0** | REJECTED: aria_label_missing_icon_button. |
| Tab order does not follow visual order | **P1** | WARN: wcag_1.3.2_tab_order_illogical. |
| Skip navigation link absent on web | **P1** | WARN: wcag_2.4.1_skip_link_missing. |
| Animation without prefers-reduced-motion | **P0** | REJECTED: wcag_2.3.3_motion_not_gated. |
| Form input without associated label | **P0** | REJECTED: wcag_1.3.1_label_missing. |
| Image without alt text | **P0** | REJECTED: wcag_1.1.1_alt_missing. |
| Decorative image with non-empty alt | **P2** | LOG: decorative_image_alt_should_be_empty. |

---

### VIOLATION MATRIX — RAMS PRINCIPLES (P1 only — never P0)

| Violation | Severity | Critic Response |
|---|---|---|
| Decorative element with no functional purpose (Rams P2/P5) | **P1** | WARN: rams_non_functional_element. |
| Design feature misrepresents product capability (Rams P6) | **P1** | WARN: rams_dishonest_affordance. |
| Trend-dependent styling (e.g. dated gradient pattern) (Rams P7) | **P1** | WARN: rams_fashionable_design_risk. |
| Detail left arbitrary/unjustified (Rams P8) | **P1** | WARN: rams_arbitrary_detail. |
| Non-essential element not removed (Rams P10) | **P1** | WARN: rams_excess_element. |

---

### CRITIC RESPONSE FORMAT (Llama 3.2 3B output template)

```
STATUS: [REJECTED | APPROVED_WITH_WARNING | APPROVED]
REVISION: [1 | 2 | 3]
VIOLATIONS: [
  { code: "contrast_fail", severity: "P0", detail: "Body text #767676 on #EAEAEA = CR 2.1:1. Required: 4.5:1.", fix: "Use #595959 on #EAEAEA = CR 7.0:1." },
  { code: "rams_excess_element", severity: "P1", detail: "Decorative divider line serves no layout function.", fix: "Remove or replace with whitespace." }
]
APPROVED_ELEMENTS: [list elements that passed audit]
```

---

### REVISION LIMIT PROTOCOL

- Revision 1 → Architect refactors. Critic re-audits.
- Revision 2 → Architect refactors. Critic re-audits.
- Revision 3 → If still REJECTED: output `FAILED_MAX_REVISIONS`. Surface all unresolved violations to user. Do not output the design.
- If Revision 3 = APPROVED_WITH_WARNING: output design + full warning list.
