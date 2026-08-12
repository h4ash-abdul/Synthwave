import React from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Track } from '../services/ai/playlistGenerator';
import { usePlayer } from '../contexts/PlayerContext';

interface TrackCardProps {
  track: Track;
  index: number;
  queue: Track[];
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const TrackCard: React.FC<TrackCardProps> = ({ track, index, queue }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  
  const isActive = currentTrack?.id === track.id;

  const handlePlayClick = () => {
    if (isActive) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative flex items-center p-4 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-white/10 border border-white/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.15)]' 
          : 'bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10'
      }`}
    >
      <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
        <img 
          src={track.coverArt} 
          alt={track.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button 
            onClick={handlePlayClick}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)] text-black hover:scale-110 transition-transform shadow-[0_0_15px_var(--primary)]"
          >
            {isActive && isPlaying ? (
              <Pause fill="currentColor" className="w-5 h-5" />
            ) : (
              <Play fill="currentColor" className="w-5 h-5 ml-1" />
            )}
          </button>
        </div>
      </div>

      <div className="ml-4 flex-grow min-w-0">
        <h4 className={`text-lg font-semibold truncate ${isActive ? 'text-[var(--primary)]' : 'text-white'}`}>
          {track.title}
        </h4>
        <p className="text-white/60 text-sm truncate">{track.artist}</p>
      </div>

      {isActive && isPlaying && (
        <div className="flex items-end h-6 gap-[2px] mr-4 shrink-0">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              className="w-1 bg-[var(--primary)] rounded-full origin-bottom"
              animate={{ height: ['20%', '100%', '30%', '80%', '20%'] }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bar * 0.1,
              }}
            />
          ))}
        </div>
      )}

      <div className="text-white/40 text-sm font-medium shrink-0 ml-4">
        {formatDuration(track.duration)}
      </div>
    </motion.div>
  );
};
