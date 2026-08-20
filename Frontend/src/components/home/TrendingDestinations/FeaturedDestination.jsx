import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DestinationImage from '../../common/DestinationImage';
import { getDestinationPrimaryImage } from '../../../utils/imageUtils';

export default function FeaturedDestination({ destinations }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate featured destinations every 7 seconds when not hovered
  useEffect(() => {
    if (!destinations || destinations.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [destinations, isHovered]);

  if (!destinations || destinations.length === 0) return null;

  const current = destinations[currentIndex];
  const imageUrl = getDestinationPrimaryImage(current);
  const categoryNames = current.categories && current.categories.length > 0
    ? current.categories.slice(0, 2).map(c => c.name.toUpperCase()).join(' • ')
    : (current.category_name ? current.category_name.toUpperCase() : 'FEATURED EXPERIENCE');
  
  const altText = `${current.name}, ${current.state?.name || current.state_name || 'India'} - ${categoryNames}`;

  return (
    <div 
      className="featured-destination-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="featured-destination-showcase"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id || current.slug}
          className="featured-card-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Destination Background Image */}
          <div className="featured-media-wrap">
            <DestinationImage 
              destination={current}
              className="featured-media-img"
              src={imageUrl}
              alt={altText}
              loading="eager"
            />
            {/* Subtle natural dark gradient for crisp readability */}
            <div className="featured-natural-gradient" />
          </div>

          {/* Featured Content Overlay */}
          <div className="featured-content-layer">
            <div className="featured-top-badge-row">
              <span className="featured-badge">★ FEATURED DESTINATION</span>
              {destinations.length > 1 && (
                <div className="featured-dots" aria-label="Featured destination selector">
                  {destinations.map((d, idx) => (
                    <button
                      key={d.id || idx}
                      className={`featured-dot ${idx === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Show featured destination ${idx + 1}: ${d.name}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="featured-main-info">
              <span className="featured-state-label">
                {current.state?.name || current.state_name || 'Incredible India'}
              </span>

              <h3 className="featured-destination-title">
                {current.name}
              </h3>
              
              <p className="featured-description">
                {current.short_description || current.description?.substring(0, 160) + '...'}
              </p>
              
              <div className="featured-meta-row">
                <div className="featured-meta-pill rating-pill">
                  <span className="star-icon">★</span>
                  <span>{parseFloat(current.avg_rating || 4.8).toFixed(1)}</span>
                  {current.total_reviews && (
                    <span className="review-count">({current.total_reviews})</span>
                  )}
                </div>

                <div className="featured-meta-pill category-pill">
                  <span className="cat-icon">✦</span>
                  <span>{categoryNames}</span>
                </div>

                {current.best_time_to_visit && (
                  <div className="featured-meta-pill season-pill">
                    <span className="season-icon">🗓</span>
                    <span>{current.best_time_to_visit}</span>
                  </div>
                )}
              </div>
              
              <div className="featured-action-row">
                <Link 
                  to={`/places/${current.slug}`} 
                  className="featured-explore-btn"
                  id={`explore-featured-${current.slug}`}
                >
                  <span>Explore {current.name}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
