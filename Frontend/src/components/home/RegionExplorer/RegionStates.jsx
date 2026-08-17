import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function RegionStates({ region, mousePos }) {
  if (!region || !region.states || region.states.length === 0) return null;

  const layerStyle = { 
    transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` 
  };

  return (
    <motion.div 
      className="region-states-container"
      key={`states-${region.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={layerStyle}
    >
      <h4 className="region-states-title">Explore States</h4>
      <div className="region-states-list">
        {region.states.map(state => (
          <Link key={state.slug} to={`/states/${state.slug}`} className="region-state-chip">
            {state.name}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
