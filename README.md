# 🟣 Vellum: The Sovereign Design Architect

**Vellum** is a local-first, multi-agent AI system designed for professional design governance. Unlike generic generators, Vellum acts as a **Senior Creative Director**, extracting strategic intent and auditing manual craftsmanship to ensure "intentional rule-breaking" leads to brand resonance.

---

## 🏗️ Project Architecture (MVP Stable)

The system uses a decoupled **Dual-Server** approach, separating the AI's reasoning engine from the reactive user interface.

```text
vellum/
├── core/                # AI Intelligence (The Brain)
│   ├── agents.py        # Logic for the Interrogator & Agent orchestration.
│   └── knowledge.py     # RAG Pipeline (Document Ingestion & ChromaDB).
├── server/              # Web Bridge (The API)
│   └── app.py           # FastAPI server with session-based memory.
├── frontend/            # Reactive Dashboard (The Face)
│   └── app.py           # Streamlit UI for the chat experience.
├── data/                # Knowledge Base (Input)
├── db/                  # Persistent Vector Store (ChromaDB)
├── .venv/               # Isolated Python environment.
└── requirements.txt     # Project dependencies.

🛠️ Technical Stack
Intelligence: Llama 3.2 (Local via Ollama)

Orchestration: LangChain (Stateful Persistence & RAG)

Memory: ChromaDB (Persistent Vector storage for Design Heuristics)

API: FastAPI (Asynchronous Python backend)

UI: Streamlit (Reactive Python frontend)

Compute: Optimized for local RTX 40-series hardware.

🚀 Getting Started (Team Setup)
1. Environment & Dependencies
PowerShell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

2. Knowledge Ingestion (Syncing the Brain)
Before the first run, or whenever you add new files to /data, run the ingestion script:

PowerShell
python -c "from core.knowledge import ingest_data; ingest_data()"
3. Launching the System
Vellum requires two parallel processes to be running:

Terminal 1 (The Backend Engine):

PowerShell
uvicorn server.app:app --reload
Terminal 2 (The Frontend Dashboard):

PowerShell
streamlit run frontend/app.py

🧠 The Vellum Workflow
Strategic Interrogation: The AI maintains a stateful session to conduct recursive interviews and define project "Intent."

Deterministic Grounding: Every response is audited against the local Knowledge Base (RAG) to ensure alignment with brand rules.

Sovereign Inference: 100% of the thinking happens locally on your GPU. Zero data leakage.

🛡️ Data Sovereignty & Privacy
Vellum is built for absolute privacy. All inference happens locally on your machine. No design drafts or client strategies are ever uploaded to a 3rd-party cloud server.

Developed by the Vellum Team. Architecture for Intentional Design
saad abdul hakeem