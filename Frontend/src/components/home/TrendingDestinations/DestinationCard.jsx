import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function DestinationCard({ destination, sizeClass }) {
  const [isSaved, setIsSaved] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    // Check local storage for bookmark
    try {
      const saved = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      if (saved.some(d => d.id === destination.id)) {
        setIsSaved(true);
      }
    } catch (e) {
      console.error('Error parsing local storage:', e);
    }
  }, [destination.id]);

  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      let saved = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      if (isSaved) {
        saved = saved.filter(d => d.id !== destination.id);
        setIsSaved(false);
      } else {
        saved.push({
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          image: destination.main_image
        });
        setIsSaved(true);
      }
      localStorage.setItem('savedDestinations', JSON.stringify(saved));
    } catch (e) {
      console.error('Error updating local storage:', e);
    }
  };

  // Subtle 3D tilt effect on hover
  const handleMouseMove = (e) => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -4; // Max 4 degrees
    const rotateY = ((x - centerX) / centerX) * 4;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  };

  const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/media/')) return `http://127.0.0.1:8000${url}`;
    if (url.startsWith('media/')) return `http://127.0.0.1:8000/${url}`;
    return url;
  };
  const imageUrl = resolveUrl(destination.main_image) || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
  
  // Format categories like "NATURE • MOUNTAINS"
  const categoryString = destination.categories?.slice(0, 2).map(c => c.name.toUpperCase()).join(' • ') || 'DESTINATION';

  return (
    <Link 
      to={`/places/${destination.slug}`} 
      className={`destination-card ${sizeClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-inner" ref={cardRef}>
        <img 
          src={imageUrl} 
          alt={`Discover ${destination.name}`} 
          className="card-media"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800';
          }}
        />
        
        <div className="card-overlay" />
        
        <button 
          className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
          onClick={toggleBookmark}
          aria-label={isSaved ? `Remove ${destination.name} from saved` : `Save ${destination.name}`}
        >
          {isSaved ? '♥' : '♡'}
        </button>

        <div className="card-content">
          <span className="card-region">{destination.state?.name || 'India'}</span>
          <h3 className="card-title">{destination.name}</h3>
          
          <p className="card-desc">
            {destination.short_description || `Discover the beauty of ${destination.name}, ${destination.state?.name || 'India'}.`}
          </p>
          
          <div className="card-meta">
            <span className="card-category">{categoryString}</span>
            {destination.avg_rating && (
              <span className="card-rating">★ {destination.avg_rating}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
