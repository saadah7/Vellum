"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RotateCcw, SlidersHorizontal, Monitor, Smartphone, Tablet } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Settings } from "@/lib/types"

type Health = { ollama: boolean; rag: boolean; ready: boolean; rag_docs: number } | null

interface TopBarProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onReset: () => void
}

const PLATFORMS: { id: Settings["platform"]; label: string; Icon: typeof Monitor }[] = [
  { id: "web",     label: "Web",     Icon: Monitor },
  { id: "ios",     label: "iOS",     Icon: Smartphone },
  { id: "android", label: "Android", Icon: Tablet },
]

export function TopBar({ settings: s, onChange, onReset }: TopBarProps) {
  const [health, setHealth] = useState<Health>(null)

  useEffect(() => {
    let mounted = true
    const tick = async () => {
      try {
        const res = await fetch("http://localhost:8000/health")
        const data = await res.json()
        if (mounted) setHealth(data)
      } catch {
        if (mounted) setHealth({ ollama: false, rag: false, ready: false, rag_docs: 0 })
      }
    }
    tick()
    const id = setInterval(tick, 15_000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  const dotColor =
    health === null   ? "bg-muted-foreground/40"
    : health.ready    ? "bg-emerald-400"
    : health.ollama   ? "bg-amber-400"
                      : "bg-rose-400"

  const healthLabel =
    health === null          ? "Checking…"
    : health.ready           ? "All systems ready"
    : !health.ollama         ? "Ollama not reachable — run: ollama serve"
    : !health.rag            ? "Design rule library empty — run ingest script"
                             : "Unknown"

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-3 border-b border-border/80 bg-background/60 backdrop-blur-xl sticky top-0 z-20">
      {/* Left: logo + status */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-baseline gap-2.5 select-none">
          <span className="vellum-brand text-[22px] font-extrabold tracking-tight leading-none">
            Vellum
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground hidden sm:inline font-mono">
            Design Reviewer
          </span>
        </div>

        <div className="w-px h-4 bg-border hidden sm:block" />

        <Tooltip>
          <TooltipTrigger
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Connection status"
          >
            <span className={cn("relative w-1.5 h-1.5 rounded-full", dotColor)}>
              {health?.ready && (
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              )}
            </span>
            <span className="hidden sm:inline">
              {health === null ? "sync" : health.ready ? "online" : "issue"}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">{healthLabel}</TooltipContent>
        </Tooltip>
      </div>

      {/* Center: platform segmented control */}
      <div className="inline-flex items-center rounded-full border border-border bg-card/60 p-0.5 backdrop-blur">
        {PLATFORMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onChange({ platform: id })}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide transition-all duration-200",
              s.platform === id
                ? "bg-foreground text-background shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Right: Advanced + Reset */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger render={<Button variant="outline" size="sm" className="h-8 rounded-full text-[11px] tracking-wide gap-1.5 bg-card/60 backdrop-blur hover:bg-card" />}>
            <SlidersHorizontal className="w-3 h-3" />
            Advanced
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-80">
            <div className="space-y-4 py-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium">Review rounds</label>
                  <span className="text-xs font-mono text-[color:var(--brand-via)]">{s.maxRounds}</span>
                </div>
                <input
                  type="range" min={1} max={5} value={s.maxRounds}
                  onChange={(e) => onChange({ maxRounds: Number(e.target.value) })}
                  className="w-full accent-[color:var(--brand-via)] cursor-pointer"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  How many times the Reviewer can send work back to the Writer before stopping.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Project details</label>
                <Input
                  placeholder="Client name (optional)"
                  value={s.clientName}
                  onChange={(e) => onChange({ clientName: e.target.value })}
                  className="h-8 text-xs"
                />
                <Select value={s.industry} onValueChange={(v) => v && onChange({ industry: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Tech","Finance","Healthcare","Legal","Luxury","Gaming","Education","Creative","E-commerce","Government"]
                      .map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select
                  value={s.typography}
                  onValueChange={(v) => v && onChange({ typography: v as Settings["typography"] })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Material 3","Apple HIG","Custom"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Brand notes — primary color, tone, typeface…"
                  value={s.brandNotes}
                  onChange={(e) => onChange({ brandNotes: e.target.value })}
                  className="text-xs min-h-[60px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium">Strictness</label>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs">Reject made-up colors</p>
                    <p className="text-[10px] text-muted-foreground">No raw hex — use design tokens</p>
                  </div>
                  <Switch
                    checked={s.rejectMadeUpColors}
                    onCheckedChange={(v) => onChange({ rejectMadeUpColors: v })}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs">Check design smell</p>
                    <p className="text-[10px] text-muted-foreground">Apply Dieter Rams&apos; 10 principles</p>
                  </div>
                  <Switch
                    checked={s.checkDesignSmell}
                    onCheckedChange={(v) => onChange({ checkDesignSmell: v })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Why I&apos;m breaking a rule</label>
                <p className="text-[10px] text-muted-foreground mt-0.5 mb-1.5">
                  Declare an intentional exception. The Reviewer grades your reasoning.
                </p>
                <Textarea
                  placeholder="e.g. Pure black for print-first editorial layout."
                  value={s.ruleBreakReason}
                  onChange={(e) => onChange({ ruleBreakReason: e.target.value })}
                  className="text-xs min-h-[52px] resize-none"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-card" onClick={onReset} />}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </TooltipTrigger>
          <TooltipContent side="bottom">New chat</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
