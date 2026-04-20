"use client"

import { cn } from "@/lib/utils"

export function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[20px] border border-border bg-card overflow-hidden"
      style={{
        boxShadow:
          "0 1px 2px rgba(38,37,30,0.04), 0 4px 12px rgba(38,37,30,0.06), 0 12px 24px rgba(38,37,30,0.03)",
      }}
    >
      <div className="px-4 py-2.5 border-b border-border bg-muted/60">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  )
}

export function ToggleRow({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
  hint?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-foreground truncate">{label}</p>
        {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex w-9 h-5 flex-shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value ? "bg-[#6c63ff]" : "bg-muted border border-border"
        )}
      >
        <span
          className={cn(
            "inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 mt-[3px]",
            value ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </button>
    </div>
  )
}
