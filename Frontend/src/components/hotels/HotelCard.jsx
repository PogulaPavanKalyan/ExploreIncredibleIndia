import React from 'react';
import { Star, MapPin, ExternalLink, Wifi, Coffee, ShieldCheck } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const image = hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';
  const name = hotel.name || 'Haritha Hill Resort';
  const stars = hotel.star_rating || 4;
  const price = hotel.price_per_night || 3200;
  const address = hotel.address || 'Araku Valley Main Road, Visakhapatnam District';
  const bookingUrl = hotel.booking_url || '#';

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
        <img
          src={image}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: '#FEF3C7',
          color: '#B45309',
          padding: '0.2rem 0.5rem',
          borderRadius: '6px',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <Star size={13} fill="#FFB703" color="#FFB703" /> {stars} Star Hotel
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
          {name}
        </h4>
        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={14} color="#FF6B35" /> {address}
        </p>

        {/* Key Amenities */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#475569' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', background: '#F8FAFC', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
            <Wifi size={12} color="#0284C7" /> Free WiFi
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', background: '#F8FAFC', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
            <Coffee size={12} color="#D97706" /> Breakfast Included
          </span>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Starts from</span>
            <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>₹{price} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/ night</span></strong>
          </div>

          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              background: '#0F172A',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Check Availability <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
