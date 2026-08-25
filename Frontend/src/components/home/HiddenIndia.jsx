import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getDestinations } from '../../services/destinationService';
import DestinationImage from '../common/DestinationImage';

export default function HiddenIndia({ destinations: initialDestinations = [] }) {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState(initialDestinations);

  useEffect(() => {
    if (initialDestinations && initialDestinations.length > 0) {
      setDestinations(initialDestinations);
      return;
    }

    getDestinations({ is_hidden_gem: 'true', page_size: 3 })
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setDestinations(res.data);
        } else {
          // Fallback to top featured offbeat
          getDestinations({ page_size: 3 })
            .then(fallbackRes => {
              if (fallbackRes?.data) setDestinations(fallbackRes.data);
            });
        }
      })
      .catch(() => {});
  }, [initialDestinations]);

  if (!destinations || destinations.length === 0) return null;

  return (
    <section className="trending-section" style={{ background: '#F4F1EA', padding: '6rem 0 7rem', borderTop: '1px solid rgba(7,20,38,0.06)' }}>
      <div className="container" style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="cinematic-header" style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ 
              display: 'inline-block', 
              color: '#FF6B1A', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              marginBottom: '0.5rem',
              padding: '0.35rem 0.95rem',
              background: 'rgba(255, 107, 26, 0.08)',
              border: '1px solid rgba(255, 107, 26, 0.25)',
              borderRadius: '20px'
            }}
          >
            ✦ Hidden India
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ color: '#071426', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, marginTop: '0.5rem', marginBottom: '0.75rem' }}
          >
            Beyond The Famous
          </motion.h2>
          <motion.p 
            style={{ color: '#475569', fontSize: '1.1rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Discover India's best kept secrets — secluded waterfalls, pristine tribal valleys, and untold living heritage.
          </motion.p>
        </div>

        <div className="trending-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {destinations.slice(0, 3).map((dest, i) => {
            return (
              <motion.div
                key={dest.id || dest.slug}
                className="cinematic-card"
                style={{ 
                  height: '420px', 
                  borderRadius: '24px',
                  background: '#071426',
                  boxShadow: '0 12px 30px rgba(7, 20, 38, 0.1)',
                  border: '1px solid rgba(7, 20, 38, 0.08)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                onClick={() => navigate(`/places/${dest.slug}`)}
              >
                <DestinationImage 
                  destination={dest} 
                  src={dest.main_image} 
                  alt={dest.name} 
                  loading="lazy" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div className="cinematic-card-content" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(to top, rgba(7,20,38,0.96) 0%, rgba(7,20,38,0.5) 45%, transparent 100%)', padding: '2rem' }}>
                  <h3 style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.4rem 0' }}>
                    {dest.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fdba74', fontSize: '0.85rem', fontWeight: 700 }}>
                    <MapPin size={15} />
                    {dest.district ? `${dest.district}, ` : ''}{dest.state?.name || dest.state_name || 'India'}
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
