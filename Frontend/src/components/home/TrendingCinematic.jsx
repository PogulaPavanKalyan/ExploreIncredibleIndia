import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { buildMediaUrl, getDestinationPlaceholder } from '../../utils/imageUtils';

export default function TrendingCinematic({ destinations = [] }) {
  const navigate = useNavigate();

  if (!destinations || destinations.length === 0) return null;

  return (
    <section className="trending-section">
      <div className="container">
        <div className="cinematic-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trending Destinations
          </motion.h2>
          <motion.p 
            style={{ color: '#94a3b8', fontSize: '1.2rem', letterSpacing: '1px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            The most sought-after experiences in India right now.
          </motion.p>
        </div>

        <div className="trending-grid">
          {destinations.slice(0, 3).map((dest, i) => {
            const imgUrl = dest.images && dest.images.length > 0 
              ? buildMediaUrl(dest.images[0].image) 
              : getDestinationPlaceholder(dest.name);

            return (
              <motion.div
                key={dest.id}
                className="cinematic-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                onClick={() => navigate(`/places/${dest.slug}`)}
              >
                <img src={imgUrl} alt={dest.name} loading="lazy" />
                <div className="cinematic-card-content">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FF6B35', fontSize: '0.8rem', fontWeight: 600 }}>
                      <MapPin size={14} />
                      {dest.state?.name || 'India'}
                    </div>
                    {dest.avg_rating && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#FBBF24', fontSize: '0.9rem', fontWeight: 600 }}>
                        <Star size={14} fill="#FBBF24" />
                        {dest.avg_rating}
                      </div>
                    )}
                  </div>
                  
                  <h3 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', lineHeight: 1.1 }}>
                    {dest.name}
                  </h3>
                  
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {dest.short_description || dest.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
