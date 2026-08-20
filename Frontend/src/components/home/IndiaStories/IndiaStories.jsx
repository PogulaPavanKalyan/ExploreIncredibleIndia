import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getStories, getFeaturedStory } from '../../../services/storyService';
import CategoryPills from './CategoryPills';
import FeaturedStoryCard from './FeaturedStoryCard';
import StoryCarousel from './StoryCarousel';
import './IndiaStories.css';

export default function IndiaStories() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [stories, setStories] = useState([]);
  const [featuredStory, setFeaturedStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Featured Story once
  useEffect(() => {
    let isMounted = true;
    getFeaturedStory()
      .then((story) => {
        if (isMounted && story) {
          setFeaturedStory(story);
        }
      })
      .catch((err) => console.warn('Error fetching featured story:', err));

    return () => { isMounted = false; };
  }, []);

  // Fetch stories on category change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const params = activeCategory !== 'all' ? { category: activeCategory } : {};
    getStories(params)
      .then((res) => {
        if (isMounted && res && res.data) {
          setStories(res.data);
        }
      })
      .catch((err) => console.warn('Error loading stories:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeCategory]);

  // Derive carousel stories (excluding featured story if in 'all' view)
  const carouselStories = activeCategory === 'all' && featuredStory
    ? stories.filter(s => s.slug !== featuredStory.slug)
    : stories;

  // Dominant card to display for active category
  const dominantStory = activeCategory === 'all'
    ? (featuredStory || stories[0])
    : (stories[0] || featuredStory);

  const remainingCarouselStories = activeCategory === 'all'
    ? carouselStories
    : stories.slice(1);

  return (
    <section className="india-stories-section" id="stories-section" aria-label="India Stories">
      {/* Background Ambience & Floating 3D Geometric Motif */}
      <div className="stories-ambient-mesh" aria-hidden="true" />
      <div className="stories-floating-geo-3d" aria-hidden="true" />

      <div className="stories-container">
        {/* Section Header */}
        <motion.div 
          className="stories-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="stories-tag-badge">
            ✦ CHRONICLES & EXPEDITIONS
          </span>

          <h2 className="stories-main-title">
            ONE COUNTRY.<br />
            <span className="gradient-text">THOUSANDS OF STORIES.</span>
          </h2>

          <p className="stories-subtitle">
            Stories, people, places and moments that make India unforgettable.
          </p>
        </motion.div>

        {/* Category Filter Navigation */}
        <CategoryPills 
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Storytelling Editorial Body */}
        <div id="stories-content-panel" role="tabpanel" aria-labelledby={`story-tab-${activeCategory}`}>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading-skeleton"
                className="stories-loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ height: '520px', borderRadius: '28px', background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249, 115, 22, 0.2)', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
                  <span>Loading authentic travel stories...</span>
                </div>
              </motion.div>
            ) : stories.length === 0 ? (
              <motion.div 
                key="empty-state"
                className="stories-empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="stories-empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <h3 className="stories-empty-title">No Stories Found in this Category</h3>
                <p className="stories-empty-text">
                  We are actively curating new expeditions for this theme. Explore all stories in the meantime.
                </p>
                <button 
                  className="stories-empty-reset-btn"
                  onClick={() => setActiveCategory('all')}
                >
                  View All Stories
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`stories-content-${activeCategory}`}
                className="stories-editorial-layout"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* 1. Large Dominant Featured Story */}
                {dominantStory && (
                  <FeaturedStoryCard story={dominantStory} />
                )}

                {/* 2. Horizontal Story Carousel with Next/Prev Controls */}
                {remainingCarouselStories.length > 0 && (
                  <StoryCarousel stories={remainingCarouselStories} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA to View All Stories */}
        <motion.div 
          className="stories-bottom-cta-wrap"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/stories" className="stories-explore-all-btn" id="explore-all-stories-btn">
            <span>Explore All Stories</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
