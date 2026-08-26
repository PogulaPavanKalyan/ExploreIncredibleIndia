import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function RegionDestinations({ region, mousePos }) {
  const destinations = Array.isArray(region?.featured_destinations)
    ? region.featured_destinations
    : Array.isArray(region?.featured_destinations?.results)
    ? region.featured_destinations.results
    : [];

  if (!region || destinations.length === 0) return null;


  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50 } }
  };

  const layerStyle = { 
    transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` 
  };

  return (
    <motion.div 
      className="region-destinations-layer"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      key={`dests-${region.id}`}
      style={layerStyle}
    >
      {destinations.map(dest => (
        <motion.div key={dest.id} variants={itemVariants}>
          <Link to={`/places/${dest.slug}`} className="region-dest-card">
            <img 
              src={dest.image || '/images/placeholders/destination.jpg'} 
              alt={dest.destination} 
              className="region-dest-img"
              loading="lazy"
            />
            <div className="region-dest-overlay">
              <span className="region-dest-name">{dest.destination}</span>
              <span className="region-dest-state">{dest.state} • {dest.category}</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
