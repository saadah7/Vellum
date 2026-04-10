from fastapi import FastAPI, HTTPException, Form
from core.graph import vellum_app
from core.knowledge import get_vectorstore
from langchain_community.chat_message_histories import ChatMessageHistory

app = FastAPI()
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

# 1. CHANGED TO POST: To support large client briefs and future image uploads
@app.post("/interrogate")
async def interrogate(
    user_input: str = Form(...),
    session_id: str = Form("Saad_01"),
    client_brief: str = Form("General Design Principles"),
    platform: str = Form("web")
):
    try:
        # 2. Fetch RAG Context filtered to the declared platform
        vectorstore = get_vectorstore()
        allowed_scopes = PLATFORM_SCOPE_MAP.get(platform, ["all"])
        relevant_docs = vectorstore.similarity_search(
            user_input, k=3,
            filter={"platform_scope": {"$in": allowed_scopes}}
        )
        context = "\n".join([doc.page_content for doc in relevant_docs])

        # 3. Get Chat History
        history = get_session_history(session_id)

        # 4. Invoke the Agentic Graph
        initial_state = {
            "input": user_input,
            "context": context,
            "client_brief": client_brief,
            "platform": platform,
            "history": history.messages,
            "revision_count": 0
        }
        
        # Runs the Architect -> Critic feedback loop
        result = vellum_app.invoke(initial_state)
        
        # 5. Extract the approved output
        final_answer = result.get("final_output") or result.get("architect_response")
        
        # 6. Update Persistent Memory
        history.add_user_message(user_input)
        history.add_ai_message(final_answer)
        
        return {
            "vellum_response": final_answer,
            "revisions": result.get("revision_count", 1),
            "status": "APPROVED" if result.get("final_output") else "MAX_REVISIONS_REACHED"
        }
    
    except Exception as e:
        print(f"SYSTEM CRASH: {str(e)}")
        # Log the full error to the terminal for debugging the RTX 4080 memory
        raise HTTPException(status_code=500, detail=f"Vellum Engine Error: {str(e)}")