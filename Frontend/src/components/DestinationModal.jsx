import React, { useState } from 'react';
import { X, Star, MapPin, Calendar, Clock, Ticket, Plane, Train, Bus, Car, Utensils, Heart, Share2, Compass, ShieldCheck, MessageSquare } from 'lucide-react';
import { translations } from '../data/translations';

export default function DestinationModal({
  item,
  lang,
  onClose,
  isSaved,
  onToggleSave,
  onPlanTrip
}) {
  if (!item) return null;
  const t = translations[lang] || translations.en;

  const [reviews, setReviews] = useState([
    { name: "Rahul Sharma", rating: 5, date: "2 weeks ago", text: "Truly breathtaking experience! Visited during early morning, line was short and morning light was perfect for photography." },
    { name: "Emily Watson", rating: 5, date: "1 month ago", text: "Detailed cultural insights and guide services made our trip unforgettable. Highly recommend taking the local battery rickshaws." }
  ]);

  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(5);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    setReviews([
      { name: "You (Explorer)", rating: Number(newRating), date: "Just now", text: newReview },
      ...reviews
    ]);
    setNewReview('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Hero Banner */}
        <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
          <img
            src={item.heroImage}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--bg-modal) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)'
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={20} />
          </button>

          {/* Title & Badge Details in Hero Banner */}
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-saffron">{item.region}</span>
              <span className="badge badge-emerald">{item.theme}</span>
              <span className="badge badge-gold">⭐ {item.rating} / 5</span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFF' }}>{item.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D1D5DB', fontSize: '0.95rem' }}>
              <MapPin size={16} color="var(--primary-saffron)" />
              <span>{item.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Main Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Quick Action Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{t.bestTime}</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary-gold)' }}>
                  📅 {item.bestTime}
                </span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{t.ticketPrice}</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary-emerald)' }}>
                  🎫 {item.ticket.domestic}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => onToggleSave(item)}
                className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                style={{ height: '38px' }}
              >
                <Heart size={16} fill={isSaved ? "#F43F5E" : "none"} color={isSaved ? "#F43F5E" : "#FFF"} />
                <span>{isSaved ? "Saved" : t.addToBucketlist}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onPlanTrip(item);
                }}
                className="btn btn-gold btn-sm"
                style={{ height: '38px' }}
              >
                <Compass size={16} />
                <span>{t.planTrip}</span>
              </button>
            </div>
          </div>

          {/* Section: Overview & History */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--primary-saffron)' }}>
              📜 {t.history}
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {item.history}
            </p>
          </div>

          {/* Section: Opening Hours & Fees */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={18} color="var(--primary-saffron)" />
                <h4 style={{ fontSize: '1rem' }}>Timings & Hours</h4>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{item.timings}</p>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Ticket size={18} color="var(--primary-emerald)" />
                <h4 style={{ fontSize: '1rem' }}>Detailed Ticket Rates</h4>
              </div>
              <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', listStyle: 'none', lineHeight: 1.6 }}>
                <li>🇮🇳 <strong>{t.domestic}:</strong> {item.ticket.domestic}</li>
                <li>🌐 <strong>{t.foreigner}:</strong> {item.ticket.foreigner}</li>
                <li>📷 <strong>Camera / Video:</strong> {item.ticket.camera}</li>
              </ul>
            </div>
          </div>

          {/* Section: How to Reach */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--primary-saffron)' }}>
              🚆 {t.howToReach}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
                  <Plane size={16} />
                  <span>{t.flight}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.howToReach.flight}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-gold)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
                  <Train size={16} />
                  <span>{t.train}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.howToReach.train}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-emerald)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
                  <Bus size={16} />
                  <span>{t.bus}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.howToReach.bus}</p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-saffron)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
                  <Car size={16} />
                  <span>{t.local}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.howToReach.local}</p>
              </div>
            </div>
          </div>

          {/* Section: Local Cuisine & Nearby Spots */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Local Food */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Utensils size={18} />
                <span>{t.localCuisine}</span>
              </h4>
              <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {item.localFood.map((dish, i) => (
                  <li key={i}>{dish}</li>
                ))}
              </ul>
            </div>

            {/* Nearby Spots */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={18} />
                <span>{t.nearbyAttractions}</span>
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.nearbyAttractions.map((spot, i) => (
                  <span key={i} className="badge badge-indigo" style={{ textTransform: 'none' }}>
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section: User Reviews & Rating Submission */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--primary-saffron)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={18} />
              <span>{t.reviews} ({reviews.length})</span>
            </h3>

            {/* Review Form */}
            <form onSubmit={handleAddReview} style={{ marginBottom: '20px', background: 'rgba(15,23,42,0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Your Rating:</span>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  className="select-field"
                  style={{ height: '36px' }}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5)</option>
                  <option value="3">⭐⭐⭐ (3/5)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Share your experience or helpful tips for fellow travelers..."
                  className="input-field"
                  style={{ height: '42px', fontSize: '0.9rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">Submit</button>
              </div>
            </form>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map((rev, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{rev.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{rev.date}</span>
                  </div>
                  <div style={{ color: '#FFB800', fontSize: '0.8rem', marginBottom: '4px' }}>
                    {'⭐'.repeat(rev.rating)}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{rev.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
