from fastapi import FastAPI, HTTPException
from core.agents import get_interrogator
from langchain_community.chat_message_histories import ChatMessageHistory

app = FastAPI()
store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

@app.get("/interrogate")
def interrogate(user_input: str, session_id: str = "Saad_01"):
    try:
        # Pass the input to the agent
        agent = get_interrogator(user_input) 
        history = get_session_history(session_id)
        
        # Execute the chain
        response = agent.invoke({
            "input": user_input,
            "history": history.messages
        })
        
        # Save to memory
        history.add_user_message(user_input)
        history.add_ai_message(response.content)
        
        return {"vellum_response": response.content}
    
    except Exception as e:
        # This will print the REAL error in your terminal
        print(f"CRITICAL ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))