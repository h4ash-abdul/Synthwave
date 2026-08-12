import React, { useState } from 'react';
import { Download, Loader2, RotateCcw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const LeftPanel: React.FC<{ onGenerate: (vibe: string) => void, onReset: () => void }> = ({ onGenerate, onReset }) => {
  const [vibe, setVibe] = useState('');
  const { isGenerating } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vibe.trim() && !isGenerating) {
      onGenerate(vibe.trim());
    }
  };

  const handleClear = () => {
    setVibe('');
    onReset();
  };

  return (
    <div className="liquid-glass-strong rounded-3xl w-full flex-1 flex flex-col p-8 lg:p-12 relative overflow-hidden">
      {/* Top Nav */}
      <div className="flex justify-between items-center w-full z-10">
        <div className="flex items-center gap-3">
          <span className="font-sans font-semibold text-2xl tracking-tighter text-white lowercase">synthwave</span>
        </div>
        <button type="button" onClick={handleClear} className="liquid-glass rounded-full px-5 py-2 flex items-center gap-2 hover:scale-105 transition-transform">
          <span className="text-white text-sm font-medium">Reset</span>
          <RotateCcw className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Center Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 mb-20 z-10">
        
        <h1 className="text-5xl lg:text-7xl font-sans font-medium text-white tracking-[-0.05em] leading-[1.1] max-w-2xl lowercase">
          synthwave
        </h1>

        <form onSubmit={handleSubmit} className="mt-12 w-full max-w-md relative flex items-center justify-center group">
          <input
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            disabled={isGenerating}
            placeholder="Describe your vibe (e.g. Neon Tokyo night)..."
            className="liquid-glass-strong rounded-full w-full pl-6 pr-16 py-4 text-white placeholder:text-white/50 outline-none text-lg font-sans focus:scale-[1.02] transition-transform backdrop-blur-[60px]"
          />
          <button 
            type="submit"
            disabled={!vibe.trim() || isGenerating}
            className="absolute right-2 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Download className="w-5 h-5 text-white" />
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {["Neon Night Drive", "Rainy Jazz", "Cyberpunk City"].map((tag) => (
            <button 
              key={tag}
              onClick={() => setVibe(tag)}
              className="liquid-glass rounded-full px-5 py-2 text-xs text-white/80 hover:scale-105 hover:text-white transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Quote */}
      <div className="w-full flex flex-col items-center text-center z-10 mt-auto">
        <span className="text-xs tracking-widest uppercase text-white/50 mb-3">CURATED ATMOSPHERE</span>
        <p className="text-lg text-white mb-4">
          <span className="font-sans">"Where words fail, </span>
          <span className="font-serif italic text-white/90">music speaks</span>
          <span className="font-sans">."</span>
        </p>
        <div className="flex items-center gap-4">
          <div className="w-8 h-[1px] bg-white/30"></div>
          <span className="text-xs tracking-widest text-white/80 uppercase">AI GENERATOR</span>
          <div className="w-8 h-[1px] bg-white/30"></div>
        </div>
      </div>
    </div>
  );
};
