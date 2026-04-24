// ── Quality report shown alongside every answer ──────────────────────────────
export interface QualityReport {
  status: string       // APPROVED | APPROVED_WITH_WARNING | APPROVED_WITH_OVERRIDE | REJECTED
  rounds: number       // how many review rounds happened
  maxRounds: number    // upper bound configured by the user
  critical: string[]   // P0 — must-fix rule breaks
  warnings: string[]   // P1 — soft rule breaks
  exceptions: string[] // OVERRIDE — intentional rule breaks the user declared
}

export interface Message {
  role: "user" | "assistant"
  content: string
  report?: QualityReport
}

// ── Settings: 2 primary, the rest in "Advanced" ───────────────────────────────
export interface Settings {
  platform: "web" | "ios" | "android"
  maxRounds: number
  // advanced
  clientName: string
  industry: string
  typography: "Material 3" | "Apple HIG" | "Custom"
  colorMode: "Light" | "Dark" | "System"
  brandNotes: string
  rejectMadeUpColors: boolean   // strict token mode
  checkDesignSmell: boolean     // RAMS audit
  ruleBreakReason: string       // override intent
}

export const DEFAULT_SETTINGS: Settings = {
  platform: "web",
  maxRounds: 3,
  clientName: "",
  industry: "Tech",
  typography: "Material 3",
  colorMode: "Light",
  brandNotes: "",
  rejectMadeUpColors: true,
  checkDesignSmell: true,
  ruleBreakReason: "",
}

// ── Parse P0/P1/OVERRIDE tags from the reviewer's feedback text ───────────────
export function parseReport(text: string) {
  const critical   = [...text.matchAll(/\[P0:\s*([^\]]+)\]/gi)].map((m) => m[1].trim())
  const warnings   = [...text.matchAll(/\[P1:\s*([^\]]+)\]/gi)].map((m) => m[1].trim())
  const exceptions = [...text.matchAll(/\[OVERRIDE:\s*([^\]]+)\]/gi)].map((m) => m[1].trim())
  return { critical, warnings, exceptions }
}

// ── Flatten settings into the free-text brief the backend expects ─────────────
export function buildBrief(s: Settings): string {
  return [
    `Client: ${s.clientName || "—"}`,
    `Industry: ${s.industry}`,
    `Platform: ${s.platform}`,
    `Color Mode: ${s.colorMode}`,
    `Typography Scale: ${s.typography}`,
    `Brand Notes: ${s.brandNotes || "—"}`,
    `Strict Token Mode: ${s.rejectMadeUpColors}`,
    `RAMS Audit: ${s.checkDesignSmell}`,
  ].join("\n")
}

// ── Example prompts shown on the empty state ──────────────────────────────────
export const EXAMPLE_PROMPTS: { title: string; prompt: string; hint: string }[] = [
  {
    title: "Check my button's contrast",
    hint: "Accessibility audit",
    prompt:
      "I have a primary CTA button: background #6c63ff, text #ffffff, 14px Inter semibold. Is this accessible on a light page? If not, suggest the minimum change.",
  },
  {
    title: "Spec a sign-up modal",
    hint: "Component design",
    prompt:
      "Design a sign-up modal for a web app. Specify spacing, focus order, field widths, and the primary action. Target desktop.",
  },
  {
    title: "Review my card layout",
    hint: "Layout audit",
    prompt:
      "I'm using 24px padding inside cards with 12px between cards on a 1280px desktop grid. Does this meet Material 3 spacing rules?",
  },
  {
    title: "I'm breaking a rule on purpose",
    hint: "Declared exception",
    prompt:
      "I'm using pure black (#000) body text on pure white (#fff) because this is a print-first editorial layout. Is this acceptable, and what should I document?",
  },
]
