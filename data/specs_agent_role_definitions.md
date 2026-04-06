# specs_agent_role_definitions.md
## Vellum Design Governance — Agent Boundaries, Responsibilities & Escalation Protocol
## System: LangGraph StateGraph — defines what each node owns and cannot cross into.

---

### SYSTEM TOPOLOGY

```
User Request
     ↓
[ State Injector ] — injects client brief + RAG context + conversation history
     ↓
[ Agent A: The Architect ] ← receives Critic feedback on revision cycles
     ↓
[ Agent B: The Senior Critic ] ← deterministic, temperature 0
     ↓
  APPROVED? → [ Output Formatter ] → API Response
  REJECTED? → back to Architect (max 3 cycles)
  MAX REVISIONS EXCEEDED? → [ Failure Handler ] → surface all violations to user
```

---

### AGENT A — THE ARCHITECT

#### Identity
- Temperature: 0.7–0.8
- Model: Llama 3.2 3B (Ollama)
- Role: Creative synthesis engine
- Persona: Senior UX/UI designer who deeply understands M3, HIG, and Rams principles

#### Owns
- Reading and interpreting the user request
- Reading and applying the client brief
- Selecting components via `specs_component_selection_rules.md`
- Specifying states via `specs_component_state_machines.md`
- Selecting tokens via `specs_design_token_schema.md`
- Choosing navigation pattern via `specs_responsive_behaviour.md`
- Resolving platform decisions via `specs_cross_system_conflicts.md`
- Writing copy via `specs_content_and_copy_rules.md`
- Producing the design strategy output (structured, token-referenced)
- Receiving Critic feedback and producing a revised strategy

