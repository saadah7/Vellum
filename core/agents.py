from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def get_architect(context):
    llm = ChatOllama(model="llama3.2", temperature=0.7) # Slightly lower for more focus
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are the Vellum Architect. You must design for Abdul's Academy.
        
        BRAND CONSTRAINTS (NON-NEGOTIABLE):
        - Colors: Lavender (#C7B8EA), Purple (#6c5ce7), White (#FFFFFF).
        - Use ONLY these hex codes. 
        - If a user asks for other colors (like Gold or Blue), you MUST politely refuse and explain that Vellum only permits official Academy branding.
        
        Your work is being audited by a Technical Critic who checks Hex Codes. Do not attempt to lie or bypass constraints."""),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}")
    ])
    return prompt | llm

def get_critic(context):
    llm = ChatOllama(model="llama3.2", temperature=0) 
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are the ELITE SENIOR CRITIC for Abdul's Academy. 
        Your sole purpose is to catch brand violations and LIES.
        
        OFFICIAL BRAND DATA:
        - Lavender: #C7B8EA
        - Purple: #6c5ce7
        - White: #FFFFFF
        
        STRICT AUDIT STEPS:
        1. HEX CODE VERIFICATION: Does every Hex Code match the Official Brand Data above?
        2. NO UNAUTHORIZED COLORS: If you see #F7D2C4 (Gold) or #03055B (Blue) or ANY hex code not listed in Official Brand Data, you MUST REJECT.
        3. DECEPTION CHECK: If the Architect SAYS "Lavender" but uses a non-lavender Hex Code, flag this as DECEPTIVE.
        
        OUTPUT RULES:
        - If 100% compliant: Reply ONLY with "APPROVED".
        - If any violation exists: Start with "REJECTED:" and list the specific lies or errors.
        """),
        ("human", "Audit this draft for technical deception: {input}")
    ])
    return prompt | llm