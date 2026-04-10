import os
from typing import TypedDict, List, Dict, Any, Annotated
from langgraph.graph import StateGraph, END
from core.agents import get_architect, get_critic

# 1. Define the Shared State (Enhanced for Universal Governance)
class AgentState(TypedDict):
    input: str
    context: str           # Universal Laws from ChromaDB
    client_brief: str      # Specific Client Requirements from UI
    platform: str          # Declared platform target (android|ios|web|cross-platform|macos|watch)
    history: List[Any]
    architect_response: str
    critic_feedback: str
    critic_verdict: str    # APPROVED | APPROVED_WITH_WARNING | REJECTED
    revision_count: int
    final_output: str

# 2. Node: The Architect (The Creative Lead)
def architect_node(state: AgentState):
    iteration = state.get('revision_count', 0) + 1
    print(f"\n[STORYBOARD] --- ARCHITECT (Attempt #{iteration}) ---")
    
    agent = get_architect(state['context'], state['client_brief'], state.get('platform', 'web'))
    
    # If the critic has provided feedback, we force the architect to address it
    current_input = state['input']
    if state.get('critic_feedback'):
        print(f"[LOG] Addressing Critic's Feedback...")
        current_input = (
            f"REVISION REQUIRED. The Critic found violations in your previous draft.\n"
            f"VIOLATIONS TO FIX:\n{state['critic_feedback']}\n\n"
            f"Rewrite your design specification to resolve every violation above. "
            f"Keep your response in professional specification format. "
            f"Do not list the audit gates. Do not use letter format. "
            f"Original user request: {state['input']}"
        )
    
    response = agent.invoke({"input": current_input, "history": state['history']})
    
    print(f"[LOG] Architect has generated a new draft.")
    return {
        "architect_response": response.content, 
        "revision_count": iteration
    }

# 3. Node: The Critic (The Rule Enforcer)
def critic_node(state: AgentState):
    print(f"\n[STORYBOARD] --- SENIOR CRITIC (Auditing Attempt #{state['revision_count']}) ---")
    
    agent = get_critic(state['context'], state['client_brief'], state.get('platform', 'web'))
    response = agent.invoke({
        "input": state['architect_response']
    })
    
    # Check critic verdict — order matters: check WARNING before plain APPROVED
    content_upper = response.content.upper()
    is_warning  = "APPROVED_WITH_WARNING" in content_upper
    is_approved = is_warning or ("APPROVED" in content_upper and "REJECTED" not in content_upper)

    if is_approved:
        verdict = "APPROVED_WITH_WARNING" if is_warning else "APPROVED"
        print(f"✅ [LOG] CRITIC: '{verdict}'")
        return {
            "final_output": state['architect_response'],
            "critic_feedback": response.content.strip(),  # kept so UI can surface P1 warnings
            "critic_verdict": verdict,
        }
    else:
        feedback = response.content.strip()
        print(f"❌ [LOG] CRITIC: 'REJECTED' - {feedback[:100]}...")
        return {"critic_feedback": feedback, "critic_verdict": "REJECTED", "final_output": None}

# 4. The Router: Decide the next state
def should_continue(state: AgentState):
    # End if we have a final approved output OR we've hit the revision limit
    if state.get("final_output"):
        print("\n[STORYBOARD] --- DEBATE CONCLUDED: WORK APPROVED ---")
        return "end"
    
    if state.get("revision_count", 0) >= 3:
        print("\n[STORYBOARD] --- DEBATE CONCLUDED: MAX REVISIONS REACHED (FORCE STOP) ---")
        return "end"
    
    print("[LOG] Routing back to Architect for revisions...")
    return "revise"

# 5. Construct & Compile the Graph
workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("architect", architect_node)
workflow.add_node("critic", critic_node)

# Define Flow
workflow.set_entry_point("architect")
workflow.add_edge("architect", "critic")

# Define Conditional Flow (The Loop)
workflow.add_conditional_edges(
    "critic", 
    should_continue, 
    {
        "revise": "architect", 
        "end": END
    }
)

# The compiled app that the FastAPI server will call
vellum_app = workflow.compile()