# specs_handoff_output_format.md
## Vellum Design Governance — Final Output Structure, FastAPI → Streamlit Handoff
## System: Output Formatter → FastAPI → Streamlit frontend

---

### OUTPUT TRIGGER CONDITIONS

Output Formatter activates ONLY on:
1. `status: APPROVED` — clean pass, no warnings
2. `status: APPROVED_WITH_WARNING` — passed all P0 gates, P1 warnings attached
3. `status: FAILED_MAX_REVISIONS` — special failure output format (see below)

Output Formatter NEVER activates on `status: REJECTED` with remaining revisions.

---

### APPROVED OUTPUT SCHEMA (FastAPI response body)

```json
{
  "vellum_response": {
    "status": "APPROVED",
    "revision_count": 2,
    "design_strategy": {
      "platform": "android",
      "window_class": "compact",
      "navigation": {
        "pattern": "navigation_bar",
        "destinations": 4,
        "decision_path": "Platform=Android, Compact, destinations≤5 → Navigation Bar"
      },
      "components": [
        {
          "component": "filled_button",
          "role": "primary_action",
          "label": "Save changes",
          "tokens": {
            "container_color": "md.sys.color.primary",
            "label_color": "md.sys.color.on-primary",
            "shape": "md.sys.shape.corner.full",
            "elevation": "md.sys.elevation.level0",
            "height": "40dp",
            "horizontal_padding": "24dp"
          },
          "states": ["enabled", "hovered", "focused", "pressed", "disabled", "loading"],
          "accessibility": {
            "role": "button",
            "label": "Save changes"
          }
        }
      ],
      "typography": {
        "display": "md.sys.typescale.headline-large",
        "body": "md.sys.typescale.body-large",
        "label": "md.sys.typescale.label-large"
      },
      "color_theme": {
        "mode": "light | dark | system",
        "primary": "md.sys.color.primary",
        "surface": "md.sys.color.surface",
        "background": "md.sys.color.background"
      },
      "spacing": {
        "screen_margin": "md.sys.spacing.4",
        "section_gap": "md.sys.spacing.6",
        "component_gap": "md.sys.spacing.2"
      },
      "motion": [
        {
          "component": "navigation_bar_item",
          "event": "select",
          "duration_token": "md.sys.motion.duration.short4",
          "easing_token": "md.sys.motion.easing.standard",
          "properties": ["indicator_width", "icon_fill", "label_color"]
        }
      ],
      "accessibility_summary": {
        "focus_trap_required": ["dialog_1"],
        "skip_link_required": false,
        "aria_live_regions": ["snackbar_container"],
        "dynamic_type": false,
        "reduced_motion_gated": true
      }
    },
    "audit_trail": {
      "gates_passed": ["gate_1", "gate_2", "gate_3", "gate_4", "gate_5", "gate_6", "gate_7", "gate_8"],
      "gates_failed": [],
      "warnings": [],
      "spec_versions_used": {
        "specs_audit_checklist": "1.0.0",
        "specs_violation_severity_matrix": "1.0.0",
        "specs_design_token_schema": "1.0.0"
      },
      "moondream_used": false,
      "timestamp": "2025-01-01T00:00:00Z"
    }
  }
}
```

---

### APPROVED_WITH_WARNING OUTPUT SCHEMA

Same as APPROVED, with additions:

```json
{
  "vellum_response": {
    "status": "APPROVED_WITH_WARNING",
    "warnings": [
      {
        "code": "rams_excess_element",
        "severity": "P1",
        "component": "card_divider",
        "detail": "Decorative divider line between cards serves no layout function (Rams P10).",
        "recommendation": "Remove divider. Use whitespace gap (md.sys.spacing.4) for visual separation."
      },
      {
        "code": "aaa_not_met",
        "severity": "P1",
        "component": "supporting_text",
        "detail": "md.sys.color.on-surface-variant on md.sys.color.surface-container = CR 5.2:1. WCAG AAA requires 7.0:1.",
        "recommendation": "Use md.sys.color.on-surface (CR 9.1:1) for AAA compliance. AA is met."
      }
    ],
    "warning_count": 2,
    "user_acknowledgment_required": false
  }
}
```

---

### FAILED_MAX_REVISIONS OUTPUT SCHEMA

