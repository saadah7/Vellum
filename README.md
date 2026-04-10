# Vellum

**Local-first AI design governance. Every output audited against 263 heuristics before it reaches you.**

Vellum runs an adversarial Architect–Critic debate loop entirely on your machine. The Architect drafts a design strategy; the Senior Critic audits it across 8 gates (WCAG contrast, typography, spacing, elevation, focus, ARIA, motion, Rams principles) and rejects anything that fails. The loop continues until the design is approved or max revisions are hit.

---

## What it does

- **Governs** — enforces WCAG 2.1, Material 3, Apple HIG, and 263 internal heuristics on every response
- **Adapts** — adjusts rules by declared platform (web / Android / iOS / cross-platform / macOS / watchOS)
- **Reports** — returns structured violation codes (e.g. `[P0: contrast_fail]`) with severity and fix guidance

---

## Stack

| Layer | Technology |
|---|---|
| LLM | Llama 3.2 via Ollama (local) |
| Orchestration | LangGraph + LangChain |
| Knowledge base | ChromaDB (27 spec files, ~400-char chunks) |
| API | FastAPI |
| UI | Streamlit |

---

## Requirements

- Python 3.10+
- [Ollama](https://ollama.com) installed and running
- 8 GB RAM minimum (16 GB recommended)
- GPU optional — Ollama runs on CPU, NVIDIA CUDA, and Apple Silicon automatically

---

## Quickstart

**1. Install Ollama and pull the model**

Download from [ollama.com](https://ollama.com), then:
```bash
ollama pull llama3.2
```

**2. Clone and install dependencies**
```bash
git clone https://github.com/saadah7/Vellum.git
cd Vellum
```

Windows:
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**3. Ingest the knowledge base**
```bash
python -c "from core.knowledge import ingest_data; ingest_data()"
```
Re-run this whenever files in `/data` are added or changed.

**4. Launch**

Terminal 1 — backend:
```bash
uvicorn server.app:app --reload
```

Terminal 2 — frontend:
```bash
streamlit run frontend/app.py
```

Open `http://localhost:8501`.

---

## Architecture

```
vellum/
├── core/
│   ├── agents.py       # Architect + Critic agents (LangChain + Ollama)
│   ├── graph.py        # LangGraph debate loop + AgentState
│   └── knowledge.py    # RAG ingestion (ChromaDB, 400-char chunks)
├── server/
│   └── app.py          # FastAPI — /interrogate endpoint
├── frontend/
│   └── app.py          # Streamlit UI
├── data/               # 27 governance spec files (.md)
└── db/                 # ChromaDB vector store (gitignored)
```

---

## Notes

- First query may be slow while Ollama loads the model into memory
- CPU-only machines will work but expect 2–5 min per response
- The debate loop runs up to 3 revisions by default (adjustable in the sidebar)

---

## Team

Saad Abdul Hakeem · Shaikh Mustafa · M A Naser Askari
