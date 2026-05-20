# Vellum — Setup Guide

A short, demo-laptop-focused guide. For the full project explanation, see `Vellum_Project_Explainer.pdf`.

---

## Prerequisites

Install these three things once per machine. None of them require any configuration.

| Tool | What it is | Where to get it |
|---|---|---|
| **Python 3.11+** | Backend runtime (the setup script accepts 3.11, 3.12, 3.13, 3.14) | https://www.python.org/downloads/ — tick "Add Python to PATH" during install |
| **Node.js LTS** | Frontend runtime (Next.js needs ≥ 18) | https://nodejs.org/ |
| **Ollama** | Local LLM runtime (hosts Llama 3.2) | https://ollama.com/download — runs as a background app on Windows |

Make sure the Ollama app is running before you continue (look for the llama icon in the system tray).

---

## One-Time Setup

```bash
git clone https://github.com/saadah7/Vellum.git
cd Vellum
```

Then run the setup script. Two ways, pick whichever is easier:

- **Double-click** `scripts\setup.cmd` (opens its own window, no PowerShell execution-policy fight)
- **Or in PowerShell:** `.\scripts\setup.ps1`

The script is idempotent — safe to re-run any time. It will:

1. Detect your Python version and pick the highest 3.11+
2. Create `./venv/` and install everything from `requirements.txt`
3. Run `npm install` inside `ui/`
4. Check Ollama is reachable; pull `llama3.2` (~2 GB) if it's missing
5. Ingest the 27 design-rule files into ChromaDB if `db/` is empty

Total time on a fresh laptop: about **5 minutes** (most of it the Ollama model pull).

---

## Daily Run

```
scripts\start.cmd
```

(Or `.\scripts\start.ps1` in PowerShell.)

Two PowerShell windows open — one for the FastAPI backend (port 8000), one for the Next.js frontend (port 3000). Then open this in your browser:

**http://localhost:3000**

To stop everything, close both windows or hit `Ctrl+C` in each.

---

## VS Code Integration

The repo ships with `.vscode/settings.json` pre-configured. When you open the project folder in VS Code:

- Every new integrated terminal automatically activates `./venv/`
- `PYTHONPATH` and `PYTHONIOENCODING` are set per-workspace (no encoding crashes on Windows)
- Pylance uses the venv's Python interpreter for IntelliSense
- Heavy folders (`venv`, `db`, `node_modules`, `.next`, `__pycache__`) are hidden from the file tree

If VS Code doesn't pick up the venv on first open, run **Ctrl+Shift+P → "Python: Select Interpreter"** and choose the one inside `./venv/Scripts/`.

---

## Troubleshooting

**"Running scripts is disabled on this system"**
PowerShell's default execution policy blocks the venv's activate script and `setup.ps1`. Two fixes:

- Use `setup.cmd` / `start.cmd` (they bypass the policy automatically), or
- Run this once per user: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

**Backend exits immediately with `ModuleNotFoundError`**
Your venv is out of sync with `requirements.txt`. Re-run `setup.cmd` — it will repair the venv if it's broken (for example, the original Python version was uninstalled).

**`/health` returns `"rag": false, "rag_docs": 0`**
The knowledge base is empty. Run `.\venv\Scripts\python.exe scripts\ingest.py` once. This populates `db/` with ~748 chunks.

**Ollama: "connection refused" on port 11434**
The Ollama desktop app isn't running. Start it from the Start Menu — it stays in the system tray. The setup script will recognise it as soon as it's up.

**First query takes 30+ seconds**
Expected. The model is being loaded into memory. Subsequent queries are faster — typically 8–15 seconds per round on Apple Silicon / a modern NVIDIA GPU, 60–120 seconds per round on CPU-only.

---

## Project Layout

```
Vellum/
├── api/                # FastAPI app + /interrogate endpoint
├── core/               # Architect, Critic, LangGraph, ChromaDB wiring
├── data/               # 27 markdown files — the rule base
├── db/                 # Local ChromaDB (gitignored; built by setup)
├── scripts/
│   ├── setup.ps1       # One-shot bootstrap (this guide)
│   ├── setup.cmd       # Double-click wrapper for setup.ps1
│   ├── start.ps1       # Launch backend + frontend
│   ├── start.cmd       # Double-click wrapper for start.ps1
│   └── ingest.py       # Standalone knowledge-base ingest
├── ui/                 # Next.js 16 + React 19 frontend
├── venv/               # Python virtual env (gitignored; built by setup)
├── requirements.txt    # Backend Python deps
└── SETUP.md            # This file
```

---

## Further Reading

- `Vellum_Project_Explainer.pdf` — structured technical walkthrough with algorithms
- `Vellum_Evaluator_Brief.pdf` — non-technical explainer for examiners
- `Vellum_Presentation_Prep.pdf` — viva Q&A
- `Vellum_Demo_Outputs.pdf` — expected output for the four canonical prompts
- `Vellum_Thesis_Reference.pdf` — full thesis document
