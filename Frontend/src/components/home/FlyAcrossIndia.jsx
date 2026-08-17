import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JOURNEY_STOPS = [
  { name: 'HYDERABAD', region: 'SOUTH', state: 'Telangana', video: '' },
  { name: 'ARAKU VALLEY', region: 'SOUTH', state: 'Andhra Pradesh', video: 'http://127.0.0.1:8000/media/hero_videos/araku-valley.mp4' },
  { name: 'GOA', region: 'WEST', state: 'Goa', video: 'http://127.0.0.1:8000/media/hero_videos/goa.mp4' },
  { name: 'JAIPUR', region: 'NORTH', state: 'Rajasthan', video: 'http://127.0.0.1:8000/media/hero_videos/jaipur.mp4' },
  { name: 'KASHMIR', region: 'NORTH', state: 'Jammu & Kashmir', video: '' },
  { name: 'SHILLONG', region: 'NORTHEAST', state: 'Meghalaya', video: 'http://127.0.0.1:8000/media/hero_videos/shillong.mp4' }
];

export default function FlyAcrossIndia({ isActive, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= JOURNEY_STOPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => onClose(), 2000); // close after last stop
          return prev;
        }
        return prev + 1;
      });
    }, 2500); // 2.5 seconds per stop

    return () => clearInterval(interval);
  }, [isActive, onClose]);

  if (!isActive) return null;

  const stop = JOURNEY_STOPS[currentIndex];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', overflow: 'hidden' }}>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={stop.name}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {stop.video ? (
            <video 
              src={stop.video} 
              autoPlay 
              muted 
              loop 
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#0f172a' }} />
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stop.name + "-text"}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ color: '#FF6B35', letterSpacing: '0.2em', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {stop.region} INDIA
            </div>
            <h1 style={{ color: '#fff', fontSize: '6rem', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, margin: 0, textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
              {stop.name}
            </h1>
            <div style={{ color: '#94a3b8', fontSize: '1.5rem', marginTop: '1rem' }}>
              {stop.state}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
        <button 
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.8rem 1.5rem', borderRadius: '30px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
        >
          Exit Journey
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1rem' }}>
        {JOURNEY_STOPS.map((s, i) => (
          <div key={s.name} style={{ width: '40px', height: '4px', background: i <= currentIndex ? '#FF6B35' : 'rgba(255,255,255,0.2)', borderRadius: '2px', transition: 'background 0.5s' }} />
        ))}
      </div>

    </div>
  );
}
