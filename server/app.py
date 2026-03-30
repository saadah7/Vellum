from fastapi import FastAPI
from core.agents import get_interrogator

app = FastAPI()

# 1. The simple "Alive" check
@app.get("/")
def home():
    return {"status": "Vellum Engine Online"}

# 2. The "Interrogation" endpoint
@app.get("/interrogate")
def interrogate(user_input: str):
    # We call the 'Brain' we defined in core/agents.py
    ai_agent = get_interrogator()
    
    # We send your 'user_input' to the AI and get a response
    response = ai_agent.invoke(user_input)
    
    return {
        "user_asked": user_input,
        "vellum_response": response.content
    }