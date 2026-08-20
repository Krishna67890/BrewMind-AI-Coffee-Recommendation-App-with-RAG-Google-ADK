import json
import os
import re
import math
from collections import Counter

class RAGSystem:
    def __init__(self, knowledge_dir):
        self.knowledge_dir = knowledge_dir
        self.reload_knowledge()

    def reload_knowledge(self):
        """Loads or reloads knowledge base files from disk."""
        self.menu_data = self._load_json("menu.json")
        self.ingredients_json = self._load_json("ingredients.json")
        self.allergens_json = self._load_json("allergens.json")
        self.offers_json = self._load_json("offers.json")
        self.coffee_guide_text = self._load_text("coffee-guide.md")
        self.faq_text = self._load_text("faq.md")

    def _load_json(self, filename):
        path = os.path.join(self.knowledge_dir, filename)
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading {filename}: {e}")
        return []

    def _load_text(self, filename):
        path = os.path.join(self.knowledge_dir, filename)
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    return f.read()
            except Exception as e:
                print(f"Error loading {filename}: {e}")
        return ""

    def get_source_content(self, source_id):
        """Returns raw text or JSON content for the frontend Source Drawer modal."""
        self.reload_knowledge()
        s_clean = source_id.lower().strip()
        if "menu" in s_clean:
            return json.dumps(self.menu_data, indent=2)
        elif "ingredient" in s_clean:
            return json.dumps(self.ingredients_json, indent=2)
        elif "allergen" in s_clean:
            return json.dumps(self.allergens_json, indent=2)
        elif "offer" in s_clean:
            return json.dumps(self.offers_json, indent=2)
        elif "guide" in s_clean:
            return self.coffee_guide_text
        elif "faq" in s_clean:
            return self.faq_text
        return f"Grounding content for {source_id} loaded directly from BrewMind AI knowledge base."

    def _tokenize(self, text):
        """Extract lowercase word tokens for TF-IDF similarity vector matching."""
        if not text:
            return []
        return re.findall(r'\w+', str(text).lower())

    def _compute_tf_idf_similarity(self, query, text):
        """Calculates TF-IDF vector similarity between query tokens and target text."""
        query_tokens = self._tokenize(query)
        doc_tokens = self._tokenize(text)
        if not query_tokens or not doc_tokens:
            return 0.0

        query_counts = Counter(query_tokens)
        doc_counts = Counter(doc_tokens)

        intersection = set(query_counts.keys()) & set(doc_counts.keys())
        if not intersection:
            return 0.0

        score = sum(query_counts[word] * doc_counts[word] for word in intersection)
        magnitude_q = math.sqrt(sum(count ** 2 for count in query_counts.values()))
        magnitude_d = math.sqrt(sum(count ** 2 for count in doc_counts.values()))

        if magnitude_q == 0 or magnitude_d == 0:
            return 0.0

        return score / (magnitude_q * magnitude_d)

    def search_menu(self, query, filters=None):
        """
        Retrieves matching menu items using hybrid TF-IDF vector similarity
        + metadata filtering (budget, roast, bitterness, sweetness, temperature, dietary, allergens).
        """
        self.reload_knowledge()
        query_lower = (query or "").lower()
        results = []

        budget = None
        dietary_restrictions = []
        taste = {}
        mood = None
        target_roast = None
        target_bitterness = None

        if filters:
            budget = filters.get('budget')
            dietary_restrictions = filters.get('dietaryRestrictions', []) or []
            taste = filters.get('tasteProfile', {}) or {}
            mood = filters.get('mood')
            target_roast = filters.get('roast') or taste.get('roast')
            target_bitterness = filters.get('bitterness') or taste.get('bitterness')

        for p in self.menu_data:
            # 1. Availability check
            if not p.get('availability', True):
                continue

            # 2. Budget filter
            if budget is not None and float(p.get('price', 0)) > float(budget):
                continue

            # 3. Dietary & Allergen Safety Filters
            if dietary_restrictions:
                skip = False
                p_allergens = [a.lower() for a in p.get('allergens', [])]
                p_dietary = [d.lower() for d in p.get('dietary_tags', []) + p.get('dietaryTags', [])]
                p_ingredients = [i.lower() for i in p.get('ingredients', [])]

                for res in dietary_restrictions:
                    res_clean = res.lower().strip()
                    if "dairy" in res_clean or "lactose" in res_clean:
                        if "dairy" in p_allergens or "milk" in p_ingredients:
                            milk_opts = [m.lower() for m in p.get('milk_options', p.get('milkOptions', []))]
                            if not any(m in ["oat", "almond", "soy", "none"] for m in milk_opts):
                                skip = True
                    if "vegan" in res_clean:
                        if "vegan" not in p_dietary:
                            skip = True
                    if "gluten" in res_clean:
                        if "gluten" in p_allergens or any(w in i for i in p_ingredients for w in ["wheat", "flour", "sourdough"]):
                            skip = True
                    if "nut" in res_clean or "nuts" in res_clean:
                        if "nuts" in p_allergens or any(w in i for i in p_ingredients for w in ["almond", "hazelnut", "pistachio", "nut"]):
                            skip = True

                if skip:
                    continue

            # 4. Temperature filter
            target_temp = taste.get('temperature', '').lower()
            if target_temp and target_temp not in ['any', 'all']:
                p_temp = p.get('temperature', '').lower()
                if target_temp == 'cold' and 'cold' not in p_temp:
                    continue
                if target_temp == 'hot' and 'hot' not in p_temp and p_temp != 'warm':
                    continue

            # 5. Hybrid Relevance & TF-IDF Vector Scoring
            full_doc_text = f"{p['name']} {p['description']} {p['category']} {p.get('roast', '')} {p.get('bitterness', '')} {p.get('sweetness', '')} {' '.join(p.get('ingredients', []))} {' '.join(p.get('best_for', []))}"
            vector_sim = self._compute_tf_idf_similarity(query_lower, full_doc_text)

            score = vector_sim * 20.0

            # Mood match bonus
            if mood:
                mood_lower = mood.lower()
                best_for = [b.lower() for b in p.get('best_for', p.get('bestFor', []))]
                if any(mood_lower in b or b in mood_lower for b in best_for):
                    score += 5

            # Roast & Bitterness explicit signals
            if target_roast and p.get('roast', '').lower() == target_roast.lower():
                score += 5
            if target_bitterness and p.get('bitterness', '').lower() == target_bitterness.lower():
                score += 5

            # Direct keyword query matches
            if query_lower:
                name_lower = p.get('name', '').lower()
                desc_lower = p.get('description', '').lower()

                if query_lower in name_lower:
                    score += 15
                if "smooth" in query_lower and (p.get('bitterness', '').lower() == 'low' or 'smooth' in desc_lower):
                    score += 8
                if "low bitterness" in query_lower or "less bitter" in query_lower or "not bitter" in query_lower:
                    if p.get('bitterness', '').lower() == 'low':
                        score += 10
                if "cold" in query_lower or "iced" in query_lower:
                    if 'cold' in p.get('temperature', '').lower():
                        score += 5

            # Include item if search score > 0 or no specific text query
            if not query_lower or score > 0 or mood:
                results.append((score, p))

        # Sort by relevance score descending, then price ascending
        results.sort(key=lambda x: (-x[0], x[1]['price']))
        return [item[1] for item in results[:6]]

    def retrieve_relevant_knowledge(self, query, filters=None):
        """
        Main RAG retrieval function. Returns (context_string, grounding_sources_list).
        """
        self.reload_knowledge()
        context_parts = []
        sources = []

        # 1. Search Menu Items
        products = self.search_menu(query, filters)
        if products:
            context_parts.append("--- RETRIEVED MENU ITEMS (menu.json) ---")
            context_parts.append(json.dumps(products, indent=2))
            sources.append("menu.json")

        # 2. Check Ingredients & Allergens
        query_lower = (query or "").lower()
        dietary = filters.get('dietaryRestrictions', []) if filters else []

        if dietary or any(w in query_lower for w in ["ingredient", "contain", "made of", "allergy", "allergen", "lactose", "dairy", "vegan", "gluten", "nut", "safe"]):
            if self.ingredients_json:
                context_parts.append("\n--- RETRIEVED INGREDIENT SPECS (ingredients.json) ---")
                context_parts.append(json.dumps(self.ingredients_json, indent=2))
                sources.append("ingredients.json")

            if self.allergens_json:
                context_parts.append("\n--- RETRIEVED ALLERGEN SAFETY MATRIX (allergens.json) ---")
                context_parts.append(json.dumps(self.allergens_json, indent=2))
                sources.append("allergens.json")

        # 3. Check Offers & Promos
        if any(w in query_lower for w in ["offer", "discount", "deal", "promo", "code", "cheap", "save"]):
            if self.offers_json:
                context_parts.append("\n--- RETRIEVED PROMOTIONAL OFFERS (offers.json) ---")
                context_parts.append(json.dumps(self.offers_json, indent=2))
                sources.append("offers.json")

        # 4. Check Coffee Guide
        if any(w in query_lower for w in ["roast", "brew", "caffeine", "temperature", "extraction", "how to", "matcha", "ratio"]):
            if self.coffee_guide_text:
                context_parts.append("\n--- RETRIEVED COFFEE GUIDE (coffee-guide.md) ---")
                context_parts.append(self.coffee_guide_text)
                sources.append("coffee-guide.md")

        # 5. Check FAQ & Policies
        if any(w in query_lower for w in ["hours", "location", "pickup", "delivery", "return", "policy", "custom"]):
            if self.faq_text:
                context_parts.append("\n--- RETRIEVED STORE FAQ (faq.md) ---")
                context_parts.append(self.faq_text)
                sources.append("faq.md")

        if not sources and products:
            sources.append("menu.json")

        return "\n\n".join(context_parts), list(dict.fromkeys(sources))

    def get_product_details(self, product_id):
        self.reload_knowledge()
        for p in self.menu_data:
            if p['id'] == product_id or p['name'].lower() == product_id.lower():
                return p
        return None

    def compare_products(self, id1, id2):
        p1 = self.get_product_details(id1)
        p2 = self.get_product_details(id2)
        if not p1 or not p2:
            return None
        return [p1, p2]
