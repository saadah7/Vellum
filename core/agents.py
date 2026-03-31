from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from core.knowledge import get_vectorstore

def get_interrogator(user_query):
    # Ensure Ollama is running llama3.2
    llm = ChatOllama(model="llama3.2", temperature=0.7)
    
    # Check the Vector DB
    vectorstore = get_vectorstore()
    relevant_docs = vectorstore.similarity_search(user_query, k=2)
    context = "\n".join([doc.page_content for doc in relevant_docs])
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"You are the Vellum Interrogator. Knowledge: {context}"),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ])
    
    return prompt | llm