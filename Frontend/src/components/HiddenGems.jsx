import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Award, Compass, Flag } from 'lucide-react';
import { hiddenGems, festivalCalendar } from '../data/hiddenGems';
import { translations } from '../data/translations';

export default function HiddenGems({ lang }) {
  const t = translations[lang] || translations.en;
  const [activeTab, setActiveTab] = useState('gems');

  return (
    <section style={{ padding: '4rem 0', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem', padding: '0.4rem 1rem' }}>
            <Award size={14} />
            <span>Offbeat & Authentic Experiences</span>
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
            {t.hiddenGems}
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
            Beyond the crowded tourist spots lie ancient tribal valleys, living root bridges, and vibrant annual cultural festivals.
          </p>

          {/* Sub-tabs */}
          <div style={{ display: 'inline-flex', gap: '8px', marginTop: '1.5rem', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('gems')}
              style={{
                padding: '0.45rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'gems' ? 'var(--primary-saffron)' : 'transparent',
                color: activeTab === 'gems' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              🌱 Hidden Gems
            </button>

            <button
              onClick={() => setActiveTab('festivals')}
              style={{
                padding: '0.45rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'festivals' ? 'var(--primary-saffron)' : 'transparent',
                color: activeTab === 'festivals' ? '#FFF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              🎉 Cultural Festivals
            </button>
          </div>
        </div>

        {/* Tab 1: Hidden Gems */}
        {activeTab === 'gems' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {hiddenGems.map((gem) => (
              <div key={gem.id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={gem.image} alt={gem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span className="badge badge-emerald" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    {gem.type}
                  </span>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: '1' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>{gem.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                    <MapPin size={14} color="var(--primary-saffron)" />
                    <span>{gem.location}</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {gem.description}
                  </p>

                  <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--primary-gold)' }}>
                    ✨ <strong>Highlight:</strong> {gem.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Cultural Festivals */}
        {activeTab === 'festivals' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {festivalCalendar.map((fest, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-gold)' }}>
                    🎪 {fest.name}
                  </h4>
                  <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
                    {fest.month}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <MapPin size={14} color="var(--accent-cyan)" />
                  <span>{fest.place}</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {fest.significance}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
