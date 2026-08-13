import React, { useState, useRef } from 'react';
import { Play, Pause, Music, Download, Share2, Image as ImageIcon, ChevronDown, BookmarkPlus } from 'lucide-react';
import type { Playlist } from '../services/ai/playlistGenerator';
import type { VibeAnalysis } from '../services/ai/vibeAnalyzer';
import { usePlayer } from '../contexts/PlayerContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

interface RightPanelProps {
  playlist: Playlist | null;
  analysis: VibeAnalysis | null;
}

export const RightPanel: React.FC<RightPanelProps> = ({ playlist, analysis }) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();
  const { setVibe, currentVibe, theme } = useTheme();
  const [showExport, setShowExport] = useState(false);
  const vibeCardRef = useRef<HTMLDivElement>(null);

  const handleRefine = (refinement: string) => {
    setVibe(`${currentVibe} ${refinement}`);
  };

  const saveVibe = () => {
    if (!currentVibe) return;
    try {
      const saved = JSON.parse(localStorage.getItem('synthwave_saved_vibes') || '[]');
      if (!saved.includes(currentVibe)) {
        localStorage.setItem('synthwave_saved_vibes', JSON.stringify([currentVibe, ...saved]));
        window.dispatchEvent(new Event('vibe-saved'));
        alert('Vibe saved successfully!');
      } else {
        alert('Vibe already saved!');
      }
    } catch (e) {}
  };

  const downloadVibeCard = async () => {
    if (vibeCardRef.current && playlist && theme) {
      try {
        const canvas = await html2canvas(vibeCardRef.current, { useCORS: true, backgroundColor: null, scale: 2 });
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `synthwave-${playlist.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        a.click();
      } catch (e) {
        console.error(e);
        alert('Failed to generate Vibe Card.');
      }
    }
  };

  const downloadPlaylist = () => {
    if (!playlist) return;
    const txt = `SYNTHWAVE PLAYLIST: ${playlist.title}\n\n` + 
      playlist.tracks.map((t, i) => `${i+1}. ${t.title} - ${t.artist}`).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt);
    a.download = `${playlist.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full gap-6">
      {/* Top Bar */}
      <div className="flex justify-end items-center w-full relative">
        <div className="relative">
          <button 
            onClick={() => setShowExport(!showExport)}
            disabled={!playlist}
            className={`liquid-glass rounded-full px-5 py-2 flex items-center gap-2 transition-transform ${playlist ? 'hover:scale-105 opacity-100' : 'opacity-50 cursor-not-allowed'}`}
          >
            <span className="text-white text-sm font-medium">Export</span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronDown className="w-3 h-3 text-white" />
            </div>
          </button>
          
          <AnimatePresence>
            {showExport && playlist && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-48 liquid-glass-strong rounded-2xl p-2 flex flex-col gap-1 z-50 shadow-2xl"
              >
                <button onClick={saveVibe} className="flex items-center gap-3 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left">
                  <BookmarkPlus className="w-4 h-4" /> Save Vibe
                </button>
                <button onClick={downloadVibeCard} className="flex items-center gap-3 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left">
                  <ImageIcon className="w-4 h-4" /> Save Vibe Card
                </button>
                <button onClick={downloadPlaylist} className="flex items-center gap-3 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left">
                  <Download className="w-4 h-4" /> Download Playlist
                </button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} className="flex items-center gap-3 px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-xl transition-colors text-left">
                  <Share2 className="w-4 h-4" /> Copy Share Link
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Playlist View */}
      <div className="liquid-glass p-4 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden mt-auto max-h-[600px] min-h-[300px]">
        <AnimatePresence mode="wait">
          {!playlist ? (
            <motion.div 
              key="default-cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60"
            >
              <Music className="w-16 h-16 text-white mb-6" />
              <h3 className="text-white font-medium text-xl mb-2">Awaiting your vibe</h3>
              <p className="text-white/60 text-sm max-w-[250px]">
                Describe an atmosphere or mood in the input panel to generate a custom soundtrack.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="playlist-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4 h-full"
            >
              <div className="px-3 pt-3 flex flex-col gap-3 shrink-0">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--primary,#10b981)] font-semibold mb-1 block">GENERATED VIBE</span>
                  <h3 className="text-white font-medium text-2xl">{playlist.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {analysis?.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest text-white/70 bg-white/10 border border-white/5 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
                  <span>{analysis?.genre}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30"></span>
                  <span>{analysis?.bpmRange[0]}-{analysis?.bpmRange[1]} BPM</span>
                  <span className="w-1 h-1 rounded-full bg-white/30"></span>
                  <span>{analysis?.energy} Energy</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col gap-3 mt-2 overflow-y-auto pr-2 custom-scrollbar">
                {playlist.tracks.map((track) => {
                  const isActive = currentTrack?.id === track.id;
                  return (
                    <div 
                      key={track.id} 
                      className={`liquid-glass rounded-2xl p-3 flex items-center gap-4 group cursor-pointer transition-all hover:bg-white/10 ${isActive ? 'bg-white/15 border border-[var(--primary,#10b981)]/30' : 'border border-transparent'}`}
                      onClick={() => isActive ? togglePlay() : playTrack(track, playlist.tracks)}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={track.coverArt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          {isActive && isPlaying ? (
                            <Pause className="w-4 h-4 text-white" fill="currentColor" />
                          ) : (
                            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm truncate transition-colors ${isActive ? 'text-[var(--primary,#10b981)]' : 'text-white group-hover:text-[var(--primary,#10b981)]'}`}>{track.title}</h4>
                        <p className="text-white/50 text-xs truncate mt-0.5">{track.artist}</p>
                      </div>
                      {isActive && isPlaying && (
                         <div className="flex items-end h-4 gap-[2px] mr-2">
                           {[1, 2, 3].map((bar) => (
                             <motion.div
                               key={bar}
                               className="w-1 bg-[var(--primary,#10b981)] rounded-full origin-bottom"
                               animate={{ height: ['20%', '100%', '30%', '80%', '20%'] }}
                               transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut", delay: bar * 0.1 }}
                             />
                           ))}
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="shrink-0 mt-4 px-2 pb-2">
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3 block">Refine Vibe</span>
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
                  {['More Chill', 'More Energetic', 'Darker', 'More Cinematic', 'Instrumental Only'].map(refinement => (
                    <button 
                      key={refinement}
                      onClick={() => handleRefine(refinement)}
                      className="text-xs text-white/70 bg-white/5 hover:bg-white/15 border border-white/10 px-3 py-1.5 rounded-full whitespace-nowrap transition-all hover:scale-105 active:scale-95 hover:border-white/30"
                    >
                      {refinement}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden Vibe Card for Export */}
      {playlist && theme && (
        <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none">
          <div ref={vibeCardRef} className="w-[1080px] h-[1920px] relative overflow-hidden flex flex-col items-center justify-center bg-[#021812] p-16">
            <div className="absolute inset-0" style={{ background: theme.background }} />
            <div className="absolute inset-0 mix-blend-screen" style={{ background: `radial-gradient(circle at center, ${theme.primary} 0%, transparent 70%)`, opacity: 0.8 }} />
            
            <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
              <h1 className="text-white text-6xl font-bold tracking-widest uppercase mb-4">SYNTHWAVE</h1>
              <div className="w-24 h-1 bg-white/30 rounded-full mb-20" />
              
              <div className="bg-black/40 backdrop-blur-[40px] border border-white/10 p-16 rounded-[4rem] w-[800px] flex flex-col gap-10">
                <div className="text-center">
                  <span className="text-3xl tracking-[0.3em] uppercase text-white/50 font-semibold mb-4 block" style={{ color: theme.primary }}>GENERATED VIBE</span>
                  <h3 className="text-white font-bold text-7xl mb-8 leading-tight">{playlist.title}</h3>
                  <div className="flex justify-center items-center gap-4 flex-wrap">
                    {analysis?.tags.map(tag => (
                      <span key={tag} className="text-xl uppercase tracking-widest text-white/80 bg-white/10 border border-white/20 px-6 py-3 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-6 mt-12">
                  {playlist.tracks.slice(0, 4).map(track => (
                    <div key={track.id} className="flex items-center gap-8 bg-black/20 p-6 rounded-3xl border border-white/5">
                        <img src={track.coverArt} crossOrigin="anonymous" className="w-24 h-24 rounded-2xl object-cover shadow-2xl" />
                        <div>
                          <h4 className="text-white text-3xl font-medium mb-2">{track.title}</h4>
                          <p className="text-white/60 text-2xl">{track.artist}</p>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
