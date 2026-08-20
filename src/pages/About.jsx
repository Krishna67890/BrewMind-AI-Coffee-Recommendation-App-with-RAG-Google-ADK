import React from 'react';
import { Coffee, Target, Lightbulb, Users, ShieldCheck, Cpu, ArrowRight, Award, ExternalLink, Github, Globe, Sparkles, CheckCircle2, ShoppingBag, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import developerImg from '../../assets/Devloper.jpg';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Gen AI Academy APAC Edition Hero Banner */}
      <div className="bg-gradient-to-r from-coffee-950 via-coffee-900 to-coffee-950 text-cream-50 p-8 sm:p-12 rounded-[2.5rem] mb-16 shadow-2xl border border-coffee-800 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">
          <Award size={16} />
          <span>Gen AI Academy APAC Edition</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
          BrewMind AI — Customer-Facing AI Agent
        </h1>
        <p className="text-base sm:text-lg text-cream-200/90 max-w-3xl leading-relaxed mb-6">
          Developed for <strong>Gen AI Academy APAC Edition</strong> (Organized by <strong>Hack2Skill</strong>) under the track <strong>Build and Deploy a Customer-Facing AI Agent</strong>.
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <a
            href="https://hack2skill.com/event/apac-genaiacademy-c3/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2"
          >
            <span>Learn More About Event</span>
            <ExternalLink size={14} />
          </a>
          <Link to="/concierge" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center space-x-2">
            <span>Launch AI Concierge</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* OUR COFFEE SHOP EXPERIENCE Section */}
      <section className="mb-20">
        <div className="bg-gradient-to-br from-amber-900/10 via-coffee-50 to-amber-900/5 p-8 sm:p-12 rounded-[2.5rem] border border-amber-200/60 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-widest mb-3">
            <Coffee size={18} className="text-amber-600" />
            <span>Companion Project</span>
          </div>

          <h2 className="text-3xl font-serif font-bold text-coffee-950 mb-4">OUR COFFEE SHOP EXPERIENCE & NATIVE APP</h2>
          <p className="text-coffee-700 text-base sm:text-lg max-w-3xl leading-relaxed mb-4">
            BrewMind AI is directly connected to a complete native Coffee Shop application ecosystem. Explore our companion Android Coffee Shop app for full product details, interactive native ordering, and the real coffee-shop menu that powers BrewMind AI.
          </p>
          <p className="text-amber-900 font-bold text-sm mb-8 flex items-center bg-amber-100/80 px-4 py-2.5 rounded-2xl border border-amber-300/60 w-fit">
            <Smartphone className="mr-2 text-amber-600 flex-shrink-0" size={20} />
            <span>Download the Android APK from GitHub to explore full menu details and the native mobile coffee experience!</span>
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a
              href="https://github.com/Krishna67890/Cofee-restaurent-app-"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center space-x-2 hover:scale-105"
            >
              <Smartphone size={18} />
              <span>DOWNLOAD APK / VISIT COFFEE SHOP APP</span>
              <ExternalLink size={14} />
            </a>

            <a
              href="https://krishna-patil-rajput.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-coffee-950 hover:bg-coffee-800 text-cream-50 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center space-x-2"
            >
              <Globe size={16} />
              <span>VIEW DEVELOPER PORTFOLIO</span>
              <ExternalLink size={14} />
            </a>

            <a
              href="https://github.com/Krishna67890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-white text-coffee-950 border border-coffee-200 hover:bg-coffee-50 rounded-2xl text-xs font-bold transition-all flex items-center space-x-2"
            >
              <Github size={16} />
              <span>GITHUB</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Developer Profile Section */}
      <section className="mb-20">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-coffee-100 shadow-xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-coffee-500 uppercase tracking-widest mb-6">
            <Users size={16} className="text-amber-500" />
            <span>Meet the Developer</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Developer Photo */}
            <div className="w-36 h-36 rounded-3xl overflow-hidden bg-coffee-950 flex-shrink-0 shadow-xl border-4 border-amber-500/20 relative group">
              <img
                src={developerImg}
                alt="Krishna Patil Rajput — BrewMind AI Developer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
                }}
              />
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
                <h2 className="text-3xl font-bold text-coffee-950">Krishna Patil Rajput</h2>
                <CheckCircle2 size={20} className="text-amber-500" />
              </div>
              <p className="text-amber-700 font-bold text-sm mb-3">
                Full-Stack Web Developer • Native Android Developer • AI Enthusiast
              </p>
              <p className="text-coffee-600 text-sm max-w-2xl leading-relaxed mb-6">
                Building practical AI-powered applications with modern web technologies and Google Cloud. Passionate about creating grounded, human-centered digital experiences that make complex choices effortless.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a
                  href="https://krishna-patil-rajput.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-coffee-950 text-cream-50 rounded-xl text-xs font-bold hover:bg-coffee-800 transition-all flex items-center space-x-2 shadow-md"
                >
                  <Globe size={16} />
                  <span>View Portfolio</span>
                  <ExternalLink size={12} />
                </a>

                <a
                  href="https://github.com/Krishna67890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-coffee-100 text-coffee-950 border border-coffee-200 rounded-xl text-xs font-bold hover:bg-coffee-200 transition-all flex items-center space-x-2"
                >
                  <Github size={16} />
                  <span>GitHub Profile</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why BrewMind AI? */}
      <section className="mb-20">
        <h2 className="text-3xl font-serif font-bold text-coffee-950 mb-8 text-center">Why BrewMind AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-coffee-100 shadow-sm">
            <h3 className="text-xl font-bold text-coffee-900 mb-3">Traditional Coffee Menus</h3>
            <p className="text-xs text-coffee-500 uppercase tracking-widest font-bold mb-4">Answers: "What do we sell?"</p>
            <ul className="space-y-2 text-xs text-coffee-700">
              <li className="flex items-center"><span className="text-red-500 mr-2">✕</span> Static product list with limited details</li>
              <li className="flex items-center"><span className="text-red-500 mr-2">✕</span> Hard to evaluate lactose, gluten, or nut allergens</li>
              <li className="flex items-center"><span className="text-red-500 mr-2">✕</span> No real-time budget or roast filtering</li>
              <li className="flex items-center"><span className="text-red-500 mr-2">✕</span> Zero personalization for customer mood</li>
            </ul>
          </div>

          <div className="bg-coffee-950 text-cream-50 p-8 rounded-[2rem] shadow-xl">
            <h3 className="text-xl font-bold text-amber-300 mb-3">BrewMind AI Concierge</h3>
            <p className="text-xs text-amber-400 uppercase tracking-widest font-bold mb-4">Answers: "What is right for YOU?"</p>
            <ul className="space-y-2 text-xs text-cream-200">
              <li className="flex items-center"><CheckCircle2 size={14} className="text-green-400 mr-2" /> Grounded RAG recommendations (menu.json, ingredients, allergens)</li>
              <li className="flex items-center"><CheckCircle2 size={14} className="text-green-400 mr-2" /> Taste profile alignment (Roast, Bitterness, Sweetness, Milk)</li>
              <li className="flex items-center"><CheckCircle2 size={14} className="text-green-400 mr-2" /> AI Order Builder with budget filtering</li>
              <li className="flex items-center"><CheckCircle2 size={14} className="text-green-400 mr-2" /> Voice input + text-to-speech interaction</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-coffee-100 shadow-sm">
           <Sparkles className="text-amber-500 mb-3" size={28} />
           <h3 className="font-bold text-coffee-950 text-base mb-1">Conversational RAG</h3>
           <p className="text-xs text-coffee-600 leading-relaxed">TF-IDF vector similarity over 32 menu items, ingredient specs, and allergen matrix.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-coffee-100 shadow-sm">
           <Cpu className="text-purple-600 mb-3" size={28} />
           <h3 className="font-bold text-coffee-950 text-base mb-1">Google ADK Agent</h3>
           <p className="text-xs text-coffee-600 leading-relaxed">Agent Development Kit execution path exposing search_menu, check_allergens, compare_products.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-coffee-100 shadow-sm">
           <Target className="text-green-600 mb-3" size={28} />
           <h3 className="font-bold text-coffee-950 text-base mb-1">Personalized Grounding</h3>
           <p className="text-xs text-coffee-600 leading-relaxed">Explicitly explains WHY each drink matches your taste profile and budget.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-coffee-100 shadow-sm">
           <ShieldCheck className="text-blue-600 mb-3" size={28} />
           <h3 className="font-bold text-coffee-950 text-base mb-1">Cloud Run Ready</h3>
           <p className="text-xs text-coffee-600 leading-relaxed">FastAPI Python backend ready for Google Cloud Run serverless deployment.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
