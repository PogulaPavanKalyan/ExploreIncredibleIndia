import React, { useState, useEffect, useRef, useCallback, Suspense, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { getExperiences } from '../../services/experienceService';
import ExperienceCard from './ExperienceCard';
import './ExperienceSection.css';

// ── Rotating 3D Compass / Marker ────────────────────────────────
const RotatingMarker = () => {
  const meshRef = useRef();
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
  });
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#f97316"
        wireframe
        emissive="#ea580c"
        emissiveIntensity={0.35}
      />
    </mesh>
  );
};

// ── Skeleton Loader ─────────────────────────────────────────────
const SkeletonGallery = () => (
  <div className="experiences-skeleton" aria-busy="true" aria-label="Loading experiences">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="skeleton-card" style={{ opacity: 1 - i * 0.12 }} />
    ))}
  </div>
);

// ── Main Experience Section ─────────────────────────────────────
const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const galleryRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const pauseTimerRef = useRef(null);

  // Fetch experiences from Django API
  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getExperiences();
      const list = response?.data || response?.results || (Array.isArray(response) ? response : []);
      setExperiences(list);
    } catch (err) {
      console.error('[ExperienceSection] Failed to load experiences:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  // Scroll active card into view within track
  const scrollToIndex = useCallback((idx) => {
    if (!galleryRef.current) return;
    const cards = galleryRef.current.querySelectorAll('.experience-card-wrapper');
    if (cards[idx]) {
      cards[idx].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, []);

  // Temporary interaction pause helper
  const pauseAutoRotation = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 7000);
  }, []);

  // Card select handler
  const handleSelectCard = useCallback((idx) => {
    setActiveIndex(idx);
    scrollToIndex(idx);
    pauseAutoRotation();
  }, [scrollToIndex, pauseAutoRotation]);

  // Carousel Next/Prev
  const goLeft = useCallback(() => {
    pauseAutoRotation();
    setActiveIndex((prev) => {
      const next = prev > 0 ? prev - 1 : experiences.length - 1;
      scrollToIndex(next);
      return next;
    });
  }, [experiences.length, scrollToIndex, pauseAutoRotation]);

  const goRight = useCallback(() => {
    pauseAutoRotation();
    setActiveIndex((prev) => {
      const next = (prev + 1) % experiences.length;
      scrollToIndex(next);
      return next;
    });
  }, [experiences.length, scrollToIndex, pauseAutoRotation]);

  // Auto-rotation every 6 seconds when not paused
  useEffect(() => {
    if (loading || error || experiences.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % experiences.length;
        scrollToIndex(next);
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [loading, error, experiences.length, isPaused, scrollToIndex]);

  // Mouse Drag to Scroll
  const handleMouseDown = useCallback((e) => {
    if (!galleryRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX;
    scrollStart.current = galleryRef.current.scrollLeft;
    galleryRef.current.classList.add('is-grabbing');
    pauseAutoRotation();
  }, [pauseAutoRotation]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current || !galleryRef.current) return;
    const deltaX = e.pageX - dragStartX.current;
    galleryRef.current.scrollLeft = scrollStart.current - deltaX;
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    galleryRef.current?.classList.remove('is-grabbing');
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goLeft();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goRight();
    }
  }, [goLeft, goRight]);

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] } }
  };

  const dots = useMemo(() => {
    return experiences.slice(0, 10);
  }, [experiences]);

  return (
    <section
      className="experiences-section"
      aria-label="What kind of journey are you looking for?"
      onKeyDown={handleKeyDown}
      onMouseEnter={pauseAutoRotation}
    >
      <div className="experiences-container">

        {/* ── Section Header ── */}
        <motion.div
          className="experiences-header"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="experiences-header-text">
            <h2 className="experiences-title">
              What kind of<br />
              <span className="highlight">journey</span> are you<br />
              looking for?
            </h2>
            <p className="experiences-subtitle">
              India has a journey for every kind of traveller.
            </p>
          </div>

          {/* 3D Decorative Floating Marker */}
          <div className="marker-3d-container" aria-hidden="true">
            <Suspense fallback={null}>
              <Canvas camera={{ position: [0, 0, 3] }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <RotatingMarker />
              </Canvas>
            </Suspense>
          </div>
        </motion.div>

        {/* ── Gallery Track / States ── */}
        {loading ? (
          <SkeletonGallery />
        ) : error ? (
          <div className="experiences-error" role="alert">
            <h3>Unable to load experiences.</h3>
            <button className="experiences-retry-btn" onClick={fetchExperiences}>
              Try Again
            </button>
          </div>
        ) : experiences.length === 0 ? (
          <div className="experiences-error">
            <h3>No experiences available right now.</h3>
          </div>
        ) : (
          <motion.div
            className="experiences-carousel-wrapper"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Horizontal Track */}
            <div
              ref={galleryRef}
              className="experiences-gallery"
              role="list"
              aria-label="Experience Categories Carousel"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={pauseAutoRotation}
            >
              {experiences.map((experience, index) => {
                const isFeatured = activeIndex === index;
                return (
                  <div
                    key={experience.id || experience.slug}
                    className={`experience-card-wrapper ${isFeatured ? 'active' : 'secondary'}`}
                    role="listitem"
                    onClick={() => handleSelectCard(index)}
                  >
                    <ExperienceCard
                      experience={experience}
                      isActive={isFeatured}
                      onClick={() => handleSelectCard(index)}
                    />
                  </div>
                );
              })}
            </div>

            {/* ── Full Visible Carousel Controls ── */}
            <div className="experiences-controls-area">
              <nav className="carousel-nav" aria-label="Experience carousel navigation">
                <button
                  type="button"
                  className="carousel-nav-btn"
                  onClick={goLeft}
                  aria-label="Previous experience category"
                >
                  ←
                </button>

                <div className="carousel-dots" role="tablist" aria-label="Experience categories dots">
                  {dots.map((exp, i) => (
                    <button
                      key={exp.id || exp.slug || i}
                      type="button"
                      className={`carousel-dot ${activeIndex === i ? 'active' : ''}`}
                      onClick={() => handleSelectCard(i)}
                      role="tab"
                      aria-selected={activeIndex === i}
                      aria-label={`Show ${exp.name} experience (${i + 1} of ${dots.length})`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="carousel-nav-btn"
                  onClick={goRight}
                  aria-label="Next experience category"
                >
                  →
                </button>
              </nav>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default ExperienceSection;
