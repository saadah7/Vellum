"use client"

import { cn } from "@/lib/utils"
import { StatusBadge } from "./status-badge"

function MetricPill({
  label,
  value,
  mono,
  children,
}: {
  label: string
  value?: string
  mono?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
        {label}
      </span>
      {children ?? (
        <span className={cn("text-sm font-semibold text-foreground", mono && "font-mono")}>
          {value}
        </span>
      )}
    </div>
  )
}

export function MetricBar({
  revisions,
  maxRevisions,
  status,
  platform,
}: {
  revisions: number | null
  maxRevisions: number
  status: string | null
  platform: string
}) {
  return (
    <div className="flex items-center gap-5 px-6 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
      <MetricPill
        label="Revisions"
        value={revisions !== null ? `${revisions} / ${maxRevisions}` : "— / —"}
      />
      <div className="w-px h-4 bg-border" />
      <MetricPill label="Status">
        <StatusBadge status={status} />
      </MetricPill>
      <div className="w-px h-4 bg-border" />
      <MetricPill label="Platform" value={platform.toUpperCase()} mono />
    </div>
  )
}
