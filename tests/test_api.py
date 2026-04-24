"""
Integration tests for api/app.py — uses FastAPI's TestClient.
Ollama does NOT need to be running for these tests.
"""

import pytest
from fastapi.testclient import TestClient
from api.app import app, _CONVERSATIONAL

client = TestClient(app, raise_server_exceptions=False)


class TestConversationalRegex:
    """The regex should bypass the debate loop for short greetings."""

    @pytest.mark.parametrize("phrase", ["hi", "hello", "hey", "thanks", "ok", "bye"])
    def test_matches_greetings(self, phrase):
        assert _CONVERSATIONAL.match(phrase)

    @pytest.mark.parametrize("phrase", [
        "design a navbar",
        "what color should I use?",
        "thanks for the help with the modal",
    ])
    def test_does_not_match_design_queries(self, phrase):
        assert _CONVERSATIONAL.match(phrase) is None


class TestInterrogateEndpoint:
    def test_missing_user_input_returns_422(self):
        res = client.post("/interrogate")
        assert res.status_code == 422

    def test_conversational_input_returns_sse(self):
        """Greeting should return SSE stream with a result event."""
        res = client.post("/interrogate", data={"user_input": "hi"})
        assert res.status_code == 200
        assert "text/event-stream" in res.headers["content-type"]
        body = res.text
        assert '"type": "result"' in body
        assert "Vellum" in body

    def test_cors_header_present(self):
        res = client.options(
            "/interrogate",
            headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "POST"},
        )
        assert res.headers.get("access-control-allow-origin") == "http://localhost:3000"


class TestHealthEndpoint:
    """The /health endpoint should always return, even when services are down —
    the UI depends on it to render a red/green indicator at startup."""

    def test_returns_expected_shape(self):
        res = client.get("/health")
        assert res.status_code == 200
        body = res.json()
        for key in ("ollama", "rag", "rag_docs", "ready"):
            assert key in body
        assert isinstance(body["ollama"], bool)
        assert isinstance(body["rag"], bool)
        assert isinstance(body["ready"], bool)
        assert isinstance(body["rag_docs"], int)

    def test_ready_is_conjunction(self):
        """ready == ollama AND rag — no other combination."""
        res = client.get("/health")
        body = res.json()
        assert body["ready"] == (body["ollama"] and body["rag"])
