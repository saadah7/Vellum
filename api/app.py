import re
from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from core.graph import vellum_app
from core.knowledge import get_vectorstore
from langchain_community.chat_message_histories import ChatMessageHistory

# Only bypass the loop for very short, clearly off-topic inputs (≤ 3 words)
_CONVERSATIONAL = re.compile(
    r"^\s*(hi|hello|hey|sup|yo|thanks|thank you|ok|okay|cool|great|nice|bye|goodbye)\s*[!?.]*\s*$",
    re.IGNORECASE
)

app = FastAPI(title="Vellum API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = {}

# Maps each platform to the platform_scope metadata tags that are relevant for it
PLATFORM_SCOPE_MAP = {
    "android":        ["all", "android_web_cross"],
    "ios":            ["all"],
    "web":            ["all", "web_cross", "android_web_cross"],
    "cross-platform": ["all", "web_cross", "android_web_cross", "cross"],
    "macos":          ["all"],
    "watch":          ["all"],
}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


@app.post("/interrogate")
async def interrogate(
    user_input: str = Form(...),
    session_id: str = Form("Saad_01"),
    client_brief: str = Form("General Design Principles"),
    platform: str = Form("web"),
    override_intent: str = Form(""),
):
    try:
        # 1. Short-circuit very short conversational inputs
        if _CONVERSATIONAL.match(user_input.strip()):
            return {
                "vellum_response": "Hello. I'm Vellum — a design governance engine. Describe a UI layout, component, or design decision and I'll audit it against WCAG, Material 3, and your client brief.",
                "revisions": 0,
                "status": "APPROVED",
                "critic_feedback": "",
            }

        # 2. Fetch RAG context with platform filter — fall back to unfiltered if empty
        try:
            vectorstore = get_vectorstore()
            allowed_scopes = PLATFORM_SCOPE_MAP.get(platform, ["all"])
            relevant_docs = vectorstore.similarity_search(
                user_input, k=3,
                filter={"platform_scope": {"$in": allowed_scopes}}
            )
            # Fallback: if filtered query returns nothing (old DB / metadata missing), run unfiltered
            if not relevant_docs:
                print("[WARN] Platform-filtered RAG returned 0 results — falling back to unfiltered search.")
                relevant_docs = vectorstore.similarity_search(user_input, k=3)
        except Exception as rag_err:
            print(f"[WARN] RAG error ({rag_err}) — continuing with empty context.")
            relevant_docs = []

        context = "\n".join([doc.page_content for doc in relevant_docs])

        # 3. Get chat history
        history = get_session_history(session_id)

        # 4. Invoke the debate loop
        initial_state = {
            "input": user_input,
            "context": context,
            "client_brief": client_brief,
            "platform": platform,
            "history": history.messages,
            "revision_count": 0,
            "override_intent": override_intent,
        }

        result = vellum_app.invoke(initial_state)

        # 5. Extract outputs
        final_answer   = result.get("final_output") or result.get("architect_response", "")
        critic_verdict = result.get("critic_verdict", "")
        critic_feedback = result.get("critic_feedback") or ""

        # Derive status from the critic's actual verdict
        if "APPROVED_WITH_OVERRIDE" in critic_verdict:
            status = "APPROVED_WITH_OVERRIDE"
        elif "APPROVED_WITH_WARNING" in critic_verdict:
            status = "APPROVED_WITH_WARNING"
        elif result.get("final_output"):
            status = "APPROVED"
        else:
            status = "MAX_REVISIONS_REACHED"

        # 6. Persist to session history
        history.add_user_message(user_input)
        history.add_ai_message(final_answer)

        return {
            "vellum_response": final_answer,
            "revisions": result.get("revision_count", 1),
            "status": status,
            "critic_feedback": critic_feedback,  # passed to frontend for violation chip parsing
        }

    except Exception as e:
        err = str(e)
        print(f"[CRASH] {err}")

        # Friendly message for common Ollama failures
        if "connection" in err.lower() or "refused" in err.lower() or "ollama" in err.lower():
            raise HTTPException(
                status_code=503,
                detail="Ollama is not reachable. Make sure it is running and llama3.2 is loaded."
            )
        raise HTTPException(status_code=500, detail=f"Vellum Engine Error: {err}")
