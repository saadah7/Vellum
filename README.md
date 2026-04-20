# Vellum

**Local-first AI design governance. Every output audited against 263 heuristics before it reaches you.**

Vellum runs an adversarial Architect–Critic debate loop entirely on your machine. The Architect drafts a design strategy; the Senior Critic audits it across 8 gates — WCAG contrast, typography, spacing, elevation, focus, ARIA, motion, and Dieter Rams principles — and rejects anything that fails. The loop continues until the design passes or max revisions are reached.

---

## Stack

| Layer | Technology |
|---|---|
| LLM | Llama 3.2 (3B) via Ollama — runs fully local |
| Orchestration | LangGraph + LangChain |
| Knowledge base | ChromaDB · 27 spec files · 400-char chunks |
| Embeddings | all-MiniLM-L6-v2 (384-dim) |
| API | FastAPI |
| UI | Next.js 16 · shadcn/ui · Tailwind |

---

## Project Structure

```
vellum/
├── api/                # FastAPI backend
│   └── app.py          # /interrogate endpoint
├── core/               # AI engine
│   ├── agents.py       # Architect + Critic (LangChain + Ollama)
│   ├── graph.py        # LangGraph debate loop + AgentState
│   └── knowledge.py    # RAG ingestion (ChromaDB)
├── data/               # 27 governance spec files (.md)
├── ui/                 # Next.js + shadcn/ui frontend
│   ├── app/
│   ├── components/ui/
│   └── lib/
├── .env.example        # Environment variable template
├── requirements.txt
└── db/                 # ChromaDB vector store (gitignored)
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

**2. Clone and set up Python environment**
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

**3. Ingest the knowledge base**
```bash
python -c "from core.knowledge import ingest_data; ingest_data()"
```
Re-run whenever files in `data/` are added or modified.

**4. Launch**

Terminal 1 — API:
```bash
uvicorn api.app:app --reload
```

Terminal 2 — UI:
```bash
cd ui && npm install && npm run dev
```

Open `http://localhost:3000`.

---

## Notes

- First query may be slow while Ollama loads the model into memory
- CPU-only machines work but expect 2–5 min per response
- Debate loop runs up to 3 revisions by default (adjustable in the sidebar)

---

## Team

Saad Abdul Hakeem · Shaikh Mustafa · M A Naser Askari  
CSE Major Project
