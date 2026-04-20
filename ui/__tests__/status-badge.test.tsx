import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { StatusBadge } from "@/components/vellum/status-badge"

describe("StatusBadge", () => {
  it("renders Idle when status is null", () => {
    render(<StatusBadge status={null} />)
    expect(screen.getByText("Idle")).toBeInTheDocument()
  })

  it("renders Approved for APPROVED status", () => {
    render(<StatusBadge status="APPROVED" />)
    expect(screen.getByText(/approved/i)).toBeInTheDocument()
  })

  it("renders Approved with Warnings for APPROVED_WITH_WARNING", () => {
    render(<StatusBadge status="APPROVED_WITH_WARNING" />)
    expect(screen.getByText(/warnings/i)).toBeInTheDocument()
  })

  it("renders Approved with Override for APPROVED_WITH_OVERRIDE", () => {
    render(<StatusBadge status="APPROVED_WITH_OVERRIDE" />)
    expect(screen.getByText(/override/i)).toBeInTheDocument()
  })

  it("renders Rejected for REJECTED status", () => {
    render(<StatusBadge status="REJECTED" />)
    expect(screen.getByText(/rejected/i)).toBeInTheDocument()
  })

  it("renders Rejected for MAX_REVISIONS_REACHED", () => {
    render(<StatusBadge status="MAX_REVISIONS_REACHED" />)
    expect(screen.getByText(/rejected/i)).toBeInTheDocument()
  })

  it("does not show Override badge for APPROVED_WITH_WARNING", () => {
    render(<StatusBadge status="APPROVED_WITH_WARNING" />)
    expect(screen.queryByText(/override/i)).not.toBeInTheDocument()
  })
})
