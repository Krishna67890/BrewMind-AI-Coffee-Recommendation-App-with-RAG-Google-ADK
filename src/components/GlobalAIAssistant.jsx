import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Send, X, Sparkles, Volume2, VolumeX, FastForward, ShoppingBag,
  Award, Check, Database, ShieldAlert, ChevronUp, Bot, FileText
} from 'lucide-react';
import { agentApi } from '../services/agentApi';
import { useCart } from '../hooks/useCart';
import { useVoice } from '../hooks/useVoice';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800";

const PAGE_SUGGESTIONS = {
  '/': [
    { label: "✨ Surprise Me", query: "Surprise me with a great coffee or tea recommendation!" },
    { label: "☕ Find Coffee for Me", query: "Help me choose a great coffee matching my taste profile." },
    { label: "🍵 Coffee vs Tea?", query: "Should I get coffee or tea for my mood today?" }
  ],
  '/menu': [
    { label: "🍦 Something Sweet", query: "Show me sweet cold coffees on the menu." },
    { label: "🧊 Smooth Cold Brew", query: "I want a smooth cold brew under ₹300." },
    { label: "💰 Under ₹250", query: "What are the best drinks under ₹250?" },
    { label: "🌱 Vegan Drinks", query: "Show me dairy-free, vegan options on the menu." }
  ],
  '/taste-profile': [
    { label: "🎯 Analyze My Taste", query: "Based on my taste profile, what drinks suit me best?" },
    { label: "☕ Recommend Roast", query: "What roast and bitterness level fits my taste profile?" }
  ],
  '/order': [
    { label: "🛒 What's In My Order?", query: "What's in my current order and what is my total?" },
    { label: "🥐 Food Pairing", query: "What snack or food pairs well with my current order?" },
    { label: "🧹 Clear Order", query: "Clear my current order" }
  ],
  '/about': [
    { label: "📱 Coffee Shop App", query: "Tell me about the companion Coffee Shop App and APK." },
    { label: "💡 Why BrewMind?", query: "Why was BrewMind AI created?" }
  ],
  '/technology': [
    { label: "🧠 How RAG Works", query: "How does the RAG knowledge retrieval pipeline work?" },
    { label: "🛠️ Agent Tools", query: "What tools does the BrewMind AI agent execute?" }
  ]
};

