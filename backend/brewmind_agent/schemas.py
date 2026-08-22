from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    tasteProfile: Optional[Dict[str, Any]] = None
    mood: Optional[str] = None
    budget: Optional[float] = 1000.0
    dietaryRestrictions: Optional[List[str]] = []
    history: Optional[List[Dict[str, Any]]] = []
    persona: Optional[str] = "Classic Barista"
    cartItems: Optional[List[Dict[str, Any]]] = []
    isDiscovery: Optional[bool] = False
    previousOrders: Optional[List[str]] = []
    pageContext: Optional[str] = "HOME"

class ComparisonRequest(BaseModel):
    product_ids: List[str]

class OrderItem(BaseModel):
    id: str
    quantity: int = 1

class OrderPreviewRequest(BaseModel):
    items: List[OrderItem]

class KnowledgeSearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5
