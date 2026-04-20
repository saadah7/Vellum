"""
Unit tests for core/graph.py — verifies AgentState schema and graph
structure without running the full LLM loop.
"""

import pytest
from core.graph import AgentState, vellum_app


class TestAgentState:
    REQUIRED_KEYS = {
        "input", "context", "client_brief", "platform",
        "history", "architect_response", "critic_feedback",
        "critic_verdict", "revision_count", "final_output",
        "override_intent",
    }

    def test_all_required_keys_present(self):
        annotations = AgentState.__annotations__
        for key in self.REQUIRED_KEYS:
            assert key in annotations, f"AgentState missing key: {key}"

    def test_override_intent_is_str(self):
        assert AgentState.__annotations__["override_intent"] is str

    def test_revision_count_is_int(self):
        assert AgentState.__annotations__["revision_count"] is int


class TestGraphStructure:
    def test_graph_compiles(self):
        assert vellum_app is not None

    def test_graph_has_invoke(self):
        assert callable(getattr(vellum_app, "invoke", None))

    def test_graph_has_stream(self):
        assert callable(getattr(vellum_app, "stream", None))
