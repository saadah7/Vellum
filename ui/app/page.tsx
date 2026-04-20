"use client"

import { useState, useRef, useEffect, useCallback } from "react"
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
import {
  Send,
  RotateCcw,
  Info,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────────
interface GovData {
  status: string
  revisions: number
  maxRevisions: number
  p0: string[]
  p1: string[]
  ov: string[]
}

interface Message {
  role: "user" | "assistant"
  content: string
  gov?: GovData
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function parseViolations(text: string) {
  const p0 = [...text.matchAll(/\[P0:\s*([^\]]+)\]/gi)].map((m) => m[1].trim())
  const p1 = [...text.matchAll(/\[P1:\s*([^\]]+)\]/gi)].map((m) => m[1].trim())
  const ov = [...text.matchAll(/\[OVERRIDE:\s*([^\]]+)\]/gi)].map((m) => m[1].trim())
  return { p0, p1, ov }
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string | null }) {
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

// ── Governance Report ─────────────────────────────────────────────────────────
function GovernanceReport({ gov }: { gov: GovData }) {
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

// ── Step Card (webplow-style) ─────────────────────────────────────────────────
function StepCard({ title, children }: { title: string; children: React.ReactNode }) {
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

// ── Toggle Row ────────────────────────────────────────────────────────────────
function ToggleRow({
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

// ── Metric Pill ───────────────────────────────────────────────────────────────
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

// ── Main App ──────────────────────────────────────────────────────────────────
export default function VellumApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState("")
  useEffect(() => {
    setSessionId(Math.random().toString(36).slice(2, 10))
  }, [])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastStatus, setLastStatus] = useState<string | null>(null)
  const [lastRevisions, setLastRevisions] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Settings
  const [clientName, setClientName] = useState("")
  const [industry, setIndustry] = useState("Tech")
  const [platform, setPlatform] = useState("web")
  const [windowClass, setWindowClass] = useState("expanded (840dp+)")
  const [colorMode, setColorMode] = useState("Light")
  const [typography, setTypography] = useState("Material 3")
  const [brandReqs, setBrandReqs] = useState("")
  const [maxRevisions, setMaxRevisions] = useState(3)
  const [strictToken, setStrictToken] = useState(true)
  const [ramsAudit, setRamsAudit] = useState(true)
  const [overrideIntent, setOverrideIntent] = useState("")

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const fullBrief = [
    `Client: ${clientName}`,
    `Industry: ${industry}`,
    `Platform: ${platform}`,
    `Window Class: ${windowClass}`,
    `Color Mode: ${colorMode}`,
    `Typography Scale: ${typography}`,
    `Brand Constraints: ${brandReqs}`,
    `Max Revisions: ${maxRevisions}`,
    `Strict Token Mode: ${strictToken}`,
    `RAMS Audit: ${ramsAudit}`,
  ].join("\n")

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const fd = new FormData()
      fd.append("user_input", userMessage)
      fd.append("client_brief", fullBrief)
      fd.append("session_id", sessionId)
      fd.append("platform", platform)
      fd.append("override_intent", overrideIntent)

      const res = await fetch("http://localhost:8000/interrogate", {
        method: "POST",
        body: fd,
      })

      if (res.ok) {
        const data = await res.json()
        const { p0, p1, ov } = parseViolations(data.critic_feedback || "")
        const gov: GovData = {
          status: data.status,
          revisions: data.revisions,
          maxRevisions,
          p0,
          p1,
          ov,
        }
        setLastStatus(data.status)
        setLastRevisions(data.revisions)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.vellum_response || "No response.", gov },
        ])
      } else if (res.status === 503) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ Ollama is not reachable. Make sure it's running and `llama3.2` is loaded (`ollama run llama3.2`).",
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Backend error ${res.status}. Check that the FastAPI server is running.`,
          },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚠️ Cannot reach the backend. Run: `uvicorn server.app:app --reload`",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, fullBrief, sessionId, platform, overrideIntent, maxRevisions])

  const handleReset = () => {
    setMessages([])
    setLastStatus(null)
    setLastRevisions(null)
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background font-sans overflow-hidden">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
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

          {/* Settings scroll */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

            <StepCard title="Project">
              <div className="space-y-2">
                <Input
                  placeholder="Client name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="rounded-full h-8 text-sm px-4"
                />
                <Select value={industry} onValueChange={(v) => v && setIndustry(v)}>
                  <SelectTrigger className="h-8 text-sm rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Tech","Finance","Healthcare","Legal","Luxury",
                      "Gaming","Education","Creative","E-commerce","Government",
                    ].map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </StepCard>

            <StepCard title="Platform">
              <div className="space-y-2">
                <Select value={platform} onValueChange={(v) => v && setPlatform(v)}>
                  <SelectTrigger className="h-8 text-sm rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["web","android","ios","cross-platform","macos","watch"].map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={windowClass} onValueChange={(v) => v && setWindowClass(v)}>
                  <SelectTrigger className="h-8 text-sm rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "compact (0–599dp)",
                      "medium (600–839dp)",
                      "expanded (840dp+)",
                    ].map((w) => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={colorMode} onValueChange={(v) => v && setColorMode(v)}>
                  <SelectTrigger className="h-8 text-sm rounded-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Light","Dark","System"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </StepCard>

            <StepCard title="Typography">
              <Select value={typography} onValueChange={(v) => v && setTypography(v)}>
                <SelectTrigger className="h-8 text-sm rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Material 3","Apple HIG","Custom"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </StepCard>

            <StepCard title="Brand">
              <Textarea
                placeholder={"Primary: #6C63FF\nTone: Minimalist\nTypeface: Inter"}
                value={brandReqs}
                onChange={(e) => setBrandReqs(e.target.value)}
                className="text-sm min-h-[80px] resize-none rounded-[12px]"
              />
            </StepCard>

            <StepCard title="Governance">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">Max Revisions</span>
                    <span className="text-xs font-mono font-semibold">{maxRevisions}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={maxRevisions}
                    onChange={(e) => setMaxRevisions(Number(e.target.value))}
                    className="w-full accent-[#6c63ff] cursor-pointer"
                  />
                </div>
                <ToggleRow
                  label="Strict Token Mode"
                  value={strictToken}
                  onChange={setStrictToken}
                  hint="Reject raw hex values"
                />
                <ToggleRow
                  label="RAMS Audit (Gate 8)"
                  value={ramsAudit}
                  onChange={setRamsAudit}
                  hint="Dieter Rams P1 warnings"
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
                    value={overrideIntent}
                    onChange={(e) => setOverrideIntent(e.target.value)}
                    className="text-xs min-h-[64px] resize-none rounded-[12px]"
                  />
                </div>
              </div>
            </StepCard>

            <StepCard title="Session">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full text-xs h-8"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-3 h-3 mr-1.5" />
                  New Session
                </Button>
                <p className="text-center text-[10px] font-mono text-muted-foreground bg-muted rounded-full py-1.5 px-3 border border-border">
                  ID: {sessionId}
                </p>
              </div>
            </StepCard>

          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Metric bar */}
          <div className="flex items-center gap-5 px-6 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
            <MetricPill
              label="Revisions"
              value={lastRevisions !== null ? `${lastRevisions} / ${maxRevisions}` : "— / —"}
            />
            <div className="w-px h-4 bg-border" />
            <MetricPill label="Status">
              <StatusBadge status={lastStatus} />
            </MetricPill>
            <div className="w-px h-4 bg-border" />
            <MetricPill label="Platform" value={platform.toUpperCase()} mono />
          </div>

          {/* Chat scroll */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center select-none">
                <p
                  className="text-5xl font-extrabold tracking-tight mb-3 leading-none"
                  style={{
                    background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  VELLUM
                </p>
                <p className="text-sm text-muted-foreground max-w-[360px] leading-relaxed">
                  Describe a UI layout, component, or design decision.
                  Vellum audits it against WCAG 2.1, Material 3, and your client brief.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                {msg.role === "user" ? (
                  <div
                    className="max-w-[72%] rounded-[15px] rounded-br-[4px] px-4 py-3 text-sm text-white"
                    style={{
                      background: "linear-gradient(135deg, #6c63ff 0%, #7c75ff 100%)",
                      boxShadow: "0 2px 8px rgba(108,99,255,0.28)",
                    }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className="w-full max-w-[82%] rounded-[15px] rounded-bl-[4px] border border-border bg-card px-5 py-4"
                    style={{
                      boxShadow:
                        "0 1px 3px rgba(38,37,30,0.05), 0 4px 16px rgba(38,37,30,0.07)",
                    }}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                      {msg.content}
                    </pre>
                    {msg.gov && <GovernanceReport gov={msg.gov} />}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-[15px] rounded-bl-[4px] border border-border bg-card px-5 py-4"
                  style={{
                    boxShadow:
                      "0 1px 3px rgba(38,37,30,0.05), 0 4px 16px rgba(38,37,30,0.07)",
                  }}
                >
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-[#6c63ff]" />
                    Architect &amp; Critic are debating…
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pill input */}
          <div className="px-6 pb-6 pt-3 border-t border-border bg-background">
            <div
              className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2.5 transition-all focus-within:border-[#6c63ff]/60 focus-within:shadow-[0_0_0_3px_rgba(108,99,255,0.12)]"
              style={{ boxShadow: "0 2px 12px rgba(38,37,30,0.07)" }}
            >
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                placeholder="Describe a layout or ask Vellum to audit a design decision…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="rounded-full w-8 h-8 flex-shrink-0 border-0 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #6c63ff, #7c75ff)" }}
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              Press{" "}
              <kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded text-[10px]">
                Enter
              </kbd>{" "}
              to send
            </p>
          </div>

        </main>
      </div>
    </TooltipProvider>
  )
}
