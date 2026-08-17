import React, { useState } from 'react';
import { Award, Star, CheckCircle2, Phone, MessageSquare, Languages, DollarSign, X } from 'lucide-react';

export default function LocalGuideCard({ guide }) {
  const [showModal, setShowModal] = useState(false);

  const photoUrl = guide.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';
  const name = guide.name || 'Ramesh Kumar';
  const expYears = guide.experience_years || 8;
  const rating = parseFloat(guide.rating || 4.9).toFixed(1);
  const price = guide.price_per_day || 1500;
  const languages = guide.languages_spoken || 'Telugu, English, Hindi';
  const phone = guide.contact_phone || '+91 98765 43210';
  const bio = guide.bio || `Certified tourist guide with ${expYears} years of experience specializing in tribal heritage, scenic coffee plantations, and hidden waterfall trails.`;

  return (
    <>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Top Header: Avatar & Rating */}
        <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '0.85rem' }}>
          <img
            src={photoUrl}
            alt={name}
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF6B35' }}
            loading="lazy"
          />
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {name}
              {guide.is_verified !== false && <CheckCircle2 size={16} color="#10B981" title="Verified Tour Guide" />}
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
              <span style={{ background: '#FEF3C7', color: '#B45309', padding: '0.15rem 0.4rem', borderRadius: '6px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Star size={12} fill="#FFB703" color="#FFB703" /> {rating}
              </span>
              <span style={{ color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Award size={13} color="#0284C7" /> {expYears}+ Yrs Exp
              </span>
            </div>
          </div>
        </div>

        {/* Bio & Languages */}
        <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
          {bio}
        </p>

        <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Languages size={14} color="#FF6B35" />
          <span>Languages: <strong>{languages}</strong></span>
        </div>

        {/* Footer: Price & Contact Button */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Daily Fee</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>₹{price} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/ day</span></strong>
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '10px',
              background: '#FF6B35',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Phone size={14} /> Contact Guide
          </button>
        </div>
      </div>

      {/* Booking / Contact Modal */}
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
            maxWidth: '440px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <img src={photoUrl} alt={name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Contact {name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>
                  ✓ Verified Tour Specialist ({expYears} Years Experience)
                </span>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Daily Hiring Rate:</span>
                <strong style={{ color: '#0F172A' }}>₹{price} / day</strong>
              </div>
              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Languages:</span>
                <strong style={{ color: '#0F172A' }}>{languages}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Phone / WhatsApp:</span>
                <strong style={{ color: '#0284C7' }}>{phone}</strong>
              </div>
            </div>

            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${name}, I found your profile on Dekho Bharat and would like to hire you as a local travel guide!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.75rem',
                borderRadius: '12px',
                background: '#25D366',
                color: '#ffffff',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.92rem'
              }}
            >
              <MessageSquare size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
