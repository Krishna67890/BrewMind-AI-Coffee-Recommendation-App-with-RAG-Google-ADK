import os
import time
import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from brewmind_agent.agent import BrewMindAgent
from brewmind_agent.schemas import ChatRequest, ComparisonRequest, OrderPreviewRequest

app = FastAPI(
    title="BrewMind AI Concierge Backend",
    description="Google ADK + RAG Backend for BrewMind AI (Gen AI Academy APAC Edition)",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, you should list your Vercel and Render domains here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ADK Agent & RAG System
# Use absolute paths to ensure it works in Docker/Render environments
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge")
agent = BrewMindAgent(KNOWLEDGE_DIR)

# Request logging middleware for observability
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    path = request.url.path
    method = request.method

    print(f"[{datetime.datetime.utcnow().isoformat()}] INCOMING {method} {path}")

    response = await call_next(request)

    duration = round((time.time() - start_time) * 1000, 2)
    print(f"[{datetime.datetime.utcnow().isoformat()}] COMPLETED {method} {path} -> {response.status_code} ({duration}ms)")

    return response

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint returning real system status.
    """
    has_menu = len(agent.rag.menu_data) > 0
    return {
        "status": "healthy",
        "agent": True,
        "retrieval": has_menu,
        "productCount": len(agent.rag.menu_data),
        "gemini": agent.model is not None,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "service": "BrewMind AI Concierge"
    }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Main conversational agent endpoint. Processes message, taste profile, budget, and dietary requirements.
    """
    try:
        response = await agent.handle_chat(request.dict())
        return response
    except Exception as e:
        print(f"Error handling chat request: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommend")
async def recommend(request: ChatRequest):
    """
    Direct recommendation search endpoint.
    """
    try:
        response = await agent.handle_chat(request.dict())
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare")
async def compare(request: ComparisonRequest):
    """
    Side-by-side comparison endpoint for two product IDs or names.
    """
    if len(request.product_ids) < 2:
        raise HTTPException(status_code=400, detail="Provide at least two product IDs to compare.")

    p1 = agent.rag.get_product_details(request.product_ids[0])
    p2 = agent.rag.get_product_details(request.product_ids[1])

    if not p1 or not p2:
        # Fallback to first two products in menu if ids not exact
        if len(agent.rag.menu_data) >= 2:
            p1 = p1 or agent.rag.menu_data[0]
            p2 = p2 or agent.rag.menu_data[1]

    # Generate BrewMind Verdict grounded in product metrics
    verdict = ""
    if p1 and p2:
        v_parts = []
        if p1.get('bitterness') == 'Low' and p2.get('bitterness') != 'Low':
            v_parts.append(f"Choose **{p1['name']}** if you prefer lower bitterness.")
        elif p2.get('bitterness') == 'Low' and p1.get('bitterness') != 'Low':
            v_parts.append(f"Choose **{p2['name']}** for a smoother, less bitter profile.")

        if p1.get('sweetness') == 'High' and p2.get('sweetness') != 'High':
            v_parts.append(f"Choose **{p1['name']}** if you have a sweet tooth.")
        elif p2.get('sweetness') == 'High' and p1.get('sweetness') != 'High':
            v_parts.append(f"Choose **{p2['name']}** for a sweeter treat.")

        if not v_parts:
            v_parts.append(f"Choose **{p1['name']}** (₹{p1['price']}) for a classic coffee profile, or choose **{p2['name']}** (₹{p2['price']}) for a refreshing cold drink.")

        verdict = " ".join(v_parts)

    return {
        "comparison": [p1, p2],
        "verdict": verdict,
        "summary": f"Comparison between {p1['name']} (₹{p1['price']}) and {p2['name']} (₹{p2['price']}).",
        "groundingSources": ["menu.json", "ingredients.json", "allergens.json"]
    }

@app.post("/api/order-preview")
async def order_preview(request: OrderPreviewRequest):
    """
    Calculates subtotal, taxes, and order breakdown for demo order items.
    """
    items_out = []
    subtotal = 0
    for item in request.items:
        p = agent.rag.get_product_details(item.id)
        if p:
            p_with_qty = dict(p)
            p_with_qty['quantity'] = item.quantity
            items_out.append(p_with_qty)
            subtotal += p['price'] * item.quantity

    tax = subtotal * 0.05
    total = subtotal + tax

    return {
        "items": items_out,
        "subtotal": round(subtotal, 2),
        "tax": round(tax, 2),
        "total": round(total, 2),
        "currency": "INR",
        "isDemoOrder": True
    }

@app.get("/api/product/{product_id}")
async def get_product(product_id: str):
    """
    Retrieve single product details by ID.
    """
    product = agent.rag.get_product_details(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.get("/api/sources/{source_id}")
async def get_source_file(source_id: str):
    """
    Returns text snippet of grounding source for the UI source drawer.
    """
    content = agent.rag.get_source_content(source_id)
    return {
        "id": source_id,
        "content": content
    }

class KnowledgeSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

@app.post("/api/knowledge/search")
async def search_knowledge(request: KnowledgeSearchRequest):
    """
    Searches BrewMind knowledge base for RAG Search dashboard.
    """
    context, sources = agent.rag.retrieve_relevant_knowledge(request.query, {})
    matching_products = agent.rag.search_menu(request.query, {})
    return {
        "success": True,
        "query": request.query,
        "retrieved_documents": sources,
        "matching_products": matching_products,
        "context_snippet": context[:500] if context else "No matching context",
        "count": len(matching_products)
    }

if __name__ == "__main__":
    import uvicorn
    # Render and Cloud Run provide the PORT environment variable
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
