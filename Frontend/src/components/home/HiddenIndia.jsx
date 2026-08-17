import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { buildMediaUrl, getDestinationPlaceholder } from '../../utils/imageUtils';

export default function HiddenIndia({ destinations = [] }) {
  const navigate = useNavigate();

  if (!destinations || destinations.length === 0) return null;

  return (
    <section className="trending-section" style={{ background: '#020617' }}>
      <div className="container">
        <div className="cinematic-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: '#FF6B35' }}
          >
            Beyond The Famous
          </motion.h2>
          <motion.p 
            style={{ color: '#94a3b8', fontSize: '1.2rem', letterSpacing: '1px' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Discover India's best kept secrets. Hidden waterfalls, tribal villages, and untold stories.
          </motion.p>
        </div>

        <div className="trending-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {destinations.slice(0, 3).map((dest, i) => {
            const imgUrl = dest.images && dest.images.length > 0 
              ? buildMediaUrl(dest.images[0].image) 
              : getDestinationPlaceholder(dest.name);

            return (
              <motion.div
                key={dest.id}
                className="cinematic-card"
                style={{ height: '400px', borderRadius: '16px' }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                onClick={() => navigate(`/places/${dest.slug}`)}
              >
                <img src={imgUrl} alt={dest.name} loading="lazy" />
                <div className="cinematic-card-content" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                    {dest.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <MapPin size={14} />
                    {dest.state?.name || 'India'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
