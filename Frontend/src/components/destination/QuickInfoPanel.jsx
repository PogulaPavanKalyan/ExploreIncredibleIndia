import React from 'react';
import { Calendar, Clock, DollarSign, Tag, MapPin, Compass } from 'lucide-react';

export default function QuickInfoPanel({ destination }) {
  if (!destination) return null;

  const bestTime = destination.best_time_to_visit || "Oct – Mar";
  const duration = destination.recommended_duration || "1–2 Days";
  
  // Format estimated budget cleanly without undefined
  let budget = "₹3,000 – ₹8,000";
  if (destination.budget_estimate) {
    budget = destination.budget_estimate;
  } else if (destination.min_budget && destination.max_budget) {
    budget = `₹${destination.min_budget.toLocaleString()} – ₹${destination.max_budget.toLocaleString()}`;
  } else if (destination.average_daily_cost) {
    budget = `₹${destination.average_daily_cost.toLocaleString()} / day`;
  }

  // Format categories / destination type
  let destType = "Spiritual & Cultural";
  if (destination.categories && destination.categories.length > 0) {
    destType = destination.categories.map(c => typeof c === 'string' ? c : c.name).join(' • ');
  } else if (destination.category_name) {
    destType = destination.category_name;
  } else if (destination.category?.name) {
    destType = destination.category.name;
  }

  const stateName = destination.state?.name || destination.state_name || "India";
  const regionName = destination.region?.name || destination.region_name || destination.state?.region?.name || "Incredible India";

  const cards = [
    {
      icon: <Calendar size={20} color="#FF6B1A" />,
      label: "BEST TIME",
      value: bestTime,
      bg: "rgba(255, 107, 26, 0.08)"
    },
    {
      icon: <Clock size={20} color="#0284C7" />,
      label: "DURATION",
      value: duration,
      bg: "rgba(2, 132, 199, 0.08)"
    },
    {
      icon: <DollarSign size={20} color="#10B981" />,
      label: "ESTIMATED BUDGET",
      value: budget,
      bg: "rgba(16, 185, 129, 0.08)"
    },
    {
      icon: <Tag size={20} color="#8B5CF6" />,
      label: "TYPE",
      value: destType,
      bg: "rgba(139, 92, 246, 0.08)"
    },
    {
      icon: <MapPin size={20} color="#EC4899" />,
      label: "STATE",
      value: stateName,
      bg: "rgba(236, 72, 153, 0.08)"
    },
    {
      icon: <Compass size={20} color="#F59E0B" />,
      label: "REGION",
      value: regionName,
      bg: "rgba(245, 158, 11, 0.08)"
    }
  ];

  return (
    <section className="quick-info-panel-section" aria-label="Destination Quick Overview" style={{
      maxWidth: '1360px',
      margin: '-2.5rem auto 2.5rem auto',
      padding: '0 1.5rem',
      position: 'relative',
      zIndex: 20
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        padding: '1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem'
      }}>
        {cards.map((card, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.9rem',
            padding: '0.75rem 1rem',
            borderRadius: '16px',
            background: card.bg,
            border: '1px solid rgba(0, 0, 0, 0.03)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
              flexShrink: 0
            }}>
              {card.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#64748B',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                display: 'block'
              }}>
                {card.label}
              </span>
              <strong style={{
                color: '#0F172A',
                fontSize: '0.92rem',
                fontWeight: 700,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {card.value}
              </strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
