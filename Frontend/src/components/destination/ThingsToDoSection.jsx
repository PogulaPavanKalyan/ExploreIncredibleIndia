import React from 'react';
import { Compass, Clock, Sparkles, CheckCircle2, Ticket } from 'lucide-react';

const DEFAULT_ACTIVITY_ICONS = {
  'temple': '🛕',
  'trekking': '🥾',
  'boating': '⛵',
  'safari': '🦁',
  'photography': '📸',
  'beach': '🏖️',
  'sightseeing': '🏛️',
  'food': '🍲',
  'spiritual': '🕉️',
  'adventure': '🧗'
};

export default function ThingsToDoSection({ destination }) {
  if (!destination) return null;

  // Gather activities from destination.activities or destination.attractions
  const activitiesList = (destination.activities && destination.activities.length > 0)
    ? destination.activities
    : (destination.attractions && destination.attractions.length > 0)
      ? destination.attractions.map(attr => ({
          id: attr.id,
          name: attr.name,
          description: attr.description,
          duration: attr.estimated_duration || "1–2 Hours",
          icon: attr.icon || "🏛️",
          ticket_price: attr.ticket_price
        }))
      : [];

  if (activitiesList.length === 0) return null;

  const getActivityIcon = (act) => {
    if (act.icon) return act.icon;
    const nameLower = (act.name || '').toLowerCase();
    for (const [key, icon] of Object.entries(DEFAULT_ACTIVITY_ICONS)) {
      if (nameLower.includes(key)) return icon;
    }
    return '✦';
  };

  return (
    <section className="details-card things-to-do-section" id="things-to-do" style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF6B1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Curated Experiences
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
            Things to Do in {destination.name}
          </h2>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {activitiesList.map((act, index) => {
          const icon = getActivityIcon(act);
          return (
            <div
              key={act.id || act.slug || index}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                padding: '1.4rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="search-item-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    {act.name}
                  </h3>
                  {act.duration && (
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                      <Clock size={12} color="#0284C7" /> {act.duration}
                    </span>
                  )}
                </div>
              </div>

              {act.description && (
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55, margin: '0 0 0.8rem 0', flex: 1 }}>
                  {act.description}
                </p>
              )}

              {act.ticket_price && parseFloat(act.ticket_price) > 0 && (
                <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#D97706' }}>
                  <Ticket size={13} /> Entry: ₹{act.ticket_price}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
