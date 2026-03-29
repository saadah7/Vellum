# 🟣 Vellum: The Sovereign Design Architect

**Vellum** is a local-first, multi-agent AI system designed for professional design governance. Unlike generic generators, Vellum acts as a **Senior Creative Director**, extracting strategic intent and auditing manual craftsmanship to ensure "intentional rule-breaking" leads to brand resonance.

---

## 🏗️ Project Architecture (MVP)

The system is built with a modular **Client-Server** approach, separating AI reasoning from the web interface.

```text
vellum/
├── core/                # AI Intelligence (The Brain)
│   ├── agents.py        # Logic for Interrogator, Architect, and Critic agents.
│   └── graph.py         # LangGraph state machine for agent "debates."
├── server/              # Web Bridge (The API)
│   └── app.py           # FastAPI server connecting the AI to the UI.
├── knowledge/           # RAG Database (The Memory)
│   └── data/            # Local design theory PDFs/Docs for ChromaDB.
├── .venv/               # Isolated Python environment.
├── .env                 # Local configuration & environment variables.
└── requirements.txt     # Project dependencies.


🛠️ Technical Stack
Intelligence: Llama 3.3 & Vision Models (via Ollama)

Orchestration: LangGraph (Stateful Multi-Agent Workflows)

Memory: ChromaDB (Vector storage for Design Heuristics)

API: FastAPI (Asynchronous Python backend)

Development: Python 3.10+, Virtual Environments (venv)

🚀 Getting Started (Team Setup)
Follow these steps to set up the Vellum local environment on your machine.

1. Clone the Repository
git clone [https://github.com/your-username/vellum.git](https://github.com/your-username/vellum.git)
cd vellum 

2. Set Up Virtual Environment
Professional development requires isolated dependencies
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

3. Install Dependencies
pip install -r requirements.txt

4. Ensure Ollama is Running
Vellum requires Ollama to be installed and running locally to host the models.
ollama run llama3.1


🧠 The Vellum Workflow
Strategic Interrogation: The AI conducts a recursive interview to define the "Sacred Intent" of the project.

Technical Manifesto: Vellum generates a blueprint of design tokens and motion physics.

Sovereign Audit: Upload a draft, and the Vision Agent critiques the work against the original strategy.

🛡️ Data Sovereignty & Privacy
Vellum is built for absolute privacy. All inference (AI thinking) happens locally on your machine. No design drafts or client strategies are ever uploaded to a 3rd-party cloud server.

Developed by the Vellum Team. Architecture for Intentional Design.