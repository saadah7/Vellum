import { describe, it, expect } from "vitest"
import { parseReport, buildBrief, DEFAULT_SETTINGS, EXAMPLE_PROMPTS } from "@/lib/types"

describe("parseReport", () => {
  it("extracts critical (P0) codes", () => {
    const { critical } = parseReport("REJECTED:\n[P0: contrast_fail] text is unreadable.")
    expect(critical).toEqual(["contrast_fail"])
  })

  it("extracts warning (P1) codes", () => {
    const { warnings } = parseReport("APPROVED_WITH_WARNING:\n[P1: rams_excess_element] redundant decoration.")
    expect(warnings).toEqual(["rams_excess_element"])
  })

  it("extracts exception (OVERRIDE) codes", () => {
    const { exceptions } = parseReport("APPROVED_WITH_OVERRIDE:\n[OVERRIDE: contrast_fail] reason: editorial intent.")
    expect(exceptions).toEqual(["contrast_fail"])
  })

  it("returns empty arrays when no tags found", () => {
    const result = parseReport("APPROVED")
    expect(result.critical).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
    expect(result.exceptions).toHaveLength(0)
  })

  it("extracts multiple critical codes from one response", () => {
    const text = "[P0: contrast_fail] bad\n[P0: touch_target_too_small] also bad"
    const { critical } = parseReport(text)
    expect(critical).toHaveLength(2)
    expect(critical).toContain("contrast_fail")
    expect(critical).toContain("touch_target_too_small")
  })

  it("is case-insensitive", () => {
    const { critical } = parseReport("[p0: contrast_fail] lowercase tag")
    expect(critical).toEqual(["contrast_fail"])
  })

  it("trims whitespace from codes", () => {
    const { critical } = parseReport("[P0:  contrast_fail  ] extra spaces")
    expect(critical[0]).toBe("contrast_fail")
  })
})

describe("buildBrief", () => {
  it("includes all settings fields", () => {
    const brief = buildBrief({ ...DEFAULT_SETTINGS, clientName: "Acme", industry: "Tech" })
    expect(brief).toContain("Client: Acme")
    expect(brief).toContain("Industry: Tech")
    expect(brief).toContain("Platform: web")
  })

  it("uses em-dash for empty client name", () => {
    const brief = buildBrief({ ...DEFAULT_SETTINGS, clientName: "" })
    expect(brief).toContain("Client: —")
  })

  it("reflects boolean settings as strings", () => {
    const brief = buildBrief({ ...DEFAULT_SETTINGS, rejectMadeUpColors: false, checkDesignSmell: true })
    expect(brief).toContain("Strict Token Mode: false")
    expect(brief).toContain("RAMS Audit: true")
  })
})

describe("DEFAULT_SETTINGS", () => {
  it("has sensible defaults", () => {
    expect(DEFAULT_SETTINGS.platform).toBe("web")
    expect(DEFAULT_SETTINGS.maxRounds).toBe(3)
    expect(DEFAULT_SETTINGS.rejectMadeUpColors).toBe(true)
    expect(DEFAULT_SETTINGS.checkDesignSmell).toBe(true)
  })
})

describe("EXAMPLE_PROMPTS", () => {
  it("ships at least 4 starter prompts", () => {
    expect(EXAMPLE_PROMPTS.length).toBeGreaterThanOrEqual(4)
  })

  it("each prompt has title, hint, and prompt text", () => {
    for (const ex of EXAMPLE_PROMPTS) {
      expect(ex.title).toBeTruthy()
      expect(ex.hint).toBeTruthy()
      expect(ex.prompt).toBeTruthy()
    }
  })
})
