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
    description="Google ADK + RAG Backend for BrewMind AI",
    version="1.1.0"
)

# 1. PERMISSIVE CORS - MUST BE FIRST
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Agent
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge")
agent = BrewMindAgent(KNOWLEDGE_DIR)

@app.get("/")
async def root():
    return {
        "status": "online",
        "version": "1.1.0",
        "service": "BrewMind AI",
        "message": "If you see this, the backend is updated!",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "agent": agent.model is not None,
        "retrieval": len(agent.rag.menu_data) > 0,
        "productCount": len(agent.rag.menu_data)
    }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        return await agent.handle_chat(request.dict())
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare")
async def compare(request: ComparisonRequest):
    if len(request.product_ids) < 2:
        raise HTTPException(status_code=400, detail="Need 2 product IDs")
    p1 = agent.rag.get_product_details(request.product_ids[0])
    p2 = agent.rag.get_product_details(request.product_ids[1])
    return {"comparison": [p1, p2], "verdict": "Compared successfully"}

@app.post("/api/order-preview")
async def order_preview(request: OrderPreviewRequest):
    subtotal = sum((agent.rag.get_product_details(i.id)['price'] * i.quantity) for i in request.items if agent.rag.get_product_details(i.id))
    return {"subtotal": subtotal, "total": subtotal * 1.05}

@app.get("/api/product/{product_id}")
async def get_product(product_id: str):
    p = agent.rag.get_product_details(product_id)
    if not p: raise HTTPException(status_code=404)
    return p

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
