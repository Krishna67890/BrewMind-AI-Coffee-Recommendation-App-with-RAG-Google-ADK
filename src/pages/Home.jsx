import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Coffee, Shield, Zap, Heart, ArrowRight, Mic } from 'lucide-react';
import { agentApi } from '../services/agentApi';
import { useVoice } from '../hooks/useVoice';

const Home = () => {
  const [online, setOnline] = useState(true);
  const { speak } = useVoice();

  useEffect(() => {
    agentApi.health().then(res => setOnline(res.status === 'healthy'));
  }, []);

  const handleVoiceWelcome = () => {
    speak("Welcome to BrewMind AI. How can I help you find your perfect cup today?");
  };

  const features = [
    {
      title: "RAG-Grounded Answers",
      description: "Retrieved knowledge from menu.json, ingredient specs, and allergen matrices.",
      icon: <Shield className="text-amber-500" size={24} />,
    },
    {
      title: "Personalized Taste Profile",
      description: "Matches your roast, bitterness, sweetness, milk, and temperature preferences.",
      icon: <Sparkles className="text-amber-500" size={24} />,
    },
    {
      title: "AI Order Builder",
      description: "Configure coffee, milk, sweetness, and budget for instant personalized picks.",
      icon: <Zap className="text-amber-500" size={24} />,
    },
    {
      title: "Allergy Intelligence",
      description: "Strictly filters allergens like lactose, gluten, and nuts for customer safety.",
      icon: <Heart className="text-amber-500" size={24} />,
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-28 flex flex-col items-center overflow-hidden">
        {/* Abstract Background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-coffee-300 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cream-300 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Live Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-coffee-100 text-coffee-950 text-xs font-bold uppercase mb-6 border border-coffee-200 shadow-sm">
              <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 animate-ping' : 'bg-amber-500'}`}></div>
              <span>● AI Concierge Online • 32 Products • RAG Powered</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-coffee-950 mb-6 leading-[1.1]">
              Your Personal<br />
              <span className="text-coffee-600">AI Coffee Concierge</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-coffee-700 mb-10 leading-relaxed font-medium">
              Tell BrewMind what you're craving. Get a personalized, knowledge-grounded recommendation in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/concierge"
                className="w-full sm:w-auto px-8 py-4 bg-coffee-950 text-cream-50 rounded-2xl font-bold shadow-xl shadow-coffee-950/20 hover:bg-coffee-800 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles size={18} className="text-amber-400" />
                <span>Ask BrewMind</span>
              </Link>
              <button
                onClick={handleVoiceWelcome}
                className="w-full sm:w-auto px-8 py-4 glass text-coffee-950 rounded-2xl font-bold border border-coffee-200 hover:bg-white transition-all flex items-center justify-center space-x-2"
              >
                <Mic size={18} className="text-amber-600" />
                <span>Voice Welcome</span>
              </button>
              <Link
                to="/menu"
                className="w-full sm:w-auto px-8 py-4 glass text-coffee-950 rounded-2xl font-bold border border-coffee-200 hover:bg-white transition-all"
              >
                Explore Menu
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual Card */}
        <div className="mt-16 max-w-5xl mx-auto px-4 relative w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="rounded-3xl overflow-hidden shadow-2xl shadow-coffee-950/40 relative"
          >
             <div className="aspect-video bg-coffee-950 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070"
                  alt="Premium Coffee Concierge"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/90 via-coffee-950/30 to-transparent flex items-end p-6 sm:p-10">
                   <div className="glass p-6 rounded-3xl max-w-md border border-white/10 shadow-2xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                          <Sparkles size={16} />
                        </div>
                        <span className="font-bold text-coffee-950 text-sm">Grounded Recommendation</span>
                      </div>
                      <p className="text-coffee-900 text-xs sm:text-sm font-medium leading-relaxed">
                        "Based on your request for low bitterness under ₹300, I recommend the <strong>Vanilla Cold Brew</strong> (₹230). Low bitterness, smooth vanilla profile, grounded in 📄 menu.json."
                      </p>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-950 mb-4">The BrewMind AI Advantage</h2>
            <p className="text-coffee-600 max-w-2xl mx-auto text-sm sm:text-base">Transforming static coffee menus into intelligent, personalized concierges.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-coffee-50 border border-coffee-100 transition-all hover:shadow-xl hover:shadow-coffee-950/5"
              >
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-coffee-950 mb-3">{feature.title}</h3>
                <p className="text-coffee-700 text-xs leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-coffee-950 text-cream-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Ready to find your perfect cup?</h2>
          <p className="text-cream-200/70 max-w-2xl mx-auto mb-10 text-base">
            Ask BrewMind AI today and experience grounded, personalized coffee discovery.
          </p>
          <Link
            to="/concierge"
            className="inline-flex items-center space-x-2 px-10 py-5 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all transform hover:scale-105 shadow-xl"
          >
            <span>Ask BrewMind AI</span>
            <Sparkles size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
