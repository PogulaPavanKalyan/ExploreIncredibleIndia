import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Ticket, ArrowRight } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import MotionCard from './animations/MotionCard';
import { getDestinationPrimaryImage, handleImageError } from '../utils/imageUtils';
import '../styles/cards.css';

export default function DestinationCard({ destination }) {
  if (!destination) return null;

  const imageUrl = getDestinationPrimaryImage(destination);

  return (
    <MotionCard>
      <div className="destination-card glass-card">
        <div className="card-image-wrap">
          <img
            src={imageUrl}
            alt={destination.name}
            loading="lazy"
            onError={(e) => handleImageError(e, destination.name)}
          />
          <div className="card-overlay">
            {destination.category_name && (
              <span className="card-category-badge">{destination.category_name}</span>
            )}
            <FavoriteButton destinationId={destination.id} initialFavorited={destination.is_favorited} />
          </div>
          {destination.is_hidden_gem && (
            <span className="card-gem-badge">Hidden Gem</span>
          )}
        </div>

        <div className="card-body">
          <div className="card-location">
            <MapPin size={14} className="location-icon" />
            <span>{destination.city_name ? `${destination.city_name}, ${destination.state_name}` : destination.state_name}</span>
          </div>

          <h3 className="card-title">
            <Link to={`/places/${destination.slug}`}>{destination.name}</Link>
          </h3>

          <p className="card-desc">{destination.short_description}</p>

          <div className="card-meta">
            <div className="meta-item">
              <Star size={14} className="star-icon" fill="#FFB703" color="#FFB703" />
              <span className="rating-value">{destination.avg_rating || 4.5}</span>
              <span className="reviews-count">({destination.total_reviews || 0})</span>
            </div>

            <div className="meta-item">
              <Ticket size={14} />
              <span>{parseFloat(destination.ticket_price) > 0 ? `₹${destination.ticket_price}` : 'Free Entry'}</span>
            </div>
          </div>

          <div className="card-footer">
            <Link to={`/places/${destination.slug}`} className="btn-explore-card">
              Explore Destination <ArrowRight size={16} style={{ marginLeft: '4px' }} />
            </Link>
          </div>
        </div>
      </div>
    </MotionCard>
  );
}


