import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { GovernanceReport } from "@/components/vellum/governance-report"
import type { GovData } from "@/lib/types"

const base: GovData = {
  status: "APPROVED",
  revisions: 1,
  maxRevisions: 3,
  p0: [],
  p1: [],
  ov: [],
}

describe("GovernanceReport", () => {
  it("shows revision count", () => {
    render(<GovernanceReport gov={{ ...base, revisions: 2, maxRevisions: 3 }} />)
    expect(screen.getByText("2 / 3 rev")).toBeInTheDocument()
  })

  it("shows 'No violations flagged' when no chips", () => {
    render(<GovernanceReport gov={base} />)
    expect(screen.getByText(/no violations/i)).toBeInTheDocument()
  })

  it("renders P0 violation chip", () => {
    render(<GovernanceReport gov={{ ...base, p0: ["contrast_fail"] }} />)
    expect(screen.getByText(/P0: contrast_fail/)).toBeInTheDocument()
  })

  it("renders P1 warning chip", () => {
    render(<GovernanceReport gov={{ ...base, p1: ["rams_excess_element"] }} />)
    expect(screen.getByText(/P1: rams_excess_element/)).toBeInTheDocument()
  })

  it("renders Override chip with ◈ symbol", () => {
    render(<GovernanceReport gov={{ ...base, ov: ["contrast_fail"] }} />)
    expect(screen.getByText(/◈.*contrast_fail/)).toBeInTheDocument()
  })

  it("renders multiple chips", () => {
    render(<GovernanceReport gov={{ ...base, p0: ["contrast_fail", "touch_target_too_small"] }} />)
    expect(screen.getByText(/P0: contrast_fail/)).toBeInTheDocument()
    expect(screen.getByText(/P0: touch_target_too_small/)).toBeInTheDocument()
  })
})
