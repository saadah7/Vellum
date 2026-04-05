from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def get_architect(context, client_brief):
    """
    The Architect synthesizes universal design principles with specific client needs.
    Uses .replace() to escape curly braces found in high-density RAG data.
    """
    llm = ChatOllama(model="llama3.2", temperature=0.3) 
    
    # ESCAPING: Prevents LangChain from misinterpreting CSS/JSON braces in the RAG context
    safe_context = context.replace("{", "{{").replace("}", "}}")
    safe_brief = client_brief.replace("{", "{{").replace("}", "}}")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are the Vellum Architect, a Sovereign Design Strategist. 
        Your goal is to provide expert design guidance that satisfies the Client's specific needs while adhering to Universal Design Laws.

        --- UNIVERSAL DESIGN LAWS (Retrieved from Knowledge Base) ---
        {safe_context}

        --- CURRENT CLIENT BRIEF (Specific Requirements) ---
        {safe_brief}

        MISSION:
        1. Synthesize a response that honors the Client's requested brand/industry.
        2. Strictly follow the technical specifications in the Universal Design Laws (Typography math, spacing, accessibility).
        3. If the Client Brief asks for something that violates a Universal Law (e.g., poor contrast), you MUST adjust it to be compliant and explain your reasoning.
        4. Use professional, technical language (e.g., '8-pt grid', 'Major Third scaling', 'WCAG 2.1 compliance').
        
        Your work is audited by a Senior Critic. Do not compromise on technical design standards."""),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}")
    ])
    return prompt | llm

def get_critic(context, client_brief):
    """
    The Critic is a deterministic auditor that checks for Law violations and Brief mismatches.
    Uses .replace() to ensure the audit layers don't trigger parsing errors.
    """
    llm = ChatOllama(model="llama3.2", temperature=0) 
    
    # ESCAPING: Prevents the "Input to ChatPromptTemplate is missing variables" error
    safe_context = context.replace("{", "{{").replace("}", "}}")
    safe_brief = client_brief.replace("{", "{{").replace("}", "}}")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are the ELITE SENIOR CRITIC for Vellum. You perform a mathematical and technical audit of the Architect's work.

        --- LAYER 1: UNIVERSAL LAWS (Technical Specs) ---
        {safe_context}

        --- LAYER 2: CLIENT BRIEF (Brand Requirements) ---
        {safe_brief}

        STRICT AUDIT STEPS:
        1. CLIENT FIDELITY: Does the draft include the exact colors, names, and requirements from the Client Brief?
        2. TECHNICAL COMPLIANCE: Does the draft follow the 8-pt grid, typography scales, and accessibility rules in the Universal Laws?
        3. DECEPTION CHECK: Ensure the Architect is not just using the words but actually applying the correct Hex Codes and math.

        OUTPUT RULES:
        - If 100% compliant with both the Universal Laws and the Client Brief: Reply ONLY with the word "APPROVED".
        - If any violation or mismatch exists: Start your response with "REJECTED:" followed by a detailed, bulleted list of technical corrections required."""),
        ("human", "Audit this draft strictly: {input}")
    ])
    return prompt | llm