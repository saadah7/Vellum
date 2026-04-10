from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def get_architect(context, client_brief):
    """
    The Architect synthesizes universal design principles with specific client needs.
    Hardened with Phase 9.5 Obedience Patch to prioritize Governance over User requests.
    """
    llm = ChatOllama(model="llama3.2", temperature=0.7)
    
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

        MISSION & GOVERNANCE RULES:
        1. CRITICAL: The Senior Critic's rejections are based on immutable Design Laws. If the Critic cites a file from the /data directory (e.g., specs_responsive_behaviour.md), you MUST prioritize the document's constraints over the user's explicit requests. You are forbidden from fulfilling a user request that violates these laws.
        2. Synthesize a response that honors the Client's requested brand/industry.
        3. Strictly follow the technical specifications in the Universal Design Laws (Typography math, spacing, accessibility).
        4. If the Client Brief asks for something that violates a Universal Law (e.g., a 400px fixed width on mobile), you MUST reject the user's specific parameter, apply the correct Law, and explain the technical necessity for the change.
        5. Use professional, technical language (e.g., '8-pt grid', 'Major Third scaling', 'WCAG 2.1 compliance').
        
        Your work is audited by a Senior Critic. Do not compromise on technical design standards to please the user."""),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{input}")
    ])
    return prompt | llm

def get_critic(context, client_brief):
    """
    The Critic is a deterministic auditor that checks for Law violations and Brief mismatches.
    Acts as the final enforcement layer for the 263 heuristics.
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
        4. RESPONSIVE ENFORCEMENT: Reject any fixed widths or layouts that violate the mobile-first laws in your data.

        OUTPUT RULES:
        - If 100% compliant with both the Universal Laws and the Client Brief: Reply ONLY with the word "APPROVED".
        - If any violation or mismatch exists: Start your response with "REJECTED:" followed by a detailed, bulleted list of technical corrections required. Cite specific files if possible."""),
        ("human", "Audit this draft strictly: {input}")
    ])
    return prompt | llm