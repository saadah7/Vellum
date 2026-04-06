# specs_design_token_schema.md
## Vellum Design Governance — Design Token Naming Convention & Structure
## Agent: Architect (Temp 0.7) — Use this schema for ALL token references in output.
## Agent: Senior Critic (Temp 0) — Reject any output using raw hex codes instead of token names.

---

### CORE RULE

All design decisions must be expressed as token references, not raw values.
FORBIDDEN in Architect output: `color: #6750A4`
REQUIRED in Architect output: `color: var(--md-sys-color-primary)` or token name `md.sys.color.primary`

---

### TOKEN NAMING CONVENTION

Format: `{prefix}.{category}.{subcategory}.{variant}.{state}`

- `md` = Material Design namespace
- `sys` = system-level (semantic, role-based)
- `ref` = reference-level (raw palette values, not for direct use in components)
- `comp` = component-level (component-specific overrides)

---

### SYSTEM COLOR TOKENS (md.sys.color.*)

#### Primary Role
```
md.sys.color.primary                    → CSS: var(--md-sys-color-primary)
md.sys.color.on-primary                 → CSS: var(--md-sys-color-on-primary)
md.sys.color.primary-container          → CSS: var(--md-sys-color-primary-container)
md.sys.color.on-primary-container       → CSS: var(--md-sys-color-on-primary-container)
md.sys.color.inverse-primary            → CSS: var(--md-sys-color-inverse-primary)
```

#### Secondary Role
```
md.sys.color.secondary
md.sys.color.on-secondary
md.sys.color.secondary-container
md.sys.color.on-secondary-container
```

#### Tertiary Role
```
md.sys.color.tertiary
md.sys.color.on-tertiary
md.sys.color.tertiary-container
md.sys.color.on-tertiary-container
```

#### Error Role
```
md.sys.color.error
md.sys.color.on-error
md.sys.color.error-container
md.sys.color.on-error-container
```

#### Surface Role
```
md.sys.color.surface
md.sys.color.on-surface
md.sys.color.surface-variant
md.sys.color.on-surface-variant
md.sys.color.surface-container-lowest
md.sys.color.surface-container-low
md.sys.color.surface-container
md.sys.color.surface-container-high
md.sys.color.surface-container-highest
md.sys.color.inverse-surface
md.sys.color.inverse-on-surface
```

#### Utility Roles
```
md.sys.color.outline
md.sys.color.outline-variant
md.sys.color.shadow
md.sys.color.scrim
md.sys.color.background
md.sys.color.on-background
```

---

### SYSTEM TYPOGRAPHY TOKENS (md.sys.typescale.*)

Format: `md.sys.typescale.{role}-{size}.{property}`

#### Token List
```
md.sys.typescale.display-large.font         → Roboto (or brand override)
md.sys.typescale.display-large.weight       → 400
md.sys.typescale.display-large.size         → 57sp
md.sys.typescale.display-large.line-height  → 64sp
md.sys.typescale.display-large.tracking     → -0.25px

md.sys.typescale.display-medium.size        → 45sp
md.sys.typescale.display-medium.line-height → 52sp
md.sys.typescale.display-medium.tracking    → 0px

md.sys.typescale.display-small.size         → 36sp
md.sys.typescale.display-small.line-height  → 44sp

md.sys.typescale.headline-large.size        → 32sp
md.sys.typescale.headline-large.line-height → 40sp
md.sys.typescale.headline-large.weight      → 400

md.sys.typescale.headline-medium.size       → 28sp
md.sys.typescale.headline-small.size        → 24sp

md.sys.typescale.title-large.size           → 22sp
md.sys.typescale.title-large.weight         → 400

md.sys.typescale.title-medium.size          → 16sp
md.sys.typescale.title-medium.weight        → 500
md.sys.typescale.title-medium.tracking      → 0.15px

md.sys.typescale.title-small.size           → 14sp
md.sys.typescale.title-small.weight         → 500
md.sys.typescale.title-small.tracking       → 0.1px

md.sys.typescale.label-large.size           → 14sp
md.sys.typescale.label-large.weight         → 500
md.sys.typescale.label-large.tracking       → 0.1px

md.sys.typescale.label-medium.size          → 12sp
md.sys.typescale.label-medium.weight        → 500
md.sys.typescale.label-medium.tracking      → 0.5px

md.sys.typescale.label-small.size           → 11sp
md.sys.typescale.label-small.tracking       → 0.5px

md.sys.typescale.body-large.size            → 16sp
md.sys.typescale.body-large.line-height     → 24sp
md.sys.typescale.body-large.tracking        → 0.5px

md.sys.typescale.body-medium.size           → 14sp
md.sys.typescale.body-medium.line-height    → 20sp
md.sys.typescale.body-medium.tracking       → 0.25px

md.sys.typescale.body-small.size            → 12sp
md.sys.typescale.body-small.line-height     → 16sp
md.sys.typescale.body-small.tracking        → 0.4px
```

---