const GlobalAIAssistant = () => {
  const { cart, addToCart, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hey! 👋 I'm BrewMind, your site-wide AI Barista. I'm right here on every page to answer menu questions, recommend coffee or tea, check allergens, and help build your order!",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);

  const { isListening, transcript, error, isSpeaking, startListening, stopListening, speak, stopSpeaking, supported } = useVoice();
  const [voiceState, setVoiceState] = useState('IDLE'); // IDLE, LISTENING, RETRIEVING, RESPONDING, SPEAKING, ERROR

  const messagesEndRef = useRef(null);

  // Determine current page context
  const getPageContextLabel = () => {
    switch (location.pathname) {
      case '/': return 'HOME';
      case '/menu': return 'MENU';
      case '/taste-profile': return 'TASTE_PROFILE';
      case '/order': return 'SMART_ORDER';
      case '/about': return 'ABOUT';
      case '/technology': return 'TECHNOLOGY';
      default: return 'HOME';
    }
  };

  useEffect(() => {
    if (transcript) {
      const cmd = transcript.toLowerCase();
      // Handle page navigation in GlobalAIAssistant too if needed,
      // but primarily we want to handle chat if the drawer is open.
      if (isOpen) {
        setInput(transcript);
        handleSend(transcript);
      }
    }
  }, [transcript]);

  useEffect(() => {
    if (isListening) setVoiceState('LISTENING');
    else if (isSpeaking) setVoiceState('SPEAKING');
    else if (voiceState !== 'RETRIEVING' && voiceState !== 'RESPONDING' && voiceState !== 'ERROR') setVoiceState('IDLE');
  }, [isListening, isSpeaking]);

  const toggleVoiceInput = () => {
    if (!supported) {
      alert("Voice recognition is not supported in this browser. You can continue using text chat!");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakMessage = (text) => {
    if (isMuted) return;
    speak(text, () => {
      setVoiceState('IDLE');
    });
  };

  const stopSpeech = () => {
    stopSpeaking();
    setVoiceState('IDLE');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSend = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Handle Voice Cart Commands
    const msgLower = messageText.toLowerCase();
    if (msgLower.includes("clear my order") || msgLower.includes("clear order")) {
      clearCart();
      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: 'user', content: messageText, timestamp: new Date() },
        { id: Date.now() + 1, role: 'assistant', content: "Done! I've cleared your order cart ☕.", timestamp: new Date() }
      ]);
      setInput('');
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setVoiceState('RETRIEVING');

    try {
      const profile = JSON.parse(localStorage.getItem('brewmind_profile') || '{}');
      const historyPayload = messages.slice(-4).map(m => ({ role: m.role, content: m.content }));

      const response = await agentApi.chat({
        message: messageText,
        tasteProfile: profile.taste || {},
        mood: profile.mood || '',
        budget: profile.budget || 1000,
        dietaryRestrictions: profile.dietary || [],
        history: historyPayload,
        persona: 'Friendly',
        cartItems: cart || [],
        pageContext: getPageContextLabel()
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.message,
        recommendations: response.recommendations,
        humanBadges: response.humanBadges || ["✓ Based on menu information", "✓ Based on taste profile"],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (!isMuted) {
        setVoiceState('RESPONDING');
        speakMessage(response.message);
      } else {
        setVoiceState('IDLE');
      }
    } catch (error) {
      setVoiceState('ERROR');
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm specialized in helping you discover and order from the BrewMind coffee and tea menu. Ask me about coffee, tea, ingredients, taste preferences, allergens, prices or your order.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSuggestions = PAGE_SUGGESTIONS[location.pathname] || PAGE_SUGGESTIONS['/'];

  return (
    <>
      {/* Floating Global AI Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-coffee-950 via-coffee-900 to-coffee-950 text-amber-400 p-4 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border border-amber-500/40 hover:scale-105 transition-all flex items-center space-x-2.5 group"
        title="Ask BrewMind AI Barista"
      >
        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold animate-pulse">
          <Mic size={18} />
        </div>
        <span className="font-bold text-xs text-white hidden sm:inline tracking-wide">
          Ask BrewMind
        </span>
        <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
          AI
        </span>
      </button>

      {/* Global Slide-Over AI Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-coffee-100 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 bg-coffee-950 text-cream-50 flex items-center justify-between border-b border-coffee-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center">
                    BrewMind AI Barista
                    <span className="ml-2 text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-mono">
                      {getPageContextLabel()} PAGE
                    </span>
                  </h3>
                  <p className="text-[10px] text-cream-300">Site-wide voice & grounded menu assistant</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-cream-300 hover:text-white p-1"
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                >
                  {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cream-300 hover:text-white p-1.5 rounded-xl hover:bg-white/10"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Voice Active Waveform Bar */}
            {voiceState !== 'IDLE' && (
              <div className="bg-amber-500 text-white px-4 py-2 flex items-center justify-between text-xs font-bold shadow-md">
                <div className="flex items-center space-x-2">
                  <Mic size={14} className="animate-bounce" />
                  <span>
                    {voiceState === 'LISTENING' && 'Listening... Speak your coffee craving...'}
                    {voiceState === 'THINKING' && 'Processing speech intent...'}
                    {voiceState === 'RETRIEVING' && 'Checking menu knowledge base...'}
                    {voiceState === 'RESPONDING' && 'BrewMind is responding...'}
                    {voiceState === 'SPEAKING' && 'BrewMind is speaking...'}
                  </span>
                </div>
                {voiceState === 'SPEAKING' && (
                  <button onClick={stopSpeech} className="px-2 py-0.5 bg-black/30 rounded text-[10px] uppercase">
                    Stop Audio
                  </button>
                )}
              </div>
            )}

            {/* Page-Specific Quick Suggestions */}
            <div className="bg-coffee-50/80 p-3 border-b border-coffee-100 flex items-center space-x-2 overflow-x-auto">
              <span className="text-[9px] font-bold text-coffee-500 uppercase tracking-widest flex-shrink-0">
                {getPageContextLabel()} Suggestions:
              </span>
              {currentSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sug.query)}
                  className="text-xs font-semibold bg-white border border-coffee-200 text-coffee-950 px-2.5 py-1 rounded-xl whitespace-nowrap hover:bg-coffee-950 hover:text-white transition-all shadow-sm"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Messages Container */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-coffee-50/30">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                    <div className={`p-4 rounded-2xl text-xs sm:text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-coffee-950 text-cream-50 rounded-tr-none'
                        : 'bg-white text-coffee-950 border border-coffee-100 rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                      {/* Product Recommendations Cards */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {msg.recommendations.slice(0, 2).map((rec, i) => (
                            <div key={i} className="bg-coffee-50/90 p-3 rounded-xl border border-coffee-200 flex items-center space-x-3">
                              <img
                                src={rec.image || DEFAULT_IMAGE}
                                alt={rec.name}
                                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                              />
                              <div className="flex-grow min-w-0">
                                <h5 className="font-bold text-coffee-950 text-xs truncate">{rec.name}</h5>
                                <p className="text-[10px] text-coffee-600 truncate">{rec.category} • ₹{rec.price}</p>
                                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
                                  {rec.matchScore || 94}% Match
                                </span>
                              </div>
                              <button
                                onClick={() => addToCart(rec)}
                                className="p-2 bg-coffee-950 text-cream-50 rounded-lg hover:bg-coffee-800 flex-shrink-0"
                                title="Add to Smart Order"
                              >
                                <ShoppingBag size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Human-Friendly Grounding Badges */}
                      {msg.humanBadges && msg.humanBadges.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-coffee-100 flex flex-wrap gap-1">
                          {msg.humanBadges.map((badge, bIdx) => (
                            <span key={bIdx} className="text-[9px] font-bold bg-coffee-100 text-coffee-800 px-2 py-0.5 rounded-md">
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-coffee-100 p-3 rounded-2xl rounded-tl-none text-xs text-coffee-600 font-bold flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                    <span>BrewMind is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-3 bg-white border-t border-coffee-100 flex items-center space-x-2"
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl transition-all ${
                  voiceState === 'LISTENING' ? 'bg-red-500 text-white animate-pulse' : 'bg-coffee-100 text-coffee-700 hover:bg-coffee-200'
                }`}
                title="Voice Input"
              >
                {voiceState === 'LISTENING' ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask BrewMind anything on this page..."
                className="flex-grow bg-coffee-50 border border-coffee-100 focus:border-coffee-300 rounded-xl px-3 py-2.5 text-xs text-coffee-950 outline-none"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`p-2.5 rounded-xl transition-all ${
                  !input.trim() || isLoading ? 'bg-coffee-100 text-coffee-300' : 'bg-coffee-950 text-cream-50'
                }`}
              >
                <Send size={16} />
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};

export default GlobalAIAssistant;
