import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Track } from '../services/ai/playlistGenerator';

interface FavoritesContextType {
  favorites: Track[];
  addFavorite: (track: Track) => void;
  removeFavorite: (trackId: string) => void;
  isFavorite: (trackId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Track[]>(() => {
    try {
      const stored = localStorage.getItem('synthwave_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('synthwave_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (track: Track) => {
    setFavorites(prev => {
      if (prev.find(t => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const removeFavorite = (trackId: string) => {
    setFavorites(prev => prev.filter(t => t.id !== trackId));
  };

  const isFavorite = (trackId: string) => {
    return favorites.some(t => t.id === trackId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
