import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight, MapPin } from 'lucide-react';

export default function StoryCard({ story }) {
  const image = story.featured_image || story.image || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600';
  const title = story.title || 'Riding the Vistadome Express through Araku Coffee Valleys';
  const slug = story.slug || 'vistadome-express-araku-valley';
  const author = story.author || 'Priya Sharma';
  const readTime = story.read_time || '5 min read';
  const stateName = story.state_name || story.state?.name || 'Andhra Pradesh';
  const snippet = story.content ? story.content.slice(0, 110) + '...' : 'A captivating journey through misty Western and Eastern Ghats tunnels, tribal coffee plantations, and cascading waterfalls.';

  return (
    <Link
      to={`/stories/${slug}`}
      style={{
        textDecoration: 'none',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      className="search-item-hover"
    >
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={image}
          alt={title}
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
          <Clock size={12} color="#FF6B35" /> {readTime}
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284C7', background: '#F0F9FF', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
            <MapPin size={11} style={{ display: 'inline', marginRight: '3px' }} /> {stateName}
          </span>
        </div>

        <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0', lineHeight: 1.35 }}>
          {title}
        </h4>

        <p style={{ fontSize: '0.83rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1rem 0', flex: 1 }}>
          {snippet}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#64748B' }}>
            <User size={14} color="#FF6B35" />
            <span>By <strong>{author}</strong></span>
          </div>

          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FF6B35', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
            Read Story <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
