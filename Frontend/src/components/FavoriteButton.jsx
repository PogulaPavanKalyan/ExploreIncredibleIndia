import React, { useState, useContext } from 'react';
import { Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { addFavorite } from '../api/favoriteApi';

export default function FavoriteButton({ destinationId, initialFavorited = false }) {
  const [isFavorited, setIsFavorited] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
      return saved.includes(destinationId) || initialFavorited;
    } catch {
      return initialFavorited;
    }
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !isFavorited;
    setIsFavorited(nextState);

    // Save to localStorage for instant guest support
    try {
      const saved = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
      if (nextState) {
        if (!saved.includes(destinationId)) saved.push(destinationId);
      } else {
        const idx = saved.indexOf(destinationId);
        if (idx > -1) saved.splice(idx, 1);
      }
      localStorage.setItem('guest_favorites', JSON.stringify(saved));
      window.dispatchEvent(new Event('favorites-updated'));
    } catch (err) {
      console.warn("Could not write guest favorite:", err);
    }

    // Also attempt backend API if authenticated
    try {
      if (nextState) {
        await addFavorite(destinationId);
      }
    } catch (err) {
      // Silently catch for guests
    }
  };

  return (
    <button
      className={`favorite-btn ${isFavorited ? 'active' : ''}`}
      onClick={handleToggle}
      disabled={loading}
      title={isFavorited ? "Remove from favorites" : "Save to favorites"}
    >
      <Heart size={18} className={isFavorited ? 'heart-filled' : ''} />
    </button>
  );
}
