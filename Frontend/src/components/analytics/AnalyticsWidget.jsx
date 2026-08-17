import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, Users, Sparkles, TrendingUp, MapPin } from 'lucide-react';
import { getAnalyticsData } from '../../services/analyticsService';

export default function AnalyticsWidget() {
  const [data, setData] = useState(getAnalyticsData());

  useEffect(() => {
    setData(getAnalyticsData());
  }, []);

  const maxCount = Math.max(...data.topDestinations.map(d => d.count), 1);

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <BarChart3 size={14} /> Platform Insights & Metrics
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
            Real-Time Explorer Statistics
          </h3>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Eye size={14} color="#0284C7" /> Total Page Views
          </span>
          <strong style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', display: 'block', marginTop: '0.2rem' }}>
            {data.totalPageViews.toLocaleString()}
          </strong>
        </div>

        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={14} color="#10B981" /> Active Travelers
          </span>
          <strong style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', display: 'block', marginTop: '0.2rem' }}>
            {data.activeSessions} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#10B981' }}>Live</span>
          </strong>
        </div>

        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={14} color="#FF6B35" /> AI Trips Built
          </span>
          <strong style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', display: 'block', marginTop: '0.2rem' }}>
            {data.itinerariesGenerated}
          </strong>
        </div>
      </div>

      {/* Top Explored Destinations Chart */}
      <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <TrendingUp size={16} color="#FF6B35" /> Top Explored Destinations across India
      </h5>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {data.topDestinations.map((dest, idx) => {
          const pct = Math.round((dest.count / maxCount) * 100);
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} color="#FF6B35" /> {dest.name} <span style={{ fontSize: '0.72rem', fontWeight: 400, color: '#64748B' }}>({dest.state})</span>
                </span>
                <strong style={{ color: '#0284C7' }}>{dest.count} views</strong>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: idx === 0 ? 'linear-gradient(90deg, #FF6B35, #FFB703)' : '#0284C7',
                  borderRadius: '10px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
