import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Star, ArrowRight } from 'lucide-react';
import { getDestinations } from '../../services/destinationService';
import DestinationImage from '../common/DestinationImage';

export default function RelatedDestinationsSection({ destination }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) return;
    let isMounted = true;
    setLoading(true);

    const stateSlug = destination.state?.slug || destination.state_slug;
    const categorySlug = destination.categories?.[0]?.slug || destination.category?.slug || destination.category_slug;
    const regionSlug = destination.region?.slug || destination.region_slug;

    // Fetch related by state or category or region
    const params = { page_size: 8 };
    if (stateSlug) params.state = stateSlug;
    else if (categorySlug) params.category = categorySlug;
    else if (regionSlug) params.region = regionSlug;

    getDestinations(params)
      .then(res => {
        if (isMounted && res && res.data) {
          const filtered = res.data.filter(d => (d.id !== destination.id && d.slug !== destination.slug));
          setRelated(filtered.slice(0, 4));
        }
      })
      .catch(err => {
        console.warn("Could not load related destinations:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [destination?.id, destination?.slug]);

  if (loading || related.length === 0) return null;

  return (
    <section className="details-card related-destinations-section" style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Curated Recommendations
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={20} color="#8B5CF6" /> You May Also Like
          </h2>
        </div>

        <Link to="/explore" style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
          Explore all destinations <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        {related.map(item => {
          const stateTitle = item.state?.name || item.state_name || 'India';
          const catTitle = item.categories?.[0]?.name || item.category_name || 'Experience';
          const rating = item.avg_rating ? parseFloat(item.avg_rating).toFixed(1) : '4.8';

          return (
            <Link
              key={item.id || item.slug}
              to={`/destinations/${item.slug}`}
              style={{
                textDecoration: 'none',
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="search-item-hover"
            >
              {/* Media Image */}
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                <DestinationImage
                  destination={item}
                  src={item.main_image}
                  alt={item.name}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  <Star size={12} fill="#F59E0B" color="#F59E0B" /> {rating}
                </div>
              </div>

              {/* Content Body */}
              <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {catTitle}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  {item.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', margin: '0 0 0.75rem 0' }}>
                  <MapPin size={13} color="#FF6B1A" /> {item.district ? `${item.district}, ` : ''}{stateTitle}
                </p>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {item.short_description || item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
