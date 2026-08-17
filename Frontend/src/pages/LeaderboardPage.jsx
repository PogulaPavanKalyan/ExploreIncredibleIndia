import React from 'react';
import { Trophy, Zap, ShieldCheck, Award, Star, Compass } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Aarav Sharma', title: 'Incredible India Legend', points: 1420, placesSaved: 28, reviewsWritten: 9, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', trophy: '👑' },
  { rank: 2, name: 'Priya Verma', title: 'Heritage Master', points: 980, placesSaved: 19, reviewsWritten: 6, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', trophy: '🥈' },
  { rank: 3, name: 'Rohan Patel', title: 'Heritage Master', points: 840, placesSaved: 16, reviewsWritten: 5, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', trophy: '🥉' },
  { rank: 4, name: 'Ananya Roy', title: 'State Traveler', points: 490, placesSaved: 10, reviewsWritten: 3, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', trophy: '🏅' },
  { rank: 5, name: 'Vikramaditya', title: 'State Traveler', points: 380, placesSaved: 8, reviewsWritten: 2, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200', trophy: '🏅' }
];

export default function LeaderboardPage() {
  return (
    <PageTransition>
      <div className="explore-container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', margin: '2rem 0 3rem 0' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Trophy size={16} /> Community Hall of Fame
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.4rem' }}>
            Top India Explorers Leaderboard
          </h1>
          <p style={{ color: '#64748B', maxWidth: '600px', margin: '0.5rem auto 0 auto', fontSize: '1rem' }}>
            Earn Explorer Points by saving bucketlist places, writing reviews, and planning trips across India!
          </p>
        </div>

        {/* Top 3 Podium Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {LEADERBOARD_DATA.slice(0, 3).map((user, idx) => (
            <div
              key={user.rank}
              style={{
                background: idx === 0 ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : '#ffffff',
                borderRadius: '20px',
                border: idx === 0 ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: idx === 0 ? '0 12px 30px rgba(245, 158, 11, 0.2)' : 'var(--shadow-sm)',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '1.8rem' }}>
                {user.trophy}
              </div>

              <img
                src={user.avatar}
                alt={user.name}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 0.75rem auto',
                  border: idx === 0 ? '3px solid #F59E0B' : '2px solid #0284C7'
                }}
              />

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem 0' }}>
                {user.name}
              </h3>
              
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0284C7', background: '#F0F9FF', padding: '0.2rem 0.6rem', borderRadius: '12px', display: 'inline-block', marginBottom: '0.75rem' }}>
                {user.title}
              </span>

              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FF6B35', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                <Zap size={18} fill="#FF6B35" /> {user.points} <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>pts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          marginBottom: '3rem'
        }}>
          <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontWeight: 800, color: '#0F172A' }}>
            All Time Explorers Rankings
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {LEADERBOARD_DATA.map((u) => (
              <div
                key={u.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #F1F5F9',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 900, width: '24px', color: u.rank <= 3 ? '#FF6B35' : '#64748B' }}>
                    #{u.rank}
                  </span>
                  <img src={u.avatar} alt={u.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {u.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{u.title}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'none' }} className="hide-mobile">
                    {u.placesSaved} saved • {u.reviewsWritten} reviews
                  </span>
                  <strong style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FF6B35', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Zap size={15} fill="#FF6B35" /> {u.points} pts
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
