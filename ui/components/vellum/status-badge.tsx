"use client"

import { CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react"

export function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-sm text-muted-foreground">Idle</span>
  const s = status.toUpperCase()

  if (s.includes("APPROVED_WITH_OVERRIDE"))
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0d9488]">
        <Sparkles className="w-3.5 h-3.5" /> Approved with Override
      </span>
    )
  if (s.includes("APPROVED_WITH"))
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#d97706]">
        <AlertTriangle className="w-3.5 h-3.5" /> Approved with Warnings
      </span>
    )
  if (s.includes("APPROVED"))
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16a34a]">
        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
      </span>
    )
  if (s.includes("REJECTED") || s.includes("MAX_REVISIONS"))
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#dc2626]">
        <XCircle className="w-3.5 h-3.5" /> Rejected
      </span>
    )
  return <span className="text-sm text-muted-foreground">{status}</span>
}
