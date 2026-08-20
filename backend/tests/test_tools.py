import pytest
# pyrefly: ignore [missing-import]
from brewmind_agent.tools import (
    search_menu,
    get_product_details,
    find_recommendations,
    check_offers,
    compare_products,
    build_order
)

def test_tool_search_menu():
    results = search_menu("espresso", budget=300)
    assert isinstance(results, list)
    assert len(results) > 0
    assert any("espresso" in p['name'].lower() for p in results)

def test_tool_get_product_details():
    product = get_product_details("c1")
    assert product is not None
    assert product['name'] == "Nitro Silk Cold Brew"
    assert product['price'] == 280

def test_tool_compare_products():
    comparison = compare_products("c1", "c2")
    assert comparison is not None
    assert len(comparison) == 2
    assert comparison[0]['id'] == 'c1'
    assert comparison[1]['id'] == 'c2'

def test_tool_build_order():
    order = build_order(["h1", "c2"])
    assert order['subtotal'] == 180 + 190
    assert order['tax'] == round((180 + 190) * 0.05, 2)
    assert order['total'] == round((180 + 190) * 1.05, 2)
    assert len(order['items']) == 2
