import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const REGION_DATA = [
  {
    id: 'south-india',
    name: 'South India',
    subtitle: 'From ancient temples to mist-covered mountains.',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920',
    featured: ['Araku', 'Hampi', 'Munnar', 'Ooty']
  },
  {
    id: 'north-india',
    name: 'North India',
    subtitle: 'Majestic Himalayas and timeless heritage.',
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1920',
    featured: ['Kashmir', 'Taj Mahal', 'Varanasi', 'Rajasthan']
  }
];

export default function RegionExploration() {
  const navigate = useNavigate();

  return (
    <section>
      {REGION_DATA.map((region, idx) => (
        <div key={region.id} className="region-section">
          
          <div className="region-bg">
            <img src={region.img} alt={region.name} loading="lazy" />
          </div>
          <div className="region-overlay" style={{ background: idx % 2 !== 0 ? 'linear-gradient(270deg, #020617 0%, rgba(2,6,23,0.8) 40%, transparent 100%)' : undefined }} />
          
          <div className="container" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: idx % 2 !== 0 ? 'flex-end' : 'flex-start' }}>
            <motion.div 
              className="region-content"
              initial={{ opacity: 0, x: idx % 2 !== 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2>{region.name}</h2>
              <p style={{ fontSize: '1.5rem', color: '#cbd5e1', marginBottom: '2rem' }}>
                {region.subtitle}
              </p>
              
              <div style={{ marginBottom: '3rem' }}>
                <h4 style={{ color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '1rem' }}>Featured Places</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {region.featured.map(place => (
                    <span key={place} style={{ padding: '0.5rem 1.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.9rem' }}>
                      {place}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => navigate(`/explore?region=${region.id}`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#020617', padding: '1rem 2.5rem', borderRadius: '30px', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Explore {region.name} <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}
