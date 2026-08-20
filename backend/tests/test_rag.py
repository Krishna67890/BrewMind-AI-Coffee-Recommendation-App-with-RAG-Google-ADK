import os
import pytest
from brewmind_agent.rag import RAGSystem

KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge")

@pytest.fixture
def rag_system():
    return RAGSystem(KNOWLEDGE_DIR)

def test_budget_filtering(rag_system):
    """TEST 6 & 1: Verify budget constraints are strictly enforced in retrieval."""
    filters = {'budget': 200}
    results = rag_system.search_menu("", filters)
    assert len(results) > 0
    for product in results:
        assert product['price'] <= 200

def test_dietary_filtering_lactose(rag_system):
    """TEST 3: Verify lactose intolerance excludes non-customizable dairy products."""
    filters = {'dietaryRestrictions': ['Dairy-Free']}
    results = rag_system.search_menu("", filters)
    assert len(results) > 0
    for product in results:
        allergens = [a.lower() for a in product.get('allergens', [])]
        # Should not have Dairy unless plant milk option is explicitly available
        if 'dairy' in allergens:
            plant_milks = [m.lower() for m in product.get('milk_options', product.get('milkOptions', []))]
            assert any(m in plant_milks for m in ['oat', 'almond', 'soy', 'none'])

def test_vegan_cold_drink(rag_system):
    """TEST 8: Verify vegan cold drink query returns cold, vegan items."""
    filters = {'dietaryRestrictions': ['Vegan'], 'tasteProfile': {'temperature': 'cold'}}
    results = rag_system.search_menu("cold brew", filters)
    assert len(results) > 0
    for product in results:
        assert 'cold' in product['temperature'].lower()
        dietary = [d.lower() for d in product.get('dietary_tags', [])]
        assert 'vegan' in dietary or 'dairy-free' in dietary

def test_grounding_sources_retrieval(rag_system):
    """Verify RAG returns appropriate grounding metadata sources."""
    context, sources = rag_system.retrieve_relevant_knowledge("What ingredients are in Velvet Latte and what are the allergens?")
    assert "Velvet Latte" in context or "ingredients" in context.lower()
    assert len(sources) > 0

def test_rag_dynamic_update_proof(rag_system, tmp_path):
    """
    Phase 21 RAG Quality Test: Proves retrieval is live and non-hardcoded
    by dynamically updating a knowledge record and asserting changed output.
    """
    # 1. Inspect original menu item
    item = rag_system.get_product_details("c1")
    assert item is not None
    original_name = item['name']

    # 2. Search menu for cold brew keyword
    res1 = rag_system.search_menu("Nitro Silk Cold Brew")
    assert len(res1) > 0
    assert res1[0]['id'] == 'c1'

    # 3. Create temporary knowledge directory with modified product description
    temp_menu = list(rag_system.menu_data)
    for p in temp_menu:
        if p['id'] == 'c1':
            p['description'] = "SPECIAL TEST RAG INGREDIENT: Organic Vanilla & Nitrogen."

    temp_menu_file = tmp_path / "menu.json"
    temp_menu_file.write_text(pytest.importorskip("json").dumps(temp_menu))

    temp_rag = RAGSystem(str(tmp_path))
    res2 = temp_rag.search_menu("SPECIAL TEST RAG INGREDIENT")
    assert len(res2) > 0
    assert "SPECIAL TEST RAG INGREDIENT" in res2[0]['description']
