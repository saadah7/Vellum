import os
from typing import TypedDict, List, Dict, Any, Annotated
from langgraph.graph import StateGraph, END
from core.agents import get_architect, get_critic

# 1. Define the Shared State (Enhanced for Universal Governance)
class AgentState(TypedDict):
    input: str
    context: str           # Universal Laws from ChromaDB
    client_brief: str      # NEW: Specific Client Requirements from UI
    history: List[Any]
    architect_response: str
    critic_feedback: str
    revision_count: int
    final_output: str

# 2. Node: The Architect (The Creative Lead)
def architect_node(state: AgentState):
    iteration = state.get('revision_count', 0) + 1
    print(f"\n[STORYBOARD] --- ARCHITECT (Attempt #{iteration}) ---")
    
    # Updated: Now passing BOTH universal context and the specific client brief
    agent = get_architect(state['context'], state['client_brief'])
    
    # If the critic has provided feedback, we force the architect to address it
    current_input = state['input']
    if state.get('critic_feedback'):
        print(f"[LOG] Addressing Critic's Feedback...")
        current_input = (
            f"PREVIOUS FEEDBACK: {state['critic_feedback']}\n\n"
            f"YOUR TASK: Improve your previous response based on the feedback while "
            f"staying true to the original request: {state['input']}"
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
    
    # Updated: Now auditing against universal rules AND the client brief
    agent = get_critic(state['context'], state['client_brief'])
    response = agent.invoke({
        "input": state['architect_response']
    })
    
    # Check if the Critic approved the work
    is_approved = "APPROVED" in response.content.upper()
    
    if is_approved:
        print("✅ [LOG] CRITIC: 'APPROVED' - Brand standards & Client requirements met.")
        return {"final_output": state['architect_response'], "critic_feedback": None}
    else:
        feedback = response.content.strip()
        print(f"❌ [LOG] CRITIC: 'REJECTED' - Reason: {feedback[:100]}...")
        return {"feedback": feedback, "final_output": None}

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