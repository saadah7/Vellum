"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Send, AlertCircle } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TopBar } from "@/components/vellum/top-bar"
import { EmptyState } from "@/components/vellum/empty-state"
import { DebateStatus, type Phase } from "@/components/vellum/debate-status"
import { QualityReport } from "@/components/vellum/quality-report"
import { Markdown } from "@/components/vellum/markdown"
import { cn } from "@/lib/utils"
import {
  type Message,
  type Settings,
  DEFAULT_SETTINGS,
  parseReport,
  buildBrief,
} from "@/lib/types"

const STORAGE_MESSAGES = "vellum_messages"
const STORAGE_SESSION  = "vellum_session_id"

export default function VellumApp() {
  const [messages, setMessages]       = useState<Message[]>([])
  const [sessionId, setSessionId]     = useState("")
  const [input, setInput]             = useState("")
  const [isLoading, setIsLoading]     = useState(false)
  const [phase, setPhase]             = useState<Phase>("idle")
  const [phaseMsg, setPhaseMsg]       = useState("Warming up")
  const [currentRound, setCurrentRound] = useState(1)
  const [warning, setWarning]         = useState<string | null>(null)
  const [settings, setSettings]       = useState<Settings>(DEFAULT_SETTINGS)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Restore from localStorage
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
  }, [messages, isLoading, phase])

  const patchSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleReset = useCallback(() => {
    const id = Math.random().toString(36).slice(2, 10)
    setMessages([])
    setWarning(null)
    setPhase("idle")
    setSessionId(id)
    localStorage.removeItem(STORAGE_MESSAGES)
    localStorage.setItem(STORAGE_SESSION, id)
  }, [])

  const submit = useCallback(async (rawText: string) => {
    const text = rawText.trim()
    if (!text || isLoading) return

    setInput("")
    setWarning(null)
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setIsLoading(true)
    setPhase("writer")
    setCurrentRound(1)
    setPhaseMsg("Fetching relevant design rules…")

    try {
      const fd = new FormData()
      fd.append("user_input", text)
      fd.append("client_brief", buildBrief(settings))
      fd.append("session_id", sessionId)
      fd.append("platform", settings.platform)
      fd.append("override_intent", settings.ruleBreakReason)
      fd.append("max_revisions", String(settings.maxRounds))

      const res = await fetch("http://localhost:8000/interrogate", { method: "POST", body: fd })

      if (res.status === 503 || !res.ok) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content:
            "I can't reach Ollama right now. Open a terminal and run:\n\n" +
            "    ollama serve\n\n" +
            "Then make sure the model is loaded:\n\n" +
            "    ollama pull llama3.2",
        }])
        return
      }

      if (!res.body) throw new Error("No response body")

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

            if (event.type === "warning") {
              setWarning(event.message ?? null)
            } else if (event.type === "progress") {
              if (event.phase === "architect") {
                setPhase("writer")
                setCurrentRound(event.revision ?? 1)
                setPhaseMsg(`Drafting an answer (round ${event.revision ?? 1})`)
              } else if (event.phase === "critic") {
                setPhase("reviewer")
                setPhaseMsg("Grading against design rules")
              } else {
                setPhaseMsg(event.message ?? "Working")
              }
            } else if (event.type === "result") {
              const parsed = parseReport(event.critic_feedback || "")
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: event.vellum_response || "No response.",
                  report: {
                    status:     event.status,
                    rounds:     event.revisions,
                    maxRounds:  settings.maxRounds,
                    critical:   parsed.critical,
                    warnings:   parsed.warnings,
                    exceptions: parsed.exceptions,
                  },
                },
              ])
            } else if (event.type === "error") {
              setMessages((prev) => [...prev, {
                role: "assistant",
                content: `Something went wrong: ${event.message}`,
              }])
            }
          } catch (parseErr) {
            console.error("Bad SSE line:", line, parseErr)
          }
        }
      }
    } catch (err) {
      console.error("Request failed:", err)
      setMessages((prev) => [...prev, {
        role: "assistant",
        content:
          "I can't reach the backend. Open a terminal and run:\n\n" +
          "    uvicorn api.app:app --reload",
      }])
    } finally {
      setIsLoading(false)
      setPhase("idle")
    }
  }, [isLoading, settings, sessionId])

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-background font-sans overflow-hidden">

        <TopBar settings={settings} onChange={patchSettings} onReset={handleReset} />

        {warning && (
          <div className="flex items-start gap-2 px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span className="font-mono">{warning}</span>
          </div>
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-5 py-6 space-y-5">

              {messages.length === 0 && !isLoading && (
                <EmptyState onPick={(p) => submit(p)} />
              )}

              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "user" ? (
                    <div
                      className="max-w-[78%] rounded-[18px] rounded-br-[4px] px-4 py-2.5 text-sm text-white animate-in fade-in slide-in-from-right-2 duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-from) 0%, var(--brand-via) 60%, var(--brand-to) 100%)",
                        boxShadow:
                          "0 0 0 1px rgba(139,127,255,0.4), 0 8px 24px rgba(139,127,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
                      }}
                    >
                      {msg.content}
                    </div>
                  ) : (
                    <div className="vellum-card w-full max-w-[92%] rounded-[16px] rounded-bl-[4px] px-5 py-4 animate-in fade-in slide-in-from-left-2 duration-200">
                      <Markdown>{msg.content}</Markdown>
                      {msg.report && <QualityReport report={msg.report} />}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <DebateStatus
                  phase={phase === "idle" ? "writer" : phase}
                  round={currentRound}
                  maxRounds={settings.maxRounds}
                  message={phaseMsg}
                />
              )}

            </div>
          </div>

          {/* Input */}
          <div className="px-6 pb-5 pt-3 border-t border-border/80 bg-background/60 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2.5 transition-all focus-within:border-[color:var(--brand-via)]/50 focus-within:shadow-[0_0_0_4px_rgba(139,127,255,0.1)]"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-raised)",
                }}
              >
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                  placeholder="Describe a design decision — a button, a layout, a color choice…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      submit(input)
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  className="rounded-full w-8 h-8 flex-shrink-0 border-0 disabled:opacity-40 transition-transform hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand-from), var(--brand-via), var(--brand-to))",
                    boxShadow: "var(--shadow-brand)",
                  }}
                  onClick={() => submit(input)}
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin text-background" />
                    : <Send className="w-3.5 h-3.5 text-background" />}
                </Button>
              </div>
              <p className="text-center text-[10px] font-mono tracking-wider uppercase text-muted-foreground mt-2">
                Every answer is graded · Stays on your laptop
              </p>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}
