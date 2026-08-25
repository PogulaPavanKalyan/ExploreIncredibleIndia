import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getExperiences } from '../../services/experienceService';

// Verified 10 categories with exact India-specific imagery & fallbacks
const DEFAULT_EXPERIENCES = [
  { id: 1, slug: 'mountains', name: 'Mountains', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Indian Himalayan mountain landscape' },
  { id: 2, slug: 'beaches', name: 'Beaches', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', alt: 'Indian beach and coastal shores' },
  { id: 3, slug: 'temples', name: 'Temples', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', alt: 'Ancient Indian temple architecture' },
  { id: 4, slug: 'heritage', name: 'Heritage', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', alt: 'Historic royal Rajasthani palace and fort' },
  { id: 5, slug: 'nature', name: 'Nature', image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', alt: 'Lush green valley and forests in India' },
  { id: 6, slug: 'wildlife', name: 'Wildlife', image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800', alt: 'Royal Bengal tiger in Indian wildlife sanctuary' },
  { id: 7, slug: 'waterfalls', name: 'Waterfalls', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800', alt: 'Cascading Indian waterfall in rainforest' },
  { id: 8, slug: 'adventure', name: 'Adventure', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', alt: 'Himalayan trekking and adventure trail' },
  { id: 9, slug: 'food-culture', name: 'Food & Culture', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', alt: 'Authentic Indian regional cuisine and culture' },
  { id: 10, slug: 'spiritual', name: 'Spiritual', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800', alt: 'Sacred Varanasi Ganga ghats and pilgrimage' }
];

export default function QuickExplore() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState(DEFAULT_EXPERIENCES);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadExperiences = async () => {
      try {
        const res = await getExperiences();
        const data = res?.data || res?.results || (Array.isArray(res) ? res : []);
        if (data.length > 0 && isMounted) {
          // Merge API data with verified fallbacks
          const mapped = data.map((item, idx) => {
            const defaultItem = DEFAULT_EXPERIENCES.find(d => d.slug === item.slug) || DEFAULT_EXPERIENCES[idx % DEFAULT_EXPERIENCES.length];
            return {
              id: item.id || defaultItem.id,
              slug: item.slug || defaultItem.slug,
              name: item.name || defaultItem.name,
              image: item.cover_image_url || defaultItem.image,
              alt: defaultItem.alt
            };
          });
          setExperiences(mapped);
        }
      } catch (err) {
        console.warn('[QuickExplore] Using default experience items:', err);
      }
    };
    loadExperiences();
    return () => { isMounted = false; };
  }, []);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="quick-explore-section" aria-label="Quick Explore by Experience">
      <div className="container">
        <div className="quick-explore-header-row">
          <h3 className="quick-explore-title">EXPLORE BY EXPERIENCE</h3>
          <div className="quick-explore-controls">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="carousel-arrow-btn left"
              aria-label="Scroll left"
              title="Scroll Left"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="carousel-arrow-btn right"
              aria-label="Scroll right"
              title="Scroll Right"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div className="quick-explore-slider-wrapper">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="floating-arrow-btn side-left"
            aria-label="Scroll left"
            title="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="quick-explore-grid" ref={scrollContainerRef} role="list">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.slug || exp.id || index}
                className="explore-item"
                role="listitem"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.5 }}
                onClick={() => navigate(`/explore?category=${exp.slug}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/explore?category=${exp.slug}`);
                  }
                }}
                aria-label={`Explore ${exp.name} destinations`}
              >
                <img
                  src={exp.image}
                  alt={exp.alt || exp.name}
                  loading="lazy"
                  onError={(e) => {
                    const fallbackItem = DEFAULT_EXPERIENCES.find(d => d.slug === exp.slug);
                    if (fallbackItem && e.currentTarget.src !== fallbackItem.image) {
                      e.currentTarget.src = fallbackItem.image;
                    }
                  }}
                />
                <div className="explore-item-overlay">
                  <h3>{exp.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="floating-arrow-btn side-right"
            aria-label="Scroll right"
            title="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
