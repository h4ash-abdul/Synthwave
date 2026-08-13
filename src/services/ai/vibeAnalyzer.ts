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
  jungle: {
    primary: '#10b981',
    secondary: '#047857',
    accent: '#059669',
    background: 'linear-gradient(to bottom, #022c22, #064e3b)',
    atmosphere: 'Lush, humid, organic',
    effects: ['noise', 'soft-glow'],
  },
  romantic: {
    primary: '#f43f5e',
    secondary: '#be123c',
    accent: '#e11d48',
    background: 'linear-gradient(to bottom, #4c0519, #881337)',
    atmosphere: 'Intimate, warm, emotional',
    effects: ['blur', 'soft-glow'],
  },
  ocean: {
    primary: '#0ea5e9',
    secondary: '#0369a1',
    accent: '#0284c7',
    background: 'linear-gradient(to bottom, #082f49, #0c4a6e)',
    atmosphere: 'Deep, flowing, submerged',
    effects: ['ambient-glow'],
  },
  cyberpunk: {
    primary: '#8b5cf6',
    secondary: '#d946ef',
    accent: '#06b6d4',
    background: 'linear-gradient(to bottom, #2e1065, #4a044e)',
    atmosphere: 'Neon lit, rainy, futuristic',
    effects: ['noise', 'glow', 'scanlines'],
  },
  sunset: {
    primary: '#f97316',
    secondary: '#fbbf24',
    accent: '#f43f5e',
    background: 'linear-gradient(to bottom, #7c2d12, #9a3412)',
    atmosphere: 'Golden, fading, warm',
    effects: ['blur', 'soft-glow'],
  },
  dark: {
    primary: '#1e1b4b',
    secondary: '#312e81',
    accent: '#4338ca',
    background: 'linear-gradient(to bottom, #000000, #0f172a)',
    atmosphere: 'Mysterious, deep, intense',
    effects: ['noise'],
  },
  energetic: {
    primary: '#ef4444',
    secondary: '#f97316',
    accent: '#dc2626',
    background: 'linear-gradient(to bottom, #450a0a, #7f1d1d)',
    atmosphere: 'Intense, driving, bright',
    effects: ['glow'],
  },
  chill: {
    primary: '#ffb347',
    secondary: '#ffcc33',
    accent: '#e66465',
    background: 'linear-gradient(to bottom, #ffe259, #ffa751)',
    atmosphere: 'Warm, cozy, soft lighting',
    effects: ['blur', 'soft-glow'],
  },
  calm: {
    primary: '#2dd4bf',
    secondary: '#3b82f6',
    accent: '#0ea5e9',
    background: 'linear-gradient(to bottom, #0f172a, #1e3a8a)',
    atmosphere: 'Peaceful, floating, serene',
    effects: ['soft-glow'],
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

export const getThemeForVibeSync = (vibeText: string): VibeTheme => {
  const text = vibeText.toLowerCase();

  // The 7 Distinct Colors for the scroll wheel prompts
  const COLORS = [
    { primary: '#8b5cf6', secondary: '#4c1d95', accent: '#a78bfa' }, // Neon Night Drive (Purple)
    { primary: '#0ea5e9', secondary: '#0369a1', accent: '#38bdf8' }, // Rainy Jazz (Blue)
    { primary: '#d946ef', secondary: '#86198f', accent: '#f0abfc' }, // Cyberpunk City (Pink/Magenta)
    { primary: '#0f172a', secondary: '#020617', accent: '#334155' }, // Deep Space Odyssey (Deep Dark/Black) -> wait, dark needs a visible primary. Let's use silver/dark blue.
    { primary: '#f97316', secondary: '#9a3412', accent: '#fb923c' }, // Retro Wave (Orange)
    { primary: '#10b981', secondary: '#047857', accent: '#34d399' }, // Lofi Beats (Green)
    { primary: '#ef4444', secondary: '#991b1b', accent: '#f87171' }, // Midnight Tokyo (Red)
  ];
  
  // Refined space color
  COLORS[3] = { primary: '#6366f1', secondary: '#312e81', accent: '#818cf8' }; // Deep Space Odyssey (Indigo)

  // Direct matches for the OptionWheel items
  if (text.includes('neon night drive')) return { ...COLORS[0], background: 'linear-gradient(to bottom, #000, #2e1065)', atmosphere: 'Neon, fast, dark', effects: ['glow'] };
  if (text.includes('rainy jazz')) return { ...COLORS[1], background: 'linear-gradient(to bottom, #082f49, #0c4a6e)', atmosphere: 'Rainy, moody, calm', effects: ['blur'] };
  if (text.includes('cyberpunk city')) return { ...COLORS[2], background: 'linear-gradient(to bottom, #4a044e, #701a75)', atmosphere: 'Cybernetic, neon, grimy', effects: ['noise'] };
  if (text.includes('deep space odyssey')) return { ...COLORS[3], background: 'linear-gradient(to bottom, #000, #1e1b4b)', atmosphere: 'Vast, empty, floating', effects: ['ambient-glow'] };
  if (text.includes('retro wave')) return { ...COLORS[4], background: 'linear-gradient(to bottom, #7c2d12, #9a3412)', atmosphere: 'Nostalgic, synth, warm', effects: ['glow'] };
  if (text.includes('lofi beats')) return { ...COLORS[5], background: 'linear-gradient(to bottom, #022c22, #064e3b)', atmosphere: 'Cozy, studying, chill', effects: ['soft-glow'] };
  if (text.includes('midnight tokyo')) return { ...COLORS[6], background: 'linear-gradient(to bottom, #450a0a, #7f1d1d)', atmosphere: 'Urban, glowing, late', effects: ['glow'] };

  // Original keyword matches mapped to the 7 colors
  if (text.match(/jungle|forest|nature|organic|green|plants/)) return { ...COLORS[5], background: 'linear-gradient(to bottom, #022c22, #064e3b)', atmosphere: 'Lush, humid, organic', effects: ['noise', 'soft-glow'] };
  if (text.match(/love|romantic|heart|passion|sweet/)) return { ...COLORS[6], background: 'linear-gradient(to bottom, #4c0519, #881337)', atmosphere: 'Intimate, warm, emotional', effects: ['blur', 'soft-glow'] };
  if (text.match(/ocean|water|deep|sea|submerged|blue/)) return { ...COLORS[1], background: 'linear-gradient(to bottom, #082f49, #0c4a6e)', atmosphere: 'Deep, flowing, submerged', effects: ['ambient-glow'] };
  if (text.match(/neon|tokyo|cyberpunk|night drive|synth|future/)) return { ...COLORS[2], background: 'linear-gradient(to bottom, #2e1065, #4a044e)', atmosphere: 'Neon lit, rainy, futuristic', effects: ['noise', 'glow'] };
  if (text.match(/sunset|golden|evening|dusk|warmth/)) return { ...COLORS[4], background: 'linear-gradient(to bottom, #7c2d12, #9a3412)', atmosphere: 'Golden, fading, warm', effects: ['blur', 'soft-glow'] };
  if (text.match(/dark|midnight|shadow|intense|mysterious/)) return { ...COLORS[3], background: 'linear-gradient(to bottom, #000, #0f172a)', atmosphere: 'Mysterious, deep, intense', effects: ['noise'] };
  if (text.match(/energetic|workout|gym|fast|hype|party/)) return { ...COLORS[6], background: 'linear-gradient(to bottom, #450a0a, #7f1d1d)', atmosphere: 'Intense, driving, bright', effects: ['glow'] };
  if (text.match(/calm|peace|serene|floating|relax|chill|coffee/)) return { ...COLORS[5], background: 'linear-gradient(to bottom, #0f172a, #1e3a8a)', atmosphere: 'Peaceful, floating, serene', effects: ['soft-glow'] };

  // Simple string hash function for fallback
  const hashStr = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
    return Math.abs(hash);
  };
  
  const h = hashStr(text);
  const picked = COLORS[h % 7];

  return {
    ...picked,
    background: 'linear-gradient(to bottom, #0f172a, #1e1b4b)',
    atmosphere: 'Unique, emergent, atmospheric',
    effects: ['ambient-glow']
  };
};

