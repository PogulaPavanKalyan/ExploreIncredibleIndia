import React from 'react';
import { X, Heart, Trash2, ArrowRight, Printer, MapPin, Compass } from 'lucide-react';
import { translations } from '../data/translations';

export default function BucketListModal({
  lang,
  savedItems,
  onClose,
  onRemove,
  onSelectDestination
}) {
  const t = translations[lang] || translations.en;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(244, 63, 94, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={24} fill="#F43F5E" color="#F43F5E" />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t.savedBucketlist} ({savedItems.length})</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Your Saved Indian Destinations & Wishlist</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {savedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Compass size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your wishlist is currently empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Browse destinations and click the heart icon to save places to your personal travel bucketlist!
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                  <Printer size={16} />
                  <span>Print Bucketlist</span>
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {savedItems.map((item) => (
                  <div key={item.id} className="glass-card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={item.heroImage}
                        alt={item.name}
                        style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.name}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          <MapPin size={12} color="var(--primary-saffron)" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectDestination(item);
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        <span>View</span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        onClick={() => onRemove(item.id)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.15)',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          color: '#F43F5E',
                          borderRadius: '8px',
                          width: '34px',
                          height: '34px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
