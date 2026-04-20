"use client"

import { StatusBadge } from "./status-badge"
import type { GovData } from "@/lib/types"

export function GovernanceReport({ gov }: { gov: GovData }) {
  const hasChips = gov.p0.length || gov.p1.length || gov.ov.length
  return (
    <div
      className="mt-4 rounded-[15px] border border-border bg-[#fafaf7] p-4"
      style={{ boxShadow: "0 1px 3px rgba(38,37,30,0.04), 0 4px 12px rgba(38,37,30,0.06)" }}
    >
      <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
        Governance Report
      </p>
      <div className="flex items-center justify-between mb-3">
        <StatusBadge status={gov.status} />
        <span className="text-xs font-mono text-muted-foreground">
          {gov.revisions} / {gov.maxRevisions} rev
        </span>
      </div>
      {hasChips ? (
        <div className="flex flex-wrap gap-1.5">
          {gov.p0.map((c, i) => (
            <span
              key={i}
              className="inline-block rounded-md px-2.5 py-1 text-[11px] font-mono"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#dc2626",
              }}
            >
              P0: {c}
            </span>
          ))}
          {gov.p1.map((c, i) => (
            <span
              key={i}
              className="inline-block rounded-md px-2.5 py-1 text-[11px] font-mono"
              style={{
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.25)",
                color: "#d97706",
              }}
            >
              P1: {c}
            </span>
          ))}
          {gov.ov.map((c, i) => (
            <span
              key={i}
              className="inline-block rounded-md px-2.5 py-1 text-[11px] font-mono"
              style={{
                background: "rgba(13,148,136,0.08)",
                border: "1px solid rgba(13,148,136,0.25)",
                color: "#0d9488",
              }}
            >
              ◈ {c}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No violations flagged.</p>
      )}
    </div>
  )
}
