# BrewMind AI — Grounded Coffee Concierge

> **Google Cloud Gen AI Academy APAC Edition — Track 1: Build and Deploy a Customer-Facing AI Agent**  
> *Lab 1: Build an AI Agent on Cloud Run with ADK and RAG*

---

## Overview

**BrewMind AI** is a customer-facing coffee concierge web application powered by **Google Agent Development Kit (ADK)**, **Gemini**, **Retrieval-Augmented Generation (RAG)**, and containerized for **Google Cloud Run**.

Unlike static menus or generic chatbots, BrewMind AI acts as a grounded coffee advisor. It retrieves real coffee shop products, ingredients, allergens, and active offers from a structured knowledge base, enforcing strict user constraints for budget, caffeine intensity, sweetness, temperature, and dietary safety (lactose, gluten, nuts, vegan).

---

## Key Features

- **Google ADK Agent**: Built using Google's Agent Development Kit Python pattern with system instructions and Python function tools (`search_menu`, `get_product_details`, `find_recommendations`, `check_offers`, `compare_products`, `build_order`).
- **Grounded RAG Retrieval**: Multi-file retrieval system querying `menu.json` (30+ items), `ingredients.json`, `allergens.json`, `offers.json`, `coffee-guide.md`, and `faq.md`.
- **Explainable Recommendations**: Transparent "Why this recommendation?" reasons and calculated match quality badges (`Strong Match`, `Good Match`, `Possible Match`).
- **Dietary Safety Enforcement**: Validates ingredients against allergen matrices to ensure lactose, gluten, and nut restrictions are strictly respected.
- **Side-by-Side Comparison**: Allows users to compare drinks side by side by price, caffeine, sweetness, temperature, and ingredients.
- **Smart Order Integration**: Direct 1-click addition of recommended drinks into a demo order cart with live tax and subtotal calculation.
- **Live Architecture & Health Monitoring**: Technology page dynamically pings `/api/health` to verify system health.
- **One-Click Judging Scenarios**: Pre-configured demo buttons for fast, reproducible judging evaluations.

---

## System Architecture

```
                                +---------------------------+
                                |    Customer Interface     |
                                |       React + Vite        |
                                +-------------+-------------+
                                              |
                                              | HTTP POST /api/chat
                                              v
                                +-------------+-------------+
                                |  FastAPI Server on Cloud  |
                                |     Google Cloud Run      |
                                +-------------+-------------+
                                              |
                                              v
                                +-------------+-------------+
                                |   Google ADK Python Agent |
                                |   - System Instruction    |
                                |   - Tool Execution        |
                                +------+--------------+-----+
                                       |              |
                                       v              v
                  +--------------------+----+    +----+----------------------+
                  |   Gemini 1.5 / Pro LLM |    |   RAG Retrieval System    |
                  |  Language Understanding |    |   Structured & Text Search|
                  +-------------------------+    +------------+--------------+
                                                              |
                                                              v
                                                 +------------+--------------+
                                                 |   Coffee Knowledge Base   |
                                                 |  - menu.json (30+ items)  |
                                                 |  - ingredients.json       |
                                                 |  - allergens.json         |
                                                 |  - offers.json            |
                                                 |  - coffee-guide.md        |
                                                 |  - faq.md                 |
                                                 +---------------------------+
```

---

## Directory Structure

