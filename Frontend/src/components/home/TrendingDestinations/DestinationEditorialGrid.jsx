import React from 'react';
import { motion } from 'framer-motion';
import DestinationCard from './DestinationCard';

// Framer Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 50 }
  }
};

export default function DestinationEditorialGrid({ destinations }) {
  if (!destinations || destinations.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '4rem 0', textAlign: 'center', color: '#94a3b8' }}>
        No destinations found for these filters. Try another region or category.
      </div>
    );
  }

  // Determine grid span classes based on an asymmetric pattern
  // Pattern: 0: Large, 1: Medium-Tall, 2: Small, 3: Medium-Wide, etc.
  const getSpanClass = (index) => {
    const pattern = index % 5;
    switch (pattern) {
      case 0: return 'grid-span-large';
      case 1: return 'grid-span-medium-tall';
      case 2: return 'grid-span-small';
      case 3: return 'grid-span-medium-wide';
      case 4: return 'grid-span-small';
      default: return 'grid-span-small';
    }
  };

  return (
    <motion.div 
      className="editorial-grid"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
    >
      {destinations.map((dest, index) => (
        <motion.div key={dest.id} variants={itemVariants} className={getSpanClass(index)}>
          <DestinationCard 
            destination={dest} 
            sizeClass="" 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
