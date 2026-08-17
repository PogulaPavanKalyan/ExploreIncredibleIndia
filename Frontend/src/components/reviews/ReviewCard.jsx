import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, User, CheckCircle2 } from 'lucide-react';
import apiClient from '../../api/apiClient';

export default function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [reported, setReported] = useState(review.is_reported || false);

  const handleHelpfulClick = async () => {
    if (hasVoted) return;
    setHelpfulCount(prev => prev + 1);
    setHasVoted(true);

    try {
      if (review.id) {
        await apiClient.post(`/reviews/${review.id}/helpful/`);
      }
    } catch (err) {
      console.warn("Could not save helpful vote:", err);
    }
  };

  const handleReportClick = async () => {
    if (reported) return;
    setReported(true);
    alert("Thank you. This review has been reported for moderator review.");

    try {
      if (review.id) {
        await apiClient.post(`/reviews/${review.id}/report/`);
      }
    } catch (err) {
      console.warn("Could not report review:", err);
    }
  };

  const authorName = review.user_details?.username || review.user_name || 'Traveler';
  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Recent Visit';

  return (
    <div style={{
      background: '#ffffff',
      padding: '1.25rem',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      marginBottom: '1rem',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      {/* Review Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem'
          }}>
            {authorName.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong style={{ color: '#0F172A', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {authorName}
              <CheckCircle2 size={14} color="#10B981" title="Verified Traveler" />
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{formattedDate}</span>
          </div>
        </div>

        {/* Star Rating Pills */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.3rem 0.6rem',
          background: '#FEF3C7',
          color: '#B45309',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          <Star size={14} fill="#FFB703" color="#FFB703" />
          <span>{review.rating || 5} / 5</span>
        </div>
      </div>

      {/* Review Title & Content */}
      <h4 style={{ margin: '0 0 0.4rem 0', color: '#0F172A', fontSize: '1rem', fontWeight: 700 }}>
        {review.title}
      </h4>
      <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
        {review.comment}
      </p>

      {/* Action Footer: Helpful & Report */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
        <button
          onClick={handleHelpfulClick}
          style={{
            background: hasVoted ? '#DCFCE7' : 'transparent',
            color: hasVoted ? '#15803D' : '#64748B',
            border: '1px solid #E2E8F0',
            padding: '0.3rem 0.7rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s ease'
          }}
        >
          <ThumbsUp size={14} /> Helpful ({helpfulCount})
        </button>

        <button
          onClick={handleReportClick}
          style={{
            background: 'transparent',
            color: reported ? '#EF4444' : '#94A3B8',
            border: 'none',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Flag size={12} /> {reported ? 'Reported' : 'Report'}
        </button>
      </div>
    </div>
  );
}
