import re
import uuid
import requests
import streamlit as st

# ── Page config ───────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Vellum | Design Governance",
    page_icon="🏛️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Global CSS ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
/* ── Base ── */
html, body, [data-testid="stAppViewContainer"] {
    background-color: #0B0D14;
    color: #E2E8F0;
    font-family: system-ui, -apple-system, sans-serif;
}
[data-testid="stSidebar"] {
    background-color: #0F1218;
    border-right: 1px solid #1E2333;
}
[data-testid="stSidebar"] * { color: #CBD5E1 !important; }

/* ── Sidebar section labels ── */
.section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6C63FF !important;
    margin: 18px 0 6px 0;
    padding-bottom: 4px;
    border-bottom: 1px solid #1E2333;
}

/* ── Inputs ── */
[data-testid="stTextInput"] input,
[data-testid="stSelectbox"] div[data-baseweb="select"],
[data-testid="stTextArea"] textarea {
    background-color: #13161F !important;
    border: 1px solid #1E2333 !important;
    border-radius: 8px !important;
    color: #E2E8F0 !important;
}
[data-testid="stTextInput"] input:focus,
[data-testid="stTextArea"] textarea:focus {
    border-color: #6C63FF !important;
    box-shadow: 0 0 0 2px rgba(108,99,255,0.25) !important;
}

/* ── Buttons ── */
[data-testid="stButton"] button {
    background: linear-gradient(135deg, #6C63FF 0%, #5B54E8 100%);
    color: #fff !important;
    border: none !important;
    border-radius: 8px !important;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: opacity 0.15s;
}
[data-testid="stButton"] button:hover { opacity: 0.85; }

/* ── Session ID pill ── */
.session-pill {
    display: inline-block;
    background: #13161F;
    border: 1px solid #1E2333;
    border-radius: 20px;
    padding: 3px 12px;
    font-size: 11px;
    color: #64748B !important;
    font-family: monospace;
    margin-top: 6px;
    word-break: break-all;
}

/* ── Header ── */
.vellum-header {
    padding: 32px 0 8px 0;
    border-bottom: 1px solid #1E2333;
    margin-bottom: 24px;
}
.vellum-wordmark {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #6C63FF, #A78BFA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
}
.vellum-subtitle {
    font-size: 13px;
    color: #64748B;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 6px;
}

/* ── Metric bar ── */
.metric-card {
    background: #13161F;
    border: 1px solid #1E2333;
    border-radius: 12px;
    padding: 16px 20px;
    text-align: center;
}
.metric-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #64748B;
    margin-bottom: 6px;
}
.metric-value {
    font-size: 22px;
    font-weight: 700;
    color: #E2E8F0;
}

