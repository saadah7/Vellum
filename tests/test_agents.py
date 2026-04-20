"""
Unit tests for core/agents.py — verifies agent construction without
requiring Ollama to be running.
"""

import pytest
from core.agents import get_architect, get_critic


class TestGetArchitect:
    def test_returns_runnable(self):
        chain = get_architect("some context", "some brief")
        assert chain is not None

    def test_accepts_platform_web(self):
        chain = get_architect("ctx", "brief", platform="web")
        assert chain is not None

    def test_accepts_platform_ios(self):
        chain = get_architect("ctx", "brief", platform="ios")
        assert chain is not None

    def test_accepts_platform_android(self):
        chain = get_architect("ctx", "brief", platform="android")
        assert chain is not None

    def test_braces_in_context_do_not_raise(self):
        """Curly braces in RAG context must be escaped so LangChain doesn't
        treat them as template variables."""
        chain = get_architect('ctx with {"key": "val"}', "brief")
        assert chain is not None

    def test_braces_in_brief_do_not_raise(self):
        chain = get_architect("ctx", 'brief with {token} inside')
        assert chain is not None


class TestGetCritic:
    def test_returns_runnable(self):
        chain = get_critic("some context", "some brief")
        assert chain is not None

    def test_accepts_override_intent(self):
        chain = get_critic("ctx", "brief", override_intent="Using black surfaces intentionally.")
        assert chain is not None

    def test_empty_override_intent(self):
        chain = get_critic("ctx", "brief", override_intent="")
        assert chain is not None

    def test_platform_ios_skips_aria_gate(self):
        """iOS platform should skip ARIA gate — no exception during construction."""
        chain = get_critic("ctx", "brief", platform="ios")
        assert chain is not None

    def test_platform_web_includes_aria_gate(self):
        chain = get_critic("ctx", "brief", platform="web")
        assert chain is not None

    def test_braces_in_override_intent_do_not_raise(self):
        chain = get_critic("ctx", "brief", override_intent='reason with {braces}')
        assert chain is not None
