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
  { id: 'c1', title: 'Nightcall', artist: 'Kavinsky', duration: 259, coverArt: 'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d6d8c2eaa1f9031b62f7a3f7', spotifyUri: 'spotify:track:0U0ldCRmgCqhVvD6ksG63j' },
  { id: 'c2', title: 'Resonance', artist: 'HOME', duration: 212, coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80', spotifyUri: 'spotify:track:1TuopWDI4KhgNaEvPP2zQo' },
  { id: 'c3', title: 'A Real Hero', artist: 'College, Electric Youth', duration: 267, coverArt: 'https://images.unsplash.com/photo-1533230491823-376518a4a580?w=300&q=80', spotifyUri: 'spotify:track:4gR900FPrk9vE85qZc4z80' },
  { id: 'c4', title: 'Under Your Spell', artist: 'Desire', duration: 232, coverArt: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&q=80', spotifyUri: 'spotify:track:7bppGjT53U817u5qZ9O7Xg' },
];

const CHILL_TRACKS: Track[] = [
  { id: 'l1', title: 'Locket', artist: 'Crumb', duration: 317, coverArt: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80', spotifyUri: 'spotify:track:0h7A2p6q3h2V9a9pL8z4M5' },
  { id: 'l2', title: 'Chamber Of Reflection', artist: 'Mac DeMarco', duration: 231, coverArt: 'https://images.unsplash.com/photo-1518022525094-7128f731118f?w=300&q=80', spotifyUri: 'spotify:track:17oaRknZ67p56vJ1n8b0Z7' },
  { id: 'l3', title: 'Space Song', artist: 'Beach House', duration: 320, coverArt: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&q=80', spotifyUri: 'spotify:track:7om1b29ZtT2h9f4J6mQZgO' },
  { id: 'l4', title: 'Show Me How', artist: 'Men I Trust', duration: 215, coverArt: 'https://images.unsplash.com/photo-1481026469463-66327c86e544?w=300&q=80', spotifyUri: 'spotify:track:01TyUsVs2315aqvtNDqpFT' },
];

const ORGANIC_TRACKS: Track[] = [
  { id: 'o1', title: 'Sunrise', artist: 'Norah Jones', duration: 200, coverArt: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=300&q=80', spotifyUri: 'spotify:track:7zkL0I529U855eF3987p7t' },
  { id: 'o2', title: 'Holocene', artist: 'Bon Iver', duration: 336, coverArt: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=300&q=80', spotifyUri: 'spotify:track:4fbvXwMTXUKVpvg6og75DL' },
  { id: 'o3', title: 'Heartbeats', artist: 'José González', duration: 160, coverArt: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80', spotifyUri: 'spotify:track:5Lw4RsmNq0uS9zB3Vp2M7H' },
  { id: 'o4', title: 'Bloom', artist: 'The Paper Kites', duration: 210, coverArt: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&q=80', spotifyUri: 'spotify:track:11bD1JtSknEaqVv3BPsmbt' },
];

const INTIMATE_TRACKS: Track[] = [
  { id: 'i1', title: 'Telepatía', artist: 'Kali Uchis', duration: 160, coverArt: 'https://images.unsplash.com/photo-1518621736915-f3b8c41bfd00?w=300&q=80', spotifyUri: 'spotify:track:6tDDoYIxWvMLTdKpjFkc1B' },
  { id: 'i2', title: 'Get You', artist: 'Daniel Caesar', duration: 278, coverArt: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=300&q=80', spotifyUri: 'spotify:track:7zFXmv6vqI4qOt4yGLOHd8' },
  { id: 'i3', title: 'Pink + White', artist: 'Frank Ocean', duration: 184, coverArt: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&q=80', spotifyUri: 'spotify:track:3xKsf9qO1CyB05OJsmNVpZ' },
  { id: 'i4', title: 'Japanese Denim', artist: 'Daniel Caesar', duration: 270, coverArt: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80', spotifyUri: 'spotify:track:1boXSE09hMeOTn7Po52jSk' },
];

const DEEP_TRACKS: Track[] = [
  { id: 'dp1', title: 'Innerbloom', artist: 'RÜFÜS DU SOL', duration: 578, coverArt: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=300&q=80', spotifyUri: 'spotify:track:66tYZgRk1J9Wk0pY2qV5H5' },
  { id: 'dp2', title: 'Opus', artist: 'Eric Prydz', duration: 543, coverArt: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=300&q=80', spotifyUri: 'spotify:track:3v2oAQpehOcBDRHGhjSJcf' },
  { id: 'dp3', title: 'Strobe', artist: 'deadmau5', duration: 637, coverArt: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=300&q=80', spotifyUri: 'spotify:track:0A4Yg8W2K58Q3yFkM2b4mJ' },
  { id: 'dp4', title: 'Xtal', artist: 'Aphex Twin', duration: 294, coverArt: 'https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=300&q=80', spotifyUri: 'spotify:track:7o2AeQnlRoCi6uv0m24n9Q' },
];

const SUNSET_TRACKS: Track[] = [
  { id: 's1', title: 'The Less I Know The Better', artist: 'Tame Impala', duration: 216, coverArt: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=300&q=80', spotifyUri: 'spotify:track:6K4t31amVTZDgR3sKmwUJJ' },
  { id: 's2', title: 'Feels Like We Only Go Backwards', artist: 'Tame Impala', duration: 192, coverArt: 'https://images.unsplash.com/photo-1470043201067-764120126f5e?w=300&q=80', spotifyUri: 'spotify:track:0LtOwyEFIjkycG2y5ZfJ3e' },
  { id: 's3', title: 'Walking On A Dream', artist: 'Empire of the Sun', duration: 196, coverArt: 'https://images.unsplash.com/photo-1414609245224-afa02bfb3fda?w=300&q=80', spotifyUri: 'spotify:track:5rA9q47f4dJvW674nJjGqN' },
  { id: 's4', title: 'Electric Feel', artist: 'MGMT', duration: 229, coverArt: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=80', spotifyUri: 'spotify:track:3FtYbEfBqAlGOJuSJLi023' },
];

const MYSTERIOUS_TRACKS: Track[] = [
  { id: 'm1', title: 'Teardrop', artist: 'Massive Attack', duration: 329, coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80', spotifyUri: 'spotify:track:67Hna13dNDkZvBpTXRIaOJ' },
  { id: 'm2', title: 'Glory Box', artist: 'Portishead', duration: 308, coverArt: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&q=80', spotifyUri: 'spotify:track:353IZlhALuuIjFfy0TRuZr' },
  { id: 'm3', title: 'Angel', artist: 'Massive Attack', duration: 378, coverArt: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80', spotifyUri: 'spotify:track:7uv632AvAgkfPt7jhR7smz' },
  { id: 'm4', title: 'Roads', artist: 'Portishead', duration: 304, coverArt: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=300&q=80', spotifyUri: 'spotify:track:1Gz9U2a5gq1eWqG4k8u4pX' },
];

const HYPE_TRACKS: Track[] = [
  { id: 'h1', title: 'HUMBLE.', artist: 'Kendrick Lamar', duration: 177, coverArt: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80', spotifyUri: 'spotify:track:7KXjTSCq5nL1LoYtL7XAwS' },
  { id: 'h2', title: 'SICKO MODE', artist: 'Travis Scott', duration: 312, coverArt: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&q=80', spotifyUri: 'spotify:track:2xLMifvR1xQ0x4uvv4qJgJ' },
  { id: 'h3', title: 'Praise The Lord', artist: 'A$AP Rocky', duration: 205, coverArt: 'https://images.unsplash.com/photo-1460355976672-71c3f0a4bdac?w=300&q=80', spotifyUri: 'spotify:track:7ycWLE2VJ3XGQ58661R3mS' },
  { id: 'h4', title: 'XO Tour Llif3', artist: 'Lil Uzi Vert', duration: 182, coverArt: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&q=80', spotifyUri: 'spotify:track:2eMwDeLQqzy9QUtipgImvv' },
];

const DEFAULT_TRACKS: Track[] = [
  { id: 'd1', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, coverArt: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&q=80', spotifyUri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b' },
  { id: 'd2', title: 'Midnight City', artist: 'M83', duration: 243, coverArt: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=300&q=80', spotifyUri: 'spotify:track:1eyzqe2QqGZUmfcPZtrIyt' },
  { id: 'd3', title: 'Starboy', artist: 'The Weeknd', duration: 230, coverArt: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=300&q=80', spotifyUri: 'spotify:track:7MXVkk9YM5odIRMYW9FTvP' },
  { id: 'd4', title: 'Kids', artist: 'MGMT', duration: 302, coverArt: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&q=80', spotifyUri: 'spotify:track:1jJci4qSDSHYsSpFXtvyzp' },
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
