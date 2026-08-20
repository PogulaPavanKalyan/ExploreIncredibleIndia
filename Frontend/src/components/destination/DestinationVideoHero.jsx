import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, MapPin, Sparkles, Heart, Share2, Compass, ChevronDown, Calendar, ArrowRight } from 'lucide-react';
import DestinationImage from '../common/DestinationImage';
import DestinationShareModal from './DestinationShareModal';
import './DestinationVideoHero.css';

export default function DestinationVideoHero({ destination }) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!destination?.id) return;
    try {
      const savedList = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      if (savedList.some(d => d.id === destination.id || d.slug === destination.slug)) {
        setIsSaved(true);
      }
    } catch (e) {
      console.warn('Could not read saved destinations:', e);
    }
  }, [destination?.id, destination?.slug]);

  if (!destination) return null;

  const toggleSave = () => {
    try {
      let savedList = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      if (isSaved) {
        savedList = savedList.filter(d => d.id !== destination.id && d.slug !== destination.slug);
        setIsSaved(false);
      } else {
        savedList.push({
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          state: destination.state?.name || destination.state_name || '',
          image: destination.main_image
        });
        setIsSaved(true);
      }
      localStorage.setItem('savedDestinations', JSON.stringify(savedList));
    } catch (e) {
      console.warn('Could not save destination:', e);
    }
  };

  const primaryVideo = destination.primary_video || (destination.videos && destination.videos.length > 0 ? destination.videos[0] : null);
  const rawVideoUrl = primaryVideo?.video_url || '';
  const isDirectVideo = rawVideoUrl.endsWith('.mp4') || rawVideoUrl.endsWith('.webm');
  
  let embedVideoUrl = null;
  if (rawVideoUrl) {
    if (rawVideoUrl.includes('youtube.com/embed/')) {
      embedVideoUrl = rawVideoUrl;
    } else if (rawVideoUrl.includes('watch?v=')) {
      embedVideoUrl = rawVideoUrl.replace('watch?v=', 'embed/');
    } else if (rawVideoUrl.includes('youtu.be/')) {
      const vidId = rawVideoUrl.split('youtu.be/')[1]?.split('?')[0];
      embedVideoUrl = `https://www.youtube.com/embed/${vidId}`;
    }
  }

  const hasVideo = !!(embedVideoUrl || isDirectVideo);

  // Extract category names
  const categoryBadges = destination.categories && destination.categories.length > 0
    ? destination.categories.map(c => typeof c === 'string' ? c : c.name)
    : (destination.category_name ? [destination.category_name] : (destination.category?.name ? [destination.category.name] : ['Experience']));

  const stateName = destination.state?.name || destination.state_name || 'India';
  const stateSlug = destination.state?.slug || destination.state_slug || 'all';
  const districtName = destination.district || destination.district_name || '';
  const locationString = districtName ? `${districtName} District, ${stateName}` : stateName;

  const scrollToAbout = () => {
    const el = document.getElementById('about-destination') || document.getElementById('discover-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToVideo = () => {
    const el = document.getElementById('video-experience') || document.getElementById('dest-video-gallery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else setIsPlayingVideo(true);
  };

  const plannerUrl = `/travel-planner?destination=${encodeURIComponent(destination.name)}&state=${encodeURIComponent(stateName)}&duration=${encodeURIComponent(destination.recommended_duration || '2 Days')}`;

  return (
    <div className="dest-video-hero" id="destination-hero">
      {/* Background Media Layer */}
      <div className="dest-video-hero-media">
        {isPlayingVideo && isDirectVideo ? (
          <video
            src={rawVideoUrl}
            className="dest-hero-video-frame"
            autoPlay
            loop
            muted
            controls
            playsInline
          />
        ) : isPlayingVideo && embedVideoUrl ? (
          <iframe
            src={`${embedVideoUrl}?autoplay=1&mute=1&controls=1&loop=1&playsinline=1`}
            title={destination.name}
            className="dest-hero-video-frame"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <DestinationImage
            destination={destination}
            src={destination.main_image}
            alt={`${destination.name} - Dekho Bharat`}
            className="dest-hero-poster-img"
            loading="eager"
          />
        )}
      </div>

      {/* Cinematic Dark Gradient Overlay */}
      <div className="dest-video-hero-overlay" />

      {/* Breadcrumbs & Share/Save Top Floating Bar */}
      <div style={{
        position: 'absolute',
        top: '6.5rem',
        left: '0',
        right: '0',
        zIndex: 30,
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/explore" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>India</Link>
          <span>›</span>
          <Link to={`/states/${stateSlug}`} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>{stateName}</Link>
          <span>›</span>
          <span style={{ color: '#FF6B1A', fontWeight: 700 }}>{destination.name}</span>
        </nav>

        {/* Save & Share Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: isSaved ? '#EF4444' : 'rgba(15, 23, 42, 0.65)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            aria-label="Save Destination"
          >
            <Heart size={14} fill={isSaved ? '#ffffff' : 'none'} color="#ffffff" />
            {isSaved ? 'SAVED' : 'SAVE DESTINATION'}
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(15, 23, 42, 0.65)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            aria-label="Share Destination"
          >
            <Share2 size={14} color="#ffffff" />
            SHARE
          </button>
        </div>
      </div>

      {/* Hero Center Content Showcase */}
      <div className="dest-video-hero-content" id="discover-content" style={{ marginTop: '3rem' }}>
        {/* Category Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}
        >
          {categoryBadges.map((badge, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 107, 26, 0.2)',
                color: '#FFB280',
                border: '1px solid rgba(255, 107, 26, 0.4)',
                backdropFilter: 'blur(10px)',
                padding: '0.3rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              <Sparkles size={12} /> {badge}
            </span>
          ))}
        </motion.div>

        {/* Destination Title */}
        <motion.h1
          className="dest-video-hero-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {destination.name}
        </motion.h1>

        {/* Location Subtitle */}
        <motion.div
          className="dest-video-hero-location"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MapPin size={18} color="#FF6B1A" />
          <span>{locationString}</span>
        </motion.div>

        {/* Action Buttons Row: EXPLORE • WATCH VIDEO • PLAN JOURNEY */}
        <motion.div
          className="dest-hero-action-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.9rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}
        >
          <button
            onClick={scrollToAbout}
            style={{
              background: '#ffffff',
              color: '#0F172A',
              border: 'none',
              padding: '0.85rem 1.8rem',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '0.9rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
            }}
            id="btn-hero-explore"
          >
            <Compass size={16} color="#FF6B1A" /> EXPLORE
          </button>

          {hasVideo && (
            <button
              onClick={scrollToVideo}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                padding: '0.85rem 1.8rem',
                borderRadius: '30px',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              id="btn-hero-watch-video"
            >
              <Play size={16} fill="#ffffff" /> WATCH VIDEO
            </button>
          )}

          <Link
            to={plannerUrl}
            style={{
              background: 'linear-gradient(135deg, #FF6B1A 0%, #FF8C42 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '0.85rem 1.8rem',
              borderRadius: '30px',
              fontWeight: 800,
              fontSize: '0.9rem',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 10px 25px rgba(255, 107, 26, 0.4)'
            }}
            id="btn-hero-plan-trip"
          >
            PLAN JOURNEY <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <div
        onClick={scrollToAbout}
        style={{
          position: 'absolute',
          bottom: '2.8rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem',
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          animation: 'bounce 2s infinite'
        }}
      >
        <span>SCROLL TO DISCOVER</span>
        <ChevronDown size={18} />
      </div>

      {/* Share Modal Dialog */}
      <DestinationShareModal
        destination={destination}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
