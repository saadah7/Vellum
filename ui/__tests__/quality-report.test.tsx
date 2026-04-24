import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QualityReport } from "@/components/vellum/quality-report"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { QualityReport as Report } from "@/lib/types"

const base: Report = {
  status: "APPROVED",
  rounds: 1,
  maxRounds: 3,
  critical: [],
  warnings: [],
  exceptions: [],
}

function renderReport(report: Report) {
  return render(
    <TooltipProvider>
      <QualityReport report={report} />
    </TooltipProvider>
  )
}

describe("QualityReport", () => {
  it("shows round count in the header", () => {
    renderReport({ ...base, rounds: 2, maxRounds: 3 })
    expect(screen.getByText("2 / 3 rounds")).toBeInTheDocument()
  })

  it("renders the Approved status chip for APPROVED", () => {
    renderReport(base)
    expect(screen.getByText("Approved")).toBeInTheDocument()
  })

  it("renders the Approved-with-warnings chip for APPROVED_WITH_WARNING", () => {
    renderReport({ ...base, status: "APPROVED_WITH_WARNING", warnings: ["rams_excess_element"] })
    expect(screen.getByText(/warnings/i)).toBeInTheDocument()
  })

  it("renders the Approved-with-exception chip for APPROVED_WITH_OVERRIDE", () => {
    renderReport({ ...base, status: "APPROVED_WITH_OVERRIDE", exceptions: ["contrast_fail"] })
    expect(screen.getByText(/exception/i)).toBeInTheDocument()
  })

  it("renders the Rejected chip for REJECTED", () => {
    renderReport({ ...base, status: "REJECTED", critical: ["contrast_fail"] })
    expect(screen.getByText(/rejected/i)).toBeInTheDocument()
  })

  it("collapses detail by default and expands on click", async () => {
    const user = userEvent.setup()
    renderReport({ ...base, critical: ["contrast_fail"] })
    expect(screen.queryByText("contrast_fail")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button"))
    expect(screen.getByText("contrast_fail")).toBeInTheDocument()
  })

  it("shows a note count when issues exist", () => {
    renderReport({ ...base, critical: ["a", "b"], warnings: ["c"] })
    expect(screen.getByText(/3 notes/i)).toBeInTheDocument()
  })

  it("renders zero-state message when expanded with no issues", async () => {
    const user = userEvent.setup()
    renderReport(base)
    await user.click(screen.getByRole("button"))
    expect(screen.getByText(/no issues flagged/i)).toBeInTheDocument()
  })
})
