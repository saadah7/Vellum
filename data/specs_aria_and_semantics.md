# specs_aria_and_semantics.md
## Vellum Design Governance — ARIA Roles, States, Properties & Landmark Map
## Agent: Senior Critic (Temp 0) — Gate 6 enforcement. All P0 = REJECTED.

---

### CORE RULE

Use semantic HTML first. ARIA is the fallback, not the default. If a native HTML element provides the role implicitly, do not add an explicit ARIA role — it creates redundancy and potential conflicts.

```
FORBIDDEN: <button role="button"> — redundant
FORBIDDEN: <a href="#" role="link"> — redundant
CORRECT: <div role="button" tabindex="0"> — acceptable ONLY when <button> cannot be used
```

---

### LANDMARK ROLES — PAGE STRUCTURE

| Role | HTML Equivalent | Use | Max Per Page |
|---|---|---|---|
| `banner` | `<header>` | Site header / top app bar | 1 |
| `navigation` | `<nav>` | Navigation menus — must have aria-label if multiple | Multiple (labeled) |
| `main` | `<main>` | Primary content | 1 |
| `complementary` | `<aside>` | Secondary/supporting content | Multiple |
| `contentinfo` | `<footer>` | Footer | 1 |
| `search` | `<search>` (HTML5) | Search region | Multiple |
| `region` | `<section>` | Named section — MUST have aria-labelledby | Only with label |
| `form` | `<form>` | Form — must have aria-label or aria-labelledby | Multiple |

#### Landmark Audit Rules
```
CHECK: Page has exactly one role="main" / <main>
  FAIL → P0: missing_main_landmark

CHECK: Multiple <nav> elements each have unique aria-label
  FAIL → P1: navigation_landmarks_unlabeled

CHECK: <section> used as region landmark has aria-labelledby pointing to visible heading
  FAIL → P1: region_landmark_missing_label
```

---

### WIDGET ROLES — COMPONENT MAP

#### Interactive Components — Required ARIA Per Component

**Button**
```html
<!-- Preferred -->
<button type="button">Label</button>

<!-- Icon-only button — REQUIRED aria-label -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Toggle button -->
<button type="button" aria-pressed="false">Mute</button>
<!-- aria-pressed must update on toggle: false → true → false -->
```

**Checkbox**
```html
<input type="checkbox" id="cb1" aria-checked="false">
<label for="cb1">Enable notifications</label>
<!-- Indeterminate state: aria-checked="mixed" -->
<!-- NEVER use div as checkbox without role="checkbox" + aria-checked + keyboard handling -->
```

**Radio Group**
```html
<fieldset>
  <legend>Preferred contact</legend>
  <input type="radio" name="contact" id="r1" value="email">
  <label for="r1">Email</label>
  <input type="radio" name="contact" id="r2" value="phone">
  <label for="r2">Phone</label>
</fieldset>
<!-- Custom radio: role="radiogroup" on container + role="radio" + aria-checked on items -->
```

**Dialog / Modal**
```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <h2 id="dialog-title">Confirm deletion</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
<!-- aria-modal="true" tells screen readers to ignore background content -->
<!-- aria-labelledby REQUIRED — points to visible dialog heading -->
```

**Alert Dialog**
```html
<div role="alertdialog" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-msg">
```
- Use `alertdialog` (not `dialog`) when the dialog requires an immediate response
- Screen readers announce alertdialog content immediately on open

**Menu / Dropdown**
```html
<button aria-haspopup="menu" aria-expanded="false" aria-controls="menu1">Options</button>
<ul role="menu" id="menu1">
  <li role="menuitem">Edit</li>
  <li role="menuitem">Delete</li>
  <li role="separator" aria-hidden="true"></li>
  <li role="menuitemcheckbox" aria-checked="true">Show labels</li>
</ul>
<!-- aria-expanded must update: false (closed) → true (open) -->
```

**Listbox (Select)**
```html
<div role="listbox" aria-label="Sort by" aria-activedescendant="opt2">
  <div role="option" id="opt1" aria-selected="false">Newest first</div>
  <div role="option" id="opt2" aria-selected="true">Oldest first</div>
</div>
<!-- aria-activedescendant = id of currently highlighted option -->
```

**Tab Bar / Tab Panel**
```html
<div role="tablist" aria-label="Settings sections">
  <button role="tab" aria-selected="true" aria-controls="panel1" id="tab1">General</button>
  <button role="tab" aria-selected="false" aria-controls="panel2" id="tab2">Privacy</button>
</div>
<div role="tabpanel" id="panel1" aria-labelledby="tab1">...</div>
<div role="tabpanel" id="panel2" aria-labelledby="tab2" hidden>...</div>
```

