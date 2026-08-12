import React from 'react';
import { Play, Music, Download, Radio } from 'lucide-react';
import type { Playlist } from '../services/ai/playlistGenerator';
import type { VibeAnalysis } from '../services/ai/vibeAnalyzer';
import { usePlayer } from '../contexts/PlayerContext';
import { motion, AnimatePresence } from 'framer-motion';

interface RightPanelProps {
  playlist: Playlist | null;
  analysis: VibeAnalysis | null;
}

export const RightPanel: React.FC<RightPanelProps> = ({ playlist, analysis }) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  return (
    <div className="flex-1 flex flex-col h-full gap-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full">
        <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-3">
          <Radio className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-xs font-mono tracking-widest uppercase">Lossless Audio</span>
        </div>
        <button 
          onClick={() => { if(playlist) alert("Exporting playlist to Spotify...") }}
          className={`liquid-glass rounded-full px-5 py-2 flex items-center gap-2 transition-transform ${playlist ? 'hover:scale-105 opacity-100' : 'opacity-50 cursor-not-allowed'}`}
        >
          <span className="text-white text-sm font-medium">Export</span>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
            <Download className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>

      {/* Bottom Feature Section / Playlist View */}
      <div className="liquid-glass p-4 rounded-[2.5rem] mt-auto flex flex-col gap-4 relative overflow-hidden flex-1 max-h-[600px]">
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
              className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
            >
              <div className="px-2 pt-2">
                <h3 className="text-white font-medium text-xl">{playlist.title}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {analysis?.tags.slice(0,3).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest text-white/60 bg-white/10 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 mt-2">
                {playlist.tracks.map((track) => {
                  const isActive = currentTrack?.id === track.id;
                  return (
                    <div 
                      key={track.id} 
                      className={`liquid-glass rounded-2xl p-3 flex items-center gap-4 group cursor-pointer ${isActive ? 'bg-white/10' : ''}`}
                      onClick={() => playTrack(track, playlist.tracks)}
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={track.coverArt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" style={{ filter: 'grayscale(100%)' }} />
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-white/90'}`}>{track.title}</h4>
                        <p className="text-white/50 text-xs truncate mt-0.5">{track.artist}</p>
                      </div>
                      {isActive && isPlaying && (
                         <div className="flex items-end h-4 gap-0.5 mr-2">
                           {[1, 2, 3].map((bar) => (
                             <motion.div
                               key={bar}
                               className="w-1 bg-white/80 rounded-full origin-bottom"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
