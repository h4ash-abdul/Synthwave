import React from 'react';
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
    setVolume,
    useSpotifyEmbed,
    setUseSpotifyEmbed
  } = usePlayer();

  return (
    <AnimatePresence>
      {currentTrack && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: 0 }}
          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full z-50 overflow-hidden"
        >
          {useSpotifyEmbed && currentTrack.spotifyUri ? (
            <div className="flex flex-col gap-1.5 w-full">
              <div className="flex items-center justify-between px-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-[#1DB954] font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.36.181.54.78.241 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
                  Official Spotify Player (Original Audio)
                </span>
                <button 
                  onClick={() => setUseSpotifyEmbed(false)} 
                  className="text-white/40 hover:text-white underline transition-colors"
                >
                  Switch to Custom Player
                </button>
              </div>
              <iframe
                key={currentTrack.spotifyUri}
                src={`https://open.spotify.com/embed/track/${currentTrack.spotifyUri.replace('spotify:track:', '')}?utm_source=generator&theme=0`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-[1.25rem] border border-white/10 shadow-2xl"
              />
            </div>
          ) : (
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
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate text-sm">{currentTrack.title}</span>
                  {currentTrack.spotifyUri && (
                    <a 
                      href={`https://open.spotify.com/track/${currentTrack.spotifyUri.replace('spotify:track:', '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Open in Spotify"
                      className="text-[#1DB954] hover:text-[#1ed760] hover:scale-110 transition-transform shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.36.181.54.78.241 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
                    </a>
                  )}
                </div>
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
                {currentTrack.spotifyUri && (
                  <button
                    onClick={() => setUseSpotifyEmbed(true)}
                    title="Play original song via Spotify Player"
                    className="liquid-glass rounded-full px-2.5 py-1 flex items-center gap-1.5 text-[11px] text-[#1DB954] hover:bg-[#1DB954]/20 transition-all border border-[#1DB954]/30"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.36.181.54.78.241 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.239.54-.959.72-1.56.3z"/></svg>
                    <span className="hidden sm:inline font-medium">Original</span>
                  </button>
                )}
                <button onClick={() => setVolume(volume === 0 ? 0.8 : 0)} className="text-white/60 hover:text-white hover:scale-110 transition-transform">
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
