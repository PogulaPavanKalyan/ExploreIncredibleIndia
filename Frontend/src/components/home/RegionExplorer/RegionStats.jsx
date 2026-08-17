import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RegionStates from './RegionStates';

export default function RegionStats({ region, mousePos }) {
  if (!region) return null;

  // Parallax calculations
  const layerStyle = { 
    transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` 
  };

  return (
    <motion.div 
      className="region-info-layer"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      style={layerStyle}
    >
      <motion.h3 
        className="region-info-name"
        key={`name-${region.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {region.name}
      </motion.h3>
      
      <motion.p 
        className="region-info-tagline"
        key={`tagline-${region.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {region.tagline ? `"${region.tagline}"` : ''}
      </motion.p>
      
      <motion.p 
        className="region-info-desc"
        key={`desc-${region.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {region.description}
      </motion.p>

      <motion.div 
        className="region-stats-row"
        key={`stats-${region.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="region-stat-item">
          <span className="region-stat-number">{region.destination_count}</span>
          <span className="region-stat-label">Destinations</span>
        </div>
        <div className="region-stat-item">
          <span className="region-stat-number">{region.state_count}</span>
          <span className="region-stat-label">States</span>
        </div>
      </motion.div>

      <RegionStates region={region} mousePos={mousePos} />

      <motion.div
        key={`btn-${region.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link to={`/regions/${region.slug}`} className="region-explore-btn">
          Explore {region.name} →
        </Link>
      </motion.div>
    </motion.div>
  );
}
