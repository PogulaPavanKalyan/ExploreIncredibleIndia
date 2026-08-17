import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function HeroContent({ currentDestination, navigate }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <AnimatePresence>
        {currentDestination && (
          <motion.div
            key={currentDestination.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: '#fff', marginBottom: '0.25rem', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {currentDestination.title}
            </h2>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '0.4rem 1.2rem', borderRadius: '20px', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <MapPin size={16} color="#FF6B35" />
              <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {currentDestination.region} INDIA • {currentDestination.state_name || 'INDIA'}
              </span>
            </div>
            
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#E2E8F0', maxWidth: '650px', margin: '0 auto 1.5rem auto', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.6 }}>
              {currentDestination.subtitle}
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => navigate(`/places/${currentDestination.destination_slug || currentDestination.slug}`)}
                className="hero-explore-btn"
                style={{ background: '#FF6B35', color: '#fff', padding: '1rem 2.5rem', borderRadius: '30px', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(255,107,53,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(255,107,53,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(255,107,53,0.3)'; }}
                aria-label={`Explore ${currentDestination.title}`}
              >
                Explore {currentDestination.title}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
