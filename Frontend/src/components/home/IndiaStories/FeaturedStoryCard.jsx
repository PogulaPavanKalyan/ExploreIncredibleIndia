import React from 'react';
import { Link } from 'react-router-dom';
import { handleDestinationImageError } from '../../../utils/imageUrl';

export default function FeaturedStoryCard({ story }) {
  if (!story) return null;

  const categoryDisplay = story.category_label || story.category_display || story.category || 'Hidden India';
  const locationDisplay = story.location || story.state_name || 'Meghalaya, India';
  const imageUrl = story.cover_image || story.featured_image || 'https://images.unsplash.com/photo-1558431382-27e303142255?w=1200';
  const altText = `${story.title} - ${categoryDisplay}, ${locationDisplay}`;

  return (
    <div className="featured-story-showcase" id="featured-story-hero">
      <Link 
        to={`/stories/${story.slug}`} 
        className="featured-story-inner"
        aria-label={`Featured Story: ${story.title}`}
      >
        <img
          src={imageUrl}
          alt={altText}
          className="featured-story-bg"
          loading="eager"
          onError={(e) => handleDestinationImageError(e, story.title, imageUrl)}
        />
        <div className="featured-story-gradient" />

        <div className="featured-story-content">
          <div className="featured-story-badge-row">
            <span className="featured-pillar-badge">★ {categoryDisplay}</span>
            <span className="featured-location-badge">📍 {locationDisplay}</span>
          </div>

          <h3 className="featured-story-title">{story.title}</h3>

          <p className="featured-story-desc">
            {story.short_description || story.content?.substring(0, 160) + '...'}
          </p>

          <div className="featured-story-footer">
            <div className="featured-author-meta">
              <span className="featured-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {story.author || 'Dekho Bharat Editorial'}
              </span>
              <span className="featured-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {story.read_time || '6 min read'}
              </span>
            </div>

            <span className="featured-read-btn">
              <span>Read Full Story</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
