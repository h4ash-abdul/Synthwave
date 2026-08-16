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

const MainContent = () => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);
  const { setInstantTheme, setIsGenerating } = useTheme();

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

  const handleReset = () => {
    setPlaylist(null);
    setAnalysis(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col p-4 lg:p-6 z-10 w-full overflow-hidden">
      <AmbientBackground />
      
      <div className="flex flex-col lg:flex-row w-full gap-6 z-10 flex-1">
        <div className="w-full lg:w-[52%] flex flex-col">
          <LeftPanel onGenerate={handleGenerate} onReset={handleReset} />
          <div className="lg:hidden w-full">
            <MusicPlayer />
          </div>
        </div>
        
        <div className="hidden lg:flex lg:w-[48%] flex-col relative z-20">
          <RightPanel playlist={playlist} analysis={analysis} />
          <div className="w-full">
            <MusicPlayer />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the words preloader to finish its cycle before sliding up
    // Total time = 800ms (first word) + (8 words * 220ms) = ~2560ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <PlayerProvider>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loader"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]"
            >
              {/* Text Layer */}
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
        <motion.div
          initial="loading"
          animate={isLoading ? "loading" : "visible"}
          variants={{
            loading: { clipPath: "circle(0% at 85% 75%)", filter: "blur(10px)", scale: 1.05 },
            visible: { clipPath: "circle(150% at 85% 75%)", filter: "blur(0px)", scale: 1, transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } }
          }}
          className="w-full min-h-screen bg-[#0a0a0a]"
        >
          <MainContent />
        </motion.div>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
