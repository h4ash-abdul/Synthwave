import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Component as AiLoader } from './components/ui/ai-loader';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { AmbientBackground } from './components/AmbientBackground';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { generatePlaylist, type Playlist } from './services/ai/playlistGenerator';
import { type VibeAnalysis, analyzeVibe, getThemeForVibeSync } from './services/ai/vibeAnalyzer';
import { MusicPlayer } from './components/MusicPlayer';

import { FavoritesProvider, useFavorites } from './contexts/FavoritesContext';

const MainContent = () => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);
  const { setInstantTheme, setIsGenerating } = useTheme();
  const { favorites } = useFavorites();

  const handleGenerate = async (vibeText: string) => {
    // 1. Instant Visual Feedback! Change color immediately before AI processes.
    setInstantTheme(getThemeForVibeSync(vibeText));
    setIsGenerating(true);

    try {
      const vibeAnalysis = await analyzeVibe(vibeText);
      setAnalysis(vibeAnalysis);
      
      const generatedPlaylist = await generatePlaylist(vibeAnalysis);
      setPlaylist(generatedPlaylist);
    } catch(e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShowFavorites = () => {
    setPlaylist({
      id: 'favorites',
      title: 'Your Favorites',
      description: 'Your personal collection of saved tracks.',
      tracks: favorites
    });
    const favTheme = {
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#fb7185',
      background: 'linear-gradient(to bottom, #4c0519, #250914)',
      atmosphere: 'Personal curated mix',
      effects: ['glow']
    };
    setAnalysis({
      mood: 'Nostalgic',
      genre: 'Favorites',
      energy: 'Mixed',
      bpmRange: [80, 140],
      tags: ['FAVORITES', 'PERSONAL'],
      theme: favTheme
    });
    setInstantTheme(favTheme);
  };

  const handleReset = () => {
    setPlaylist(null);
    setAnalysis(null);
  };

  return (
    <div className="relative h-screen flex flex-col p-4 lg:p-6 z-10 w-full overflow-hidden">
      <AmbientBackground />
      
      <div className="flex flex-col lg:flex-row w-full gap-6 z-10 flex-1 min-h-0">
        <div className="w-full lg:w-[52%] flex flex-col min-h-0">
          <LeftPanel onGenerate={handleGenerate} onReset={handleReset} onShowFavorites={handleShowFavorites} />
          <div className="lg:hidden w-full shrink-0">
            <MusicPlayer />
          </div>
        </div>
        
        <div className="hidden lg:flex lg:w-[48%] flex-col relative z-20 min-h-0">
          <RightPanel playlist={playlist} analysis={analysis} />
          <div className="w-full shrink-0">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
};

import { initiateSpotifyLogin, getAccessTokenFromCode, getStoredAccessToken } from './services/spotifyAuth';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredAccessToken());
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        setIsLoading(true);
        try {
          await getAccessTokenFromCode(code);
          setIsAuthenticated(true);
        } catch(e) {
          console.error(e);
          // Remove invalid code from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          setAuthError('Spotify login expired or was rejected. You can reconnect or continue with built-in music!');
        }
      }
    };
    handleAuth();

    if (isAuthenticated) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2800);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && !isLoading) {
    return (
      <div className="w-full h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6 relative">
        <div className="liquid-glass p-8 rounded-3xl max-w-md w-full flex flex-col items-center text-center shadow-2xl border border-white/10">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#9b5de5] to-[#f15bb5]">Synthwave</h1>
          <p className="text-gray-400 text-sm mb-6">Connect your Spotify account to search and stream tracks, or listen right now with our built-in audio tracks.</p>
          
          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={initiateSpotifyLogin}
              className="w-full py-3.5 bg-[#1DB954] hover:bg-[#1ed760] transition-all hover:scale-[1.02] active:scale-[0.98] rounded-full font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-[#1DB954]/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.36.181.54.78.241 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
              Connect with Spotify
            </button>

            <button 
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-full font-medium text-white/90 text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue with Built-in Music
            </button>
          </div>

          {authError && <p className="text-amber-400/90 text-xs mt-4 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">{authError}</p>}
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <PlayerProvider>
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loader"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]"
              >
                <motion.div 
                  className="z-10 relative"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30, x: -30 }}
                  transition={{ duration: 0.3, ease: "easeIn" }}
                >
                  <AiLoader />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {isAuthenticated && (
            <motion.div
              initial="loading"
              animate={isLoading ? "loading" : "visible"}
              variants={{
                loading: { clipPath: "circle(0% at 85% 75%)", filter: "blur(4px)", scale: 1.05 },
                visible: { clipPath: "circle(150% at 85% 75%)", filter: "blur(0px)", scale: 1, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }
              }}
              className="w-full h-screen overflow-hidden bg-[#0a0a0a]"
            >
              <MainContent />
            </motion.div>
          )}
        </PlayerProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
