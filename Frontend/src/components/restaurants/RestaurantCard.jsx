import React from 'react';
import { Utensils, Star, MapPin, DollarSign } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const image = restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600';
  const name = restaurant.name || 'Araku Bamboo Chicken House';
  const cuisine = restaurant.cuisine_type || 'Andhra & Tribal Delicacies';
  const rating = parseFloat(restaurant.rating || 4.7).toFixed(1);
  const costForTwo = restaurant.avg_cost_for_two || 600;
  const address = restaurant.address || 'Main Road, Near Araku Railway Station';
  const famousDishes = restaurant.famous_dishes ? restaurant.famous_dishes.split(',') : ['Bamboo Chicken', 'Bongu Biryani', 'Araku Filter Coffee'];

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
      <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
        <img
          src={image}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(15, 23, 42, 0.85)',
          color: '#ffffff',
          backdropFilter: 'blur(6px)',
          padding: '0.2rem 0.6rem',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.2rem'
        }}>
          <Star size={13} fill="#FFB703" color="#FFB703" /> {rating}
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '6px', textTransform: 'uppercase' }}>
            {cuisine}
          </span>
        </div>

        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.3rem 0' }}>
          {name}
        </h4>
        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={13} color="#FF6B35" /> {address}
        </p>

        {/* Famous Dish Tags */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '0.3rem', textTransform: 'uppercase' }}>Must Try Specialties</span>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {famousDishes.map((dish, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.2rem 0.5rem',
                  background: '#F1F5F9',
                  color: '#334155',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                🍲 {dish.trim()}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Avg. Cost for 2</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>₹{costForTwo}</strong>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(name + ' ' + address)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              background: '#0284C7',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <MapPin size={13} /> Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
