from fastapi import FastAPI, HTTPException, Form
from core.graph import vellum_app
from core.knowledge import get_vectorstore
from langchain_community.chat_message_histories import ChatMessageHistory

app = FastAPI()
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# 1. CHANGED TO POST: To support large client briefs and future image uploads
@app.post("/interrogate")
async def interrogate(
    user_input: str = Form(...), 
    session_id: str = Form("Saad_01"),
    client_brief: str = Form("General Design Principles") # NEW: Specific requirements
):
    try:
        # 2. Fetch RAG Context (The Universal Rulebook)
        # We increase k to 5 to pull from your 15+ new specialized files
        vectorstore = get_vectorstore()
        relevant_docs = vectorstore.similarity_search(user_input, k=5)
        context = "\n".join([doc.page_content for doc in relevant_docs])
        
        # 3. Get Chat History
        history = get_session_history(session_id)
        
        # 4. Invoke the Agentic Graph (The Adversarial Debate)
        # Initial state now includes the 'client_brief' for dynamic governance
        initial_state = {
            "input": user_input,
            "context": context,
            "client_brief": client_brief, # NEW: Injected into the state
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