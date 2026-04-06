# specs_versioning_and_changelog.md
## Vellum Design Governance — Spec Version Control, Drift Detection & Update Protocol
## System: ChromaDB + LangGraph — defines how spec updates propagate through the agent system.

---

### VERSION SCHEMA

All spec files follow semantic versioning: `MAJOR.MINOR.PATCH`

```
MAJOR: Breaking change — a rule that previously APPROVED a pattern now REJECTS it
       Requires: ChromaDB full re-embed of affected file
       Requires: Architect and Critic system prompt update
       Requires: Manual regression test of last 10 approved designs against new rule

MINOR: Non-breaking addition — new rule added, existing rules unchanged
       Requires: ChromaDB partial re-embed of affected file
       Requires: Notification to Architect prompt (new rule available)

PATCH: Clarification or correction — wording change, example added, typo fixed
       Requires: ChromaDB re-embed of affected chunk only
       Requires: No agent prompt update
```

---

### SPEC FILE VERSION REGISTRY

```
specs_priority_hierarchy.md           → v1.0.0
specs_violation_severity_matrix.md    → v1.0.0
specs_audit_checklist.md              → v1.0.0
specs_conflict_resolution_logic.md    → v1.0.0
specs_touch_and_keyboard_targets.md   → v1.0.0
specs_focus_management.md             → v1.0.0
specs_aria_and_semantics.md           → v1.0.0
specs_color_blind_safe_palettes.md    → v1.0.0
specs_reduced_motion_rules.md         → v1.0.0
specs_dynamic_type_scaling.md         → v1.0.0
specs_component_selection_rules.md    → v1.0.0
specs_component_state_machines.md     → v1.0.0
specs_design_token_schema.md          → v1.0.0
specs_responsive_behaviour.md         → v1.0.0
specs_cross_system_conflicts.md       → v1.0.0
specs_content_and_copy_rules.md       → v1.0.0
specs_motion_and_animation.md         → v1.0.0
specs_iconography.md                  → v1.0.0
specs_typography_scaling.md           → v1.0.0
specs_grid_and_spacing.md             → v1.0.0
specs_color_and_contrast.md           → v1.0.0
specs_elevation_and_shadows.md        → v1.0.0
specs_design_principles_rams.md       → v1.0.0
specs_agent_role_definitions.md       → v1.0.0
specs_scope_and_platform_rules.md     → v1.0.0
specs_handoff_output_format.md        → v1.0.0
```

---

### UPSTREAM SOURCE TRACKING

Each spec file maps to one or more upstream sources. When upstream sources release updates, the corresponding Vellum spec file must be reviewed.

```
WCAG 2.1 → specs_violation_severity_matrix.md, specs_audit_checklist.md,
            specs_touch_and_keyboard_targets.md, specs_focus_management.md,
            specs_aria_and_semantics.md, specs_color_and_contrast.md,
            specs_reduced_motion_rules.md, specs_dynamic_type_scaling.md

WCAG 3.0 (when released) → MAJOR version bump for all WCAG-sourced files

Material Design 3 → specs_typography_scaling.md, specs_grid_and_spacing.md,
                    specs_color_and_contrast.md, specs_elevation_and_shadows.md,
                    specs_design_token_schema.md, specs_component_state_machines.md,
                    specs_motion_and_animation.md, specs_iconography.md,
                    specs_responsive_behaviour.md

Apple HIG → specs_cross_system_conflicts.md, specs_dynamic_type_scaling.md,
            specs_touch_and_keyboard_targets.md, specs_iconography.md,
            specs_responsive_behaviour.md

Dieter Rams → specs_design_principles_rams.md (static — no upstream updates expected)
```

---

### CHROMADB RE-EMBED PROTOCOL

When a spec file is updated:

```python
# Step 1: Delete existing vectors for the file
collection.delete(where={"source": "specs_[filename].md"})

# Step 2: Re-chunk the updated file
# Chunk size: 400 tokens max per chunk (optimized for Llama 3.2 3B context)
# Overlap: 50 tokens between chunks
# Chunk boundary: prefer section headers (##, ###) as split points

# Step 3: Re-embed all chunks
# Each chunk metadata must include:
chunk_metadata = {
  "source": "specs_[filename].md",
  "version": "1.1.0",
  "section": "GATE 1 — CONTRAST & COLOR",
  "authority_level": "P4 | P3 | P2 | P1",
  "agent_target": "critic | architect | both",
  "last_updated": "YYYY-MM-DD"
}

# Step 4: Run regression test (see below)
```

