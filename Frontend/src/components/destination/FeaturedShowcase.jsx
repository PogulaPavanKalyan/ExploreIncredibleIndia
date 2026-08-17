import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, Compass, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { getDestinationPrimaryImage, handleImageError } from '../../utils/imageUtils';

export default function FeaturedShowcase({ destination }) {
  if (!destination) return null;

  const imageUrl = getDestinationPrimaryImage(destination);

  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
      <div className="container">
        <div className="section-header">
          <div>
            <span className="badge badge-gold">
              <Sparkles size={14} /> Spotlight Destination
            </span>
            <h2 className="section-title">Explore {destination.name}</h2>
          </div>
        </div>

        <div className="story-block glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          <motion.div
            className="story-image-wrap"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img src={imageUrl} alt={destination.name} loading="lazy" onError={(e) => handleImageError(e, destination.name)} />
          </motion.div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FF6B35', fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.5rem' }}>
              <MapPin size={16} /> <span>{destination.city_name ? `${destination.city_name}, ${destination.state_name}` : destination.state_name}</span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
              {destination.name}
            </h2>

            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {destination.short_description}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {destination.category_name && (
                <span className="badge badge-primary">{destination.category_name}</span>
              )}
              {destination.best_time_to_visit && (
                <span className="badge badge-gold">Best: {destination.best_time_to_visit}</span>
              )}
              <span className="badge badge-primary" style={{ background: '#F1F5F9', color: '#334155' }}>
                <Star size={12} fill="#FFB703" color="#FFB703" style={{ marginRight: '4px' }} />
                {destination.avg_rating || 4.7} Rating
              </span>
            </div>

            <Link to={`/places/${destination.slug}`} className="btn-cta-planner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Discover {destination.name} Experience <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
