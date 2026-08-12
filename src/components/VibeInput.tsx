import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface VibeInputProps {
  onGenerate: (vibe: string) => void;
}

export const VibeInput: React.FC<VibeInputProps> = ({ onGenerate }) => {
  const [vibe, setVibe] = useState('');
  const { isGenerating } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vibe.trim() && !isGenerating) {
      onGenerate(vibe.trim());
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 shadow-2xl">
          <Search className="w-6 h-6 text-white/50 group-focus-within:text-[var(--primary)] transition-colors" />
          <input
            type="text"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="Describe your current vibe (e.g. Neon-lit Tokyo night drive in the rain)"
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 ml-4 text-lg font-medium"
            disabled={isGenerating}
          />
          {isGenerating ? (
            <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
          ) : (
            <button
              type="submit"
              disabled={!vibe.trim()}
              className="ml-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate
            </button>
          )}
        </div>
      </div>
    </motion.form>
  );
};
