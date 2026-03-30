import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# 1. This function 'reads' your data folder and saves it to a database
def ingest_data():
    print("Vellum is learning from your data...")
    loader = DirectoryLoader('./data', glob="./*.txt", loader_cls=TextLoader)
    documents = loader.load()
    
    # Split text into chunks so the AI can find specific sentences
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    splits = text_splitter.split_documents(documents)
    
    # Turn text into numbers (Vectors) and save to a folder named 'db'
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma.from_documents(
        documents=splits, 
        embedding=embeddings, 
        persist_directory="./db"
    )
    print("Learning complete. Database 'db' created.")
    return vectorstore

# 2. This function lets the Agent 'open' the database later
def get_vectorstore():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return Chroma(persist_directory="./db", embedding_function=embeddings)