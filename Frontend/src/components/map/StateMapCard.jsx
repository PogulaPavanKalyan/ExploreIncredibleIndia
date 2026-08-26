import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ArrowRight, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { buildMediaUrl, getDestinationPlaceholder, handleImageError } from '../../utils/imageUtils';

export default function StateMapCard({ state, onClose }) {
  if (!state) return null;

  const imageUrl = state.image || state.banner_image || state.thumbnail_image
    ? buildMediaUrl(state.image || state.banner_image || state.thumbnail_image)
    : getDestinationPlaceholder(state.name);

  return (
    <AnimatePresence>
      <motion.div
        className="state-hover-card"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <img src={imageUrl} alt={state.name} onError={(e) => handleImageError(e, state.name)} />

        <div className="state-card-title">{state.name}</div>
        {state.capital && (
          <div className="state-card-capital">
            <Building size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Capital: {state.capital}
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4, margin: '0.4rem 0' }}>
          {state.short_description || `Discover incredible travel destinations across ${state.name}.`}
        </p>

        <div className="state-card-stats">
          <span className="stat-chip">
            <Compass size={12} style={{ display: 'inline', marginRight: '3px' }} />
            {state.destinations_count || 5}+ Places
          </span>
          {state.cities_count > 0 && (
            <span className="stat-chip" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
              {state.cities_count} Cities
            </span>
          )}
        </div>

        <div style={{ marginTop: '0.75rem', pointerEvents: 'auto' }}>
          <Link
            to={`/states/${state.slug}`}
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              width: '100%',
              padding: '0.45rem',
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
          >
            Explore {state.name} <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
