import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import { getDestinations } from '../services/destinationService';
import { getFavorites } from '../services/favoriteService';
import DestinationCard from '../components/DestinationCard';
import PageTransition from '../components/PageTransition';
import SkeletonGrid from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';

export default function FavoritesPage() {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedDestinations = async () => {
    setLoading(true);
    try {
      // 1. Check guest favorites in localStorage
      let guestIds = [];
      try {
        guestIds = JSON.parse(localStorage.getItem('guest_favorites') || '[]');
      } catch {
        guestIds = [];
      }

      // 2. Fetch authenticated backend favorites if logged in
      let backendIds = [];
      try {
        const favRes = await getFavorites();
        if (favRes && favRes.data) {
          backendIds = favRes.data.map(f => f.destination?.id || f.destination);
        }
      } catch {
        backendIds = [];
      }

      const combinedIds = Array.from(new Set([...guestIds, ...backendIds].filter(Boolean)));

      if (combinedIds.length === 0) {
        setSavedPlaces([]);
        setLoading(false);
        return;
      }

      // 3. Load all destination records
      const allRes = await getDestinations({ page_size: 100 });
      if (allRes && allRes.data) {
        const matched = allRes.data.filter(d => combinedIds.includes(d.id));
        setSavedPlaces(matched);
      }
    } catch (err) {
      console.error("Error loading saved destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedDestinations();

    const handleUpdate = () => loadSavedDestinations();
    window.addEventListener('favorites-updated', handleUpdate);
    return () => window.removeEventListener('favorites-updated', handleUpdate);
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Clear all saved favorites?")) {
      localStorage.setItem('guest_favorites', JSON.stringify([]));
      setSavedPlaces([]);
      window.dispatchEvent(new Event('favorites-updated'));
    }
  };

  return (
    <PageTransition>
      <div className="favorites-page" style={{ minHeight: '80vh', padding: '2.5rem 0', background: 'var(--light-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <Link to="/explore" style={{ color: '#FF6B35', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                <ArrowLeft size={16} /> Back to Explore All Places
              </Link>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Heart size={28} fill="#EF4444" color="#EF4444" /> Saved Favorites
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
                {savedPlaces.length} destination{savedPlaces.length === 1 ? '' : 's'} saved to your trip wishlist
              </p>
            </div>

            {savedPlaces.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  background: '#FEE2E2',
                  color: '#991B1B',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} /> Clear Wishlist
              </button>
            )}
          </div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : savedPlaces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#EF4444' }}>
                <Heart size={32} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                Your Wishlist is Empty
              </h3>
              <p style={{ color: '#64748B', maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Explore incredible hill stations, beaches, forts, and waterfalls across India and click the heart icon to save places here!
              </p>
              <Link to="/explore" className="btn-cta-planner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={18} /> Explore Destinations Now
              </Link>
            </div>
          ) : (
            <div className="grid-destinations">
              {savedPlaces.map(place => (
                <DestinationCard key={place.id} destination={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