```
BrewMindAI/
├── backend/
│   ├── brewmind_agent/
│   │   ├── __init__.py
│   │   ├── agent.py          # Google ADK Agent logic & Gemini interaction
│   │   ├── rag.py            # RAG Retrieval System & multi-file search
│   │   ├── tools.py          # Agent tools (search_menu, compare, build_order)
│   │   ├── schemas.py        # FastAPI Pydantic request/response schemas
│   │   └── prompts.py        # System instructions & RAG prompt template
│   ├── knowledge/
│   │   ├── menu.json         # 32 Coffee shop products with full metadata
│   │   ├── ingredients.json  # Comprehensive ingredient specifications
│   │   ├── allergens.json    # Allergen safety matrix & cross-contamination rules
│   │   ├── offers.json       # Active promotional discount codes
│   │   ├── coffee-guide.md   # Roast profiles, extraction, caffeine guide
│   │   └── faq.md            # Store hours, policies, customization rules
│   ├── tests/
│   │   ├── test_rag.py       # RAG retrieval, budget, dietary & dynamic RAG proof
│   │   ├── test_tools.py     # Python agent tools execution tests
│   │   └── test_agent.py     # End-to-end agent judging scenarios
│   ├── main.py               # FastAPI server entry point & middleware
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Cloud Run Docker configuration
│   ├── .dockerignore
│   └── .env.example
│
├── src/
│   ├── components/
│   │   └── Layout.jsx        # Navigation header & footer
│   ├── data/
│   │   └── menuData.js       # Synced frontend dataset (32 items)
│   ├── hooks/
│   │   └── useCart.js        # Cart state hook
│   ├── pages/
│   │   ├── AIConcierge.jsx   # Main AI Concierge chat, explainability, grounding
│   │   ├── Technology.jsx    # Live architecture diagram & health monitor
│   │   ├── TasteProfile.jsx  # Customer flavor profile & budget configuration
│   │   ├── SmartOrder.jsx    # Smart order preview & cart breakdown
│   │   ├── Menu.jsx          # Interactive menu grid & category filter
│   │   ├── Home.jsx          # Hero page & quick features
│   │   └── About.jsx         # Track 1 problem, solution & architecture alignment
│   ├── services/
│   │   └── agentApi.js       # API client for backend communications
│   ├── App.jsx
│   └── index.css
│
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server health, agent status, and RAG menu item count. |
| `POST` | `/api/chat` | Main agent endpoint. Accepts `message`, `tasteProfile`, `mood`, `budget`, `dietaryRestrictions`. |
| `POST` | `/api/recommend` | Direct recommendation query endpoint. |
| `POST` | `/api/compare` | Returns side-by-side comparison for two product IDs. |
| `POST` | `/api/order-preview` | Calculates subtotal, 5% tax, and order total for item IDs. |
| `GET` | `/api/product/{id}` | Retrieves detailed metadata for a single menu product. |

---

## Local Development Guide

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
# Activate virtual environment (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set Gemini API Key (optional for local testing)
set GOOGLE_API_KEY=your_gemini_api_key_here

# Run FastAPI backend server
python main.py
# Backend will start at http://localhost:8080
```

### 2. Frontend Setup

```bash
# From the root directory
npm install

# Start Vite dev server
npm run dev
# Frontend will start at http://localhost:5173
```

---

## Running Evaluation Suite

```bash
# From the backend directory with pytest installed
pytest tests/ -v
```

The test suite validates:
1. `test_budget_filtering`: Confirms budget constraints are strictly respected.
2. `test_dietary_filtering_lactose`: Validates dairy exclusion for lactose intolerant users.
3. `test_vegan_cold_drink`: Validates vegan & cold drink matching.
4. `test_grounding_sources_retrieval`: Verifies grounding sources are returned.
5. `test_rag_dynamic_update_proof`: **Phase 21 RAG Quality Test** — Dynamically modifies knowledge base records to prove answers are generated from RAG retrieval rather than hard-coded text.

---

## Google Cloud Run Deployment Guide

```bash
# 1. Set your GCP Project ID
gcloud config set project YOUR_GCP_PROJECT_ID

# 2. Build backend container image using Cloud Build
gcloud builds submit --tag gcr.io/YOUR_GCP_PROJECT_ID/brewmind-backend ./backend

# 3. Deploy to Google Cloud Run
gcloud run deploy brewmind-backend \
    --image gcr.io/YOUR_GCP_PROJECT_ID/brewmind-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars GOOGLE_API_KEY=YOUR_GEMINI_API_KEY

# 4. Update VITE_API_BASE_URL in frontend environment variables to point to your Cloud Run URL.
```

---

## Verification & Judging Flow

1. Open **AI Concierge**.
2. Click **`☕ Cold + Strong`** or enter:  
   `"I need a cold, strong coffee with low sweetness under ₹250."`
3. Observe real ADK recommendation (**Nitro Silk Cold Brew**), transparent **"Why this recommendation?"** breakdown, and **"Grounded in BrewMind Knowledge"** source tags.
4. Click **`🥛 Dairy-Free`** or enter:  
   `"Is Nitro Silk Cold Brew dairy-free?"`  
   Verify RAG allergen checking.
5. Click **`⚖️ Compare Drinks`** to view the side-by-side comparison.
6. Click **Add to Smart Order** -> Navigate to **Smart Order** page to view demo order preview.
7. Open **Technology** page -> Verify live `/api/health` architecture monitoring.

---

## License & Credits

Built for **Google Cloud Gen AI Academy APAC Edition — Track 1**. Powered by Google ADK, Gemini, FastAPI, React, and Google Cloud Run.
