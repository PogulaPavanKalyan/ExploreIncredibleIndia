import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DestinationImage from '../../common/DestinationImage';
import { getDestinationPrimaryImage } from '../../../utils/imageUtils';

export default function DestinationCard({ destination, sizeClass = '' }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!destination?.id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      if (saved.some(d => d.id === destination.id || d.slug === destination.slug)) {
        setIsSaved(true);
      }
    } catch (e) {
      console.error('Error reading saved destinations:', e);
    }
  }, [destination?.id, destination?.slug]);

  if (!destination) return null;

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      let saved = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      if (isSaved) {
        saved = saved.filter(d => d.id !== destination.id && d.slug !== destination.slug);
        setIsSaved(false);
      } else {
        saved.push({
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          state: destination.state?.name || destination.state_name || '',
          image: destination.main_image
        });
        setIsSaved(true);
      }
      localStorage.setItem('savedDestinations', JSON.stringify(saved));
    } catch (e) {
      console.error('Error saving destination:', e);
    }
  };

  const imageUrl = getDestinationPrimaryImage(destination);
  const stateName = destination.state?.name || destination.state_name || 'India';
  
  const categoryString = destination.categories && destination.categories.length > 0
    ? destination.categories.slice(0, 2).map(c => c.name.toUpperCase()).join(' • ')
    : (destination.category_name ? destination.category_name.toUpperCase() : 'DESTINATION');

  const rating = destination.avg_rating 
    ? parseFloat(destination.avg_rating).toFixed(1) 
    : '4.8';

  const altText = `${destination.name}, ${stateName} - ${categoryString}`;

  return (
    <div className={`destination-card-wrapper ${sizeClass}`}>
      <Link 
        to={`/places/${destination.slug}`} 
        className="destination-card"
        id={`dest-card-${destination.slug}`}
        aria-label={`Explore ${destination.name} in ${stateName}`}
      >
        {/* Full Media Image & Overlay */}
        <div className="card-media-box">
          <DestinationImage 
            destination={destination}
            src={imageUrl} 
            alt={altText} 
            className="card-media-image"
            loading="lazy"
          />
          <div className="card-gradient-overlay" />
          
          {/* Top Left Floating Rating Badge */}
          <div className="card-rating-badge">
            <span className="star">★</span>
            <span className="rating-num">{rating}</span>
          </div>

          {/* Top Right Floating Bookmark Button */}
          <button 
            type="button"
            className={`card-bookmark-btn ${isSaved ? 'saved' : ''}`}
            onClick={toggleBookmark}
            aria-label={isSaved ? `Remove ${destination.name} from saved favorites` : `Save ${destination.name} to favorites`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "#ef4444" : "none"} stroke={isSaved ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        {/* Bottom Card Body Content */}
        <div className="card-body">
          <div className="card-header-tags">
            <span className="card-region-tag">{stateName}</span>
            <span className="card-category-tag">{categoryString}</span>
          </div>

          <h4 className="card-destination-name">{destination.name}</h4>
          
          <p className="card-destination-desc">
            {destination.short_description || destination.description?.substring(0, 110) || `Discover the beauty of ${destination.name}, ${stateName}.`}
          </p>
          
          <div className="card-footer-row">
            <span className="card-explore-link">
              <span>EXPLORE DESTINATION</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
