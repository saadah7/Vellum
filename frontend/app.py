import streamlit as st
import requests

# 1. Page Configuration (Injecting the Academy Vibe)
st.set_page_config(
    page_title="Vellum | Creative Director",
    page_icon="💜",
    layout="centered"
)

st.title("Vellum")
st.caption("Abdul's Academy | Stateful RAG Engine")

# 2. Initialize Visual Chat History
if "messages" not in st.session_state:
    st.session_state.messages = []

# 3. Render previous messages on screen
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 4. The Input Box
if prompt := st.chat_input("Ask Vellum a design or strategy question..."):
    
    # Display the user's message immediately
    st.chat_message("user").markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # 5. Connect to your FastAPI Backend
    # We are hardcoding session_id="Saad_01" for your local MVP
    api_url = f"http://127.0.0.1:8000/interrogate"
    params = {
        "user_input": prompt,
        "session_id": "Saad_01"
    }

    try:
        # Send the request to your local RTX 4080 Super engine
        with st.spinner("Vellum is thinking..."):
            response = requests.get(api_url, params=params)
            
        if response.status_code == 200:
            ai_response = response.json().get("vellum_response", "Error parsing response.")
        else:
            ai_response = f"Backend Error: {response.status_code}"
            
    except requests.exceptions.ConnectionError:
        ai_response = "Connection Error. Is your FastAPI server running?"

    # 6. Display Vellum's response
    with st.chat_message("assistant"):
        st.markdown(ai_response)
    st.session_state.messages.append({"role": "assistant", "content": ai_response})