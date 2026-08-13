import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type VibeTheme, analyzeVibe } from '../services/ai/vibeAnalyzer';

interface ThemeContextType {
  theme: VibeTheme | null;
  currentVibe: string;
  setVibe: (vibe: string) => Promise<void>;
  setInstantTheme: (theme: VibeTheme) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  isGenerating: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<VibeTheme | null>(null);
  const [currentVibe, setCurrentVibe] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const setInstantTheme = (newTheme: VibeTheme) => {
    setTheme(newTheme);
  };

  const setVibe = async (vibeText: string) => {
    setIsGenerating(true);
    setCurrentVibe(vibeText);
    try {
      const analysis = await analyzeVibe(vibeText);
      setTheme(analysis.theme);
    } catch (error) {
      console.error("Failed to analyze vibe:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, currentVibe, setVibe, setInstantTheme, setIsGenerating, isGenerating }}>
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
