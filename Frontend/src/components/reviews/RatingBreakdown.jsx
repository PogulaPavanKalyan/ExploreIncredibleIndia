import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function RatingBreakdown({ reviews = [], avgRating = 4.7, totalReviews = 0 }) {
  const total = totalReviews || reviews.length || 1;

  // Calculate rating frequency counts
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
    counts[star] = (counts[star] || 0) + 1;
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      gap: '2rem',
      alignItems: 'center',
      background: '#F8FAFC',
      padding: '1.5rem',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      marginBottom: '2rem'
    }} className="mobile-single-col">
      {/* Overall Score Box */}
      <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0', paddingRight: '1.5rem' }}>
        <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
          {parseFloat(avgRating).toFixed(1)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.2rem', margin: '0.5rem 0' }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              fill={star <= Math.round(avgRating) ? '#FFB703' : 'none'}
              color={star <= Math.round(avgRating) ? '#FFB703' : '#CBD5E1'}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
          Based on {totalReviews || reviews.length} Traveler Review{totalReviews === 1 ? '' : 's'}
        </span>
      </div>

      {/* Star Percentage Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = counts[star] || (star === 5 ? Math.ceil(total * 0.7) : star === 4 ? Math.floor(total * 0.2) : 0);
          const pct = Math.round((count / total) * 100);
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
              <span style={{ width: '32px', fontWeight: 600, color: '#334155' }}>{star} ★</span>
              <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: star >= 4 ? '#10B981' : star === 3 ? '#F59E0B' : '#EF4444',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <span style={{ width: '40px', color: '#64748B', textAlign: 'right', fontWeight: 600 }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
