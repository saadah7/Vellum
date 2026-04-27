"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function Markdown({ children }: { children: string }) {
  return (
    <div className="vellum-md text-sm leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2 first:mt-0 text-foreground">{children}</h2>,
          h3: ({ children }) => (
            <h3 className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mt-4 mb-1.5 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => <h4 className="text-sm font-semibold mt-3 mb-1 first:mt-0 text-foreground">{children}</h4>,
          p:  ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="mb-3 last:mb-0 space-y-1 pl-4 list-disc marker:text-muted-foreground/50">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 last:mb-0 space-y-1 pl-4 list-decimal marker:text-muted-foreground/50">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
          code: ({ className, children, ...props }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  className="rounded-md bg-[color:var(--brand-soft)] text-[color:var(--brand-via)] px-1.5 py-0.5 text-[0.85em] font-mono font-medium break-words"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return (
              <code className="block text-xs font-mono leading-relaxed text-foreground/90" {...props}>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="mb-3 last:mb-0 max-w-full overflow-x-auto rounded-lg bg-black/40 border border-border px-3 py-2">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[color:var(--brand-via)]/50 pl-3 my-3 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-border" />,
          a: ({ href, children }) => (
            <a href={href} className="text-[color:var(--brand-via)] hover:underline underline-offset-2" target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="w-full text-xs border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="text-left font-semibold px-2.5 py-1.5 border-b border-border bg-muted/40">{children}</th>,
          td: ({ children }) => <td className="px-2.5 py-1.5 border-b border-border/60">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
