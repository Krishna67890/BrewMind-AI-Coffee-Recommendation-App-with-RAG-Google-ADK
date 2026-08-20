import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Coffee, Thermometer, Zap, Droplets, Sparkles, AlertCircle, Tag, Check, X, ShoppingBag, Eye, Info, Mic } from 'lucide-react';
import { products, categories } from '../data/menuData';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useVoice } from '../hooks/useVoice';

const DEFAULT_COFFEE_IMAGE = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800";

const Menu = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isListening, transcript, startListening, stopListening, speak, supported } = useVoice();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  // Filter state
  const [maxPrice, setMaxPrice] = useState(500);
  const [roastFilter, setRoastFilter] = useState('All');
  const [bitternessFilter, setBitternessFilter] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('All');

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  const handleAskBrewMind = (product) => {
    setSelectedProductModal(null);
    navigate('/concierge', { state: { initialMessage: `Tell me more about ${product.name} (₹${product.price}). Why do you recommend it?` } });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = product.price <= maxPrice;
      const matchesRoast = roastFilter === 'All' || product.roast === roastFilter;
      const matchesBitterness = bitternessFilter === 'All' || product.bitterness === bitternessFilter;

      let matchesDietary = true;
      if (dietaryFilter !== 'All') {
        const pTags = [
          ...(product.dietary_tags || []),
          ...(product.dietaryTags || [])
        ].map(t => t.toLowerCase());
        const pAllergens = (product.allergens || []).map(a => a.toLowerCase());

        if (dietaryFilter === 'Dairy-Free') {
          matchesDietary = pTags.includes('dairy-free') || !pAllergens.includes('dairy');
        } else if (dietaryFilter === 'Vegan') {
          matchesDietary = pTags.includes('vegan');
        } else if (dietaryFilter === 'Gluten-Free') {
          matchesDietary = pTags.includes('gluten-free') || !pAllergens.includes('gluten');
        } else if (dietaryFilter === 'Nut-Free') {
          matchesDietary = !pAllergens.includes('nuts');
        }
      }

      return matchesCategory && matchesSearch && matchesPrice && matchesRoast && matchesBitterness && matchesDietary;
    });
  }, [activeCategory, searchQuery, maxPrice, roastFilter, bitternessFilter, dietaryFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-coffee-100 text-coffee-800 text-xs font-bold tracking-widest uppercase mb-3 border border-coffee-200">
            <Sparkles size={14} className="text-amber-500" />
            <span>32 Grounded Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-coffee-950 mb-2">Our Coffee Menu</h1>
          <p className="text-coffee-600 text-base">Handcrafted coffee, teas, snacks, and desserts grounded in real store specifications.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
            <input
              type="text"
              placeholder="Search coffee, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-white border border-coffee-100 rounded-2xl focus:ring-2 focus:ring-coffee-200 focus:border-coffee-300 outline-none transition-all text-sm"
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-coffee-400 hover:text-coffee-600'
              }`}
              title="Search with Voice"
            >
              <Mic size={18} />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl border transition-all text-sm font-bold ${
              showFilters ? 'bg-coffee-950 text-cream-50 border-coffee-950 shadow-md' : 'bg-white text-coffee-700 border-coffee-100 hover:bg-coffee-50'
            }`}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Expandable Advanced Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-white p-6 rounded-3xl border border-coffee-100 shadow-lg overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-coffee-100">
              <h3 className="font-bold text-coffee-950 text-base flex items-center">
                <Filter size={16} className="mr-2 text-amber-500" /> Advanced Menu Filters
              </h3>
              <button
                onClick={() => {
                  setMaxPrice(500);
                  setRoastFilter('All');
                  setBitternessFilter('All');
                  setDietaryFilter('All');
                }}
                className="text-xs text-amber-700 font-bold hover:underline"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              {/* Max Price Slider */}
              <div>
                <div className="flex justify-between font-bold text-coffee-700 mb-2">
                  <span>Max Budget</span>
                  <span className="text-coffee-950 font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="500"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-coffee-950 cursor-pointer"
                />
              </div>

              {/* Roast Level */}
              <div>
                <label className="font-bold text-coffee-700 block mb-2">Roast Profile</label>
                <select
                  value={roastFilter}
                  onChange={(e) => setRoastFilter(e.target.value)}
                  className="w-full p-2.5 bg-coffee-50 border border-coffee-200 rounded-xl font-bold text-coffee-950"
                >
                  <option value="All">All Roasts</option>
                  <option value="Light">Light Roast</option>
                  <option value="Medium">Medium Roast</option>
                  <option value="Dark">Dark Roast</option>
                  <option value="Cold Brew">Cold Brew</option>
                </select>
              </div>

              {/* Bitterness Level */}
              <div>
                <label className="font-bold text-coffee-700 block mb-2">Bitterness Level</label>
                <select
                  value={bitternessFilter}
                  onChange={(e) => setBitternessFilter(e.target.value)}
                  className="w-full p-2.5 bg-coffee-50 border border-coffee-200 rounded-xl font-bold text-coffee-950"
                >
                  <option value="All">All Bitterness Levels</option>
                  <option value="Low">Low Bitterness</option>
                  <option value="Medium">Medium Bitterness</option>
                  <option value="High">High Bitterness</option>
                </select>
              </div>

              {/* Dietary Filter */}
              <div>
                <label className="font-bold text-coffee-700 block mb-2">Dietary Safety</label>
                <select
                  value={dietaryFilter}
                  onChange={(e) => setDietaryFilter(e.target.value)}
                  className="w-full p-2.5 bg-coffee-50 border border-coffee-200 rounded-xl font-bold text-coffee-950"
                >
                  <option value="All">All Options</option>
                  <option value="Dairy-Free">Dairy-Free</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Nut-Free">Nut-Free</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeCategory === 'All' ? 'bg-coffee-950 text-cream-50 shadow-md' : 'bg-white text-coffee-700 border border-coffee-100 hover:bg-coffee-50'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map(cat => {
          const count = products.filter(p => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat ? 'bg-coffee-950 text-cream-50 shadow-md' : 'bg-white text-coffee-700 border border-coffee-100 hover:bg-coffee-50'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* 32 Product Grid with High Quality Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-coffee-100 shadow-sm hover:shadow-xl hover:shadow-coffee-950/10 transition-all flex flex-col"
            >
              {/* Product Photo */}
              <div
                className="aspect-[4/3] bg-coffee-100 relative overflow-hidden cursor-pointer"
                onClick={() => setSelectedProductModal(product)}
              >
                <img
                  src={product.image || DEFAULT_COFFEE_IMAGE}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_COFFEE_IMAGE;
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-cream-50 shadow-sm">
                  {product.category}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-coffee-950 text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-lg">
                    <Eye size={14} />
                    <span>View Product Specs</span>
                  </span>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      onClick={() => setSelectedProductModal(product)}
                      className="text-base font-bold text-coffee-950 group-hover:text-coffee-600 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <span className="font-bold text-coffee-950 text-base">₹{product.price}</span>
                  </div>

                  <p className="text-xs text-coffee-600 mb-3 line-clamp-2">{product.description}</p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Roast, Bitterness & Caffeine Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {product.roast && product.roast !== 'N/A' && (
                      <span className="bg-coffee-50 text-coffee-800 font-bold px-2 py-0.5 rounded border border-coffee-100">
                        {product.roast} Roast
                      </span>
                    )}
                    {product.bitterness && (
                      <span className="bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                        {product.bitterness} Bitterness
                      </span>
                    )}
                    {product.dietary_tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAskBrewMind(product)}
                      className="flex-1 py-2.5 bg-coffee-50 hover:bg-coffee-950 hover:text-white text-coffee-950 rounded-xl text-xs font-bold transition-all border border-coffee-200 flex items-center justify-center space-x-1"
                    >
                      <span>Ask BrewMind</span>
                      <Sparkles size={12} />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center"
                      title="Add to Smart Order"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-coffee-200 mt-6">
          <div className="bg-coffee-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-coffee-300">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-coffee-950 mb-2">No matching products found</h3>
          <p className="text-coffee-600 text-sm">Try broadening your search query or adjusting your filters.</p>
        </div>
      )}

      {/* Product Detail Drawer Modal */}
      {selectedProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-coffee-100 max-h-[90vh] flex flex-col relative overflow-hidden">
            <button
              onClick={() => setSelectedProductModal(null)}
              className="absolute top-4 right-4 bg-coffee-100 hover:bg-coffee-950 hover:text-white text-coffee-700 p-2 rounded-full transition-colors z-10"
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto pr-1 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={selectedProductModal.image || DEFAULT_COFFEE_IMAGE}
                  alt={selectedProductModal.name}
                  className="w-full sm:w-48 h-48 rounded-2xl object-cover border border-coffee-200 flex-shrink-0 shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_COFFEE_IMAGE;
                  }}
                />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {selectedProductModal.category}
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-coffee-950 mt-2">{selectedProductModal.name}</h2>
                  <p className="text-2xl font-bold text-coffee-950 my-1">₹{selectedProductModal.price}</p>
                  <p className="text-xs text-coffee-600 leading-relaxed mt-2">{selectedProductModal.description}</p>
                </div>
              </div>

              {/* Taste Profile Specs Grid */}
              <div className="bg-coffee-50 p-4 rounded-2xl border border-coffee-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-coffee-500 font-medium block text-[10px] uppercase">Roast Level</span>
                  <span className="font-bold text-coffee-950">{selectedProductModal.roast || 'Medium'}</span>
                </div>
                <div>
                  <span className="text-coffee-500 font-medium block text-[10px] uppercase">Bitterness</span>
                  <span className="font-bold text-coffee-950">{selectedProductModal.bitterness || 'Low'}</span>
                </div>
                <div>
                  <span className="text-coffee-500 font-medium block text-[10px] uppercase">Sweetness</span>
                  <span className="font-bold text-coffee-950">{selectedProductModal.sweetness || 'Medium'}</span>
                </div>
                <div>
                  <span className="text-coffee-500 font-medium block text-[10px] uppercase">Caffeine</span>
                  <span className="font-bold text-coffee-950">{selectedProductModal.caffeine || 'Medium'}</span>
                </div>
              </div>

              {/* Ingredients & Allergens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-4 rounded-2xl border border-coffee-100">
                  <h4 className="font-bold text-coffee-950 mb-2 flex items-center">
                    <Coffee size={14} className="mr-1 text-amber-600" /> Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedProductModal.ingredients?.map((ing, i) => (
                      <span key={i} className="bg-coffee-50 text-coffee-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-coffee-100">
                  <h4 className="font-bold text-coffee-950 mb-2 flex items-center">
                    <AlertCircle size={14} className="mr-1 text-red-500" /> Allergens Matrix
                  </h4>
                  {selectedProductModal.allergens && selectedProductModal.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedProductModal.allergens.map((alg, i) => (
                        <span key={i} className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded text-[11px]">
                          ⚠️ {alg}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-green-700 font-bold text-[11px] bg-green-50 px-2 py-0.5 rounded">
                      ✓ No major allergens listed
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => handleAskBrewMind(selectedProductModal)}
                  className="flex-1 py-3.5 bg-coffee-950 text-cream-50 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 hover:bg-coffee-800 transition-colors shadow-md"
                >
                  <Sparkles size={16} />
                  <span>Ask BrewMind About This Product</span>
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProductModal);
                    setSelectedProductModal(null);
                  }}
                  className="py-3.5 px-6 bg-amber-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 hover:bg-amber-600 transition-colors shadow-md"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Smart Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
