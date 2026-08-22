import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Coffee, Sparkles, Clock, MapPin, CheckCircle2, AlertCircle, RefreshCcw, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { agentApi } from '../services/agentApi';
import { products } from '../data/menuData';
import { useVoice } from '../hooks/useVoice';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800";

const SmartOrder = () => {
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isListening, transcript, startListening, stopListening, supported } = useVoice();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [backendPreview, setBackendPreview] = useState(null);

  // AI Order Builder State
  const [builder, setBuilder] = useState({
    coffee: 'Vanilla Cold Brew',
    milk: 'Oat Milk',
    sweetness: 'Light Sweetness',
    temperature: 'Iced',
    budget: 300
  });

  const [aiRecommendation, setAiRecommendation] = useState({
    product: products.find(p => p.id === 'c4') || products[0],
    customization: 'Oat Milk • Light Sweetness • Iced',
    why: 'Matches your preference for a smooth, low bitterness, lightly sweet iced coffee under ₹300.'
  });

  const handleBuildOrder = () => {
    let matched = products.find(p =>
      (builder.temperature === 'Iced' ? p.temperature === 'Cold' : p.temperature === 'Hot') &&
      p.price <= builder.budget
    ) || products[0];

    if (builder.coffee && builder.coffee !== 'Choose') {
      const explicitMatch = products.find(p => p.name.toLowerCase().includes(builder.coffee.toLowerCase()));
      if (explicitMatch) matched = explicitMatch;
    }

    setAiRecommendation({
      product: matched,
      customization: `${builder.milk} • ${builder.sweetness} • ${builder.temperature}`,
      why: `Handcrafted recommendation matching your preference for ${builder.temperature.toLowerCase()} coffee with ${builder.milk.toLowerCase()} under ₹${builder.budget}.`
    });
  };

  // Sync with backend order-preview endpoint
  useEffect(() => {
    if (transcript) {
      const cmd = transcript.toLowerCase();
      if (cmd.includes("place order") || cmd.includes("confirm order")) {
        if (cart.length > 0) handlePlaceOrder();
      } else if (cmd.includes("clear order") || cmd.includes("empty cart")) {
        clearCart();
      } else if (cmd.includes("build my order")) {
        handleBuildOrder();
      }
    }
  }, [transcript]);

  useEffect(() => {
    const fetchPreview = async () => {
      if (cart.length === 0) {
        setBackendPreview(null);
        return;
      }

      try {
        const items = cart.map(item => ({ id: item.id, quantity: item.quantity }));
        const preview = await agentApi.orderPreview(items);
        setBackendPreview(preview);
      } catch (error) {
        console.error("Backend preview sync error:", error);
        setBackendPreview(null);
      }
    };

    const debounce = setTimeout(fetchPreview, 400);
    return () => clearTimeout(debounce);
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600 shadow-md">
          <CheckCircle2 size={52} />
        </div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase mb-4 border border-green-200">
          <span>Demo Order Confirmed</span>
        </div>
        <h1 className="text-4xl font-serif text-coffee-950 mb-4">Order Preview Ready!</h1>
        <p className="text-coffee-600 mb-8 text-base leading-relaxed">
          Your BrewMind AI grounded selection has been generated. In production, this formatted payload routes directly to the café POS.
        </p>
        <div className="bg-white p-6 rounded-3xl border border-coffee-100 shadow-sm mb-10 text-left">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-coffee-50">
             <span className="text-coffee-400 font-bold text-xs uppercase">Order Reference</span>
             <span className="text-coffee-950 font-bold">#BM-APAC-8841</span>
          </div>
          <div className="flex items-center space-x-3 text-coffee-700 text-sm">
            <MapPin size={18} className="text-amber-500 flex-shrink-0" />
            <span>BrewMind Flagship Café • Barista Station 1</span>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <Link to="/concierge" className="inline-flex items-center space-x-2 px-8 py-4 bg-coffee-950 text-cream-50 rounded-2xl font-bold hover:bg-coffee-800 transition-all shadow-lg">
             <Sparkles size={18} />
             <span>Back to AI Concierge</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-serif text-coffee-950 mb-2 flex items-center">
            <ShoppingBag className="mr-3 text-coffee-950" size={32} />
            Smart Order & AI Builder
          </h1>
          <p className="text-coffee-600 text-sm">Build your custom order with AI guidance or add items directly from recommendations.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-2 rounded-xl border transition-all ${
              isListening ? 'bg-red-500 text-white border-red-600 animate-pulse' : 'bg-white text-coffee-700 border-coffee-200 hover:bg-coffee-100'
            }`}
            title="Voice Commands"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200">
            Demo Mode • Real Grounded Pricing
          </span>
        </div>
      </div>

      {/* AI Order Builder Section */}
      <div className="bg-gradient-to-br from-coffee-950 via-coffee-900 to-coffee-950 text-cream-50 rounded-3xl p-6 sm:p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles size={22} className="text-amber-400" />
          <h2 className="text-2xl font-serif font-bold text-amber-300">AI Order Builder</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Coffee Choice */}
          <div>
            <label className="text-xs font-bold text-cream-300 uppercase tracking-wider block mb-2">☕ Coffee</label>
            <select
              value={builder.coffee}
              onChange={(e) => setBuilder({...builder, coffee: e.target.value})}
              className="w-full p-3 bg-coffee-800 border border-coffee-700 rounded-xl text-cream-50 text-xs font-bold outline-none"
            >
              <option value="Vanilla Cold Brew">Vanilla Cold Brew</option>
              <option value="Smooth Roast">Smooth Roast</option>
              <option value="Nitro Silk Cold Brew">Nitro Silk Cold Brew</option>
              <option value="Velvet Latte">Velvet Latte</option>
              <option value="Amber Cappuccino">Amber Cappuccino</option>
            </select>
          </div>

          {/* Milk Choice */}
          <div>
            <label className="text-xs font-bold text-cream-300 uppercase tracking-wider block mb-2">🥛 Milk</label>
            <select
              value={builder.milk}
              onChange={(e) => setBuilder({...builder, milk: e.target.value})}
              className="w-full p-3 bg-coffee-800 border border-coffee-700 rounded-xl text-cream-50 text-xs font-bold outline-none"
            >
              <option value="Oat Milk">Oat Milk</option>
              <option value="Almond Milk">Almond Milk</option>
              <option value="Whole Dairy Milk">Whole Dairy Milk</option>
              <option value="No Milk (Black)">No Milk (Black)</option>
            </select>
          </div>

          {/* Sweetness */}
          <div>
            <label className="text-xs font-bold text-cream-300 uppercase tracking-wider block mb-2">🍯 Sweetness</label>
            <select
              value={builder.sweetness}
              onChange={(e) => setBuilder({...builder, sweetness: e.target.value})}
              className="w-full p-3 bg-coffee-800 border border-coffee-700 rounded-xl text-cream-50 text-xs font-bold outline-none"
            >
              <option value="Light Sweetness">Light Sweetness</option>
              <option value="Medium Sweetness">Medium Sweetness</option>
              <option value="Unsweetened">Unsweetened</option>
              <option value="Extra Sweet">Extra Sweet</option>
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-xs font-bold text-cream-300 uppercase tracking-wider block mb-2">🌡 Temperature</label>
            <select
              value={builder.temperature}
              onChange={(e) => setBuilder({...builder, temperature: e.target.value})}
              className="w-full p-3 bg-coffee-800 border border-coffee-700 rounded-xl text-cream-50 text-xs font-bold outline-none"
            >
              <option value="Iced">Iced Coffee</option>
              <option value="Hot">Hot Coffee</option>
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs font-bold text-cream-300 uppercase tracking-wider block mb-2">💰 Budget</label>
            <div className="p-2.5 bg-coffee-800 border border-coffee-700 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">₹{builder.budget}</span>
              <input
                type="range"
                min="150"
                max="500"
                step="25"
                value={builder.budget}
                onChange={(e) => setBuilder({...builder, budget: parseInt(e.target.value)})}
                className="w-20 accent-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleBuildOrder}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg"
        >
          <Sparkles size={18} />
          <span>✨ Build My Order</span>
        </button>

        {/* AI Pick Result */}
        {aiRecommendation && (
          <div className="mt-6 pt-6 border-t border-coffee-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <img
                src={aiRecommendation.product.image || DEFAULT_IMAGE}
                alt={aiRecommendation.product.name}
                className="w-16 h-16 rounded-2xl object-cover border border-coffee-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Your BrewMind Pick</span>
                <h4 className="text-lg font-bold text-white">{aiRecommendation.product.name}</h4>
                <p className="text-xs text-cream-200/80">{aiRecommendation.customization} • <strong className="text-amber-300">₹{aiRecommendation.product.price}</strong></p>
                <p className="text-[11px] text-cream-300 italic mt-1">Why: {aiRecommendation.why}</p>
              </div>
            </div>

            <button
              onClick={() => addToCart(aiRecommendation.product, aiRecommendation.customization)}
              className="px-6 py-3 bg-white text-coffee-950 rounded-xl text-xs font-bold hover:bg-cream-100 transition-colors shadow-md flex-shrink-0"
            >
              Add to Smart Order
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-coffee-200 shadow-sm">
              <div className="w-16 h-16 bg-coffee-50 rounded-full flex items-center justify-center mx-auto mb-4 text-coffee-400">
                <Coffee size={32} />
              </div>
              <h3 className="text-xl font-bold text-coffee-950 mb-2">Your Smart Order is empty</h3>
              <p className="text-coffee-600 mb-8 text-sm">Use the AI Builder above or ask the Concierge for recommendations.</p>
              <Link to="/concierge" className="inline-flex items-center space-x-2 px-6 py-3.5 bg-coffee-950 text-cream-50 rounded-xl font-bold shadow-lg">
                 <Sparkles size={18} />
                 <span>Find My Drink with AI</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-5 rounded-3xl border border-coffee-100 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || DEFAULT_IMAGE}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-coffee-950 text-base">{item.name}</h4>
                        <p className="text-xs text-coffee-500">{item.customization || 'Standard Preparation'}</p>
                        <span className="text-xs font-bold text-coffee-950">₹{item.price} each</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-coffee-50 rounded-xl border border-coffee-100 p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-amber-600">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-amber-600">
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="font-bold text-coffee-950 text-base">₹{item.price * item.quantity}</span>

                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-coffee-100 shadow-xl overflow-hidden sticky top-28">
            <div className="bg-coffee-950 p-6 text-cream-50">
              <h3 className="text-lg font-bold">Order Summary</h3>
              <p className="text-xs text-cream-300">Grounded price calculation from knowledge base</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm text-coffee-600">
                <span>Subtotal</span>
                <span>₹{backendPreview ? backendPreview.subtotal : subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-coffee-600">
                <span>GST (5%)</span>
                <span>₹{(backendPreview?.tax ?? tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-coffee-600">
                <span>Store Pickup</span>
                <span className="text-green-600 font-bold uppercase text-xs">Free</span>
              </div>

              {backendPreview && (
                <div className="py-2 px-3 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                   <span className="text-[10px] font-bold text-green-700 uppercase">Grounded Price Validation</span>
                   <CheckCircle2 size={12} className="text-green-600" />
                </div>
              )}

              <div className="pt-4 border-t border-coffee-100 flex justify-between items-center">
                <span className="text-base font-bold text-coffee-950">Total</span>
                <span className="text-2xl font-bold text-coffee-950">₹{(backendPreview?.total ?? total).toFixed(2)}</span>
              </div>

              <button
                disabled={cart.length === 0 || isOrdering}
                onClick={handlePlaceOrder}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 transition-all mt-4 ${
                  cart.length === 0 || isOrdering
                  ? 'bg-coffee-100 text-coffee-300 cursor-not-allowed'
                  : 'bg-coffee-950 text-cream-50 hover:bg-coffee-800 shadow-lg'
                }`}
              >
                {isOrdering ? (
                   <div className="w-5 h-5 border-2 border-cream-50 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Confirm Demo Order</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-coffee-400 mt-3 uppercase tracking-widest font-bold">
                Prototype Demonstration • No Real Payments Charged
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartOrder;
