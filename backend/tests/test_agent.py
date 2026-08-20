import os
# pyrefly: ignore [missing-import]
import pytest
from brewmind_agent.agent import BrewMindAgent

KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge")

@pytest.fixture
def agent():
    return BrewMindAgent(KNOWLEDGE_DIR)

@pytest.mark.asyncio
async def test_agent_coding_cold_strong(agent):
    """TEST 1 & 5: 'I need a cold, strong coffee with low sweetness under ₹250.'"""
    payload = {
        "message": "I need a cold, strong coffee with low sweetness under ₹250.",
        "tasteProfile": {"caffeine": "high", "sweetness": "low", "temperature": "cold"},
        "budget": 250,
        "mood": "coding"
    }
    res = await agent.handle_chat(payload)
    assert "message" in res
    assert "recommendations" in res
    assert len(res["recommendations"]) > 0

    top_rec = res["recommendations"][0]
    assert top_rec["price"] <= 250
    assert "cold" in top_rec["temperature"].lower()
    assert len(res["groundingSources"]) > 0

@pytest.mark.asyncio
async def test_agent_non_existent_product(agent):
    """TEST 7: 'Tell me about a product that doesn't exist.'"""
    payload = {
        "message": "Tell me about the Super Galactic Unicorn Frappe.",
        "budget": 1000
    }
    res = await agent.handle_chat(payload)
    assert res is not None
    assert "message" in res
