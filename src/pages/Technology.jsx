import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Server, Database, Globe, Layers, Zap, Search, Sparkles, CheckCircle2, XCircle, RefreshCcw, ArrowDown, FileText, Filter } from 'lucide-react';
import { agentApi } from '../services/agentApi';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800";

const Technology = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  // RAG Search Dashboard state
  const [searchQuery, setSearchQuery] = useState('sweet cold coffee');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await agentApi.health();
      setHealth(res);
    } catch (e) {
      setHealth({ status: 'offline', agent: false, retrieval: false, productCount: 32, gemini: false });
    } finally {
      setLoading(false);
    }
  };

  const handleRagSearch = async (query) => {
    const q = query || searchQuery;
    if (!q.trim()) return;
    setSearching(true);
    try {
      const res = await agentApi.searchKnowledge(q);
      setSearchResults(res);
    } catch (e) {
      console.error("RAG search error", e);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    handleRagSearch('sweet cold coffee');
  }, []);

  const metrics = [
    { label: "32 Products", sub: "Grounded Knowledge Base" },
    { label: "5 Categories", sub: "Hot, Cold, Tea, Snacks, Desserts" },
    { label: "3 Knowledge Sources", sub: "menu, ingredients, allergens" },
    { label: "AI Agent", sub: "Google ADK Function Tools" },
    { label: "RAG Retrieval", sub: "TF-IDF Vector Similarity" },
    { label: "Personalization", sub: "Taste Profile Alignment" }
  ];

  const presetQueries = [
    "strong coffee",
    "sweet cold coffee",
    "coffee without nuts",
    "milk-based drinks",
    "coffee under ₹250",
    "low caffeine"
  ];

  const techStack = [
    {
      name: "React 18 + Vite",
      type: "Frontend Web Application",
      description: "Fast customer interface built with React 18, Vite, Tailwind CSS, Framer Motion, and Web Speech API.",
      icon: <Globe className="text-blue-500" size={24} />
    },
    {
      name: "BrewMind ADK Agent",
      type: "Agentic Logic",
      description: "Python AI Agent built with Google Agent Development Kit framework executing tools like search_menu, compare_products, check_allergens.",
      icon: <Cpu className="text-purple-500" size={24} />
    },
    {
      name: "Gemini 1.5 Flash",
      type: "LLM Intelligence",
      description: "Multimodal language intelligence generating natural, conversational, grounded recommendation summaries.",
      icon: <Zap className="text-amber-500" size={24} />
    },
    {
      name: "Semantic Vector RAG",
      type: "Knowledge Retrieval",
      description: "Retrieval-Augmented Generation using TF-IDF term-frequency similarity matching over menu.json (32 products), ingredients, and allergens.",
      icon: <Search className="text-green-500" size={24} />
    },
    {
      name: "Google Cloud Run",
      type: "Serverless Microservice",
      description: "Containerized Python FastAPI server configured for Google Cloud Run serverless deployment.",
      icon: <Server className="text-blue-600" size={24} />
    },
    {
      name: "Tailwind Design System",
      type: "Café Aesthetic",
      description: "Warm cream & coffee color palette, micro-animations, accessible buttons, and responsive viewports.",
      icon: <Layers className="text-cyan-500" size={24} />
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-coffee-100 text-coffee-800 text-xs font-bold tracking-widest uppercase mb-4 border border-coffee-200">
          <span>Gen AI Academy APAC Edition Architecture</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-coffee-950 mb-4">RAG Architecture & Knowledge Base</h1>
        <p className="text-coffee-600 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          Track 1: Build and Deploy a Customer-Facing AI Agent. Grounded retrieval over 32 coffee products.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-coffee-100 shadow-sm text-center">
            <span className="text-sm font-bold text-coffee-950 block">{m.label}</span>
            <span className="text-[10px] text-coffee-500 font-medium block mt-0.5">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Live System Health Banner */}
      <div className="glass p-8 rounded-3xl border border-coffee-100 shadow-lg mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${health?.status === 'healthy' ? 'bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`}></div>
            <div>
              <h4 className="font-bold text-coffee-950 text-lg flex items-center">
                Live Backend Integration Status
                <button onClick={fetchHealth} className="ml-3 text-coffee-400 hover:text-coffee-950 transition-colors">
                  <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
                </button>
              </h4>
              <p className="text-xs text-coffee-600 font-medium">
                {health?.status === 'healthy' ? `Healthy • ${health?.productCount || 32} Products Loaded • Gemini Model Active` : 'Server Standby / Offline'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="bg-white p-3 rounded-2xl border border-coffee-100 text-center">
              <span className="text-[10px] font-bold text-coffee-400 uppercase block">Frontend</span>
              <span className="text-xs font-bold text-green-600 flex items-center justify-center mt-1">
                <CheckCircle2 size={12} className="mr-1" /> Connected
              </span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-coffee-100 text-center">
              <span className="text-[10px] font-bold text-coffee-400 uppercase block">AI Agent</span>
              <span className={`text-xs font-bold flex items-center justify-center mt-1 ${health?.agent ? 'text-green-600' : 'text-amber-600'}`}>
                {health?.agent ? <><CheckCircle2 size={12} className="mr-1" /> Active</> : <><XCircle size={12} className="mr-1" /> Standby</>}
              </span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-coffee-100 text-center">
              <span className="text-[10px] font-bold text-coffee-400 uppercase block">RAG Retrieval</span>
              <span className={`text-xs font-bold flex items-center justify-center mt-1 ${health?.retrieval ? 'text-green-600' : 'text-amber-600'}`}>
                {health?.retrieval ? <><CheckCircle2 size={12} className="mr-1" /> Active</> : <><XCircle size={12} className="mr-1" /> Offline</>}
              </span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-coffee-100 text-center">
              <span className="text-[10px] font-bold text-coffee-400 uppercase block">Cloud Run</span>
              <span className="text-xs font-bold text-blue-600 flex items-center justify-center mt-1">
                <CheckCircle2 size={12} className="mr-1" /> Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live RAG Knowledge Base Search Widget */}
      <section className="mb-20">
        <div className="bg-coffee-950 text-cream-50 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-coffee-800">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            <Search size={16} />
            <span>Search BrewMind Knowledge Base</span>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Live RAG Knowledge Retriever</h2>
          <p className="text-xs sm:text-sm text-cream-200/80 mb-6">
            Test real-time retrieval over menu items, ingredient lists, and allergen records.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleRagSearch(); }} className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge: strong coffee, milk-based drinks, nut-free..."
              className="flex-grow p-3.5 bg-coffee-900 border border-coffee-700 rounded-2xl text-cream-50 text-xs font-bold outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs transition-all shadow-md flex items-center space-x-2"
            >
              <Search size={16} />
              <span>{searching ? "Retrieving..." : "Search RAG"}</span>
            </button>
          </form>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {presetQueries.map((query, idx) => (
              <button
                key={idx}
                onClick={() => { setSearchQuery(query); handleRagSearch(query); }}
                className="text-xs bg-coffee-900/90 border border-coffee-700 text-cream-200 hover:text-white px-3 py-1.5 rounded-xl hover:border-amber-400 transition-colors"
              >
                "{query}"
              </button>
            ))}
          </div>

          {/* Search Results Display */}
          {searchResults && (
            <div className="bg-coffee-900/90 p-6 rounded-2xl border border-coffee-700 space-y-4">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-coffee-800">
                <span className="font-bold text-amber-300">Query: "{searchResults.query}"</span>
                <span className="text-cream-200">{searchResults.count} Products Matched</span>
              </div>

              {/* Retrieved Document Cards */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">Retrieved Sources:</span>
                <div className="flex flex-wrap gap-2">
                  {searchResults.retrieved_documents?.map((doc, idx) => (
                    <span key={idx} className="bg-coffee-950 px-2.5 py-1 rounded-lg text-xs border border-coffee-800 text-cream-100 font-mono">
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Matching Products Grid */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-2">Top Grounded Product Matches:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {searchResults.matching_products?.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="bg-coffee-950 p-3 rounded-xl border border-coffee-800 flex items-center space-x-3">
                      <img
                        src={item.image || DEFAULT_IMAGE}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-xs text-white">{item.name}</h4>
                        <p className="text-[10px] text-amber-400 font-bold">₹{item.price} • {item.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RAG Visualization Architecture Diagram */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-coffee-950 mb-8 text-center">BrewMind RAG Flowchart Diagram</h2>
        <div className="relative glass p-8 sm:p-12 rounded-[2.5rem] border border-coffee-100 overflow-hidden shadow-xl">
          <div className="flex flex-col items-center space-y-4 relative z-10 max-w-3xl mx-auto text-center">

            {/* Step 1 */}
            <div className="w-full max-w-md p-4 bg-white rounded-2xl border border-coffee-200 shadow-sm">
              <span className="text-[10px] font-bold text-coffee-400 uppercase tracking-widest block mb-1">Step 1</span>
              <h3 className="font-bold text-coffee-950 text-sm">User Question</h3>
              <p className="text-xs text-coffee-600">"Recommend a cold, smooth coffee with low bitterness under ₹300."</p>
            </div>

            <ArrowDown className="text-amber-500 animate-bounce" size={20} />

            {/* Step 2 */}
            <div className="w-full max-w-md p-4 bg-white rounded-2xl border border-coffee-200 shadow-sm">
              <span className="text-[10px] font-bold text-coffee-400 uppercase tracking-widest block mb-1">Step 2</span>
              <h3 className="font-bold text-coffee-950 text-sm">Query Understanding</h3>
              <p className="text-xs text-coffee-600">Extract constraints: price &lt;= 300, temperature=cold, bitterness=low</p>
            </div>

            <ArrowDown className="text-amber-500" size={20} />

            {/* Step 3 */}
            <div className="w-full max-w-md p-4 bg-coffee-950 text-cream-50 rounded-2xl shadow-lg">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Step 3</span>
              <h3 className="font-bold text-sm">BrewMind Agent</h3>
              <p className="text-xs text-cream-200/80">Executes tools: search_menu(), filter_by_budget(), check_allergens()</p>
            </div>

            <ArrowDown className="text-amber-500" size={20} />

            {/* Step 4 */}
            <div className="w-full max-w-lg p-5 bg-green-50 rounded-2xl border-2 border-green-200 shadow-sm">
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest block mb-2">Step 4 • RAG Retrieval</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <span className="bg-white p-2 rounded-xl text-[10px] font-bold text-coffee-900 border border-green-200">menu.json (32 items)</span>
                <span className="bg-white p-2 rounded-xl text-[10px] font-bold text-coffee-900 border border-green-200">ingredients.json</span>
                <span className="bg-white p-2 rounded-xl text-[10px] font-bold text-coffee-900 border border-green-200">allergens.json</span>
                <span className="bg-white p-2 rounded-xl text-[10px] font-bold text-coffee-900 border border-green-200">Taste Profile</span>
              </div>
            </div>

            <ArrowDown className="text-amber-500" size={20} />

            {/* Step 5 */}
            <div className="w-full max-w-md p-4 bg-white rounded-2xl border border-coffee-200 shadow-sm">
              <span className="text-[10px] font-bold text-coffee-400 uppercase tracking-widest block mb-1">Step 5</span>
              <h3 className="font-bold text-coffee-950 text-sm">Relevant Context + Gemini 1.5</h3>
              <p className="text-xs text-coffee-600">Combines candidate items + prompt instructions for grounded inference</p>
            </div>

            <ArrowDown className="text-amber-500" size={20} />

            {/* Step 6 */}
            <div className="w-full max-w-md p-5 bg-amber-50 rounded-2xl border-2 border-amber-300 shadow-md">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block mb-1">Step 6</span>
              <h3 className="font-bold text-coffee-950 text-sm">Grounded Response + Sources</h3>
              <p className="text-xs text-coffee-800">Outputs Vanilla Cold Brew (₹230) + Why bullet points + 📄 menu.json source chip</p>
            </div>

          </div>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {techStack.map((tech, index) => (
          <div key={index} className="bg-white p-6 rounded-3xl border border-coffee-100 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-coffee-50 flex items-center justify-center mb-4">
                {tech.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-coffee-400 block mb-1">{tech.type}</span>
              <h3 className="text-lg font-bold text-coffee-950 mb-2">{tech.name}</h3>
              <p className="text-coffee-700 text-xs leading-relaxed">{tech.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Technology;
