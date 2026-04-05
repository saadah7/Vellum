from fastapi import FastAPI, HTTPException
from core.graph import vellum_app
from core.knowledge import get_vectorstore
from langchain_community.chat_message_histories import ChatMessageHistory

app = FastAPI()
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

@app.get("/interrogate")
async def interrogate(user_input: str, session_id: str = "Saad_01"):
    try:
        # 1. Fetch RAG Context (The "Rulebook")
        vectorstore = get_vectorstore()
        relevant_docs = vectorstore.similarity_search(user_input, k=3)
        context = "\n".join([doc.page_content for doc in relevant_docs])
        
        # 2. Get Chat History
        history = get_session_history(session_id)
        
        # 3. Invoke the Agentic Graph (The Debate)
        # Initial state for the LangGraph
        initial_state = {
            "input": user_input,
            "context": context,
            "history": history.messages,
            "revision_count": 0
        }
        
        # This runs the Architect -> Critic loop
        result = vellum_app.invoke(initial_state)
        
        # 4. Extract the approved output
        final_answer = result.get("final_output") or result.get("architect_response")
        
        # 5. Update Memory
        history.add_user_message(user_input)
        history.add_ai_message(final_answer)
        
        return {
            "vellum_response": final_answer,
            "revisions": result.get("revision_count", 1),
            "status": "APPROVED" if result.get("final_output") else "MAX_REVISIONS_REACHED"
        }
    
    except Exception as e:
        print(f"SYSTEM CRASH: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Agent Debate Failed: {str(e)}")