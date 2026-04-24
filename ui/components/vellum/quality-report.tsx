"use client"

import { useState } from "react"
import { ChevronDown, CheckCircle2, AlertTriangle, XCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { QualityReport as Report } from "@/lib/types"

export function QualityReport({ report }: { report: Report }) {
  const [open, setOpen] = useState(false)
  const total = report.critical.length + report.warnings.length + report.exceptions.length

  return (
    <div
      className="mt-5 rounded-[12px] border border-border/80 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%), var(--card)",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <StatusChip status={report.status} />
          <span className="text-[11px] font-mono text-muted-foreground">
            {report.rounds} / {report.maxRounds} rounds
          </span>
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              {total} {total === 1 ? "note" : "notes"}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {report.critical.length > 0 && (
            <Section
              label="Critical issues"
              hint="Must fix before shipping"
              tooltip="Rules the Reviewer marked P0 — hard failures like WCAG contrast violations."
              items={report.critical}
              color="rose"
            />
          )}
          {report.warnings.length > 0 && (
            <Section
              label="Warnings"
              hint="Worth a second look"
              tooltip="Rules the Reviewer marked P1 — soft failures like unusual spacing."
              items={report.warnings}
              color="amber"
            />
          )}
          {report.exceptions.length > 0 && (
            <Section
              label="Intentional exceptions"
              hint="Rule breaks you declared upfront"
              tooltip="The Reviewer accepted these because you explained why in Advanced → Why I'm breaking a rule."
              items={report.exceptions}
              color="teal"
            />
          )}
          {total === 0 && (
            <p className="text-xs text-muted-foreground pt-1">
              No issues flagged. Every applicable rule passed.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function Section({
  label, hint, tooltip, items, color,
}: {
  label: string
  hint: string
  tooltip: string
  items: string[]
  color: "rose" | "amber" | "teal"
}) {
  const styles = {
    rose:  { bg: "rgba(248,113,113,0.10)", border: "rgba(248,113,113,0.30)", text: "#fca5a5" },
    amber: { bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.30)",  text: "#fcd34d" },
    teal:  { bg: "rgba(45,212,191,0.10)",  border: "rgba(45,212,191,0.30)",  text: "#5eead4" },
  }[color]

  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: styles.text }}>
          {label}
        </p>
        <Tooltip>
          <TooltipTrigger className="text-[10px] text-muted-foreground cursor-help">
            — {hint}
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[240px] text-[11px]">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((text, i) => (
          <span
            key={i}
            className="inline-block rounded-md px-2.5 py-1 text-[11px] font-mono animate-in fade-in zoom-in-95 duration-200"
            style={{
              animationDelay: `${i * 40}ms`,
              animationFillMode: "both",
              background: styles.bg,
              border: `1px solid ${styles.border}`,
              color: styles.text,
            }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

function StatusChip({ status }: { status: string | null }) {
  if (!status) return null
  const s = status.toUpperCase()

  const config =
    s.includes("APPROVED_WITH_OVERRIDE") ? { Icon: Sparkles,      text: "Approved (with exception)", color: "#5eead4" }
  : s.includes("APPROVED_WITH")          ? { Icon: AlertTriangle, text: "Approved (with warnings)",  color: "#fcd34d" }
  : s.includes("APPROVED")               ? { Icon: CheckCircle2,  text: "Approved",                  color: "#86efac" }
  :                                        { Icon: XCircle,       text: "Rejected — needs rework",   color: "#fca5a5" }

  const { Icon, text, color } = config
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold"
      style={{ color }}
    >
      <Icon className="w-3.5 h-3.5" />
      {text}
    </span>
  )
}