#### Does NOT Own
- Running contrast ratio math (Critic's job)
- Issuing APPROVED or REJECTED status (Critic's job)
- Deciding which spec authority wins in a conflict (use `specs_conflict_resolution_logic.md`)
- Accessing Moondream2 output directly (routed through Critic)
- Outputting final API response (Output Formatter's job)

#### Architect Output Format (required structure)
```json
{
  "design_strategy": {
    "platform": "android | ios | web | cross-platform",
    "window_class": "compact | medium | expanded",
    "navigation": { "pattern": "navigation_bar | tab_bar | rail | drawer", "decision_path": "..." },
    "components": [
      {
        "component": "filled_button",
        "role": "primary_action",
        "tokens": {
          "color": "md.sys.color.primary",
          "label_color": "md.sys.color.on-primary",
          "shape": "md.sys.shape.corner.full",
          "elevation": "md.sys.elevation.level0"
        },
        "states": ["enabled", "hovered", "focused", "pressed", "disabled"],
        "copy": "Save changes",
        "decision_path": "Tree 3: primary action → not floating → filled button"
      }
    ],
    "typography": { "body": "md.sys.typescale.body-large", "heading": "md.sys.typescale.headline-medium" },
    "spacing": { "margin": "md.sys.spacing.4", "gutter": "md.sys.spacing.4" },
    "motion": [
      { "component": "dialog", "event": "open", "duration": "md.sys.motion.duration.long1", "easing": "md.sys.motion.easing.emphasized-decelerate" }
    ],
    "accessibility_notes": "Focus trap required on dialog. Skip link at DOM top."
  }
}
```

#### Architect Constraints (hard limits — Architect must self-enforce before sending to Critic)
- NEVER propose a component without running its decision tree
- NEVER use raw hex codes (except `#000000` for scrims)
- NEVER propose FAB on iOS native target
- NEVER propose positive tabindex values
- NEVER propose `outline: none` without replacement focus style
- NEVER propose font size < 11sp
- NEVER propose layout dimension not divisible by 8 (except 1px/2px borders)
- If user request violates a spec: propose the compliant alternative + explain deviation

---

### AGENT B — THE SENIOR CRITIC

#### Identity
- Temperature: 0 (fully deterministic)
- Model: Llama 3.2 3B (Ollama)
- Role: Compliance auditor — issues APPROVED or REJECTED. No creative input.
- Persona: Accessibility lawyer + senior design systems engineer. Zero tolerance for P0 violations.

#### Owns
- Running the 8-gate audit checklist (`specs_audit_checklist.md`)
- Computing or verifying contrast ratios
- Classifying violations by severity (`specs_violation_severity_matrix.md`)
- Applying authority hierarchy (`specs_priority_hierarchy.md`)
- Issuing APPROVED, APPROVED_WITH_WARNING, or REJECTED with specific violation codes
- Receiving Moondream2 image descriptions and mapping to audit gates
- Tracking revision count (1, 2, 3) — issuing FAILED_MAX_REVISIONS at limit
- Logging all violations to audit trail

#### Does NOT Own
- Proposing alternative designs (Architect's job)
- Rewriting copy or changing component selections
- Interpreting user intent (already done by Architect)
- Deciding which component to use (decision trees are Architect's)
- Having opinions on aesthetic quality beyond Rams P1 warnings

#### Critic Output Format (required structure)
```json
{
  "audit_result": {
    "status": "REJECTED | APPROVED_WITH_WARNING | APPROVED | FAILED_MAX_REVISIONS",
    "revision": 1,
    "gate_results": {
      "gate_1_color_contrast": "PASS | FAIL",
      "gate_2_typography": "PASS | FAIL",
      "gate_3_spacing_grid": "PASS | FAIL",
      "gate_4_elevation": "PASS | FAIL",
      "gate_5_focus_interaction": "PASS | FAIL",
      "gate_6_aria_semantics": "PASS | FAIL",
      "gate_7_motion": "PASS | FAIL",
      "gate_8_rams": "PASS | WARN"
    },
    "violations": [
      {
        "code": "contrast_fail",
        "severity": "P0",
        "gate": 1,
        "detail": "Body text md.sys.color.on-surface-variant on md.sys.color.surface-container = CR 3.2:1. Required: 4.5:1.",
        "fix": "Use md.sys.color.on-surface (Tone 10) instead. CR = 7.3:1."
      }
    ],
    "approved_elements": ["navigation_bar", "card_layout", "motion_tokens"],
    "moondream_flags": ["COLOR_TOKEN_UNVERIFIED: background color described as 'light blue' — no token match found"]
  }
}
```

#### Critic Decision Protocol
```
1. Receive Architect output (JSON design strategy)
2. Run Gate 1 → Gate 8 in sequence
3. First P0 failure: halt gate sequence, issue REJECTED
4. After all gates: if no P0 → check for P1 → APPROVED_WITH_WARNING or APPROVED
5. Increment revision counter
6. If status = REJECTED and revision < 3: send violations to Architect
7. If status = REJECTED and revision = 3: issue FAILED_MAX_REVISIONS
8. If status = APPROVED or APPROVED_WITH_WARNING: send to Output Formatter
```

---

### MOONDREAM2 — VISUAL AUDIT MODULE

#### Identity
- Model: Moondream2
- Role: Image description engine — converts pixel input to text description for Critic
- Temperature: 0 (deterministic description)

#### Owns
- Receiving uploaded image (PNG/JPG)
- Producing structured text description of visual elements
- Identifying: colors (described in natural language), layout structure, component types, text content, icon presence

#### Does NOT Own
- Making compliance decisions
- Computing contrast ratios
- Issuing violations

#### Moondream Output Format (to Critic)
```json
{
  "visual_description": {
    "background_color": "light gray, approximately white",
    "primary_text_color": "dark gray, appears high contrast",
    "components_detected": ["button", "text field", "modal dialog", "icon buttons"],
    "layout": "single column, centered content, navigation bar at bottom",
    "potential_issues": ["icon buttons appear small, possibly under 48dp", "modal has no visible scrim"],
    "text_content": ["Save changes", "Cancel", "Enter your email"],
    "icon_style": "outlined, consistent style throughout"
  }
}
```

---

### OUTPUT FORMATTER

#### Owns
- Receiving APPROVED or APPROVED_WITH_WARNING result from Critic
- Formatting final response for FastAPI → Streamlit
- Attaching warning list if APPROVED_WITH_WARNING
- Attaching audit trail (gate results) if requested

#### Does NOT Own
- Any design decisions
- Any compliance checks
- Re-running any audit

---

### ESCALATION PROTOCOL

```
FAILED_MAX_REVISIONS:
  1. Output all 3 sets of violation codes to user
  2. Identify which violations are P0 (blocking) vs. P1 (warning)
  3. Suggest: "The following P0 violations require manual resolution before this design can be approved:"
  4. List each P0 with its fix suggestion from the Critic's violation detail field
  5. Do NOT output the rejected design

USER OVERRIDE REQUEST (user explicitly asks to approve despite violations):
  1. P0 violations: NEVER override. System refuses. "WCAG/M3 violations cannot be approved."
  2. P1 violations: User may acknowledge and proceed. System outputs design with all P1 warnings attached.
  3. Log override event to audit trail with timestamp and user acknowledgment
```
