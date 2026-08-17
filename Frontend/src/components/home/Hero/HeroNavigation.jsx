import React from 'react';
import { motion } from 'framer-motion';
import SearchAutocomplete from '../../search/SearchAutocomplete';

const REGIONS = ['SOUTH', 'NORTH', 'WEST', 'EAST', 'CENTRAL', 'NORTHEAST'];

export default function HeroNavigation({ currentDestination, fetchRandomDestination }) {
  return (
    <div style={{ width: '100%', paddingBottom: '0.5rem' }}>
      <motion.div
        className="hero-search-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ maxWidth: '680px', margin: '0 auto 1.5rem auto' }}
      >
        <SearchAutocomplete placeholder="Where will India take you?" />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {REGIONS.map(region => (
          <button
            key={region}
            onClick={() => fetchRandomDestination(region)}
            style={{
              background: currentDestination?.region === region ? 'rgba(255,107,53,0.9)' : 'rgba(15,23,42,0.6)',
              border: `1px solid ${currentDestination?.region === region ? '#FF6B35' : 'rgba(255,255,255,0.1)'}`,
              color: '#fff',
              padding: '0.5rem 1.25rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.3s'
            }}
          >
            {region}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('start-fly-across-india'))}
          style={{ 
            background: 'transparent', 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.4)', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '30px', 
            fontWeight: 600, 
            letterSpacing: '1px',
            fontSize: '0.9rem',
            cursor: 'pointer', 
            transition: 'all 0.3s',
            backdropFilter: 'blur(5px)',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = '#fff'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
        >
          FLY ACROSS INDIA
        </button>
      </div>
    </div>
  );
}
