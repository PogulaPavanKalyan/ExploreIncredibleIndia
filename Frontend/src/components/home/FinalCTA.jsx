import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section style={{ padding: '10rem 0', background: '#020617', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Particles/Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', zIndex: 0 }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, rotate: -90 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring' }}
          style={{ display: 'inline-block', marginBottom: '2rem' }}
        >
          <Compass size={64} color="#FF6B35" strokeWidth={1} />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ fontSize: '4rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}
        >
          YOUR NEXT ADVENTURE
          <br />
          <span style={{ color: '#94a3b8' }}>IS SOMEWHERE IN INDIA.</span>
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: '3rem' }}
        >
          <button 
            onClick={() => navigate('/explore')}
            style={{ 
              background: '#fff', 
              color: '#020617', 
              padding: '1.2rem 3rem', 
              borderRadius: '30px', 
              fontWeight: 800, 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '1.2rem',
              transition: 'all 0.3s',
              boxShadow: '0 10px 25px rgba(255,255,255,0.2)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            EXPLORE INDIA
          </button>
        </motion.div>
      </div>
    </section>
  );
}
