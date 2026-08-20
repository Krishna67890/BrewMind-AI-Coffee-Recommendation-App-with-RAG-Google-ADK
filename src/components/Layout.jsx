import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, Menu as MenuIcon, X, Sparkles, User, ShoppingBag, Info, Cpu, Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '../hooks/useVoice';

import GlobalAIAssistant from './GlobalAIAssistant';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isListening, transcript, startListening, stopListening, supported } = useVoice();

  useEffect(() => {
    if (transcript) {
      const cmd = transcript.toLowerCase();
      if (cmd.includes('go to concierge') || cmd.includes('open concierge') || cmd.includes('talk to ai')) {
        navigate('/concierge');
      } else if (cmd.includes('go to menu') || cmd.includes('show menu')) {
        navigate('/menu');
      } else if (cmd.includes('go to profile') || cmd.includes('my profile')) {
        navigate('/profile');
      } else if (cmd.includes('go to order') || cmd.includes('show cart') || cmd.includes('my order')) {
        navigate('/order');
      } else if (cmd.includes('go home') || cmd.includes('home page')) {
        navigate('/');
      }
    }
  }, [transcript, navigate]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Coffee size={18} /> },
    { name: 'AI Concierge', path: '/concierge', icon: <Sparkles size={18} /> },
    { name: 'Menu', path: '/menu', icon: <MenuIcon size={18} /> },
    { name: 'Taste Profile', path: '/profile', icon: <User size={18} /> },
    { name: 'Smart Order', path: '/order', icon: <ShoppingBag size={18} /> },
    { name: 'Technology', path: '/technology', icon: <Cpu size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-coffee-50 font-sans relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-coffee-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-coffee-950 p-2 rounded-xl text-cream-100 group-hover:bg-coffee-800 transition-colors">
                <Coffee size={24} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-coffee-950 block leading-none">BrewMind AI</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-coffee-600 font-semibold">Coffee Concierge</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                    isActive(link.path)
                      ? 'bg-coffee-950 text-cream-100'
                      : 'text-coffee-700 hover:bg-coffee-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-coffee-900 hover:bg-coffee-100 transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-coffee-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-coffee-950 text-cream-100 shadow-lg'
                        : 'text-coffee-700 hover:bg-coffee-100'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow relative">
        {children}
      </main>

      {/* Global AI Concierge Floating Button & Assistant Drawer across all routes */}
      <GlobalAIAssistant />

      {/* Footer */}
      <footer className="bg-coffee-950 text-cream-100/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Coffee className="text-cream-400" size={28} />
                <span className="text-2xl font-bold text-cream-50">BrewMind AI</span>
              </div>
              <p className="max-w-md mb-8 text-cream-200/60 leading-relaxed">
                Your personal coffee concierge powered by advanced AI. We understand your mood, preferences, and dietary needs to help you find your perfect cup.
              </p>
              <div className="text-sm text-cream-200/40">
                &copy; {new Date().getFullYear()} BrewMind AI. Created for Google Cloud Gen AI Academy.
              </div>
            </div>
            <div>
              <h4 className="text-cream-50 font-semibold mb-6 uppercase tracking-wider text-sm">Experience</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/concierge" className="hover:text-cream-400 transition-colors">AI Concierge</Link></li>
                <li><Link to="/menu" className="hover:text-cream-400 transition-colors">Digital Menu</Link></li>
                <li><Link to="/profile" className="hover:text-cream-400 transition-colors">Taste Profile</Link></li>
                <li><Link to="/order" className="hover:text-cream-400 transition-colors">Smart Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cream-50 font-semibold mb-6 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/technology" className="hover:text-cream-400 transition-colors">Our Technology</Link></li>
                <li><Link to="/about" className="hover:text-cream-400 transition-colors">About Us</Link></li>
                <li><a href="#" className="hover:text-cream-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cream-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
