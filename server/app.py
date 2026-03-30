from fastapi import FastAPI
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
    # Pass user_input here so the agent can search the DB
    agent = get_interrogator(user_input) 
    history = get_session_history(session_id)
    
    response = agent.invoke({
        "input": user_input,
        "history": history.messages
    })
    
    history.add_user_message(user_input)
    history.add_ai_message(response.content)
    
    return {"vellum_response": response.content}