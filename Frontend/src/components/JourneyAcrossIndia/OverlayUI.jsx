import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Compass } from 'lucide-react';

const getMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600';

export function OverlayUI({ 
  activeDestination,
  loading,
  error,
  onRetry,
}) {
  return (
    <div className="journey-info-panel">
      <div className="info-card">
        {loading ? (
          /* ── Loading Skeleton State ── */
          <div className="info-loading-state">
            <div className="skeleton skeleton-image"></div>
            <div style={{ padding: '0 24px 24px' }}>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text" style={{ marginTop: 8 }}></div>
              <div className="skeleton skeleton-text" style={{ marginTop: 8 }}></div>
            </div>
          </div>

        ) : error ? (
          /* ── Error State with Retry ── */
          <div className="info-error-state">
            <h3>Unable to load destinations.</h3>
            <button className="explore-btn" onClick={onRetry} style={{ maxWidth: 180 }}>
              Retry
            </button>
          </div>

        ) : !activeDestination ? (
          /* ── Empty State ── */
          <div className="info-empty-state">
            <h3>No destinations available for this region.</h3>
          </div>

        ) : (
          /* ── Destination Detail Card ── */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDestination.id || activeDestination.destination}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="info-card-inner"
            >
              {/* Destination Image Banner */}
              <div className="info-image-container">
                <img
                  src={getMediaUrl(activeDestination.image) || FALLBACK_IMAGE}
                  alt={`${activeDestination.destination}, ${activeDestination.state}`}
                  className="info-image"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                />
                <div className="info-image-overlay" />
              </div>

              {/* Card Body */}
              <div className="info-content-container">
                <h3 className="info-title">
                  <MapPin size={22} color="#00f2fe" aria-hidden="true" />
                  {activeDestination.destination}
                </h3>

                <div className="info-state">
                  <span>{activeDestination.state || 'India'}</span>
                  &bull;
                  <span className="info-state-badge">
                    <Compass size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {activeDestination.region || 'India'}
                  </span>
                  {activeDestination.category && (
                    <span className="info-state-badge" style={{ borderColor: 'rgba(0,242,254,0.4)', color: '#00f2fe' }}>
                      {activeDestination.category}
                    </span>
                  )}
                </div>

                <p className="info-desc">{activeDestination.short_description}</p>

                <Link
                  to={activeDestination.slug ? `/places/${activeDestination.slug}` : '/explore'}
                  className="explore-btn"
                  aria-label={`Explore ${activeDestination.destination}`}
                >
                  Explore Destination &rarr;
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
