import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import type { Track } from '../services/ai/playlistGenerator';
import { getStoredAccessToken, getValidAccessToken } from '../services/spotifyAuth';

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
  deviceId: string | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyPlayerRef = useRef<any>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const isPremiumRef = useRef<boolean>(false);

  // Initialize Spotify Web Playback SDK if token exists
  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) return;

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const player = new (window as any).Spotify.Player({
        name: 'Synthwave Web Player',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); },
        volume: 0.8
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
      });

      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        setIsPlaying(!state.paused);
        setProgress(Math.floor(state.position / 1000));
        
        // Check if track ended
        if (state.position === 0 && state.paused && state.restrictions.disallow_resuming_reasons?.includes('not_paused')) {
           // We might need a better way to trigger nextTrack via SDK, but HTML5 fallback uses 'ended'
        }
      });

      player.addListener('initialization_error', ({ message }: any) => {
        console.error(message);
      });
      player.addListener('authentication_error', ({ message }: any) => {
        console.error(message);
      });
      player.addListener('account_error', ({ message }: any) => {
        console.error(message);
        // User does not have Premium
        isPremiumRef.current = false;
      });

      player.connect().then((success: boolean) => {
        if (success) {
          isPremiumRef.current = true; // Assume true until account_error fires
        }
      });

      spotifyPlayerRef.current = player;
    };
    
    // Trigger if script already loaded
    if ((window as any).Spotify) {
      (window as any).onSpotifyWebPlaybackSDKReady?.();
    }

    return () => {
      if (spotifyPlayerRef.current) {
        spotifyPlayerRef.current.disconnect();
      }
    };
  }, []);

  // HTML5 Audio fallback
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.8;
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const clearSpotifyInterval = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleEnded = () => {
      nextTrack();
    };
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrack, queue]);

  const playFallback = (track: Track) => {
    if (audioRef.current) {
      const targetSrc = track.audioUrl || '/audio/track1.mp3';
      if (!audioRef.current.src.endsWith(targetSrc) && audioRef.current.src !== targetSrc) {
        audioRef.current.src = targetSrc;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Audio play request failed:', err);
        });
      }
    }
  };

  const playSpotifyTrack = async (uri: string, track: Track) => {
    const token = await getValidAccessToken();
    if (!token) {
      playFallback(track);
      return;
    }

    let targetDeviceId = deviceId;
    if (!targetDeviceId) {
      try {
        const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const dev = data.devices?.find((d: any) => d.is_active) || data.devices?.[0];
          if (dev) targetDeviceId = dev.id;
        }
      } catch (err) {
        console.warn('Failed to query Spotify devices:', err);
      }
    }

    if (!targetDeviceId) {
      console.log('No Spotify device ready, playing local audio track');
      playFallback(track);
      return;
    }
    
    try {
      // First, attempt to transfer playback to this device to make it active
      try {
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          body: JSON.stringify({ device_ids: [targetDeviceId], play: false }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } catch (tErr) {
        console.warn('Transfer playback notice:', tErr);
      }

      let response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${targetDeviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 404) {
        console.log('Got 404 from Spotify, waiting 1s and retrying...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try transferring playback one more time with play: true
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          body: JSON.stringify({ device_ids: [targetDeviceId], play: false }),
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        await new Promise(resolve => setTimeout(resolve, 500));

        response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${targetDeviceId}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      }

      if (!response.ok) {
        const errDetails = await response.text();
        console.warn('Spotify play returned not ok status:', response.status, errDetails);
        throw new Error(`Code ${response.status}: ${errDetails}. (DeviceID: ${targetDeviceId})`);
      }

      // Start manual progress polling since state_changed isn't frequent enough
      clearSpotifyInterval();
      progressIntervalRef.current = window.setInterval(async () => {
        if (spotifyPlayerRef.current) {
          const state = await spotifyPlayerRef.current.getCurrentState();
          if (state) {
            setProgress(Math.floor(state.position / 1000));
          }
        }
      }, 1000);
    } catch (e: any) {
      console.warn('Spotify playback failed, playing fallback local audio:', e);
      alert(`Spotify Playback Error: ${e.message}\n\nPlease check your console for more details.`);
      playFallback(track);
    }
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    if (newQueue) {
      setQueue(newQueue);
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    clearSpotifyInterval();

    if (spotifyPlayerRef.current && typeof spotifyPlayerRef.current.activateElement === 'function') {
      spotifyPlayerRef.current.activateElement();
    }

    if (track.spotifyUri && getStoredAccessToken()) {
      playSpotifyTrack(track.spotifyUri, track);
    } else {
      playFallback(track);
    }
  };

  const togglePlay = () => {
    if (currentTrack) {
      const nextState = !isPlaying;
      setIsPlaying(nextState);
      
      if (spotifyPlayerRef.current && deviceId && isPremiumRef.current) {
        spotifyPlayerRef.current.togglePlay().catch(() => {
          if (audioRef.current) {
            if (nextState) audioRef.current.play().catch(() => {});
            else audioRef.current.pause();
          }
        });
      } else if (audioRef.current) {
        if (nextState) audioRef.current.play().catch(() => {});
        else audioRef.current.pause();
      }
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (spotifyPlayerRef.current) {
      spotifyPlayerRef.current.setVolume(vol);
    }
    if (audioRef.current) {
      audioRef.current.volume = vol;
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
    if (currentTrack?.spotifyUri && deviceId && isPremiumRef.current && spotifyPlayerRef.current) {
      spotifyPlayerRef.current.seek(newProgress * 1000);
    } else if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
    }
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
        prevTrack,
        deviceId
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
