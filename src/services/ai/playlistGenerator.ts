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

const ORGANIC_TRACKS: Track[] = [
  { id: 'o1', title: 'Canopy', artist: 'Jungle Beats', duration: 254, coverArt: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&q=80' },
  { id: 'o2', title: 'Rainforest Echo', artist: 'Nature Electronica', duration: 310, coverArt: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&q=80' },
  { id: 'o3', title: 'Moss & Vine', artist: 'Earth Pulse', duration: 198, coverArt: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80' },
  { id: 'o4', title: 'Undergrowth', artist: 'Deep Roots', duration: 245, coverArt: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80' },
];

const INTIMATE_TRACKS: Track[] = [
  { id: 'i1', title: 'Velvet', artist: 'Soul Sessions', duration: 215, coverArt: 'https://images.unsplash.com/photo-1518621736915-f3b8c41bfd00?w=300&q=80' },
  { id: 'i2', title: 'Candlelight', artist: 'Warm Notes', duration: 185, coverArt: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300&q=80' },
  { id: 'i3', title: 'Whisper', artist: 'Quiet Moments', duration: 240, coverArt: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&q=80' },
  { id: 'i4', title: 'Close', artist: 'Late R&B', duration: 198, coverArt: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80' },
];

const DEEP_TRACKS: Track[] = [
  { id: 'dp1', title: 'Abyss', artist: 'Oceanic', duration: 320, coverArt: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&q=80' },
  { id: 'dp2', title: 'Currents', artist: 'Submerged', duration: 275, coverArt: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=300&q=80' },
  { id: 'dp3', title: 'Drifting', artist: 'Tidal Wave', duration: 210, coverArt: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=300&q=80' },
  { id: 'dp4', title: 'Midnight Sea', artist: 'Blue Depth', duration: 290, coverArt: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=300&q=80' },
];

const SUNSET_TRACKS: Track[] = [
  { id: 's1', title: 'Golden Hour', artist: 'Fading Light', duration: 230, coverArt: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=300&q=80' },
  { id: 's2', title: 'Warmth', artist: 'Sun Chasers', duration: 195, coverArt: 'https://images.unsplash.com/photo-1470043201067-764120126f5e?w=300&q=80' },
  { id: 's3', title: 'Dusk', artist: 'Horizon', duration: 250, coverArt: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=300&q=80' },
  { id: 's4', title: 'Last Rays', artist: 'Evening Sky', duration: 210, coverArt: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80' },
];

const MYSTERIOUS_TRACKS: Track[] = [
  { id: 'm1', title: 'Shadows', artist: 'Dark Ambient', duration: 310, coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80' },
  { id: 'm2', title: 'Echoes in the Dark', artist: 'Void', duration: 285, coverArt: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&q=80' },
  { id: 'm3', title: 'Midnight', artist: 'The Unknown', duration: 240, coverArt: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80' },
  { id: 'm4', title: 'Secrets', artist: 'Veil', duration: 275, coverArt: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=300&q=80' },
];

const HYPE_TRACKS: Track[] = [
  { id: 'h1', title: 'Adrenaline', artist: 'Pulse Rate', duration: 205, coverArt: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80' },
  { id: 'h2', title: 'Max Output', artist: 'Overdrive', duration: 190, coverArt: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&q=80' },
  { id: 'h3', title: 'Ignite', artist: 'Firestarter', duration: 220, coverArt: 'https://images.unsplash.com/photo-1460355976672-71c3f0a4bdac?w=300&q=80' },
  { id: 'h4', title: 'Power Surge', artist: 'Voltage', duration: 215, coverArt: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&q=80' },
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

  // Adjust title based on the original vibe keywords occasionally, or just use the mapped title
  // For simplicity, we just use the mapped title.

  return {
    id: `playlist-${Date.now()}`,
    title,
    description: `A curated ${analysis.genre} playlist for your ${analysis.mood.toLowerCase()} vibe.`,
    tracks
  };
};
