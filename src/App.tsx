import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { AmbientBackground } from './components/AmbientBackground';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { generatePlaylist, type Playlist } from './services/ai/playlistGenerator';
import { type VibeAnalysis, analyzeVibe } from './services/ai/vibeAnalyzer';
import { MusicPlayer } from './components/MusicPlayer';

const MainContent = () => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);

  const handleGenerate = async (vibeText: string) => {
    const vibeAnalysis = await analyzeVibe(vibeText);
    setAnalysis(vibeAnalysis);
    
    const generatedPlaylist = await generatePlaylist(vibeAnalysis);
    setPlaylist(generatedPlaylist);
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
  return (
    <ThemeProvider>
      <PlayerProvider>
        <MainContent />
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
