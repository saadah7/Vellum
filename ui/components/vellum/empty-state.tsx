"use client"

import { Sparkles, ShieldCheck, Lock, ArrowUpRight } from "lucide-react"
import { EXAMPLE_PROMPTS } from "@/lib/types"

interface EmptyStateProps {
  onPick: (prompt: string) => void
}

export function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center min-h-full py-16 px-4 animate-in fade-in duration-500">
      <div className="max-w-3xl w-full text-center">

        {/* PRODUCT pill — composio-style accent above hero */}
        <div className="flex items-center justify-center mb-8">
          <span className="vellum-pill-brand">
            <span className="w-1 h-1 rounded-full bg-[color:var(--brand-via)]" />
            Design Reviewer · v1.0
          </span>
        </div>

        {/* Wordmark */}
        <p className="vellum-brand text-[88px] leading-[0.95] font-extrabold tracking-[-0.03em] mb-6 inline-block">
          Vellum
        </p>

        {/* Tagline — large display */}
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground leading-tight mb-4 max-w-2xl mx-auto">
          AI design reviewer that <span className="italic text-[color:var(--brand-via)]">checks its own work.</span>
        </h1>

        {/* Explainer */}
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
          Ask a design question. Two AI designers tackle it — one writes the answer, the other
          grades it against <span className="font-semibold text-foreground">263 design rules</span>{" "}
          from Apple, Google, and accessibility standards. You get the answer plus a report
          card showing what&apos;s solid and what&apos;s risky.
        </p>

        {/* Trust pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          <span className="vellum-pill">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Every answer graded
          </span>
          <span className="vellum-pill">
            <Sparkles className="w-3.5 h-3.5 text-[color:var(--brand-via)]" />
            Cites the source rule
          </span>
          <span className="vellum-pill">
            <Lock className="w-3.5 h-3.5 text-sky-400" />
            100% on-device
          </span>
        </div>

        {/* Fading rule */}
        <div className="vellum-rule mb-6" />

        {/* "Try one of these" label */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            Try one of these
          </span>
        </div>

        {/* Example prompts */}
        <div className="grid sm:grid-cols-2 gap-3 text-left">
          {EXAMPLE_PROMPTS.map((ex, i) => (
            <button
              key={i}
              onClick={() => onPick(ex.prompt)}
              className="vellum-card group p-5 rounded-[16px] flex flex-col gap-1 hover:-translate-y-0.5"
              style={{
                animation: `vellum-fade-up 500ms ease ${i * 80}ms both`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground group-hover:text-[color:var(--brand-via)] transition-colors">
                  {ex.hint}
                </p>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-[color:var(--brand-via)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[15px] font-medium text-foreground leading-snug">
                {ex.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
