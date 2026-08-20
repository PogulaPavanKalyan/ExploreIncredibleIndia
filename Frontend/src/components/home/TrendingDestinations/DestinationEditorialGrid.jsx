import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DestinationCard from './DestinationCard';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function DestinationEditorialGrid({ destinations, onResetFilters }) {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="destination-empty-state" role="status">
        <div className="empty-state-icon-box">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m16 12-4-4-4 4"></path>
            <path d="M12 16V8"></path>
          </svg>
        </div>
        <h3 className="empty-state-title">No Destinations Found</h3>
        <p className="empty-state-subtitle">
          We couldn't find any destinations matching your selected region and experience criteria.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
          <button 
            className="empty-state-reset-btn"
            onClick={onResetFilters}
            aria-label="Clear filters and show all destinations"
          >
            Reset All Filters
          </button>
          <Link 
            to="/explore"
            className="empty-state-reset-btn"
            style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', textDecoration: 'none' }}
          >
            Explore all destinations →
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic grid span pattern: 1st is large, 2nd is tall, 3rd is standard, etc.
  const getSpanClass = (index) => {
    const pattern = index % 6;
    switch (pattern) {
      case 0: return 'grid-span-large';
      case 1: return 'grid-span-medium-tall';
      case 2: return 'grid-span-small';
      case 3: return 'grid-span-medium-wide';
      case 4: return 'grid-span-small';
      case 5: return 'grid-span-small';
      default: return 'grid-span-small';
    }
  };

  return (
    <motion.div 
      className="editorial-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {destinations.map((dest, index) => (
        <motion.div 
          key={dest.id || dest.slug} 
          variants={itemVariants} 
          className={getSpanClass(index)}
        >
          <DestinationCard 
            destination={dest} 
            sizeClass="" 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
