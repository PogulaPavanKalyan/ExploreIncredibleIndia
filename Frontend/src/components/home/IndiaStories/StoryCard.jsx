import React from 'react';
import { Link } from 'react-router-dom';
import { handleDestinationImageError } from '../../../utils/imageUrl';

export default function StoryCard({ story }) {
  if (!story) return null;

  const categoryDisplay = story.category_label || story.category_display || story.category || 'Story';
  const locationDisplay = story.location || story.state_name || 'Incredible India';
  const imageUrl = story.cover_image || story.featured_image || 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800';
  const altText = `${story.title} - ${categoryDisplay}, ${locationDisplay}`;

  return (
    <div className="story-card-item">
      <Link 
        to={`/stories/${story.slug}`} 
        className="story-card-link"
        id={`story-card-${story.slug}`}
        aria-label={`Read story: ${story.title}`}
      >
        <div className="story-card-media">
          <img
            src={imageUrl}
            alt={altText}
            className="story-card-img"
            loading="lazy"
            onError={(e) => handleDestinationImageError(e, story.title, imageUrl)}
          />
          <div className="story-card-media-overlay" />
          <span className="story-card-category-pill">{categoryDisplay}</span>
          <span className="story-card-readtime">{story.read_time || '5 min read'}</span>
        </div>

        <div className="story-card-body">
          <span className="story-card-location">
            📍 {locationDisplay}
          </span>

          <h4 className="story-card-title">{story.title}</h4>

          <p className="story-card-description">
            {story.short_description || story.content?.substring(0, 120) + '...'}
          </p>

          <div className="story-card-footer">
            <span className="story-author-name">By {story.author || 'Dekho Bharat'}</span>
            <span className="story-read-action">
              <span>Read Story</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