export const analyzeVibe = async (vibeText: string): Promise<VibeAnalysis> => {
  const theme = getThemeForVibeSync(vibeText);
  const text = vibeText.toLowerCase();

  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (text.match(/jungle|forest|nature|organic|green|plants/)) {
    return { mood: 'Organic', genre: 'Organic Electronica', energy: 'Medium', bpmRange: [85, 95], tags: ['#JUNGLE', '#ORGANIC', '#ATMOSPHERIC'], theme };
  }
  if (text.match(/love|romantic|heart|passion|sweet/)) {
    return { mood: 'Intimate', genre: 'R&B / Soul', energy: 'Low', bpmRange: [65, 80], tags: ['#ROMANTIC', '#WARM', '#EMOTIONAL'], theme };
  }
  if (text.match(/ocean|water|deep|sea|submerged|blue/)) {
    return { mood: 'Deep', genre: 'Ambient / Chillout', energy: 'Low', bpmRange: [70, 85], tags: ['#OCEAN', '#DEEP', '#FLOWING'], theme };
  }
  if (text.match(/neon|tokyo|cyberpunk|night drive|synth|future/)) {
    return { mood: 'Late Night', genre: 'Synthwave', energy: 'Medium', bpmRange: [95, 115], tags: ['#LATENIGHT', '#CYBERPUNK', '#NEON'], theme };
  }
  if (text.match(/sunset|golden|evening|dusk|warmth/)) {
    return { mood: 'Golden', genre: 'Chillwave', energy: 'Medium', bpmRange: [80, 95], tags: ['#SUNSET', '#WARM', '#CHILLWAVE'], theme };
  }
  if (text.match(/dark|midnight|shadow|intense|mysterious/)) {
    return { mood: 'Mysterious', genre: 'Dark Ambient', energy: 'Low', bpmRange: [60, 80], tags: ['#DARK', '#MYSTERIOUS', '#DEEP'], theme };
  }
  if (text.match(/energetic|workout|gym|fast|hype|party/)) {
    return { mood: 'Hype', genre: 'Electronic / Bass', energy: 'High', bpmRange: [120, 140], tags: ['#ENERGETIC', '#HYPE', '#DRIVING'], theme };
  }
  if (text.match(/calm|peace|serene|floating|relax|chill|coffee/)) {
    return { mood: 'Relaxed', genre: 'Lo-Fi / Ambient', energy: 'Low', bpmRange: [60, 85], tags: ['#CALM', '#LOFI', '#PEACEFUL'], theme };
  }

  return {
    mood: 'Atmospheric',
    genre: 'Electronic / Ambient',
    energy: 'Medium',
    bpmRange: [90, 120],
    tags: ['#VIBE', '#ATMOSPHERIC', '#ELECTRONIC'],
    theme
  };
};
