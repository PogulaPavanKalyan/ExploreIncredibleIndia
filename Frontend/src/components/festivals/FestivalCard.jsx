import React, { useState } from 'react';
import { Calendar, MapPin, Sparkles, Info, X } from 'lucide-react';

export default function FestivalCard({ festival }) {
  const [showModal, setShowModal] = useState(false);

  const image = festival.image || 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=600';
  const name = festival.name || 'Itika Pongal & Dhimsa Dance Utsav';
  const month = festival.month_celebrated || 'January - February';
  const stateName = festival.state_name || festival.state?.name || 'Andhra Pradesh';
  const description = festival.description || 'Grand cultural harvest festival celebrated with traditional Dhimsa tribal dance performance, folk songs, colorful rangolis, and special bamboo cuisine feasts.';

  return (
    <>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
          <img
            src={image}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            backdropFilter: 'blur(6px)',
            padding: '0.25rem 0.65rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Calendar size={13} color="#FF6B35" /> {month}
          </div>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ marginBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', background: '#F0F9FF', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
              <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} /> {stateName}
            </span>
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
            {name}
          </h4>
          
          <p style={{ fontSize: '0.83rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1rem 0', flex: 1 }}>
            {description.length > 100 ? `${description.slice(0, 100)}...` : description}
          </p>

          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                background: '#FF6B35',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Info size={13} /> Festival Details
            </button>
          </div>
        </div>
      </div>

      {/* Festival Details Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.6)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
            >
              <X size={18} />
            </button>

            <div style={{ height: '200px', position: 'relative' }}>
              <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#FF6B35', fontWeight: 700, textTransform: 'uppercase' }}>Cultural Celebration</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{name}</h3>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div style={{ background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', flex: 1 }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Season / Month</span>
                  <strong style={{ color: '#0F172A' }}>{month}</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', flex: 1 }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>State / Region</span>
                  <strong style={{ color: '#0F172A' }}>{stateName}</strong>
                </div>
              </div>

              <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>Cultural Significance & Rituals</h5>
              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                {description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
