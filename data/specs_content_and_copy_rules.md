# specs_content_and_copy_rules.md
## Vellum Design Governance — Voice, Tone, Copy Length & Truncation Rules
## Agent: Architect (Temp 0.7) — Apply to all text content in design proposals.
## Agent: Senior Critic (Temp 0) — Flag violations as P1 WARN.

---

### VOICE PRINCIPLES (Rams P6 — Honesty applied to language)

- **Honest**: Do not use copy that overstates capability. "Smart suggestions" is acceptable. "AI that reads your mind" is not.
- **Useful**: Every word must serve the user. Remove adjectives that don't add information.
- **Clear**: One idea per sentence. Active voice over passive. Subject → Verb → Object.
- **Respectful**: Address user as capable adult. No condescension. No excessive hand-holding.
- **Consistent**: Same term for same concept throughout. Never alternate "delete" and "remove" for the same action.

---

### CASE RULES

| Context | Case Rule | Example |
|---|---|---|
| Button labels | Sentence case | "Save changes" not "Save Changes" |
| Navigation labels | Sentence case | "My account" not "My Account" |
| Dialog titles | Sentence case | "Delete this item?" not "Delete This Item?" |
| Section headings (UI) | Sentence case | "Recent activity" |
| All-caps labels | Permitted with +0.08em tracking | "NEW" badge, "BETA" tag |
| Brand names / proper nouns | Preserve original casing | "iPhone", "YouTube", "ChromaDB" |
| Error messages | Sentence case, no period if < full sentence | "Password is too short" |
| Tooltip content | Sentence case | "Opens in a new tab" |

**FORBIDDEN casing:**
- Title Case on button labels → P1 WARN: button_label_title_case
- ALL CAPS on body text → P1 WARN: body_text_all_caps
- ALL CAPS on headings > 3 words → P1 WARN: heading_all_caps_too_long

---

### COPY LENGTH RULES PER COMPONENT

#### Buttons
- Max label length: **3 words** (exceptions: Extended FAB up to 4 words)
- Icon + label: icon replaces 1 word — max 2 words with icon
- FORBIDDEN: Sentence as button label ("Click here to continue")
- Examples: "Save", "Delete account", "Add to cart", "Get started"

#### Dialog Titles
- Max: **8 words**
- Phrasing: Question ("Delete this file?") or Noun phrase ("Account settings")
- FORBIDDEN: Long explanatory title — put explanation in supporting text

#### Dialog Supporting Text
- Max: **3 sentences** or **60 words**
- Must answer: what will happen, any irreversible consequences
- FORBIDDEN: Repeating the title in the supporting text

#### Snackbar Messages
- Max: **2 lines** / **60 characters** on Compact / **120 characters** on Expanded
- Single action label: max **2 words** ("Undo", "Dismiss", "View")
- FORBIDDEN: Snackbar with no action button AND message > 1 line (use Banner instead)

#### Tooltip Content
- Max: **1 sentence** / **60 characters**
- No rich text (no bold, no links) inside tooltip
- FORBIDDEN: Tooltip that duplicates the button label (adds no value)

#### Empty State Messages
- Structure: [What happened] + [Why] + [What to do]
- Heading: max 5 words ("No results found", "Nothing here yet")
- Body: max 2 sentences
- CTA: 1 button (filled), max 3 words

#### Error Messages (Form Validation)
- Format: Specific, actionable, non-blaming
- FORBIDDEN: "Invalid input" — too vague
- FORBIDDEN: "You entered wrong data" — blaming
- CORRECT: "Email must include @" / "Password must be 8+ characters"
- Max length: 1 sentence, < 80 characters
- Must reference the specific field if multiple errors

#### Loading States
- < 1 second: no message needed (spinner only)
- 1–3 seconds: "Loading..." or skeleton only
- 3–10 seconds: Progress with specific message ("Uploading your file...")
- > 10 seconds: Progress + estimated time ("About 2 minutes remaining")

#### Onboarding / Empty States
- Max steps: 3 (Compact) / 5 (Expanded)
- Each step: 1 heading (max 5 words) + 1–2 sentences body
- CTA per step: 1 primary button only

---

### TRUNCATION RULES

#### Text Truncation
- Single-line truncation: `text-overflow: ellipsis` — ONLY when full text accessible via tooltip or expansion
- Multi-line truncation: max 2–3 lines with "…" — provide expand/read-more if > 3 lines
- FORBIDDEN: Truncating error messages — always show full error
- FORBIDDEN: Truncating navigation labels — shorten the label instead
- FORBIDDEN: Mid-word truncation — always truncate at word boundary

#### Truncation by Component
| Component | Max Lines | Truncation Method |
|---|---|---|
| Card title | 2 | Ellipsis + tooltip |
| Card body | 3 | Ellipsis + "Read more" link |
| List item (primary) | 1 | Ellipsis (full text in detail view) |
| List item (secondary) | 2 | Ellipsis |
| Chip label | 1 | Ellipsis (chip min-width: 48dp) |
| Snackbar | 2 | Never truncate — shorten the copy |
| Navigation label | 1 | Shorten copy, never truncate |
| Button label | 1 | Never truncate — shorten the copy |
| Dialog title | 2 | Ellipsis (but prefer shorter copy) |

---

### PLACEHOLDER TEXT RULES

- Placeholder = hint, not label. Never use placeholder as the only label for a field.
- Format: Example value, not instructions ("e.g. jane@example.com" not "Enter your email")
- FORBIDDEN: Placeholder that repeats the label ("Email" as placeholder when label is also "Email")
- FORBIDDEN: Placeholder used as error state hint ("Must be 8 characters" as placeholder)
- Placeholder disappears on focus → supporting text must carry hints that persist

---

### MICROCOPY — ACTION VERB TABLE

| Action | Preferred Verb | Avoid |
|---|---|---|
| Create new item | "New [item]" / "Add [item]" | "Create", "Make" |
| Remove permanently | "Delete" | "Remove", "Erase" |
| Remove from list/set | "Remove" | "Delete" |
| Save current state | "Save" | "Submit", "OK" |
| Submit a form | "Submit" / "Send" | "OK", "Done" |
| Abandon/cancel | "Cancel" | "No", "Back", "Quit" |
| Confirm destructive | "Delete" / "Remove" (repeat action verb) | "Yes", "OK", "Confirm" |
| Close/dismiss | "Close" / "Dismiss" | "Exit", "Quit" |
| Undo last action | "Undo" | "Revert", "Go back" |
| Retry failed action | "Try again" | "Retry", "Reload" |

**Destructive action confirmation rule**: The confirm button must repeat the exact destructive verb.
- Dialog: "Delete account?" → buttons: "Cancel" + "Delete account" (not "OK" + "Yes")

---

### COPY AUDIT RULES (Critic — P1 WARN)

```
CHECK: Button labels ≤ 3 words
  FAIL → P1: button_label_too_long

CHECK: Button labels in sentence case
  FAIL → P1: button_label_title_case

CHECK: Error messages are specific and actionable (not generic "Invalid input")
  FAIL → P1: error_message_non_specific

CHECK: Destructive confirm button repeats the action verb
  FAIL → P1: destructive_confirm_wrong_label

CHECK: Placeholder text present alongside (not instead of) form label
  FAIL → P0: placeholder_replaces_label (WCAG 1.3.5)

CHECK: Snackbar message ≤ 2 lines on Compact
  FAIL → P1: snackbar_copy_too_long

CHECK: Tooltip content ≤ 60 characters
  FAIL → P1: tooltip_copy_too_long
```