/* ── Status badges ── */
.badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
}
.badge-approved  { background: rgba(34,197,94,0.15);  color: #22C55E; border: 1px solid rgba(34,197,94,0.3); }
.badge-warning   { background: rgba(245,158,11,0.15); color: #F59E0B; border: 1px solid rgba(245,158,11,0.3); }
.badge-rejected  { background: rgba(239,68,68,0.15);  color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }
.badge-idle      { background: rgba(100,116,139,0.15);color: #64748B; border: 1px solid rgba(100,116,139,0.3); }
.badge-override  { background: rgba(13,148,136,0.15); color: #0D9488; border: 1px solid rgba(13,148,136,0.3); }

/* ── Violation chips ── */
.chip-p0 {
    display: inline-block;
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.35);
    color: #FCA5A5;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-family: monospace;
    margin: 2px 3px;
}
.chip-p1 {
    display: inline-block;
    background: rgba(245,158,11,0.12);
    border: 1px solid rgba(245,158,11,0.35);
    color: #FCD34D;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-family: monospace;
    margin: 2px 3px;
}
.chip-override {
    display: inline-block;
    background: rgba(13,148,136,0.12);
    border: 1px solid rgba(13,148,136,0.35);
    color: #5EEAD4;
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-family: monospace;
    margin: 2px 3px;
}

/* ── Chat bubbles ── */
[data-testid="stChatMessage"] {
    background: #13161F !important;
    border: 1px solid #1E2333 !important;
    border-radius: 12px !important;
    margin-bottom: 8px !important;
}

/* ── Governance report card ── */
.gov-card {
    background: #13161F;
    border: 1px solid #1E2333;
    border-radius: 12px;
    padding: 20px 24px;
    margin-top: 12px;
}
.gov-card-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #6C63FF;
    margin-bottom: 14px;
}

/* ── Divider ── */
.vellum-divider {
    border: none;
    border-top: 1px solid #1E2333;
    margin: 12px 0;
}

/* ── Spinner override ── */
[data-testid="stSpinner"] { color: #6C63FF !important; }
</style>
""", unsafe_allow_html=True)


# ── Session state init ─────────────────────────────────────────────────────────
if "messages" not in st.session_state:
    st.session_state.messages = []
if "session_id" not in st.session_state:
    st.session_state.session_id = str(uuid.uuid4())[:8]
if "last_status" not in st.session_state:
    st.session_state.last_status = None
if "last_revisions" not in st.session_state:
    st.session_state.last_revisions = None
if "last_max_revisions" not in st.session_state:
    st.session_state.last_max_revisions = 3


# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown('<div class="vellum-wordmark" style="font-size:22px;padding:8px 0 4px 0;">🏛 VELLUM</div>', unsafe_allow_html=True)
    st.markdown('<hr class="vellum-divider">', unsafe_allow_html=True)

    # Project
    st.markdown('<div class="section-label">Project</div>', unsafe_allow_html=True)
    client_name = st.text_input("Client Name", placeholder="e.g., Nexus FinTech", label_visibility="collapsed")
    st.caption("Client name")
    industry = st.selectbox("Industry", [
        "Tech", "Finance", "Healthcare", "Legal", "Luxury",
        "Gaming", "Education", "Creative", "E-commerce", "Government"
    ])

    # Platform
    st.markdown('<div class="section-label">Platform</div>', unsafe_allow_html=True)
    platform = st.selectbox("Platform Target", [
        "web", "android", "ios", "cross-platform", "macos", "watch"
    ])
    window_class = st.selectbox("Window Class", [
        "compact (0–599dp)", "medium (600–839dp)", "expanded (840dp+)"
    ])
    color_mode = st.selectbox("Color Mode", ["Dark", "Light", "System"])

    # Typography
    st.markdown('<div class="section-label">Typography</div>', unsafe_allow_html=True)
    typography_scale = st.selectbox("Scale System", ["Material 3", "Apple HIG", "Custom"])

    # Brand
    st.markdown('<div class="section-label">Brand</div>', unsafe_allow_html=True)
    brand_reqs = st.text_area(
        "Brand Requirements",
        placeholder="Primary: #6C63FF\nTone: Minimalist\nTypeface: Inter",
        height=120,
        label_visibility="collapsed",
    )
    st.caption("Colors, tone, typeface constraints")

    # Governance
    st.markdown('<div class="section-label">Governance</div>', unsafe_allow_html=True)
    with st.expander("Audit Settings", expanded=False):
        max_revisions = st.slider("Max Revisions", 1, 5, 3)
        strict_token_mode = st.toggle("Strict Token Mode", value=True,
            help="Reject raw hex values — enforce design tokens only.")
        rams_audit = st.toggle("RAMS Audit (Gate 8)", value=True,
            help="Dieter Rams principles audit. P1 warnings only.")
        override_intent = st.text_area(
            "Override Intent",
            placeholder="e.g., Using pure black for a print-first layout where contrast is enforced by paper weight.",
            height=80,
            help="Declare why you are intentionally breaking a rule. The Critic will evaluate your reasoning.",
        )

    # Session
    st.markdown('<div class="section-label">Session</div>', unsafe_allow_html=True)
    if st.button("New Session", use_container_width=True):
        st.session_state.messages = []
        st.session_state.session_id = str(uuid.uuid4())[:8]
        st.session_state.last_status = None
        st.session_state.last_revisions = None
        st.rerun()
    st.markdown(f'<div class="session-pill">ID: {st.session_state.session_id}</div>', unsafe_allow_html=True)

# ── Brief construction ────────────────────────────────────────────────────────
full_brief = f"""Client: {client_name}
Industry: {industry}
Platform: {platform}
Window Class: {window_class}
Color Mode: {color_mode}
Typography Scale: {typography_scale}
Brand Constraints: {brand_reqs}
Max Revisions: {max_revisions}
Strict Token Mode: {strict_token_mode}
RAMS Audit: {rams_audit}"""


# ── Header ────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="vellum-header">
    <div class="vellum-wordmark">VELLUM</div>
    <div class="vellum-subtitle">Design Governance Engine · Powered by Ollama</div>
</div>
""", unsafe_allow_html=True)


# ── Metric bar ────────────────────────────────────────────────────────────────
def status_badge(status):
    if status is None:
        return '<span class="badge badge-idle">— IDLE</span>'
    s = str(status).upper()
    if "APPROVED_WITH_OVERRIDE" in s:
        return '<span class="badge badge-override">◈ APPROVED WITH OVERRIDE</span>'
    if "APPROVED_WITH" in s:
        return '<span class="badge badge-warning">⚠ APPROVED WITH WARNINGS</span>'
    if "APPROVED" in s:
        return '<span class="badge badge-approved">✓ APPROVED</span>'
    if "REJECTED" in s or "MAX_REVISIONS" in s:
        return '<span class="badge badge-rejected">✕ REJECTED</span>'
    return f'<span class="badge badge-idle">{status}</span>'

col1, col2, col3 = st.columns(3)
with col1:
    rev_display = f"{st.session_state.last_revisions} / {st.session_state.last_max_revisions}" \
        if st.session_state.last_revisions else "— / —"
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Revisions</div>
        <div class="metric-value">{rev_display}</div>
    </div>""", unsafe_allow_html=True)
with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Audit Status</div>
        <div style="margin-top:6px">{status_badge(st.session_state.last_status)}</div>
    </div>""", unsafe_allow_html=True)
with col3:
    platform_label = platform.upper()
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Active Platform</div>
        <div class="metric-value" style="font-size:16px;letter-spacing:0.04em">{platform_label}</div>
    </div>""", unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)


# ── Violation chip parser ─────────────────────────────────────────────────────
def parse_violations(text):
    """Extract [P0: code], [P1: code], and [OVERRIDE: code] tags from critic output."""
    p0 = re.findall(r'\[P0:\s*([^\]]+)\]', text, re.IGNORECASE)
    p1 = re.findall(r'\[P1:\s*([^\]]+)\]', text, re.IGNORECASE)
    ov = re.findall(r'\[OVERRIDE:\s*([^\]]+)\]', text, re.IGNORECASE)
    return p0, p1, ov


# ── Chat history ──────────────────────────────────────────────────────────────
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])
        if message["role"] == "assistant" and message.get("gov"):
            g = message["gov"]
            p0_chips = "".join(f'<span class="chip-p0">P0: {c}</span>' for c in g.get("p0", []))
            p1_chips = "".join(f'<span class="chip-p1">P1: {c}</span>' for c in g.get("p1", []))
            ov_chips = "".join(f'<span class="chip-override">◈ {c}</span>' for c in g.get("ov", []))
            chips_html = p0_chips + p1_chips + ov_chips
            rev_str = f"{g.get('revisions', '?')} / {g.get('max_revisions', '?')} revisions"
            st.markdown(f"""
            <div class="gov-card">
                <div class="gov-card-title">Governance Report</div>
                <div style="margin-bottom:10px">{status_badge(g.get('status'))}</div>
                <div style="font-size:12px;color:#64748B;margin-bottom:8px">{rev_str}</div>
                {f'<div>{chips_html}</div>' if chips_html else '<div style="font-size:12px;color:#64748B">No violations flagged.</div>'}
            </div>""", unsafe_allow_html=True)


# ── Chat input ────────────────────────────────────────────────────────────────
if prompt := st.chat_input("Describe a layout or ask Vellum to audit a design decision…"):

    st.chat_message("user").markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    api_url = "http://127.0.0.1:8000/interrogate"
    data_payload = {
        "user_input": prompt,
        "client_brief": full_brief,
        "session_id": st.session_state.session_id,
        "platform": platform,
        "override_intent": override_intent,
    }

    try:
        with st.spinner("Architect & Critic are debating…"):
            response = requests.post(api_url, data=data_payload, timeout=300)

        if response.status_code == 200:
            result          = response.json()
            ai_response     = result.get("vellum_response", "Error parsing response.")
            status          = result.get("status", "UNKNOWN")
            revisions       = result.get("revisions", 1)
            critic_feedback = result.get("critic_feedback", "")

            # Update metrics
            st.session_state.last_status        = status
            st.session_state.last_revisions     = revisions
            st.session_state.last_max_revisions = max_revisions

            # Parse violation chips from critic_feedback (where [P0/P1/OVERRIDE: code] tags actually live)
            p0_codes, p1_codes, ov_codes = parse_violations(critic_feedback)

            gov_data = {
                "status": status,
                "revisions": revisions,
                "max_revisions": max_revisions,
                "p0": p0_codes,
                "p1": p1_codes,
                "ov": ov_codes,
            }

            # Render response
            with st.chat_message("assistant"):
                st.markdown(ai_response)
                p0_chips   = "".join(f'<span class="chip-p0">P0: {c}</span>' for c in p0_codes)
                p1_chips   = "".join(f'<span class="chip-p1">P1: {c}</span>' for c in p1_codes)
                ov_chips   = "".join(f'<span class="chip-override">◈ {c}</span>' for c in ov_codes)
                chips_html = p0_chips + p1_chips + ov_chips
                rev_str    = f"{revisions} / {max_revisions} revisions"
                st.markdown(f"""
                <div class="gov-card">
                    <div class="gov-card-title">Governance Report</div>
                    <div style="margin-bottom:10px">{status_badge(status)}</div>
                    <div style="font-size:12px;color:#64748B;margin-bottom:8px">{rev_str}</div>
                    {f'<div>{chips_html}</div>' if chips_html else '<div style="font-size:12px;color:#64748B">No violations flagged.</div>'}
                </div>""", unsafe_allow_html=True)

            st.session_state.messages.append({
                "role": "assistant",
                "content": ai_response,
                "gov": gov_data,
            })

        elif response.status_code == 503:
            ai_response = "⚠️ Ollama is not reachable. Make sure it is running and `llama3.2` is loaded (`ollama run llama3.2`)."
            with st.chat_message("assistant"):
                st.markdown(ai_response)
            st.session_state.messages.append({"role": "assistant", "content": ai_response})

        else:
            ai_response = f"Backend Error {response.status_code}: {response.text}"
            with st.chat_message("assistant"):
                st.markdown(ai_response)
            st.session_state.messages.append({"role": "assistant", "content": ai_response})

    except requests.exceptions.ConnectionError:
        ai_response = "⚠️ Cannot reach the backend. Run: `uvicorn server.app:app --reload`"
        with st.chat_message("assistant"):
            st.markdown(ai_response)
        st.session_state.messages.append({"role": "assistant", "content": ai_response})

    st.rerun()
