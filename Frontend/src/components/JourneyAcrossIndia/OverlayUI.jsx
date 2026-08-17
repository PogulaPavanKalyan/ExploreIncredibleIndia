import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const getMediaUrl = (path) => {
  if (!path) return null;
  // Django API now returns clean absolute Unsplash URLs.
  // For real local files it still returns /media/... — prefix with backend host.
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
          /* ── Skeleton ── */
          <div className="info-loading-state">
            <div className="skeleton skeleton-image"></div>
            <div style={{ padding: '0 24px 24px' }}>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text" style={{ marginTop: 8 }}></div>
              <div className="skeleton skeleton-text" style={{ marginTop: 8 }}></div>
            </div>
          </div>

        ) : error ? (
          /* ── Error ── */
          <div className="info-error-state">
            <h3>Unable to load destinations.</h3>
            <button className="explore-btn" onClick={onRetry} style={{ maxWidth: 180 }}>
              Retry
            </button>
          </div>

        ) : !activeDestination ? (
          /* ── Empty ── */
          <div className="info-empty-state">
            <h3>No destinations available for this region.</h3>
          </div>

        ) : (
          /* ── Destination Card ── */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDestination.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="info-card-inner"
            >
              {/* Image */}
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

              {/* Content */}
              <div className="info-content-container">
                <h3 className="info-title">
                  <MapPin size={20} color="#cda87c" aria-hidden="true" />
                  {activeDestination.destination}
                </h3>
                <span className="info-state">
                  {activeDestination.state} &bull; {activeDestination.region}
                </span>
                <p className="info-desc">{activeDestination.short_description}</p>
                <Link
                  to={`/places/${activeDestination.slug}`}
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