```json
{
  "vellum_response": {
    "status": "FAILED_MAX_REVISIONS",
    "revision_count": 3,
    "unresolved_violations": [
      {
        "code": "contrast_fail",
        "severity": "P0",
        "gate": 1,
        "detail": "Brand color #FF6B6B on #FFFFFF = CR 3.1:1. Required: 4.5:1 for normal text.",
        "fix": "Darken to #D44545. CR = 4.6:1. Passes AA.",
        "architect_attempts": [
          "Revision 1: Used #FF6B6B — CR 3.1:1 — REJECTED",
          "Revision 2: Used #FF8888 — CR 2.7:1 — REJECTED (worse)",
          "Revision 3: Used #FF7070 — CR 2.9:1 — REJECTED"
        ]
      }
    ],
    "manual_resolution_required": true,
    "message": "3 revision cycles exhausted. The following P0 violations require manual resolution before this design can be approved. The rejected design has not been output.",
    "partial_design_available": false
  }
}
```

---

### STREAMLIT DISPLAY FORMAT

The FastAPI response renders in Streamlit as:

#### APPROVED display
```
✅ Design Approved (Revision 2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Expandable] Design Strategy
  Platform: Android — Compact
  Navigation: Navigation Bar (4 destinations)
  Components: [list]
  Tokens: [list]

[Expandable] Audit Trail
  ✅ Gate 1: Color & Contrast — PASS
  ✅ Gate 2: Typography — PASS
  ... (all 8 gates)
  Spec versions: [list]
```

#### APPROVED_WITH_WARNING display
```
⚠️ Design Approved with Warnings (Revision 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Expandable] Warnings (2)
  ⚠ P1 — rams_excess_element: Decorative divider...
  ⚠ P1 — aaa_not_met: Supporting text CR 5.2:1...

[Expandable] Design Strategy ...
[Expandable] Audit Trail ...
```

#### FAILED_MAX_REVISIONS display
```
❌ Design Failed — Manual Intervention Required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 revision cycles exhausted. Unresolved P0 violations:

🚫 contrast_fail (Gate 1)
   Brand color #FF6B6B on #FFFFFF = CR 3.1:1 (required 4.5:1)
   Fix: Use #D44545 → CR 4.6:1

[Expandable] Revision History
  Revision 1: #FF6B6B — CR 3.1:1 — REJECTED
  Revision 2: #FF8888 — CR 2.7:1 — REJECTED
  Revision 3: #FF7070 — CR 2.9:1 — REJECTED
```

---

### MOONDREAM HANDOFF FORMAT

When user uploads an image:

```
Image → Moondream2 → visual_description JSON → Critic (injected into Gate context)
```

Moondream output injected into Critic system prompt as:
```
[VISUAL AUDIT INPUT]
The user submitted an image for compliance review.
Moondream description: {visual_description}
Apply trigger keyword matching to all 8 gates.
Flag COLOR_TOKEN_UNVERIFIED for any color described in natural language without a matching token.
```

---

### STATE GRAPH HANDOFF (LangGraph)

```python
# LangGraph state schema
class VellumState(TypedDict):
    user_request: str
    client_brief: dict
    rag_context: list[str]
    architect_output: dict        # Architect's design strategy JSON
    critic_output: dict           # Critic's audit result JSON
    revision_count: int           # 0, 1, 2, 3
    final_output: dict            # Output Formatter result
    moondream_description: dict   # Optional — populated if image uploaded
    audit_trail: list[dict]       # Accumulates all revision audit results
    status: str                   # PENDING | REJECTED | APPROVED | APPROVED_WITH_WARNING | FAILED_MAX_REVISIONS

# Node routing logic
def route_after_critic(state: VellumState) -> str:
    if state["critic_output"]["status"] == "APPROVED":
        return "output_formatter"
    if state["critic_output"]["status"] == "APPROVED_WITH_WARNING":
        return "output_formatter"
    if state["critic_output"]["status"] == "REJECTED" and state["revision_count"] < 3:
        return "architect"  # loop back
    if state["revision_count"] >= 3:
        return "failure_handler"
```

---

### AUDIT TRAIL PERSISTENCE

All audit results written to `audit_trail.jsonl` (append-only):

```jsonl
{"session_id": "uuid", "timestamp": "ISO8601", "revision": 1, "status": "REJECTED", "violations": [...], "spec_versions": {...}}
{"session_id": "uuid", "timestamp": "ISO8601", "revision": 2, "status": "APPROVED_WITH_WARNING", "warnings": [...], "spec_versions": {...}}
```

Audit trail is queryable for:
- Most common P0 violations (identifies spec gaps or Architect drift)
- Average revisions to approval (system health metric)
- Client-specific violation patterns (inform Client Brief updates)
