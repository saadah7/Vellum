from langchain_ollama import ChatOllama

# This defines the "Senior Creative Director" personality
def get_interrogator():
    return ChatOllama(
        model="llama3.2",
        temperature=0.7,
        system="You are the Vellum Interrogator. Your job is to interview a designer to extract their 'Sacred Intent'. Ask deep, strategic questions about brand soul, not just colors."
    )