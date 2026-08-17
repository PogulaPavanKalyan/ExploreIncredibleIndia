import React from 'react';
import { Award, Trophy, Star, ShieldCheck, Zap } from 'lucide-react';
import { calculateGamification } from '../../utils/gamification';

export default function UserBadgesWidget({ favoritesCount = 3, reviewsCount = 1, itinerariesCount = 1 }) {
  const stats = calculateGamification(favoritesCount, reviewsCount, itinerariesCount);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '2rem'
    }}>
      {/* Level Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            fontSize: '2rem',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${stats.rank.badgeColor}`
          }}>
            {stats.rank.icon}
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Traveler Rank Level {stats.rank.level}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {stats.rank.title}
              <ShieldCheck size={18} color="#10B981" />
            </h3>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Explorer Points</span>
          <strong style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FF6B35', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            <Zap size={18} fill="#FF6B35" /> {stats.points} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748B' }}>pts</span>
          </strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748B', marginBottom: '0.35rem', fontWeight: 600 }}>
          <span>Level Progress ({stats.progressPercent}%)</span>
          <span>Next Rank: <strong>{stats.nextRank.title}</strong> ({stats.nextRank.minPts} pts)</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{
            width: `${stats.progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FF6B35, #FFB703)',
            borderRadius: '10px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Earned Badges Grid */}
      <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Trophy size={16} color="#D97706" /> Explorer Badges & Trophies
      </h5>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {stats.badges.map(badge => (
          <div
            key={badge.id}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              border: badge.unlocked ? '1px solid #FDE68A' : '1px dashed #CBD5E1',
              background: badge.unlocked ? '#FEFCE8' : '#F8FAFC',
              opacity: badge.unlocked ? 1 : 0.6,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <span style={{ fontSize: '1.6rem' }}>{badge.icon}</span>
            <div>
              <h6 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {badge.name}
              </h6>
              <span style={{ fontSize: '0.7rem', color: badge.unlocked ? '#D97706' : '#94A3B8', fontWeight: 600 }}>
                {badge.unlocked ? '✓ Unlocked' : '🔒 Locked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
