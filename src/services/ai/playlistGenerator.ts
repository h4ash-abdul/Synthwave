import type { VibeAnalysis } from './vibeAnalyzer';
import { searchSpotifyTrack } from '../spotifyApi';
import { getStoredAccessToken } from '../spotifyAuth';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverArt: string;
  audioUrl?: string;
  spotifyUri?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  tracks: Track[];
}

const CYBERPUNK_TRACKS: Track[] = [
  { id: 'c1', title: 'Nightcall', artist: 'Kavinsky', duration: 259, coverArt: '' },
  { id: 'c2', title: 'Resonance', artist: 'HOME', duration: 212, coverArt: '' },
  { id: 'c3', title: 'A Real Hero', artist: 'College, Electric Youth', duration: 267, coverArt: '' },
  { id: 'c4', title: 'Under Your Spell', artist: 'Desire', duration: 232, coverArt: '' },
];

const CHILL_TRACKS: Track[] = [
  { id: 'l1', title: 'Locket', artist: 'Crumb', duration: 317, coverArt: '' },
  { id: 'l2', title: 'Chamber Of Reflection', artist: 'Mac DeMarco', duration: 231, coverArt: '' },
  { id: 'l3', title: 'Space Song', artist: 'Beach House', duration: 320, coverArt: '' },
  { id: 'l4', title: 'Show Me How', artist: 'Men I Trust', duration: 215, coverArt: '' },
];

const ORGANIC_TRACKS: Track[] = [
  { id: 'o1', title: 'Sunrise', artist: 'Norah Jones', duration: 200, coverArt: '' },
  { id: 'o2', title: 'Holocene', artist: 'Bon Iver', duration: 336, coverArt: '' },
  { id: 'o3', title: 'Heartbeats', artist: 'José González', duration: 160, coverArt: '' },
  { id: 'o4', title: 'Bloom', artist: 'The Paper Kites', duration: 210, coverArt: '' },
];

const INTIMATE_TRACKS: Track[] = [
  { id: 'i1', title: 'Telepatía', artist: 'Kali Uchis', duration: 160, coverArt: '' },
  { id: 'i2', title: 'Get You', artist: 'Daniel Caesar', duration: 278, coverArt: '' },
  { id: 'i3', title: 'Pink + White', artist: 'Frank Ocean', duration: 184, coverArt: '' },
  { id: 'i4', title: 'Japanese Denim', artist: 'Daniel Caesar', duration: 270, coverArt: '' },
];

const DEEP_TRACKS: Track[] = [
  { id: 'dp1', title: 'Innerbloom', artist: 'RÜFÜS DU SOL', duration: 578, coverArt: '' },
  { id: 'dp2', title: 'Opus', artist: 'Eric Prydz', duration: 543, coverArt: '' },
  { id: 'dp3', title: 'Strobe', artist: 'deadmau5', duration: 637, coverArt: '' },
  { id: 'dp4', title: 'Xtal', artist: 'Aphex Twin', duration: 294, coverArt: '' },
];

const SUNSET_TRACKS: Track[] = [
  { id: 's1', title: 'The Less I Know The Better', artist: 'Tame Impala', duration: 216, coverArt: '' },
  { id: 's2', title: 'Feels Like We Only Go Backwards', artist: 'Tame Impala', duration: 192, coverArt: '' },
  { id: 's3', title: 'Walking On A Dream', artist: 'Empire of the Sun', duration: 196, coverArt: '' },
  { id: 's4', title: 'Electric Feel', artist: 'MGMT', duration: 229, coverArt: '' },
];

const MYSTERIOUS_TRACKS: Track[] = [
  { id: 'm1', title: 'Teardrop', artist: 'Massive Attack', duration: 329, coverArt: '' },
  { id: 'm2', title: 'Glory Box', artist: 'Portishead', duration: 308, coverArt: '' },
  { id: 'm3', title: 'Angel', artist: 'Massive Attack', duration: 378, coverArt: '' },
  { id: 'm4', title: 'Roads', artist: 'Portishead', duration: 304, coverArt: '' },
];

const HYPE_TRACKS: Track[] = [
  { id: 'h1', title: 'HUMBLE.', artist: 'Kendrick Lamar', duration: 177, coverArt: '' },
  { id: 'h2', title: 'SICKO MODE', artist: 'Travis Scott', duration: 312, coverArt: '' },
  { id: 'h3', title: 'Praise The Lord', artist: 'A$AP Rocky', duration: 205, coverArt: '' },
  { id: 'h4', title: 'XO Tour Llif3', artist: 'Lil Uzi Vert', duration: 182, coverArt: '' },
];

const DEFAULT_TRACKS: Track[] = [
  { id: 'd1', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, coverArt: '' },
  { id: 'd2', title: 'Midnight City', artist: 'M83', duration: 243, coverArt: '' },
  { id: 'd3', title: 'Starboy', artist: 'The Weeknd', duration: 230, coverArt: '' },
  { id: 'd4', title: 'Kids', artist: 'MGMT', duration: 302, coverArt: '' },
];

export const generatePlaylist = async (analysis: VibeAnalysis): Promise<Playlist> => {
  let tracks = DEFAULT_TRACKS;
  let title = "Generated Vibe";
  
  switch(analysis.mood) {
    case 'Organic': tracks = ORGANIC_TRACKS; title = "Jungle After Dark"; break;
    case 'Intimate': tracks = INTIMATE_TRACKS; title = "Late Night Romance"; break;
    case 'Deep': tracks = DEEP_TRACKS; title = "Oceanic Depths"; break;
    case 'Late Night': tracks = CYBERPUNK_TRACKS; title = "Neon Night Drive"; break;
    case 'Golden': tracks = SUNSET_TRACKS; title = "Sunset Cruise"; break;
    case 'Mysterious': tracks = MYSTERIOUS_TRACKS; title = "Dark Matter"; break;
    case 'Hype': tracks = HYPE_TRACKS; title = "Maximum Energy"; break;
    case 'Relaxed': tracks = CHILL_TRACKS; title = "Warm & Cozy"; break;
    default: tracks = DEFAULT_TRACKS; title = "Atmospheric Journey"; break;
  }

  // If Spotify is linked, augment tracks with real metadata
  if (getStoredAccessToken()) {
    tracks = await Promise.all(tracks.map(async (t, index) => {
      const spotifyData = await searchSpotifyTrack(t.title, t.artist);
      const fallbackAudio = `/audio/track${(index % 4) + 1}.mp3`;
      return {
        ...t,
        ...spotifyData,
        audioUrl: spotifyData.audioUrl || fallbackAudio
      };
    }));
  } else {
    // Fallback images and local audio files if not linked to spotify
    tracks = tracks.map((t, index) => ({
      ...t,
      coverArt: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=300&q=80',
      audioUrl: `/audio/track${(index % 4) + 1}.mp3`
    }));
  }

  return {
    id: `playlist-${Date.now()}`,
    title,
    description: `A curated ${analysis.genre} playlist for your ${analysis.mood.toLowerCase()} vibe.`,
    tracks
  };
};
