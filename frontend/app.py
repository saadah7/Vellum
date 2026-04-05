import streamlit as st
import requests

# 1. Page Configuration (Evolving from Academy to Enterprise)
st.set_page_config(
    page_title="Vellum | Design Governance",
    page_icon="🏛️",
    layout="wide" # Wide layout works better for sidebar briefs
)

# Custom Styling for a Professional "Sovereign" Look
st.markdown("""
    <style>
    .main {
        background-color: #0e1117;
    }
    .stChatFloatingInputContainer {
        padding-bottom: 20px;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("🏛️ Vellum")
st.caption("Universal Design Governance Engine | Powered by RTX 4080 Super")

# 2. Sidebar: The Client Environment (The "Dynamic Brief")
with st.sidebar:
    st.header("🏢 Client Environment")
    st.info("Define the specific project constraints below. Vellum will audit all designs against these rules + Universal Laws.")
    
    client_name = st.text_input("Client Name", placeholder="e.g., Nexus FinTech")
    industry = st.selectbox("Industry", ["Tech", "Healthcare", "Luxury", "Educational", "Creative"])
    
    brand_reqs = st.text_area(
        "Brand Requirements & Colors", 
        placeholder="e.g., Primary: #0070FF, Tone: Minimalist, Typography: Sans-serif only.",
        height=200
    )
    
    # Constructing the Brief String for the Backend
    full_brief = f"""
    Client: {client_name}
    Industry: {industry}
    Brand Constraints: {brand_reqs}
    """
    
    if st.button("Clear History"):
        st.session_state.messages = []
        st.rerun()

# 3. Initialize Visual Chat History
if "messages" not in st.session_state:
    st.session_state.messages = []

# 4. Render previous messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 5. The Input Box
if prompt := st.chat_input("Ask Vellum to audit a layout or draft a strategy..."):
    
    st.chat_message("user").markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # 6. Connect to FastAPI via POST
    api_url = "http://127.0.0.1:8000/interrogate"
    
    # Data payload matches the Form fields in our updated FastAPI
    data_payload = {
        "user_input": prompt,
        "client_brief": full_brief,
        "session_id": "Saad_01"
    }

    try:
        with st.spinner("Architect & Critic are debating..."):
            # Using .post and 'data' for form-encoded values
            response = requests.post(api_url, data=data_payload)
            
        if response.status_code == 200:
            result = response.json()
            ai_response = result.get("vellum_response", "Error parsing response.")
            
            # Display metadata for your demo/pitch
            revisions = result.get("revisions", 1)
            status = result.get("status", "UNKNOWN")
            
            with st.expander("🔍 Governance Report"):
                st.write(f"**Status:** {status}")
                st.write(f"**Internal Revisions:** {revisions}")
        else:
            ai_response = f"Backend Error: {response.status_code} - {response.text}"
            
    except requests.exceptions.ConnectionError:
        ai_response = "Connection Error. Ensure the FastAPI server is running on port 8000."

    # 7. Display Vellum's response
    with st.chat_message("assistant"):
        st.markdown(ai_response)
    st.session_state.messages.append({"role": "assistant", "content": ai_response})