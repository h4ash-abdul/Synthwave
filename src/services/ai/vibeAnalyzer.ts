export interface VibeTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  atmosphere: string;
  effects: string[];
}

export interface VibeAnalysis {
  mood: string;
  genre: string;
  energy: string;
  bpmRange: [number, number];
  tags: string[];
  theme: VibeTheme;
}

const THEMES: Record<string, VibeTheme> = {
  cyberpunk: {
    primary: '#0ff',
    secondary: '#f0f',
    accent: '#ff003c',
    background: 'linear-gradient(to bottom, #050510, #1a0b2e)',
    atmosphere: 'Neon lit, rainy, futuristic',
    effects: ['noise', 'glow', 'scanlines'],
  },
  chill: {
    primary: '#ffb347',
    secondary: '#ffcc33',
    accent: '#e66465',
    background: 'linear-gradient(to bottom, #ffe259, #ffa751)',
    atmosphere: 'Warm, cozy, soft lighting',
    effects: ['blur', 'soft-glow'],
  },
  default: {
    primary: '#4ade80',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
    background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)',
    atmosphere: 'Atmospheric, deep, inviting',
    effects: ['ambient-glow'],
  }
};

export const analyzeVibe = async (vibeText: string): Promise<VibeAnalysis> => {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const text = vibeText.toLowerCase();
  
  if (text.includes('neon') || text.includes('tokyo') || text.includes('cyberpunk') || text.includes('night drive')) {
    return {
      mood: 'Late Night',
      genre: 'Synthwave / Ambient',
      energy: 'Medium',
      bpmRange: [85, 110],
      tags: ['#LateNight', '#Cyberpunk', '#Rain', '#Drive', '#Neon'],
      theme: THEMES.cyberpunk
    };
  }
  
  if (text.includes('coffee') || text.includes('sunday') || text.includes('warm') || text.includes('chill')) {
    return {
      mood: 'Relaxed',
      genre: 'Lo-Fi / Jazz',
      energy: 'Low',
      bpmRange: [60, 85],
      tags: ['#Chill', '#Sunday', '#Coffee', '#LoFi', '#Warm'],
      theme: THEMES.chill
    };
  }

  // Default fallback
  return {
    mood: 'Atmospheric',
    genre: 'Electronic / Ambient',
    energy: 'Medium',
    bpmRange: [90, 120],
    tags: ['#Vibe', '#Atmospheric', '#Electronic', '#Generated'],
    theme: THEMES.default
  };
};
