import type { VibeAnalysis } from './vibeAnalyzer';

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverArt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  tracks: Track[];
}

const CYBERPUNK_TRACKS: Track[] = [
  { id: 'c1', title: 'Neon Rain', artist: 'Night Drive', duration: 245, coverArt: 'https://images.unsplash.com/photo-1555580399-4c17fb1d6688?w=300&q=80' },
  { id: 'c2', title: 'City of Glass', artist: 'Kavinsky Clone', duration: 198, coverArt: 'https://images.unsplash.com/photo-1517436073-3b1b1b4b9b9b?w=300&q=80' },
  { id: 'c3', title: 'Midnight Run', artist: 'Synthwave 1984', duration: 312, coverArt: 'https://images.unsplash.com/photo-1533230491823-376518a4a580?w=300&q=80' },
  { id: 'c4', title: 'Cybernetic Love', artist: 'Data Romance', duration: 210, coverArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80' },
];

const CHILL_TRACKS: Track[] = [
  { id: 'l1', title: 'Morning Brew', artist: 'Sunday Jazz', duration: 180, coverArt: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80' },
  { id: 'l2', title: 'Soft Rain on Window', artist: 'Lofi Girl', duration: 240, coverArt: 'https://images.unsplash.com/photo-1518022525094-7128f731118f?w=300&q=80' },
  { id: 'l3', title: 'Comfort Zone', artist: 'Warm Beats', duration: 215, coverArt: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&q=80' },
  { id: 'l4', title: 'Fireside', artist: 'Mellow Tunes', duration: 195, coverArt: 'https://images.unsplash.com/photo-1481026469463-66327c86e544?w=300&q=80' },
];

const DEFAULT_TRACKS: Track[] = [
  { id: 'd1', title: 'Atmospheric Entry', artist: 'Deep Space', duration: 250, coverArt: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80' },
  { id: 'd2', title: 'Pulse', artist: 'Electronic Mind', duration: 220, coverArt: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=300&q=80' },
  { id: 'd3', title: 'Flow State', artist: 'The Grid', duration: 305, coverArt: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&q=80' },
  { id: 'd4', title: 'Signals', artist: 'Unknown', duration: 190, coverArt: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80' },
];

export const generatePlaylist = async (analysis: VibeAnalysis): Promise<Playlist> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let tracks = DEFAULT_TRACKS;
  let title = "Generated Vibe";
  
  if (analysis.mood === 'Late Night') {
    tracks = CYBERPUNK_TRACKS;
    title = "Night Drive Essentials";
  } else if (analysis.mood === 'Relaxed') {
    tracks = CHILL_TRACKS;
    title = "Warm & Cozy";
  }

  return {
    id: `playlist-${Date.now()}`,
    title,
    description: `A curated ${analysis.genre} playlist for your ${analysis.mood.toLowerCase()} vibe.`,
    tracks
  };
};
