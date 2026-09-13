import { getValidAccessToken } from './spotifyAuth';
import type { Track } from './ai/playlistGenerator';

export const searchSpotifyTrack = async (title: string, artist: string): Promise<Partial<Track> & { spotifyUri?: string }> => {
  const token = await getValidAccessToken();
  if (!token) return {};

  // Use broad search so typos or minor artist naming variations still match
  const query = encodeURIComponent(`${title} ${artist}`);
  const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    const track = data.tracks?.items?.[0];

    if (track) {
      return {
        title: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        duration: Math.floor(track.duration_ms / 1000),
        coverArt: track.album.images[0]?.url,
        audioUrl: track.preview_url, // For non-premium fallback
        spotifyUri: track.uri // For premium SDK playback
      };
    }
  } catch (e) {
    console.error("Spotify search failed", e);
  }
  return {};
};
