import os
import json
from .rag import RAGSystem

KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge")
rag = RAGSystem(KNOWLEDGE_DIR)

def search_menu(query: str, budget: float = None, dietary_restrictions: list = None):
    """
    Search the coffee shop menu for products matching a query, budget, and dietary needs.
    """
    filters = {
        'budget': budget,
        'dietaryRestrictions': dietary_restrictions or []
    }
    return rag.search_menu(query, filters)

def get_product_details(product_id: str):
    """
    Retrieve full details for a specific product by its ID or name.
    """
    return rag.get_product_details(product_id)

def find_recommendations(caffeine: str = None, sweetness: str = None, temperature: str = None, budget: float = 1000, roast: str = None, bitterness: str = None):
    """
    Find best coffee recommendations based on taste profile parameters.
    """
    filters = {
        'tasteProfile': {
            'caffeine': caffeine,
            'sweetness': sweetness,
            'temperature': temperature,
            'roast': roast,
            'bitterness': bitterness
        },
        'budget': budget
    }
    return rag.search_menu("", filters)

def check_allergens(product_id_or_name: str = None):
    """
    Retrieve allergen safety matrix and check specific product allergen content.
    """
    if product_id_or_name:
        p = rag.get_product_details(product_id_or_name)
        if p:
            return {
                "product": p['name'],
                "allergens": p.get('allergens', []),
                "ingredients": p.get('ingredients', []),
                "dietaryTags": p.get('dietary_tags', p.get('dietaryTags', []))
            }
    return rag._load_json("allergens.json")

def compare_products(id1: str, id2: str):
    """
    Compare two products side by side by their IDs or names.
    """
    return rag.compare_products(id1, id2)

def calculate_order(items: list):
    """
    Calculates subtotal, 5% tax, and order total for a list of product IDs.
    """
    subtotal = 0
    details = []
    for item_id in items:
        p = rag.get_product_details(item_id)
        if p:
            subtotal += p['price']
            details.append(p)

    tax = subtotal * 0.05
    return {
        "items": details,
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "total": round(subtotal + tax, 2)
    }

def filter_by_budget(max_price: float):
    """
    Filter menu products with price <= max_price.
    """
    return rag.search_menu("", {'budget': max_price})

def find_by_roast(roast_level: str):
    """
    Find products by roast level (Light, Medium, Dark, Cold Brew).
    """
    return rag.search_menu("", {'roast': roast_level})

def find_by_bitterness(bitterness_level: str):
    """
    Find products by bitterness level (Low, Medium, High).
    """
    return rag.search_menu("", {'bitterness': bitterness_level})

# Export tool function dictionary and list
tools_map = {
    "search_menu": search_menu,
    "get_product_details": get_product_details,
    "find_recommendations": find_recommendations,
    "check_allergens": check_allergens,
    "compare_products": compare_products,
    "calculate_order": calculate_order,
    "filter_by_budget": filter_by_budget,
    "find_by_roast": find_by_roast,
    "find_by_bitterness": find_by_bitterness
}

tools_list = list(tools_map.values())
