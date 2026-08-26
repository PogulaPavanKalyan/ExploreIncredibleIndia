import React from 'react';
import { motion } from 'framer-motion';

export default function RegionNavigation({ regions, activeRegion, onSelect }) {
  if (!Array.isArray(regions) || regions.length === 0) return null;


  return (
    <div className="region-nav-container">
      {regions.map((region) => {
        const isActive = activeRegion && activeRegion.id === region.id;
        
        return (
          <button
            key={region.id}
            onClick={() => onSelect(region)}
            className={`region-nav-btn ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
          >
            {region.name.replace(' India', '')}
            
            {isActive && (
              <motion.div
                layoutId="region-nav-underline"
                className="region-nav-indicator"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
