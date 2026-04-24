"use client"

import { PenLine, ScanSearch } from "lucide-react"
import { cn } from "@/lib/utils"

export type Phase = "idle" | "writer" | "reviewer"

interface DebateStatusProps {
  phase: Phase
  round: number
  maxRounds: number
  message: string
}

export function DebateStatus({ phase, round, maxRounds, message }: DebateStatusProps) {
  return (
    <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex gap-2">
        <Avatar
          Icon={PenLine}
          label="Writer"
          active={phase === "writer"}
          color="#6c63ff"
        />
        <Avatar
          Icon={ScanSearch}
          label="Reviewer"
          active={phase === "reviewer"}
          color="#a78bfa"
        />
      </div>

      <div className="vellum-card flex-1 rounded-[16px] px-5 py-3.5">
        <div className="flex items-center justify-between gap-3 mb-1.5">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            {phase === "writer"   ? "Writer is drafting" :
             phase === "reviewer" ? "Reviewer is grading" :
                                    "Thinking"}
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">
            Round {round} / {maxRounds}
          </span>
        </div>
        <p className="text-sm text-foreground">
          {message}
          <span className="inline-block w-1 h-3 ml-0.5 bg-[#6c63ff] animate-pulse" />
        </p>
      </div>
    </div>
  )
}

function Avatar({
  Icon, label, active, color,
}: {
  Icon: typeof PenLine
  label: string
  active: boolean
  color: string
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
          active ? "scale-105 shadow-lg" : "scale-100 opacity-40"
        )}
        style={{
          background: active
            ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
            : "var(--muted)",
          boxShadow: active ? `0 0 0 3px ${color}22` : undefined,
        }}
      >
        <Icon className={cn("w-4 h-4", active ? "text-white" : "text-muted-foreground")} />
        {active && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: color, opacity: 0.25 }}
          />
        )}
      </div>
      <span className={cn(
        "text-[9px] font-bold tracking-widest uppercase",
        active ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  )
}
