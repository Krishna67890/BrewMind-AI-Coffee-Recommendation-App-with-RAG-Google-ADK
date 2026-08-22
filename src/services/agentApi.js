/**
 * BrewMind AI API Service
 *
 * Communicates with the Python Google ADK Agent & RAG Backend on Cloud Run or Local Host.
 */

const RENDER_URL = 'https://brewmind-ai-coffee-recommendation-app.onrender.com';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || RENDER_URL;
console.log('🚀 BrewMind AI Connecting to:', API_BASE_URL);

class AgentApi {
  /**
   * Send a chat message to the BrewMind AI Agent
   */
  async chat(payload) {
    try {
      console.log('📡 Sending request to:', `${API_BASE_URL}/api/chat`);
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('❌ Server Response Error:', errorBody);
        throw new Error('BrewMind AI is temporarily unavailable.');
      }

      return await response.json();
    } catch (error) {
      console.error('API Chat Error:', error);
      throw error;
    }
  }

  /**
   * Compare two products side-by-side
   */
  async compare(productIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_ids: productIds }),
      });
      if (!response.ok) throw new Error('Comparison failed');
      return await response.json();
    } catch (error) {
      console.error('API Compare Error:', error);
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/product/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('API GetProduct Error:', error);
      throw error;
    }
  }

  /**
   * Get raw grounding source content for drawer modal
   */
  async getSource(sourceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sources/${encodeURIComponent(sourceId)}`);
      if (!response.ok) throw new Error('Source details unavailable');
      return await response.json();
    } catch (error) {
      console.error('API GetSource Error:', error);
      return { id: sourceId, content: `Retrieved knowledge source: ${sourceId}` };
    }
  }

  /**
   * Search knowledge base for RAG Search dashboard
   */
  async searchKnowledge(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/knowledge/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, top_k: 5 }),
      });
      if (!response.ok) throw new Error('Knowledge search failed');
      return await response.json();
    } catch (error) {
      console.error('API SearchKnowledge Error:', error);
      return { success: false, query, retrieved_documents: [], matching_products: [], context_snippet: "No matching context" };
    }
  }

  /**
   * Generate Order Preview (Subtotal, Tax, Total)
   */
  async orderPreview(items) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/order-preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!response.ok) throw new Error('Order preview failed');
      return await response.json();
    } catch (error) {
      console.error('API OrderPreview Error:', error);
      throw error;
    }
  }

  /**
   * Dynamic Health Check
   */
  async health() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (response.ok) {
        return await response.json();
      }
      return { status: 'offline', agent: false, retrieval: false, productCount: 0, gemini: false };
    } catch (error) {
      return { status: 'offline', agent: false, retrieval: false, productCount: 0, gemini: false };
    }
  }
}

export const agentApi = new AgentApi();
