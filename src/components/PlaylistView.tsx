import React from 'react';
import { motion } from 'framer-motion';
import type { Playlist } from '../services/ai/playlistGenerator';
import type { VibeAnalysis } from '../services/ai/vibeAnalyzer';
import { TrackCard } from './TrackCard';
import { Play } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

interface PlaylistViewProps {
  playlist: Playlist | null;
  analysis: VibeAnalysis | null;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({ playlist, analysis }) => {
  const { playTrack } = usePlayer();

  if (!playlist || !analysis) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto mt-16 pb-32 z-10 relative"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        {/* Cover Art composite */}
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl shrink-0 grid grid-cols-2 grid-rows-2 gap-0.5 relative group">
          {playlist.tracks.slice(0, 4).map((track, i) => (
            <img key={i} src={track.coverArt} alt="" className="w-full h-full object-cover" />
          ))}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm">
            <button 
              onClick={() => playTrack(playlist.tracks[0], playlist.tracks)}
              className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_30px_var(--primary)]"
            >
              <Play fill="currentColor" className="w-8 h-8 ml-1" />
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-grow">
          <p className="text-[var(--primary)] font-medium uppercase tracking-widest text-sm mb-2">
            Generated Vibe
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            {playlist.title}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-6">
            {playlist.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {analysis.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-6 text-sm text-white/50">
            <span>{playlist.tracks.length} tracks</span>
            <span>•</span>
            <span>Mood: {analysis.mood}</span>
            <span>•</span>
            <span>{analysis.bpmRange[0]}-{analysis.bpmRange[1]} BPM</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playlist.tracks.map((track, index) => (
          <TrackCard key={track.id} track={track} index={index} queue={playlist.tracks} />
        ))}
      </div>
    </motion.div>
  );
};
