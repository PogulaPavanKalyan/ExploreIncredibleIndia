import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, Wallet, Compass } from 'lucide-react';

export default function JourneyBuilder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    startLocation: '',
    days: '4',
    budget: 'mid',
    interest: 'culture'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/travel-planner?start=${formData.startLocation}&days=${formData.days}&budget=${formData.budget}&interest=${formData.interest}`);
  };

  return (
    <section style={{ padding: '8rem 0', background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '30px', 
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,107,53,0.1)', color: '#FF6B35', padding: '0.5rem 1.5rem', borderRadius: '30px', marginBottom: '2rem', fontWeight: 600 }}>
            <Sparkles size={16} /> AI-Powered
          </div>
          
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', marginBottom: '1rem', letterSpacing: '-1px' }}>
            BUILD YOUR INDIA JOURNEY
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Tell us how you want to travel, and our intelligent engine will craft the perfect authentic itinerary in seconds.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <MapPin size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Starting City (e.g. Delhi)" 
                required
                value={formData.startLocation}
                onChange={e => setFormData({...formData, startLocation: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem' }}
              />
            </div>
            
            <div style={{ flex: '1 1 150px', position: 'relative' }}>
              <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <select 
                value={formData.days}
                onChange={e => setFormData({...formData, days: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', appearance: 'none' }}
              >
                <option value="3" style={{color: '#000'}}>3 Days</option>
                <option value="4" style={{color: '#000'}}>4 Days</option>
                <option value="7" style={{color: '#000'}}>1 Week</option>
                <option value="14" style={{color: '#000'}}>2 Weeks</option>
              </select>
            </div>

            <div style={{ flex: '1 1 150px', position: 'relative' }}>
              <Wallet size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <select 
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', appearance: 'none' }}
              >
                <option value="budget" style={{color: '#000'}}>Budget</option>
                <option value="mid" style={{color: '#000'}}>Mid-Range</option>
                <option value="luxury" style={{color: '#000'}}>Luxury</option>
              </select>
            </div>

            <div style={{ flex: '1 1 200px', position: 'relative' }}>
              <Compass size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <select 
                value={formData.interest}
                onChange={e => setFormData({...formData, interest: e.target.value})}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '1rem', appearance: 'none' }}
              >
                <option value="mountains" style={{color: '#000'}}>Mountains</option>
                <option value="beaches" style={{color: '#000'}}>Beaches</option>
                <option value="temples" style={{color: '#000'}}>Temples</option>
                <option value="heritage" style={{color: '#000'}}>Heritage</option>
                <option value="nature" style={{color: '#000'}}>Nature</option>
                <option value="culture" style={{color: '#000'}}>Culture</option>
              </select>
            </div>

            <button 
              type="submit"
              style={{ flex: '1 1 200px', background: '#FF6B35', color: '#fff', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.3s' }}
              onMouseOver={(e) => e.target.style.background = '#e85a28'}
              onMouseOut={(e) => e.target.style.background = '#FF6B35'}
            >
              CREATE MY JOURNEY
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
