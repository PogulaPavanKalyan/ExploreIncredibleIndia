import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Category-specific alt descriptions and high-fidelity verified fallbacks (all 100% India imagery)
const CATEGORY_META = {
  mountains: {
    alt: 'Misty snow-capped Himalayan mountain peaks in India',
    fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000'
  },
  beaches: {
    alt: 'Golden sandy beach and turquoise waters along the Indian coastline',
    fallback: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000'
  },
  temples: {
    alt: 'Magnificent ancient Indian temple architecture and sacred gopuram',
    fallback: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1000'
  },
  heritage: {
    alt: 'Royal Rajasthani palace and historic Indian fort heritage',
    fallback: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1000'
  },
  nature: {
    alt: 'Untouched lush green forest and scenic valley landscape in India',
    fallback: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1000'
  },
  wildlife: {
    alt: 'Royal Bengal tiger in an Indian national park wildlife reserve',
    fallback: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1000'
  },
  waterfalls: {
    alt: 'Spectacular cascading waterfall hidden in the Indian rainforest',
    fallback: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1000'
  },
  adventure: {
    alt: 'Outdoor trekking and mountain adventure trail in the Indian Himalayas',
    fallback: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000'
  },
  'food-culture': {
    alt: 'Authentic Indian spices, culinary dishes and vibrant regional culture',
    fallback: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1000'
  },
  spiritual: {
    alt: 'Sacred Varanasi Ganga Ghats morning aarti and spiritual retreat in India',
    fallback: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000'
  }
};

const resolveMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/media/')) return `http://127.0.0.1:8000${url}`;
  if (url.startsWith('media/')) return `http://127.0.0.1:8000/${url}`;
  return url;
};

const ExperienceCard = ({ experience, isActive, onClick }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const slugKey = useMemo(() => {
    return (experience.slug || '').toLowerCase().replace(/_/g, '-');
  }, [experience.slug]);

  const meta = CATEGORY_META[slugKey] || {
    alt: `${experience.name} experience in India`,
    fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000'
  };

  const initialUrl = resolveMediaUrl(
    experience.cover_image_url || experience.cover_image || experience.image
  ) || meta.fallback;

  const [imgSrc, setImgSrc] = useState(initialUrl);

  // Sync state if props update
  React.useEffect(() => {
    const freshUrl = resolveMediaUrl(
      experience.cover_image_url || experience.cover_image || experience.image
    ) || meta.fallback;
    setImgSrc(freshUrl);
  }, [experience.cover_image_url, experience.cover_image, experience.image, meta.fallback]);

  // Subtle 3D tilt effect on mouse movement (max 3-5 degrees)
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -3.5;
    const rotateY = ((x - cx) / cx) * 4.5;

    setRotation({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotation({ x: 0, y: 0 });
  }, []);

  const handleImgError = useCallback((e) => {
    console.warn(`[ExperienceCard] FAILED IMAGE: ${e.currentTarget.src} for category: "${experience.name}"`);
    if (imgSrc !== meta.fallback) {
      setImgSrc(meta.fallback);
    }
  }, [meta.fallback, experience.name, imgSrc]);

  const destinationCount = experience.destination_count || experience.featured_destinations?.length || 0;

  return (
    <div
      ref={cardRef}
      className={`experience-card-inner ${isActive ? 'is-featured' : ''}`}
      style={{
        transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Explore ${experience.name} experiences in India`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Background Media */}
      <img
        className="experience-media"
        src={imgSrc}
        alt={meta.alt}
        loading="lazy"
        onError={handleImgError}
        decoding="async"
      />

      {/* Cinematic Dark Gradient Overlay */}
      <div className="experience-overlay" aria-hidden="true" />

      {/* Destination Count Badge */}
      {destinationCount > 0 && (
        <div className="experience-count" aria-label={`${destinationCount} destinations available`}>
          {destinationCount} destination{destinationCount !== 1 ? 's' : ''}
        </div>
      )}

      {/* Content Area */}
      <div className="experience-content">
        <h3 className="experience-name">{experience.name}</h3>

        <div className="experience-details">
          {experience.description && (
            <p className="experience-desc">{experience.description}</p>
          )}

          <Link
            to={`/places?category=${experience.slug}`}
            className="experience-explore-btn"
            aria-label={`Explore ${experience.name} destinations across India`}
            onClick={(e) => e.stopPropagation()}
          >
            <span>Explore {experience.name}</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExperienceCard);
