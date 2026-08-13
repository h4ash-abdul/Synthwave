import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const MusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    volume, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    seek, 
    setVolume 
  } = usePlayer();

  useEffect(() => {
    let interval: number;
    if (isPlaying && currentTrack) {
      interval = window.setInterval(() => {
        if (progress < currentTrack.duration) {
          seek(progress + 1);
        } else {
          nextTrack();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, currentTrack, seek, nextTrack]);

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full z-50 mt-4"
        >
          <div className="liquid-glass-strong rounded-[2rem] h-20 flex items-center px-6 gap-4 relative overflow-hidden group">
            
            {/* Progress Bar (Absolute top edge) */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 bg-white/10 cursor-pointer group/progress"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                seek(Math.floor(percentage * currentTrack.duration));
              }}
            >
              <div 
                className="h-full bg-white relative transition-all duration-100"
                style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-opacity" />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-4 w-1/3 min-w-[150px]">
              <img 
                src={currentTrack.coverArt} 
                alt={currentTrack.title} 
                className={`w-12 h-12 rounded-xl object-cover shadow-lg ${isPlaying ? 'animate-[pulse-slow_4s_ease-in-out_infinite]' : ''}`}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-white font-medium truncate text-sm">{currentTrack.title}</span>
                <span className="text-white/50 text-xs truncate">{currentTrack.artist}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center flex-grow">
              <div className="flex items-center gap-6">
                <button onClick={prevTrack} className="text-white/60 hover:text-white transition-colors hover:scale-110">
                  <SkipBack className="w-5 h-5" fill="currentColor" />
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                  )}
                </button>
                <button onClick={nextTrack} className="text-white/60 hover:text-white transition-colors hover:scale-110">
                  <SkipForward className="w-5 h-5" fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Volume & Time */}
            <div className="flex items-center justify-end gap-3 w-1/3 min-w-[150px]">
              <span className="text-white/50 text-xs font-mono tracking-wider">
                {formatDuration(progress)} / {formatDuration(currentTrack.duration)}
              </span>
              
              <div className="flex items-center gap-2 ml-2">
                <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-white/60 hover:text-white hover:scale-110 transition-transform">
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
