import { describe, it, expect } from "vitest"
import { parseViolations, buildBrief, DEFAULT_SETTINGS } from "@/lib/types"

describe("parseViolations", () => {
  it("extracts P0 codes", () => {
    const { p0 } = parseViolations("REJECTED:\n[P0: contrast_fail] text is unreadable.")
    expect(p0).toEqual(["contrast_fail"])
  })

  it("extracts P1 codes", () => {
    const { p1 } = parseViolations("APPROVED_WITH_WARNING:\n[P1: rams_excess_element] redundant decoration.")
    expect(p1).toEqual(["rams_excess_element"])
  })

  it("extracts OVERRIDE codes", () => {
    const { ov } = parseViolations("APPROVED_WITH_OVERRIDE:\n[OVERRIDE: contrast_fail] reason: editorial intent.")
    expect(ov).toEqual(["contrast_fail"])
  })

  it("returns empty arrays when no tags found", () => {
    const result = parseViolations("APPROVED")
    expect(result.p0).toHaveLength(0)
    expect(result.p1).toHaveLength(0)
    expect(result.ov).toHaveLength(0)
  })

  it("extracts multiple P0 codes from one response", () => {
    const text = "[P0: contrast_fail] bad\n[P0: touch_target_too_small] also bad"
    const { p0 } = parseViolations(text)
    expect(p0).toHaveLength(2)
    expect(p0).toContain("contrast_fail")
    expect(p0).toContain("touch_target_too_small")
  })

  it("is case-insensitive", () => {
    const { p0 } = parseViolations("[p0: contrast_fail] lowercase tag")
    expect(p0).toEqual(["contrast_fail"])
  })

  it("trims whitespace from codes", () => {
    const { p0 } = parseViolations("[P0:  contrast_fail  ] extra spaces")
    expect(p0[0]).toBe("contrast_fail")
  })
})

describe("buildBrief", () => {
  it("includes all settings fields", () => {
    const brief = buildBrief({ ...DEFAULT_SETTINGS, clientName: "Acme", industry: "Tech" })
    expect(brief).toContain("Client: Acme")
    expect(brief).toContain("Industry: Tech")
    expect(brief).toContain("Platform: web")
  })

  it("reflects boolean settings as strings", () => {
    const brief = buildBrief({ ...DEFAULT_SETTINGS, strictToken: false, ramsAudit: true })
    expect(brief).toContain("Strict Token Mode: false")
    expect(brief).toContain("RAMS Audit: true")
  })
})

describe("DEFAULT_SETTINGS", () => {
  it("has sensible defaults", () => {
    expect(DEFAULT_SETTINGS.platform).toBe("web")
    expect(DEFAULT_SETTINGS.maxRevisions).toBe(3)
    expect(DEFAULT_SETTINGS.strictToken).toBe(true)
    expect(DEFAULT_SETTINGS.ramsAudit).toBe(true)
  })
})
