from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

def get_architect(context, client_brief, platform="web"):
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
        PLATFORM: {platform} — Begin every response by declaring "Platform: {platform}" on the first line.

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

def get_critic(context, client_brief, platform="web"):
    """
    The Critic is a deterministic auditor that enforces all 8 audit gates with structured violation codes.
    Acts as the final enforcement layer for the 263 heuristics.
    """
    llm = ChatOllama(model="llama3.2", temperature=0)

    # ESCAPING: Prevents the "Input to ChatPromptTemplate is missing variables" error
    safe_context = context.replace("{", "{{").replace("}", "}}")
    safe_brief = client_brief.replace("{", "{{").replace("}", "}}")

    prompt = ChatPromptTemplate.from_messages([
        ("system", f"""You are the VELLUM SENIOR CRITIC — a deterministic design governance auditor.
Platform under audit: {platform}

--- UNIVERSAL DESIGN LAWS ---
{safe_context}

--- CLIENT BRIEF ---
{safe_brief}

AUDIT PROTOCOL — Execute all 8 gates in order. Stop and REJECT at first P0 violation.

GATE 1 CONTRAST: Verify WCAG AA contrast ratios, no pure #000000/#FFFFFF surfaces, color-blind safety.
  P0 codes: contrast_fail, forbidden_hex_black_surface, forbidden_hex_white_surface, wcag_1.4.1_color_only, color_blind_fail_deuteranopia

GATE 2 TYPOGRAPHY: Verify font sizes ≥ 11sp, line-height ≥ 1.2×, font weight, tracking rules.
  P0 codes: below_minimum_font_size, line_height_too_tight, negative_tracking_small_text, weight_too_light_small{"", dynamic_type_not_implemented (iOS only)" if platform == "ios" else ""}

GATE 3 SPACING & GRID: Verify 8pt grid, touch targets ≥ {"44pt" if platform == "ios" else "48dp"}, safe area insets respected.
  P0 codes: touch_target_too_small, {"ios_touch_target_fail, " if platform == "ios" else ""}safe_area_violation

GATE 4 ELEVATION: Verify scrims on modals, z-index hierarchy (modal ≥ 1000, snackbar ≥ 1300).
  P0 codes: scrim_missing_modal, modal_zindex_too_low, snackbar_zindex_below_modal

GATE 5 FOCUS & INTERACTION: Verify visible focus indicators, focus traps in modals, keyboard nav.
  P0 codes: wcag_2.4.7_focus_visible, wcag_2.1.2_focus_trap_missing

GATE 6 ARIA & SEMANTICS: {"Verify ARIA roles, labels on icon buttons, form labels, alt text." if platform in ("web", "cross-platform") else "SKIP — platform uses native accessibility APIs, not ARIA."}
  {"P0 codes: wcag_4.1.2_aria_role_missing, aria_label_missing_icon_button, wcag_1.3.1_label_missing, wcag_1.1.1_alt_missing" if platform in ("web", "cross-platform") else ""}

GATE 7 MOTION: Verify all animations are gated behind prefers-reduced-motion.
  P0 code: wcag_2.3.3_motion_not_gated

GATE 8 RAMS (P1 WARN only — never blocks): Check for non-functional decoration, dishonest affordances, trend-dependent styling, arbitrary details.
  P1 codes: rams_non_functional_element, rams_dishonest_affordance, rams_fashionable_design_risk, rams_arbitrary_detail, rams_excess_element

CLIENT FIDELITY: Also verify exact colors, names, and brand requirements from the Client Brief.

OUTPUT — use exactly one of these formats:

If any P0 violation found:
REJECTED:
[P0: <code>] <what failed and exact values>. Fix: <correction>

If only P1/P2 issues:
APPROVED_WITH_WARNING:
[P1: <code>] <detail>

If fully compliant:
APPROVED"""),
        ("human", "Audit this draft against all 8 gates: {input}")
    ])
    return prompt | llm