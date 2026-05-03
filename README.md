# Vellum

**AI design reviewer that checks its own work.**

Ask a design question. Two AI designers tackle it — one writes the answer, the other grades it against 263 real design rules from Apple, Google, and accessibility standards. You get the answer plus a **report card** showing what's solid and what's risky. Runs 100% on your laptop, so your designs stay private.

---

## Why this exists

Designers ask ChatGPT design questions every day and ship the answers. The answers sound right but often aren't — hallucinated WCAG numbers, invented component specs, no source for any claim. Juniors can't tell good advice from bad, so bad advice ships.

Vellum fixes this with three moves:

1. **Two AI agents instead of one.** A **Writer** proposes an answer; a **Reviewer** grades it against a searchable library of real design rules. If the Reviewer rejects the work, it goes back for revision. Up to 5 rounds.
2. **Every answer is graded.** You see a report card: Approved, Approved with warnings, Approved with exception, or Rejected. Each flag cites the rule so you can verify.
3. **Runs offline.** No cloud, no telemetry. Your client brief never leaves your laptop.

---

## The 263 rules

The Reviewer grades against 27 spec files covering:

- **Accessibility** — WCAG 2.1 contrast, focus order, touch targets, ARIA semantics
- **Platform systems** — Material 3 (Android/web), Apple HIG (iOS/macOS)
- **Universal heuristics** — spacing, typography scaling, elevation, motion, reduced-motion rules
- **Component rules** — state machines, selection logic, iconography
- **Philosophy** — Dieter Rams' 10 principles (the "design smell" checker)

All live in `data/` as plain Markdown, chunked and indexed into a local vector database at startup.

---

## Stack

| Layer | Technology |
|---|---|
| AI models | Llama 3.2 (3B) via Ollama — fully local |
| Orchestration | LangGraph + LangChain (Writer ↔ Reviewer loop) |
| Rule library | ChromaDB · 27 spec files · 400-char chunks |
| Embeddings | all-MiniLM-L6-v2 (384-dim) |
| API | FastAPI · SSE streaming · `/health` pre-flight |
| UI | Next.js 16 · shadcn/ui · Tailwind v4 · react-markdown |
| Styling | Dark composio-inspired theme · animated orb background · Geist fonts |

---

## Interface at a glance

- **Top bar** — wordmark, live health dot (green/amber/red), platform selector (Web · iOS · Android), Advanced popover for every other setting
- **Empty state** — hero with four starter prompts that each exercise a different rule category
- **Debate view** — Writer and Reviewer avatars animate while they work, round counter updates live
- **Reply** — rendered markdown with inline code styling, followed by a collapsible **Quality Report** (critical issues, warnings, intentional exceptions)
- **Live background** — three drifting purple orbs + panning dot grid behind everything (respects `prefers-reduced-motion`)

---

## Project layout

```
vellum/
├── api/                        # FastAPI backend
│   └── app.py                  # /interrogate (SSE) + /health
├── core/                       # AI engine
│   ├── agents.py               # Writer (architect) + Reviewer (critic) prompts
│   ├── graph.py                # LangGraph loop + state machine
│   └── knowledge.py            # RAG ingest → ChromaDB
├── data/                       # 27 design rule spec files (.md)
├── ui/                         # Next.js + shadcn/ui frontend
│   ├── app/
│   │   ├── globals.css         # Dark theme tokens + live-background CSS
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn primitives
│   │   └── vellum/             # app components
│   │       ├── top-bar.tsx     # Header: logo, health, platform, Advanced
│   │       ├── empty-state.tsx # Hero + example prompts
│   │       ├── debate-status.tsx
│   │       ├── quality-report.tsx
│   │       ├── markdown.tsx    # Tuned react-markdown renderer
│   │       └── live-background.tsx
│   └── lib/types.ts
├── tests/                      # Pytest suites
├── .env.example
└── requirements.txt
```

---

## Requirements

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com) installed and running
- 8 GB RAM minimum (16 GB recommended)
- GPU optional — works on CPU, NVIDIA CUDA, and Apple Silicon

---

## Quickstart

**1. Install Ollama and pull the model**
```bash
ollama pull llama3.2
```

**2. Clone and set up the Python environment**
```bash
git clone https://github.com/saadah7/Vellum.git
cd Vellum
cp .env.example .env
```

Windows:
```bash
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
```

macOS / Linux:
```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

**3. Build the design rule library** (one-time, and after any change in `data/`)
```bash
python -c "from core.knowledge import ingest_data; ingest_data()"
```

**4. Launch**

Terminal 1 — API:
```bash
uvicorn api.app:app --reload
```

Terminal 2 — UI:
```bash
cd ui && npm install && npm run dev
```

Open `http://localhost:3000`. The dot in the top bar turns **green** when both Ollama and the rule library are ready. Hover the dot for the exact recovery command if it's amber or red.

---

## Demo flow (5 minutes)

The home screen ships with 4 starter prompts. Each one is designed to exercise a different rule category — click them in order for a guided tour:

| # | Prompt | What the Reviewer catches |
|---|---|---|
| 1 | **Check my button's contrast** — `#6c63ff` on white, 14px | Contrast math — WCAG AA requires 4.5:1 for body text |
| 2 | **Spec a sign-up modal** | Focus order, field widths, primary-action hierarchy |
| 3 | **Review my card layout** — 24px / 12px spacing | Material 3 8-point grid compliance |
| 4 | **I'm breaking a rule on purpose** — pure black on white | Accepts the declared exception, explains what to document |

During each run you'll see two avatars — **Writer** and **Reviewer** — the active one pulses and glows. When the debate finishes the answer lands as rendered markdown, with a collapsible Quality Report showing the rule IDs it flagged.

---

## API surface

| Endpoint | Purpose |
|---|---|
| `GET /health` | Returns `{ ollama, rag, rag_docs, ready }`. UI pings every 15s for the health dot. |
| `POST /interrogate` | Server-Sent Events stream: `warning`, `progress` (Writer/Reviewer phases), `result`, `error`. Accepts `user_input`, `session_id`, `platform`, `max_revisions`, `override_intent`, `client_brief`. |

---

## Running tests

```bash
# Backend (32 tests: agents, graph, API, /health)
pytest

# Frontend (21 tests: types, quality report)
cd ui && npm test
```

---

## Troubleshooting

- **Red dot, "Ollama not reachable"** — run `ollama serve` in another terminal
- **Amber dot, "Design rule library empty"** — re-run the ingest command from step 3
- **First query is slow** — Ollama is loading the 3B model into memory (~20–30s on CPU)
- **CPU-only machines** — expect 2–5 min per full debate loop
- **Port 8000 blocked on Windows** (`WinError 10013`) — Hyper-V port reservations. Restart WinNAT: `net stop winnat && net start winnat` (admin PowerShell), or run the server on `--port 8001` and update the two `localhost:8000` strings in `ui/`.

---

## Notes

- Debate runs up to 3 rounds by default; adjustable 1–5 in Advanced settings
- Knowledge is ingested once and persisted in `db/` (gitignored)
- The `EMBEDDING_MODEL` env var must match what `db/` was ingested with — if you swap models, re-run ingest
- Conversational greetings ("hi", "thanks") bypass the debate loop and return instantly

---

## Team

Saad Abdul Hakeem · Shaikh Mustafa · M A Naser Askari
CSE Major Project
