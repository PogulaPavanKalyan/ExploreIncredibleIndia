import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Compass, ArrowRight, Sparkles } from 'lucide-react';

const INDIA_REGIONS = [
  { id: 'delhi', name: 'Delhi NCR', slug: 'delhi', x: 42, y: 30, count: '12+ Places', type: 'Capital & Heritage' },
  { id: 'rajasthan', name: 'Rajasthan', slug: 'rajasthan', x: 28, y: 40, count: '25+ Places', type: 'Royal Palaces & Forts' },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', slug: 'andhra-pradesh', x: 55, y: 70, count: '18+ Places', type: 'Eastern Ghats & Temples' },
  { id: 'kerala', name: 'Kerala', slug: 'kerala', x: 44, y: 88, count: '20+ Places', type: 'Backwaters & Spices' },
  { id: 'goa', name: 'Goa', slug: 'goa', x: 32, y: 72, count: '15+ Places', type: 'Sun, Beaches & Nightlife' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', slug: 'himachal-pradesh', x: 45, y: 18, count: '22+ Places', type: 'Snow Peaks & Valleys' }
];

export default function StateMap3D() {
  const [activePin, setActivePin] = useState(null);
  const navigate = useNavigate();

  const handleStateClick = (slug) => {
    navigate(`/explore?state=${slug}`);
  };

  return (
    <div className="map-3d-container">
      {/* Background Glow Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 45% 50%, rgba(255, 107, 53, 0.12) 0%, rgba(15, 23, 42, 0.95) 75%)',
        pointerEvents: 'none'
      }} />

      {/* SVG Connecting Lines between States */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line x1="42%" y1="30%" x2="28%" y2="40%" stroke="rgba(255, 107, 53, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="42%" y1="30%" x2="45%" y2="18%" stroke="rgba(255, 107, 53, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="28%" y1="40%" x2="32%" y2="72%" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="32%" y1="72%" x2="44%" y2="88%" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="42%" y1="30%" x2="55%" y2="70%" stroke="rgba(255, 107, 53, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="55%" y1="70%" x2="44%" y2="88%" stroke="rgba(255, 107, 53, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
      </svg>

      {/* Interactive Map Header Badge */}
      <div style={{
        position: 'absolute',
        top: '1.25rem',
        left: '1.25rem',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.9rem',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: '#ffffff',
        fontSize: '0.8rem',
        fontWeight: 600
      }}>
        <Sparkles size={14} style={{ color: '#FF6B35' }} /> Interactive 3D Region Map
      </div>

      {/* Floating State Nodes */}
      {INDIA_REGIONS.map((region) => {
        const isActive = activePin === region.id;
        return (
          <div
            key={region.id}
            className="map-3d-pin"
            style={{ left: `${region.x}%`, top: `${region.y}%` }}
            onMouseEnter={() => setActivePin(region.id)}
            onMouseLeave={() => setActivePin(null)}
            onClick={() => handleStateClick(region.slug)}
          >
            {/* Glowing Map Dot */}
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#FF6B35',
              boxShadow: '0 0 20px #FF6B35, 0 0 40px rgba(255, 107, 53, 0.6)',
              border: '3px solid #ffffff',
              margin: '0 auto',
              transition: 'all 0.3s ease'
            }} />

            {/* State Bubble Label */}
            <div className="pin-bubble" style={{
              marginTop: '0.4rem',
              background: isActive ? 'linear-gradient(135deg, #FF6B35, #E05320)' : 'rgba(15, 23, 42, 0.85)',
              border: isActive ? '1px solid #FF6B35' : '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {region.name}
            </div>

            {/* Hover Tooltip Card */}
            {isActive && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '180px',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 107, 53, 0.4)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                color: '#ffffff',
                zIndex: 20,
                textAlign: 'left'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FF6B35' }}>{region.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>{region.type}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38BDF8', marginTop: '0.4rem' }}>
                  {region.count} →
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
