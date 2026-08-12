import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type VibeTheme, analyzeVibe } from '../services/ai/vibeAnalyzer';

interface ThemeContextType {
  theme: VibeTheme | null;
  setVibe: (vibe: string) => Promise<void>;
  isGenerating: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<VibeTheme | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const setVibe = async (vibeText: string) => {
    setIsGenerating(true);
    try {
      const analysis = await analyzeVibe(vibeText);
      setTheme(analysis.theme);
      
      // Update CSS variables for smooth transitions
      const root = document.documentElement;
      root.style.setProperty('--primary', analysis.theme.primary);
      root.style.setProperty('--secondary', analysis.theme.secondary);
      root.style.setProperty('--accent', analysis.theme.accent);
      root.style.setProperty('--background', analysis.theme.background);
    } catch (error) {
      console.error("Failed to analyze vibe:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setVibe, isGenerating }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
