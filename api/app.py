import asyncio
import json
import re
import threading
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from core.graph import vellum_app
from core.knowledge import get_vectorstore
from langchain_community.chat_message_histories import ChatMessageHistory

load_dotenv()

# ── Conversational bypass ─────────────────────────────────────────────────────
_CONVERSATIONAL = re.compile(
    r"^\s*(hi|hello|hey|sup|yo|thanks|thank you|ok|okay|cool|great|nice|bye|goodbye)\s*[!?.]*\s*$",
    re.IGNORECASE,
)

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(title="Vellum API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store: dict = {}

# Platform → allowed platform_scope metadata tags
PLATFORM_SCOPE_MAP = {
    "android":        ["all", "android_web_cross"],
    "ios":            ["all"],
    "web":            ["all", "web_cross", "android_web_cross"],
    "cross-platform": ["all", "web_cross", "android_web_cross", "cross"],
    "macos":          ["all"],
    "watch":          ["all"],
}


def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


def _sse(event: dict) -> str:
    """Format a dict as a Server-Sent Event line."""
    return f"data: {json.dumps(event)}\n\n"


def _derive_status(verdict: str, has_final_output: bool) -> str:
    if "APPROVED_WITH_OVERRIDE" in verdict:
        return "APPROVED_WITH_OVERRIDE"
    if "APPROVED_WITH_WARNING" in verdict:
        return "APPROVED_WITH_WARNING"
    if has_final_output:
        return "APPROVED"
    return "MAX_REVISIONS_REACHED"


# ── /interrogate (SSE streaming) ──────────────────────────────────────────────
@app.post("/interrogate")
async def interrogate(
    user_input:      str = Form(...),
    session_id:      str = Form("default"),
    client_brief:    str = Form("General Design Principles"),
    platform:        str = Form("web"),
    override_intent: str = Form(""),
):
    # ── Conversational short-circuit ─────────────────────────────────────────
    if _CONVERSATIONAL.match(user_input.strip()):
        async def _greet():
            yield _sse({
                "type": "result",
                "vellum_response": (
                    "Hello. I'm Vellum — a design governance engine. "
                    "Describe a UI layout, component, or design decision and I'll audit it."
                ),
                "revisions": 0,
                "status": "APPROVED",
                "critic_feedback": "",
            })
        return StreamingResponse(_greet(), media_type="text/event-stream",
                                 headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})

    # ── RAG context ──────────────────────────────────────────────────────────
    try:
        vectorstore   = get_vectorstore()
        allowed       = PLATFORM_SCOPE_MAP.get(platform, ["all"])
        relevant_docs = vectorstore.similarity_search(
            user_input, k=3,
            filter={"platform_scope": {"$in": allowed}},
        )
        if not relevant_docs:
            print("[WARN] Platform filter returned 0 docs — falling back to unfiltered.")
            relevant_docs = vectorstore.similarity_search(user_input, k=3)
    except Exception as rag_err:
        print(f"[WARN] RAG error ({rag_err}) — proceeding with empty context.")
        relevant_docs = []

    context = "\n".join(d.page_content for d in relevant_docs)
    history = get_session_history(session_id)

    initial_state = {
        "input":           user_input,
        "context":         context,
        "client_brief":    client_brief,
        "platform":        platform,
        "history":         history.messages,
        "revision_count":  0,
        "override_intent": override_intent,
    }

    # ── SSE generator ────────────────────────────────────────────────────────
    loop  = asyncio.get_event_loop()
    queue: asyncio.Queue = asyncio.Queue()

    def _run_graph() -> None:
        """Stream LangGraph node outputs into the async queue."""
        try:
            for chunk in vellum_app.stream(initial_state):
                loop.call_soon_threadsafe(queue.put_nowait, ("chunk", chunk))
        except Exception as exc:
            loop.call_soon_threadsafe(queue.put_nowait, ("error", str(exc)))
        finally:
            loop.call_soon_threadsafe(queue.put_nowait, ("done", None))

    async def generate():
        yield _sse({"type": "start"})

        t = threading.Thread(target=_run_graph, daemon=True)
        t.start()

        final_state: dict = {}

        while True:
            kind, payload = await queue.get()

            if kind == "done":
                break

            if kind == "error":
                yield _sse({"type": "error", "message": payload})
                return

            # kind == "chunk": merge non-None fields into final_state
            node = next(iter(payload))
            data = payload[node]
            final_state.update({k: v for k, v in data.items() if v is not None})

            if node == "architect":
                yield _sse({
                    "type":     "progress",
                    "phase":    "architect",
                    "revision": data.get("revision_count", 1),
                    "message":  f"Architect drafting (revision {data.get('revision_count', 1)})…",
                })
            elif node == "critic":
                verdict = data.get("critic_verdict", "")
                yield _sse({
                    "type":    "progress",
                    "phase":   "critic",
                    "verdict": verdict,
                    "message": f"Critic auditing… verdict: {verdict or 'pending'}",
                })

        # ── Final result ─────────────────────────────────────────────────────
        final_answer    = final_state.get("final_output") or final_state.get("architect_response", "")
        critic_verdict  = final_state.get("critic_verdict", "")
        critic_feedback = final_state.get("critic_feedback") or ""
        status          = _derive_status(critic_verdict, bool(final_state.get("final_output")))

        history.add_user_message(user_input)
        history.add_ai_message(final_answer)

        yield _sse({
            "type":            "result",
            "vellum_response": final_answer,
            "revisions":       final_state.get("revision_count", 1),
            "status":          status,
            "critic_feedback": critic_feedback,
        })

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
