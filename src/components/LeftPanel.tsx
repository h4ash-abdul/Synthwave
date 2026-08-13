import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, RotateCcw, Clock, Bookmark } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Shuffle from './Shuffle';
import OptionWheel from './OptionWheel';
import { getThemeForVibeSync } from '../services/ai/vibeAnalyzer';

export const LeftPanel: React.FC<{ onGenerate: (vibe: string) => void, onReset: () => void }> = ({ onGenerate, onReset }) => {
  const [vibe, setVibe] = useState('');
  const [recentVibes, setRecentVibes] = useState<string[]>([]);
  const [savedVibes, setSavedVibes] = useState<string[]>([]);
  const { isGenerating } = useTheme();

  const currentColor = getThemeForVibeSync(vibe || 'Neon Night Drive').primary;

  const loadStorage = () => {
    try {
      const saved = localStorage.getItem('synthwave_saved_vibes');
      const recent = localStorage.getItem('synthwave_recent_vibes');
      if (saved) setSavedVibes(JSON.parse(saved));
      if (recent) setRecentVibes(JSON.parse(recent));
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    loadStorage();
    window.addEventListener('vibe-saved', loadStorage);
    return () => window.removeEventListener('vibe-saved', loadStorage);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vibe.trim();
    if (v && !isGenerating) {
      // Save to recent
      const newRecents = [v, ...recentVibes.filter(item => item !== v)].slice(0, 10);
      setRecentVibes(newRecents);
      localStorage.setItem('synthwave_recent_vibes', JSON.stringify(newRecents));
      onGenerate(v);
    }
  };

  const handleClear = () => {
    setVibe('');
    onReset();
  };

  return (
    <div className="liquid-glass rounded-[2.5rem] w-full flex-1 flex flex-col p-8 lg:p-12 relative overflow-hidden">
      {/* Top Nav */}
      <div className="flex justify-end items-center w-full z-10">
        <button type="button" onClick={handleClear} className="liquid-glass rounded-full px-5 py-2 flex items-center gap-2 hover:scale-105 transition-transform">
          <span className="text-white text-sm font-medium">Reset</span>
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 mb-20 z-10 w-full max-w-4xl mx-auto">
        
        <Shuffle
          text="SYNTHWAVE"
          shuffleDirection="right"
          duration={0.5}
          animationMode="random"
          shuffleTimes={2}
          ease="power3.out"
          stagger={0.03}
          scrambleCharset="!@#$%^&*"
          colorFrom="#10b981"
          colorTo="#ffffff"
          tag="h1"
          className="text-7xl lg:text-8xl font-sans font-semibold tracking-[-0.05em] leading-[1.1]"
        />

        <form onSubmit={handleSubmit} className="mt-12 w-full max-w-md relative flex items-center justify-center group">
          <input
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            disabled={isGenerating}
            placeholder="Describe your vibe (e.g. Neon Tokyo night)..."
            className="liquid-glass-strong rounded-full w-full pl-6 pr-32 py-4 text-white placeholder:text-white/50 outline-none text-lg font-sans focus:scale-[1.02] transition-transform backdrop-blur-[60px]"
          />
          <button 
            type="submit"
            disabled={!vibe.trim() || isGenerating}
            className="absolute right-2 h-10 px-4 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 border hover:brightness-125"
            style={{ backgroundColor: `${currentColor}33`, borderColor: `${currentColor}4D` }}
          >
            <span className="text-white text-sm font-medium tracking-wide" style={{ color: currentColor }}>GENERATE</span>
            {isGenerating ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-white" />
            )}
          </button>
        </form>

        <div className="w-full max-w-md mx-auto mt-6 flex flex-col gap-3">
          {savedVibes.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
              <Bookmark className="w-3 h-3 shrink-0" style={{ color: currentColor }} />
              <span className="text-[10px] uppercase tracking-widest text-white/40 shrink-0">Saved</span>
              {savedVibes.map(s => (
                <button key={s} onClick={() => { setVibe(s); onGenerate(s); }} className="text-xs text-white/80 border px-3 py-1 rounded-full whitespace-nowrap transition-colors hover:brightness-125" style={{ backgroundColor: `${currentColor}1A`, borderColor: `${currentColor}33` }}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {recentVibes.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
              <Clock className="w-3 h-3 text-white/40 shrink-0" />
              <span className="text-[10px] uppercase tracking-widest text-white/40 shrink-0">Recent</span>
              {recentVibes.map(r => (
                <button key={r} onClick={() => { setVibe(r); onGenerate(r); }} className="text-xs text-white/60 bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full whitespace-nowrap transition-colors">
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vibe Selection Wheel */}
        <div className="h-48 w-full max-w-md mx-auto mt-8 relative">
          <OptionWheel
            items={[
              'Neon Night Drive',
              'Rainy Jazz',
              'Cyberpunk City',
              'Deep Space Odyssey',
              'Retro Wave',
              'Lofi Beats to Study to',
              'Midnight Tokyo'
            ]}
            defaultSelected={0}
            textColor="#ffffff40"
            activeColor={currentColor}
            side="left"
            fontSize={1.5}
            spacing={1.8}
            curve={0}
            tilt={0}
            blur={1}
            fade={0.3}
            smoothing={200}
            inset={0}
            loop={true}
            draggable={true}
            onChange={(_index: number, item: string) => {
              setVibe(item);
            }}
          />
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="w-full flex flex-col items-center text-center z-10 mt-auto">
        <span className="text-xs tracking-widest uppercase text-white/50 mb-3">CURATED ATMOSPHERE</span>
        <p className="text-lg text-white">
          <span className="font-sans">"Where words fail, </span>
          <span className="font-serif italic text-white/90">music speaks</span>
          <span className="font-sans">."</span>
        </p>
      </div>
    </div>
  );
};
