"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/vellum/sidebar"
import { MetricBar } from "@/components/vellum/metric-bar"
import { GovernanceReport } from "@/components/vellum/governance-report"
import { cn } from "@/lib/utils"
import {
  type Message,
  type SidebarSettings,
  DEFAULT_SETTINGS,
  parseViolations,
  buildBrief,
} from "@/lib/types"

// ── Storage keys ──────────────────────────────────────────────────────────────
const STORAGE_MESSAGES = "vellum_messages"
const STORAGE_SESSION  = "vellum_session_id"

// ── App ───────────────────────────────────────────────────────────────────────
export default function VellumApp() {
  const [messages, setMessages]       = useState<Message[]>([])
  const [sessionId, setSessionId]     = useState("")
  const [input, setInput]             = useState("")
  const [isLoading, setIsLoading]     = useState(false)
  const [loadingMsg, setLoadingMsg]   = useState("Architect & Critic are debating…")
  const [lastStatus, setLastStatus]   = useState<string | null>(null)
  const [lastRevisions, setLastRevs]  = useState<number | null>(null)
  const [settings, setSettings]       = useState<SidebarSettings>(DEFAULT_SETTINGS)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MESSAGES)
      if (saved) setMessages(JSON.parse(saved))
    } catch { /* corrupted — start fresh */ }
    const sid = localStorage.getItem(STORAGE_SESSION)
    if (sid) {
      setSessionId(sid)
    } else {
      const id = Math.random().toString(36).slice(2, 10)
      setSessionId(id)
      localStorage.setItem(STORAGE_SESSION, id)
    }
  }, [])

  // Persist messages
  useEffect(() => {
    if (messages.length > 0)
      localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages))
  }, [messages])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isLoading])

  const patchSettings = useCallback((patch: Partial<SidebarSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleReset = useCallback(() => {
    const id = Math.random().toString(36).slice(2, 10)
    setMessages([])
    setLastStatus(null)
    setLastRevs(null)
    setSessionId(id)
    localStorage.removeItem(STORAGE_MESSAGES)
    localStorage.setItem(STORAGE_SESSION, id)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return
    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setLoadingMsg("Fetching design rules…")

    try {
      const fd = new FormData()
      fd.append("user_input", userMessage)
      fd.append("client_brief", buildBrief(settings))
      fd.append("session_id", sessionId)
      fd.append("platform", settings.platform)
      fd.append("override_intent", settings.overrideIntent)

      const res = await fetch("http://localhost:8000/interrogate", { method: "POST", body: fd })

      if (!res.body) throw new Error("No response body")
      if (res.status === 503) {
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Ollama is not reachable. Make sure it's running and `llama3.2` is loaded." }])
        return
      }

      // ── Consume SSE stream ──────────────────────────────────────────────
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const event = JSON.parse(line.slice(6))

            if (event.type === "progress") {
              setLoadingMsg(event.message ?? "Debating…")
            } else if (event.type === "result") {
              const { p0, p1, ov } = parseViolations(event.critic_feedback || "")
              setLastStatus(event.status)
              setLastRevs(event.revisions)
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: event.vellum_response || "No response.",
                  gov: { status: event.status, revisions: event.revisions, maxRevisions: settings.maxRevisions, p0, p1, ov },
                },
              ])
            } else if (event.type === "error") {
              setMessages((prev) => [...prev, { role: "assistant", content: `⚠️ Engine error: ${event.message}` }])
            }
          } catch { /* malformed SSE line — skip */ }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Cannot reach the backend. Run: `uvicorn api.app:app --reload`" }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, settings, sessionId])

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background font-sans overflow-hidden">

        <Sidebar
          settings={settings}
          sessionId={sessionId}
          onChange={patchSettings}
          onReset={handleReset}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          <MetricBar
            revisions={lastRevisions}
            maxRevisions={settings.maxRevisions}
            status={lastStatus}
            platform={settings.platform}
          />

          {/* Chat */}
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
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                {msg.role === "user" ? (
                  <div
                    className="max-w-[72%] rounded-[15px] rounded-br-[4px] px-4 py-3 text-sm text-white"
                    style={{ background: "linear-gradient(135deg, #6c63ff 0%, #7c75ff 100%)", boxShadow: "0 2px 8px rgba(108,99,255,0.28)" }}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div
                    className="w-full max-w-[82%] rounded-[15px] rounded-bl-[4px] border border-border bg-card px-5 py-4"
                    style={{ boxShadow: "0 1px 3px rgba(38,37,30,0.05), 0 4px 16px rgba(38,37,30,0.07)" }}
                  >
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{msg.content}</pre>
                    {msg.gov && <GovernanceReport gov={msg.gov} />}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-[15px] rounded-bl-[4px] border border-border bg-card px-5 py-4" style={{ boxShadow: "0 1px 3px rgba(38,37,30,0.05), 0 4px 16px rgba(38,37,30,0.07)" }}>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-[#6c63ff]" />
                    {loadingMsg}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
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
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="rounded-full w-8 h-8 flex-shrink-0 border-0 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #6c63ff, #7c75ff)" }}
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              </Button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-2">
              Press <kbd className="font-mono bg-muted border border-border px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send
            </p>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
