import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function FeaturedDestination({ destinations }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Rotate featured destinations every 8 seconds
  useEffect(() => {
    if (!destinations || destinations.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [destinations]);

  // Track mouse for 3D parallax
  const handleMouseMove = (e) => {
    if (!containerRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  if (!destinations || destinations.length === 0) return null;

  const current = destinations[currentIndex];
  
  // Has video logic (simple check for mp4, or using a specific field if present)
  // Our seed script usually sets main_image, but let's assume if there's a video we'd render it.
  // Since we only have images seeded, we will just use the main_image.
  const hasVideo = current.video_url && current.video_url.endsWith('.mp4');

  // Parallax calculations
  const layer1Style = { transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` };
  const layer2Style = { transform: `translateZ(50px) translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` };
  const layer3Style = { transform: `translateZ(100px) translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)` };

  const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://127.0.0.1:8000${url}`;
    if (url.startsWith('media/')) return `http://127.0.0.1:8000/${url}`;
    return url;
  };

  const mediaUrl = resolveUrl(current.main_image) || '/images/placeholders/destination.jpg';
  const posterUrl = resolveUrl(current.poster_image || current.main_image) || '/images/placeholders/destination.jpg';

  return (
    <div 
      className="featured-destination-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px' }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
          {/* Layer 1: Background Media */}
          <div className="featured-interactive-layer layer-1" style={layer1Style}>
            {hasVideo ? (
              <video 
                className="featured-media"
                src={current.video_url}
                autoPlay
                loop
                muted
                playsInline
                poster={posterUrl}
              />
            ) : (
              <img 
                className="featured-media"
                src={mediaUrl}
                alt={current.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/placeholders/destination.jpg';
                }}
              />
            )}
            <div className="featured-overlay" />
          </div>

          {/* Layer 2: Text Content */}
          <div className="featured-interactive-layer layer-2" style={layer2Style}>
            <div className="featured-content">
              <span className="featured-label">Featured Destination</span>
              
              <motion.h2 
                className="featured-name"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {current.name}
              </motion.h2>
              
              <motion.h3 
                className="featured-state"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {current.state?.name || 'India'}
              </motion.h3>
              
              <motion.p 
                className="featured-desc"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {current.short_description || current.description?.substring(0, 150) + '...'}
              </motion.p>
              
              <motion.div 
                className="featured-meta"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {current.avg_rating && (
                  <div className="meta-item">
                    <span className="meta-icon">★</span> {current.avg_rating}
                  </div>
                )}
                {current.categories && current.categories.length > 0 && (
                  <div className="meta-item">
                    {current.categories.slice(0, 2).map(c => c.name.toUpperCase()).join(' • ')}
                  </div>
                )}
              </motion.div>
              
              {/* Layer 3: Buttons */}
              <motion.div 
                style={layer3Style}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link to={`/places/${current.slug}`} className="featured-btn">
                  Explore {current.name}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
