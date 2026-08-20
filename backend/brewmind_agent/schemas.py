from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TasteProfile(BaseModel):
    caffeine: Optional[str] = 'medium'
    sweetness: Optional[str] = 'medium'
    temperature: Optional[str] = 'hot'
    milk: Optional[str] = 'dairy'

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message or query")
    tasteProfile: Optional[Dict[str, Any]] = None
    mood: Optional[str] = None
    budget: Optional[float] = 1000.0
    dietaryRestrictions: Optional[List[str]] = []

class ProductRecommendation(BaseModel):
    id: str
    name: str
    category: str
    price: float
    description: str
    temperature: str
    caffeine: str
    sweetness: str
    milk_options: List[str] = []
    ingredients: List[str] = []
    allergens: List[str] = []
    dietary_tags: List[str] = []
    best_for: List[str] = []
    availability: bool = True
    matchQuality: Optional[str] = "Strong Match"
    matchScore: Optional[int] = 95

class GroundingSource(BaseModel):
    type: str
    id: str
    name: str

class GroundingMetadata(BaseModel):
    sources: List[GroundingSource]

class ChatResponse(BaseModel):
    message: str
    recommendations: List[Dict[str, Any]] = []
    reasons: List[str] = []
    groundingSources: List[str] = []
    grounding: Optional[Dict[str, Any]] = None
    preferencesUsed: Optional[Dict[str, Any]] = None

class ComparisonRequest(BaseModel):
    product_ids: List[str]

class OrderItem(BaseModel):
    id: str
    quantity: int = 1

class OrderPreviewRequest(BaseModel):
    items: List[OrderItem]

class HealthResponse(BaseModel):
    status: str
    agent: bool
    retrieval: bool
    timestamp: str
    service: str = "BrewMind AI Concierge"
