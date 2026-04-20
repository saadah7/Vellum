"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RotateCcw, Info } from "lucide-react"
import { StepCard, ToggleRow } from "./step-card"
import type { SidebarSettings } from "@/lib/types"

interface SidebarProps {
  settings: SidebarSettings
  sessionId: string
  onChange: (patch: Partial<SidebarSettings>) => void
  onReset: () => void
}

export function Sidebar({ settings: s, sessionId, onChange, onReset }: SidebarProps) {
  return (
    <TooltipProvider>
      <aside className="w-[288px] flex-shrink-0 border-r border-border bg-[#f8f8f4] flex flex-col">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <p
            className="text-[22px] font-extrabold tracking-tight leading-none"
            style={{
              background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VELLUM
          </p>
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">
            Design Governance Engine
          </p>
        </div>

        {/* Settings */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          <StepCard title="Project">
            <div className="space-y-2">
              <Input
                placeholder="Client name"
                value={s.clientName}
                onChange={(e) => onChange({ clientName: e.target.value })}
                className="rounded-full h-8 text-sm px-4"
              />
              <Select value={s.industry} onValueChange={(v) => v && onChange({ industry: v })}>
                <SelectTrigger className="h-8 text-sm rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Tech","Finance","Healthcare","Legal","Luxury","Gaming","Education","Creative","E-commerce","Government"]
                    .map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </StepCard>

          <StepCard title="Platform">
            <div className="space-y-2">
              <Select value={s.platform} onValueChange={(v) => v && onChange({ platform: v })}>
                <SelectTrigger className="h-8 text-sm rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["web","android","ios","cross-platform","macos","watch"]
                    .map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={s.windowClass} onValueChange={(v) => v && onChange({ windowClass: v })}>
                <SelectTrigger className="h-8 text-sm rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["compact (0–599dp)","medium (600–839dp)","expanded (840dp+)"]
                    .map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={s.colorMode} onValueChange={(v) => v && onChange({ colorMode: v })}>
                <SelectTrigger className="h-8 text-sm rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Light","Dark","System"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </StepCard>

          <StepCard title="Typography">
            <Select value={s.typography} onValueChange={(v) => v && onChange({ typography: v })}>
              <SelectTrigger className="h-8 text-sm rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Material 3","Apple HIG","Custom"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </StepCard>

          <StepCard title="Brand">
            <Textarea
              placeholder={"Primary: #6C63FF\nTone: Minimalist\nTypeface: Inter"}
              value={s.brandReqs}
              onChange={(e) => onChange({ brandReqs: e.target.value })}
              className="text-sm min-h-[80px] resize-none rounded-[12px]"
            />
          </StepCard>

          <StepCard title="Governance">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Max Revisions</span>
                  <span className="text-xs font-mono font-semibold">{s.maxRevisions}</span>
                </div>
                <input
                  type="range" min={1} max={5} value={s.maxRevisions}
                  onChange={(e) => onChange({ maxRevisions: Number(e.target.value) })}
                  className="w-full accent-[#6c63ff] cursor-pointer"
                />
              </div>
              <ToggleRow
                label="Strict Token Mode" hint="Reject raw hex values"
                value={s.strictToken} onChange={(v) => onChange({ strictToken: v })}
              />
              <ToggleRow
                label="RAMS Audit (Gate 8)" hint="Dieter Rams P1 warnings"
                value={s.ramsAudit} onChange={(v) => onChange({ ramsAudit: v })}
              />
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="text-xs text-muted-foreground">Override Intent</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px] text-xs">
                      Declare why you&apos;re intentionally breaking a rule. The Critic evaluates your reasoning.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  placeholder="e.g., Pure black for print-first editorial layout."
                  value={s.overrideIntent}
                  onChange={(e) => onChange({ overrideIntent: e.target.value })}
                  className="text-xs min-h-[64px] resize-none rounded-[12px]"
                />
              </div>
            </div>
          </StepCard>

          <StepCard title="Session">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full rounded-full text-xs h-8" onClick={onReset}>
                <RotateCcw className="w-3 h-3 mr-1.5" /> New Session
              </Button>
              <p className="text-center text-[10px] font-mono text-muted-foreground bg-muted rounded-full py-1.5 px-3 border border-border">
                ID: {sessionId}
              </p>
            </div>
          </StepCard>
        </div>
      </aside>
    </TooltipProvider>
  )
}
