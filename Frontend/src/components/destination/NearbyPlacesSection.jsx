import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Star, ArrowRight } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { getDestinationPrimaryImage, handleImageError } from '../../utils/imageUtils';

export default function NearbyPlacesSection({ destinationSlug, destinationName }) {
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destinationSlug) return;
    setLoading(true);
    apiClient.get(`/places/${destinationSlug}/nearby/`)
      .then(res => {
        if (res.data && res.data.data) {
          setNearbyPlaces(res.data.data);
        }
      })
      .catch(err => {
        console.warn("Could not fetch nearby places:", err);
      })
      .finally(() => setLoading(false));
  }, [destinationSlug]);

  if (loading || nearbyPlaces.length === 0) {
    return null;
  }

  return (
    <section className="details-card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Explore Nearby Attractions
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Places Near {destinationName || 'Here'}
          </h2>
        </div>

        <Link to="/explore" style={{ color: '#FF6B35', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          Explore All Spots <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {nearbyPlaces.map(place => (
          <Link
            key={place.id}
            to={`/places/${place.slug}`}
            style={{
              textDecoration: 'none',
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
            className="search-item-hover"
          >
            {/* Image Box */}
            <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
              <img
                src={getDestinationPrimaryImage(place)}
                alt={place.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
                onError={(e) => handleImageError(e, place.name)}
              />

              {/* Distance Badge */}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#ffffff',
                backdropFilter: 'blur(6px)',
                padding: '0.25rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Navigation size={12} color="#FF6B35" />
                <span>{place.distance_km || 10} km away</span>
              </div>
            </div>

            {/* Content Box */}
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.3rem 0', lineHeight: 1.3 }}>
                {place.name}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} color="#FF6B35" /> {place.city_name || place.state_name || 'India'}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284C7', background: '#F0F9FF', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  {place.category_name || place.category?.name || 'Attraction'}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Star size={13} fill="#FFB703" color="#FFB703" /> {place.avg_rating || 4.5}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