### SYSTEM SHAPE TOKENS (md.sys.shape.*)

```
md.sys.shape.corner.none        → 0dp
md.sys.shape.corner.extra-small → 4dp  (TextField, Menu item)
md.sys.shape.corner.small       → 8dp  (Chip, Snackbar)
md.sys.shape.corner.medium      → 12dp (Card, Dialog)
md.sys.shape.corner.large       → 16dp (FAB, Bottom Sheet top corners)
md.sys.shape.corner.extra-large → 28dp (Extended FAB)
md.sys.shape.corner.full        → 50%  (Pills, Badge, Switch track)
```

---

### SYSTEM ELEVATION TOKENS (md.sys.elevation.*)

```
md.sys.elevation.level0 → 0dp   box-shadow: none
md.sys.elevation.level1 → 1dp   box-shadow: 0px 1px 2px rgba(0,0,0,0.30), 0px 1px 3px 1px rgba(0,0,0,0.15)
md.sys.elevation.level2 → 3dp   box-shadow: 0px 1px 2px rgba(0,0,0,0.30), 0px 2px 6px 2px rgba(0,0,0,0.15)
md.sys.elevation.level3 → 6dp   box-shadow: 0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.30)
md.sys.elevation.level4 → 8dp   box-shadow: 0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.30)
md.sys.elevation.level5 → 12dp  box-shadow: 0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.30)
```

---

### SYSTEM SPACING TOKENS (md.sys.spacing.*)

```
md.sys.spacing.0   → 0dp
md.sys.spacing.1   → 4dp   (micro — icon gap, badge offset)
md.sys.spacing.2   → 8dp   (dense component internal padding)
md.sys.spacing.3   → 12dp  (chip internal horizontal padding)
md.sys.spacing.4   → 16dp  (standard margin, card padding)
md.sys.spacing.5   → 24dp  (medium breakpoint margin, section gap)
md.sys.spacing.6   → 32dp  (section-to-section gap, hero padding)
md.sys.spacing.7   → 48dp  (minimum touch target, large section gap)
md.sys.spacing.8   → 64dp  (hero padding, major layout zone gap)
```

---

### COMPONENT-LEVEL TOKEN OVERRIDES (md.comp.*)

Format: `md.comp.{component}.{slot}.{property}`

Examples:
```
md.comp.button.container.color          → md.sys.color.primary
md.comp.button.label-text.color         → md.sys.color.on-primary
md.comp.button.container.shape          → md.sys.shape.corner.full
md.comp.button.container.height         → 40dp
md.comp.button.container.elevation      → md.sys.elevation.level0

md.comp.card.container.color            → md.sys.color.surface-container-low
md.comp.card.container.shape            → md.sys.shape.corner.medium
md.comp.card.container.elevation        → md.sys.elevation.level0

md.comp.dialog.container.color          → md.sys.color.surface-container-high
md.comp.dialog.container.shape          → md.sys.shape.corner.extra-large
md.comp.dialog.container.elevation      → md.sys.elevation.level3
md.comp.dialog.headline.color           → md.sys.color.on-surface
md.comp.dialog.supporting-text.color    → md.sys.color.on-surface-variant

md.comp.text-field.active-indicator.color         → md.sys.color.primary
md.comp.text-field.error.active-indicator.color    → md.sys.color.error
md.comp.text-field.container.color                 → md.sys.color.surface-container-highest
```

---

### REFERENCE PALETTE TOKENS (md.ref.palette.*) — DO NOT USE IN COMPONENTS

These are raw palette values. Only used to generate sys tokens. Architect must never output these as component values.

```
md.ref.palette.primary40     → #6750A4
md.ref.palette.primary80     → #D0BCFF
md.ref.palette.primary90     → #EADDFF
md.ref.palette.secondary40   → #625B71
md.ref.palette.error40       → #B3261E
md.ref.palette.neutral98     → #FEF7FF  (surface light)
md.ref.palette.neutral6      → #141218  (surface dark)
```

---

### CLIENT BRIEF TOKEN OVERRIDE PATTERN

When a client brief defines custom brand colors, map them into the token system:

```
Client: brand-primary = #1A73E8 (Google Blue)
Vellum mapping:
  md.ref.palette.primary40 → #1A73E8 (override)
  All md.sys.color.primary* tokens regenerate from this seed via HCT
  Critic verifies: md.sys.color.primary on md.sys.color.surface ≥ 4.5:1
```

---

### TOKEN AUDIT RULES (Critic)

```
CHECK: No raw hex codes in Architect output (except scrim: #000000 which is permitted)
  FAIL → P1: raw_hex_instead_of_token

CHECK: All color references use md.sys.color.* tokens (not md.ref.palette.*)
  FAIL → P1: reference_token_used_in_component

CHECK: All spacing values reference md.sys.spacing.* or are explicit 8pt multiples
  FAIL → P1: arbitrary_spacing_value

CHECK: All shape values reference md.sys.shape.corner.*
  FAIL → P2: non_token_shape_value
```