---

### CHUNK METADATA SCHEMA (ChromaDB)

Every chunk stored in ChromaDB must carry this metadata for accurate RAG retrieval:

```json
{
  "source": "specs_audit_checklist.md",
  "version": "1.0.0",
  "section": "GATE 1 — CONTRAST & COLOR",
  "subsection": "CHECK 1.1",
  "authority_level": "P4",
  "agent_target": "critic",
  "platform_scope": "all | ios | android | web",
  "violation_codes": ["contrast_fail", "large_text_contrast_fail"],
  "last_updated": "2025-01-01",
  "upstream_source": "WCAG 2.1"
}
```

---

### RAG RETRIEVAL STRATEGY PER AGENT

#### Architect Query Strategy
```python
# Query: component selection
query = "navigation pattern compact breakpoint mobile"
results = collection.query(
  query_texts=[query],
  n_results=5,
  where={"agent_target": {"$in": ["architect", "both"]}}
)

# Query: token lookup
query = "button primary color token"
results = collection.query(
  query_texts=[query],
  n_results=3,
  where={"source": "specs_design_token_schema.md"}
)
```

#### Critic Query Strategy
```python
# Query: specific violation check
query = "contrast ratio body text minimum"
results = collection.query(
  query_texts=[query],
  n_results=3,
  where={
    "agent_target": {"$in": ["critic", "both"]},
    "authority_level": {"$in": ["P4", "P3"]}
  }
)
# Always prioritize P4 chunks over P3 chunks in results
```

---

### DRIFT DETECTION RULES

Spec drift = when the running system produces decisions inconsistent with the current spec files.

#### Drift Indicators (log and flag)
- Architect proposes raw hex code more than once per session → flag: `architect_token_drift`
- Critic approves a design with contrast < 4.5:1 → flag: `critic_contrast_drift` (critical)
- Critic issues APPROVED without running all 8 gates → flag: `critic_gate_skip`
- Architect repeatedly selects wrong component for same use case → flag: `architect_component_drift`

#### Drift Response
```
Minor drift (architect_token_drift, architect_component_drift):
  → Re-inject relevant spec chunk into Architect context
  → Log to drift_log.json

Critical drift (critic_contrast_drift, critic_gate_skip):
  → Halt session
  → Re-embed affected spec files
  → Run regression test
  → Do not resume until regression passes
```

---

### REGRESSION TEST PROTOCOL

Run after any MAJOR or MINOR version bump:

```
Test set: last 10 approved designs (stored in audit trail)
For each design:
  1. Re-run Critic audit against new spec version
  2. Compare result: APPROVED vs. REJECTED
  3. If previously APPROVED design now REJECTED:
     → Identify which new rule caused the change
     → Flag as BREAKING_CHANGE
     → Notify: "Spec update v[X.X.X] introduces breaking change affecting [N] previously approved designs"
  4. Document all regressions in changelog
```

---

### CHANGELOG FORMAT

```markdown
## [1.1.0] — YYYY-MM-DD
### Added
- specs_audit_checklist.md: Gate 1 CHECK 1.8 — HDR display contrast rule added
### Changed
- specs_violation_severity_matrix.md: pure #FFFFFF on surface upgraded from P1 to P0
  - BREAKING: designs approved under previous rule may now be rejected
### Fixed
- specs_typography_scaling.md: Body Large line-height corrected from 1.4x to 1.5x

## [1.0.1] — YYYY-MM-DD
### Fixed
- specs_component_selection_rules.md: Tree 4 radio group threshold corrected from ≤ 7 to ≤ 5
```

---

### SPEC FILE HEADER TEMPLATE

Every spec file must begin with this header block:

```markdown
# specs_[filename].md
## Version: 1.0.0
## Last updated: YYYY-MM-DD
## Upstream sources: [WCAG 2.1 | M3 | HIG | Rams]
## Authority level: [P4 | P3 | P2 | P1]
## Agent target: [critic | architect | both]
## Platform scope: [all | ios | android | web]
## Breaking changes from previous version: [none | description]
```
