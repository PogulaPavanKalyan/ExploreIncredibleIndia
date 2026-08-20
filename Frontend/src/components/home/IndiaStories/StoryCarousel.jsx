import React, { useRef, useState, useEffect } from 'react';
import StoryCard from './StoryCard';

export default function StoryCarousel({ stories = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [stories]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 380;
    const target = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount 
      : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({
      left: target,
      behavior: 'smooth'
    });
  };

  if (!stories || stories.length === 0) return null;

  return (
    <div className="story-carousel-container">
      <div className="story-carousel-header">
        <div className="carousel-section-heading">
          <span className="heading-dot" />
          <span>More Travel Stories & Chronicled Journeys</span>
        </div>

        <div className="carousel-nav-controls">
          <button
            className="carousel-control-btn"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous stories"
            id="stories-carousel-prev"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            className="carousel-control-btn"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next stories"
            id="stories-carousel-next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div 
        className="story-carousel-track" 
        ref={scrollRef}
        onScroll={checkScrollability}
        tabIndex={0}
        role="region"
        aria-label="Story carousel"
      >
        {stories.map((story) => (
          <StoryCard key={story.id || story.slug} story={story} />
        ))}
      </div>
    </div>
  );
}
