from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from core.knowledge import get_vectorstore

def get_interrogator(user_query):
    llm = ChatOllama(model="llama3.2", temperature=0.7)
    
    # 1. Search the library for info related to what Saad asked
    vectorstore = get_vectorstore()
    relevant_docs = vectorstore.similarity_search(user_query, k=2)
    context = "\n".join([doc.page_content for doc in relevant_docs])
    
    # 2. Add that context to the AI's instructions
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"You are the Vellum Interrogator. Use this Academy Knowledge to guide your questions: {context}"),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}"),
    ])
    
    return prompt | llm