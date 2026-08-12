import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Track } from '../services/ai/playlistGenerator';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  queue: Track[];
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  seek: (progress: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    if (newQueue) {
      setQueue(newQueue);
    }
  };

  const togglePlay = () => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      if (currentIndex !== -1 && currentIndex < queue.length - 1) {
        playTrack(queue[currentIndex + 1]);
      }
    }
  };

  const prevTrack = () => {
    if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        playTrack(queue[currentIndex - 1]);
      }
    }
  };

  const seek = (newProgress: number) => {
    setProgress(newProgress);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        progress,
        queue,
        playTrack,
        togglePlay,
        setVolume,
        seek,
        nextTrack,
        prevTrack
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
