import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Zap, Droplets, Thermometer, CreditCard, Save, CheckCircle2, AlertCircle, Sparkles, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TasteProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    taste: {
      caffeine: 'medium',
      sweetness: 'low',
      roast: 'medium',
      bitterness: 'low',
      temperature: 'cold',
      milk: 'oat'
    },
    mood: 'focused',
    budget: 300,
    dietary: ['Dairy-Free']
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('brewmind_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Error loading saved profile:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('brewmind_profile', JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSaveAndAskAI = () => {
    handleSave();
    navigate('/concierge', { state: { initialMessage: "What should I order based on my saved taste profile?" } });
  };

  const toggleDietary = (restriction) => {
    setProfile(prev => ({
      ...prev,
      dietary: prev.dietary.includes(restriction)
        ? prev.dietary.filter(r => r !== restriction)
        : [...prev.dietary, restriction]
    }));
  };

  const dietaryOptions = [
    "Dairy-Free", "Nut-Free", "Vegan", "Gluten-Free", "Vegetarian", "Low-Calorie"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-coffee-100 text-coffee-800 text-xs font-bold tracking-widest uppercase mb-3 border border-coffee-200">
          <Sparkles size={14} className="text-amber-500" />
          <span>Personalization Engine</span>
        </div>
        <h1 className="text-4xl font-serif text-coffee-950 mb-3">Your Taste Profile</h1>
        <p className="text-coffee-600 text-base">
          Configure your flavor preferences. BrewMind AI retrieves knowledge base items grounded directly in your profile.
        </p>
      </div>

      {/* Visual Taste Profile Card Preview */}
      <div className="bg-coffee-950 text-cream-50 p-6 rounded-3xl mb-8 shadow-xl border border-coffee-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mb-1">Active Taste Summary</span>
          <h3 className="font-bold text-lg text-white">
            {profile.taste.roast?.toUpperCase() || 'MEDIUM'} ROAST • {profile.taste.bitterness?.toUpperCase() || 'LOW'} BITTERNESS
          </h3>
          <p className="text-xs text-cream-200/80 mt-1">
            Temp: <strong>{profile.taste.temperature?.toUpperCase() || 'COLD'}</strong> • Milk: <strong>{profile.taste.milk?.toUpperCase() || 'OAT'}</strong> • Max Price: <strong>₹{profile.budget}</strong>
          </p>
        </div>
        <button
          onClick={handleSaveAndAskAI}
          className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex-shrink-0 flex items-center space-x-2"
        >
          <Sparkles size={16} />
          <span>Ask BrewMind What to Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Core Preferences */}
        <div className="md:col-span-2 space-y-8">
          {/* Roast & Bitterness */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-coffee-100 shadow-sm">
            <h2 className="text-xl font-bold text-coffee-950 mb-6 flex items-center">
              <Coffee className="mr-2 text-amber-600" size={20} />
              Roast & Bitterness Preference
            </h2>

            <div className="space-y-6">
              {/* Roast Level */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold text-coffee-700 uppercase tracking-wider">Roast Level</label>
                  <span className="text-xs font-bold text-coffee-950 capitalize">{profile.taste.roast}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['light', 'medium', 'dark', 'cold brew'].map(level => (
                    <button
                      key={level}
                      onClick={() => setProfile({...profile, taste: {...profile.taste, roast: level}})}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                        profile.taste.roast === level
                        ? 'bg-coffee-950 text-cream-50 border-coffee-950 shadow-md'
                        : 'bg-coffee-50 text-coffee-600 border-coffee-100 hover:border-coffee-300'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bitterness Level */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold text-coffee-700 uppercase tracking-wider">Bitterness Tolerance</label>
                  <span className="text-xs font-bold text-coffee-950 capitalize">{profile.taste.bitterness}</span>
                </div>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map(level => (
                    <button
                      key={level}
                      onClick={() => setProfile({...profile, taste: {...profile.taste, bitterness: level}})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                        profile.taste.bitterness === level
                        ? 'bg-coffee-950 text-cream-50 border-coffee-950 shadow-md'
                        : 'bg-coffee-50 text-coffee-600 border-coffee-100 hover:border-coffee-300'
                      }`}
                    >
                      {level.toUpperCase()} BITTERNESS
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness Level */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-xs font-bold text-coffee-700 uppercase tracking-wider">Sweetness Level</label>
                  <span className="text-xs font-bold text-coffee-950 capitalize">{profile.taste.sweetness}</span>
                </div>
                <div className="flex gap-2">
                  {['none', 'low', 'medium', 'high'].map(level => (
                    <button
                      key={level}
                      onClick={() => setProfile({...profile, taste: {...profile.taste, sweetness: level}})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${
                        profile.taste.sweetness === level
                        ? 'bg-coffee-950 text-cream-50 border-coffee-950 shadow-md'
                        : 'bg-coffee-50 text-coffee-600 border-coffee-100 hover:border-coffee-300'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Milk & Temperature */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-coffee-100 shadow-sm">
            <h2 className="text-xl font-bold text-coffee-950 mb-6 flex items-center">
              <Droplets className="mr-2 text-blue-500" size={20} />
              Milk & Temperature
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wider block mb-3">Milk Base</label>
                <select
                  value={profile.taste.milk}
                  onChange={(e) => setProfile({...profile, taste: {...profile.taste, milk: e.target.value}})}
                  className="w-full p-3 bg-coffee-50 border border-coffee-200 rounded-xl text-coffee-950 text-xs font-bold outline-none focus:ring-2 focus:ring-coffee-100"
                >
                  <option value="none">Black (No Milk)</option>
                  <option value="oat">Oat Milk (Plant-based)</option>
                  <option value="almond">Almond Milk</option>
                  <option value="dairy">Dairy Milk</option>
                  <option value="soy">Soy Milk</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wider block mb-3">Temperature</label>
                <div className="flex bg-coffee-50 p-1 rounded-xl border border-coffee-200">
                  <button
                    onClick={() => setProfile({...profile, taste: {...profile.taste, temperature: 'hot'}})}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      profile.taste.temperature === 'hot' ? 'bg-white text-coffee-950 shadow-sm' : 'text-coffee-500'
                    }`}
                  >
                    <Thermometer size={14} className="mr-1 text-orange-500" /> Hot
                  </button>
                  <button
                    onClick={() => setProfile({...profile, taste: {...profile.taste, temperature: 'cold'}})}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      profile.taste.temperature === 'cold' ? 'bg-white text-coffee-950 shadow-sm' : 'text-coffee-500'
                    }`}
                  >
                    <Droplets size={14} className="mr-1 text-blue-400" /> Cold / Iced
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Constraints */}
        <div className="space-y-8">
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-coffee-100 shadow-sm">
            <h2 className="text-xl font-bold text-coffee-950 mb-6 flex items-center">
              <CreditCard className="mr-2 text-green-500" size={20} />
              Budget Limit
            </h2>
            <div className="mb-4">
               <input
                type="range"
                min="100"
                max="1000"
                step="25"
                value={profile.budget}
                onChange={(e) => setProfile({...profile, budget: parseInt(e.target.value)})}
                className="w-full h-2 bg-coffee-100 rounded-lg appearance-none cursor-pointer accent-coffee-950"
               />
            </div>
            <div className="flex justify-between items-center bg-coffee-50 p-3 rounded-xl border border-coffee-100">
               <span className="text-xs text-coffee-600 font-medium">Max per item</span>
               <span className="text-xl font-bold text-coffee-950">₹{profile.budget}</span>
            </div>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-coffee-100 shadow-sm">
            <h2 className="text-xl font-bold text-coffee-950 mb-4 flex items-center">
              <AlertCircle className="mr-2 text-red-500" size={20} />
              Dietary Rules
            </h2>
            <div className="flex flex-wrap gap-2">
               {dietaryOptions.map(option => (
                 <button
                   key={option}
                   onClick={() => toggleDietary(option)}
                   className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                     profile.dietary.includes(option)
                     ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                     : 'bg-coffee-50 text-coffee-600 border-coffee-100 hover:border-coffee-200'
                   }`}
                 >
                   {option}
                 </button>
               ))}
            </div>
          </section>

          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 transition-all shadow-lg ${
                isSaved
                ? 'bg-green-500 text-white'
                : 'bg-coffee-950 text-cream-50 hover:bg-coffee-800'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Taste Profile Saved</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Taste Profile</span>
                </>
              )}
            </button>

            <button
              onClick={handleSaveAndAskAI}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-base flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <Sparkles size={20} />
              <span>Ask AI Concierge Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasteProfile;