**Accordion**
```html
<button aria-expanded="false" aria-controls="acc1-panel" id="acc1-btn">Section title</button>
<div role="region" id="acc1-panel" aria-labelledby="acc1-btn" hidden>...</div>
<!-- aria-expanded updates on toggle. role="region" only if content is substantial -->
```

**Slider**
```html
<input type="range" min="0" max="100" value="50" aria-label="Volume" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="50%">
<!-- aria-valuetext: human-readable value when numeric is insufficient (e.g. "Low", "Medium", "High") -->
```

**Progress / Loading**
```html
<!-- Determinate -->
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
<!-- Indeterminate (no aria-valuenow) -->
<div role="progressbar" aria-label="Loading" aria-valuemin="0" aria-valuemax="100">
```

**Tooltip**
```html
<button aria-describedby="tip1">Save</button>
<div role="tooltip" id="tip1">Saves all changes (Ctrl+S)</div>
<!-- aria-describedby not aria-labelledby — tooltip supplements, not replaces label -->
<!-- Tooltip must appear on both hover AND focus -->
```

**Combobox / Autocomplete**
```html
<input type="text" role="combobox" aria-expanded="false" aria-autocomplete="list" aria-controls="listbox1" aria-activedescendant="">
<ul role="listbox" id="listbox1">
  <li role="option" id="opt1">Result 1</li>
</ul>
```

---

### ARIA LIVE REGIONS — DYNAMIC CONTENT

| Scenario | aria-live value | aria-atomic |
|---|---|---|
| Snackbar / Toast notification | `polite` | `true` |
| Form validation error | `polite` | `false` |
| Alert / urgent message | `assertive` | `true` |
| Search results count update | `polite` | `true` |
| Loading state announcement | `polite` | `true` |
| Route change announcement (SPA) | `polite` | `true` |
| Chat messages (incremental) | `polite` | `false` |

```
RULE: Use aria-live="assertive" sparingly — interrupts screen reader immediately.
RULE: aria-live regions must exist in DOM on page load, not injected dynamically.
RULE: Do NOT put aria-live on the element that changes — put it on a persistent container.
```

---

### IMAGE ALT TEXT RULES (WCAG 1.1.1 — P0)

- **Informative image**: `alt="descriptive text"` — describes content/function
- **Decorative image**: `alt=""` — explicitly empty, not missing
- **Functional image** (button/link icon): `alt="action description"` (e.g. `alt="Search"`)
- **Complex image** (chart/graph): `alt="brief description"` + long description in adjacent text or `aria-describedby`
- **Icon inside labeled button**: `<svg aria-hidden="true">` — SVG hidden, button label provides context

```
FORBIDDEN: <img> with no alt attribute → P0: wcag_1.1.1_alt_missing
FORBIDDEN: <img alt="image"> or <img alt="photo"> — non-descriptive → P1: alt_text_non_descriptive
FORBIDDEN: <img alt=""> on informative image → P0: decorative_alt_on_informative_image
```

---

### ARIA AUDIT CHECKLIST (Critic Gate 6)

```
CHECK: All icon-only buttons have aria-label or aria-labelledby
  FAIL → P0: aria_label_missing_icon_button

CHECK: All modals have role="dialog" + aria-modal="true" + aria-labelledby
  FAIL → P0: aria_modal_attributes_incomplete

CHECK: All aria-expanded toggles update state on open/close
  FAIL → P0: aria_expanded_not_updating

CHECK: All form inputs associated with label (for/id or aria-label or aria-labelledby)
  FAIL → P0: form_input_label_missing

CHECK: aria-live regions present in DOM on page load (not injected)
  FAIL → P1: aria_live_region_injected_dynamically

CHECK: All images have alt attribute present (empty or descriptive)
  FAIL → P0: wcag_1.1.1_alt_missing

CHECK: No redundant ARIA roles on semantic HTML elements
  FAIL → P2: redundant_aria_role
```

---

### MOONDREAM2 VISUAL AUDIT TRIGGERS

- "icon button" / "icon without text" → CHECK aria-label on button
- "popup" / "modal" / "dialog" → CHECK role="dialog" + aria-modal + aria-labelledby
- "image" / "photo" / "illustration" → CHECK alt text presence
- "form" / "input field" / "text box" → CHECK associated label
- "loading spinner" → CHECK role="progressbar" or aria-live announcement
- "notification" / "toast" / "banner" → CHECK aria-live="polite" region
- "dropdown" / "menu" → CHECK aria-haspopup + aria-expanded
