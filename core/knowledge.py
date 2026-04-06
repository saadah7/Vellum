import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

DATA_PATH = "data"
CHROMA_PATH = "db"

def ingest_data():
    print("Vellum is learning from your data...")
    
    # 1. Check if directory exists and has files
    if not os.path.exists(DATA_PATH) or not os.listdir(DATA_PATH):
        print(f"ERROR: No files found in {DATA_PATH}. Please add your .md files there.")
        return

    # 2. Load all Markdown and Text files
    # We use glob="**/*.md" to ensure it grabs all the new Claude files
    loader = DirectoryLoader(DATA_PATH, glob="**/*.md", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
    documents = loader.load()
    
    if not documents:
        # Fallback to .txt if no .md found
        loader = DirectoryLoader(DATA_PATH, glob="**/*.txt", loader_cls=TextLoader, loader_kwargs={'encoding': 'utf-8'})
        documents = loader.load()

    print(f"Loaded {len(documents)} document(s).")

    # 3. Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    splits = text_splitter.split_documents(documents)
    
    if not splits:
        print("ERROR: Files were loaded but no text content was found to split.")
        return

    # 4. Create Embeddings
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 5. Store in Chroma
    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=CHROMA_PATH
    )
    
    print(f"✅ Success! Vellum's brain is now populated with {len(splits)} design heuristics.")

def get_vectorstore():
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)