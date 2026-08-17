import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, X, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ADS = [
  {
    id: 'ad-kerala',
    badge: 'Ad • Sponsored',
    tagline: 'Kerala Backwaters Special',
    title: '5-Day Luxury Houseboat Package',
    desc: 'Cruise through Alleppey backwaters with authentic traditional Kerala meals.',
    price: '₹4,999',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600',
    link: '/explore?state=kerala'
  },
  {
    id: 'ad-rajasthan',
    badge: 'Trending Travel Deal',
    tagline: 'Royal Rajasthan Heritage',
    title: 'Jaipur & Udaipur Palace Expedition',
    desc: 'Experience royal hospitality, desert safari, and historic fort tours.',
    price: '₹8,499',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600',
    link: '/explore?state=rajasthan'
  },
  {
    id: 'ad-vistadome',
    badge: 'IRCTC Scenic Rail Deal',
    tagline: 'Araku Valley Vistadome Pass',
    title: 'Vizag to Araku Glass-Roof Train Tour',
    desc: 'Panoramic views through 58 tunnels and lush green coffee plantations.',
    price: '₹1,250',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600',
    link: '/places/araku-valley'
  }
];

export default function Advertisement({ type = 'sidebar-right', index = 0 }) {
  const [dismissed, setDismissed] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const adData = MOCK_ADS[index % MOCK_ADS.length];

  useEffect(() => {
    // Log ad impression metric
    console.info(`[Ad Analytics] Impression logged for ad slot "${type}": ${adData.id}`);
  }, [type, adData.id]);

  const handleAdClick = () => {
    setClickCount(prev => prev + 1);
    console.info(`[Ad Analytics] Click recorded for ad "${adData.id}". Total clicks: ${clickCount + 1}`);
  };

  if (dismissed) return null;

  if (type === 'banner') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0F172A, #1E293B)',
        color: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: '16px',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ background: '#FF6B35', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', textTransform: 'uppercase' }}>
            {adData.badge}
          </span>
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {adData.title}
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0 }}>
              {adData.desc} — Starting at <strong style={{ color: '#FFB703' }}>{adData.price}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to={adData.link}
            onClick={handleAdClick}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              background: '#FF6B35',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Claim Deal <ArrowRight size={14} />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Dismiss Ad"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (type === 'inline' || type === 'mobile') {
    return (
      <div className="ad-wrapper ad-inline" style={{ position: 'relative' }}>
        <button
          onClick={() => setDismissed(true)}
          style={{ position: 'absolute', top: '8px', right: '12px', background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8 }}
          title="Dismiss Ad"
        >
          <X size={16} />
        </button>

        <span className="ad-badge">{adData.badge}</span>
        <div className="ad-inline-inner">
          <div className="ad-inline-info">
            <span style={{ fontSize: '0.8rem', color: '#ff6b35', fontWeight: 700, textTransform: 'uppercase' }}>
              <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {adData.tagline}
            </span>
            <h4>{adData.title}</h4>
            <p>{adData.desc} — Starting from <strong style={{ color: '#ffffff' }}>{adData.price}</strong> per person.</p>
          </div>
          <Link to={adData.link} onClick={handleAdClick} className="ad-inline-cta">
            Explore Package <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Sidebar Ads (Desktop position: sticky)
  const isLeft = type === 'sidebar-left' || type === 'left';
  return (
    <div className={`ad-wrapper ad-sidebar ${isLeft ? 'ad-sidebar-left' : 'ad-sidebar-right'}`} style={{ position: 'relative' }}>
      <button
        onClick={() => setDismissed(true)}
        style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, background: 'rgba(15, 23, 42, 0.7)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Dismiss Ad"
      >
        <X size={14} />
      </button>

      <div className="ad-card-media">
        <span className="ad-badge">{adData.badge}</span>
        <img src={adData.image} alt={adData.title} loading="lazy" />
      </div>
      <div className="ad-content">
        <span className="ad-tagline">{adData.tagline}</span>
        <h4 className="ad-title">{adData.title}</h4>
        <p className="ad-desc">{adData.desc}</p>
        <div className="ad-price-row">
          <span className="ad-price-label">Starts at</span>
          <span className="ad-price-amount">{adData.price}</span>
        </div>
        <Link to={adData.link} onClick={handleAdClick} className="ad-cta-btn">
          View Deal <ArrowRight size={14} style={{ marginLeft: '4px' }} />
        </Link>
      </div>
    </div>
  );
}
