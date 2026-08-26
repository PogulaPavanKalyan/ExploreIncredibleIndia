import React, { useState, useEffect } from 'react';
import { 
  MapPin, Layers, Sparkles, BookOpen, Users, TrendingUp, 
  Activity, CheckCircle2, Clock, ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDestinations } from '../../services/destinationService';
import './AdminPages.css';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    destinationsCount: 215,
    statesCount: 36,
    collectionsCount: 6,
    storiesCount: 18,
    usersCount: 1420
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, action: 'Added New Visiting Place', title: 'Somnath Jyotirlinga Temple', time: '10 mins ago', type: 'place' },
    { id: 2, action: 'Updated Collection Banner', title: '12 Sacred Jyotirlingas of India', time: '45 mins ago', type: 'collection' },
    { id: 3, action: 'Published Travel Story', title: 'Backwaters of Kerala: A Serene Odyssey', time: '2 hours ago', type: 'story' },
    { id: 4, action: 'Verified Festival Dates', title: 'Kumbh Mela Prayagraj 2026', time: '5 hours ago', type: 'festival' },
  ]);

  useEffect(() => {
    getDestinations({ page_size: 1 })
      .then((res) => {
        if (res && res.pagination && res.pagination.total) {
          setStats(prev => ({ ...prev, destinationsCount: res.pagination.total }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="admin-overview-page">
      
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Platform Executive Overview</h1>
          <p className="admin-page-subtitle">Real-time status of India Travel Hub data, content, and user engagement.</p>
        </div>
        <Link to="/admin/destinations?action=new" className="btn-submit">
          + Add New Visiting Place
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-wrapper">
            <MapPin size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Visiting Places</span>
            <span className="stat-value">{stats.destinationsCount}</span>
            <span className="stat-change">↑ 12 Added this week</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper" style={{ color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            <Layers size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Collections</span>
            <span className="stat-value">{stats.collectionsCount}</span>
            <span className="stat-change">Jyotirlingas, Char Dham +4</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
            <Sparkles size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Cultural Festivals</span>
            <span className="stat-value">24</span>
            <span className="stat-change">Upcoming Season Active</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrapper" style={{ color: '#a855f7', background: 'rgba(168, 85, 247, 0.15)', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Registered Travelers</span>
            <span className="stat-value">{stats.usersCount}</span>
            <span className="stat-change">↑ +8.4% growth</span>
          </div>
        </div>
      </div>

      {/* Regional Interest & Activity Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Regional Distribution Box */}
        <div className="admin-table-panel">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0' }}>
            Regional Destination Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { region: 'South India', count: 68, color: '#ff6b35' },
              { region: 'North India', count: 54, color: '#38bdf8' },
              { region: 'West India', count: 38, color: '#fbbf24' },
              { region: 'East & Central India', count: 32, color: '#10b981' },
              { region: 'Northeast Frontier', count: 23, color: '#a855f7' }
            ].map((reg) => (
              <div key={reg.region}>
                <div style={{ display: 'flex', justify: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  <span>{reg.region}</span>
                  <span>{reg.count} Places</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${(reg.count / 70) * 100}%`, height: '100%', background: reg.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Panel */}
        <div className="admin-table-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Recent System Activity
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>● Live DB Sync</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentActivities.map((act) => (
              <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.65rem 0.85rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <CheckCircle2 size={16} color="#ff6b35" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', display: 'block' }}>{act.action}</span>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{act.title}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', flexShrink: 0 }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
