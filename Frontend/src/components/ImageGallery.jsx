import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ images = [], fallbackImage = '' }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const galleryList = images && images.length > 0
    ? images
    : [{ id: 'fallback', image: fallbackImage, caption: 'Destination View' }];

  const currentImg = galleryList[activeIdx] || galleryList[0];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="gallery-container">
      {/* Desktop Grid Layout */}
      <div className="gallery-grid-desktop">
        {galleryList.map((item, idx) => (
          <div
            key={item.id || idx}
            className="gallery-thumb-card"
            onClick={() => {
              setActiveIdx(idx);
              setLightboxOpen(true);
            }}
          >
            <img src={item.image} alt={item.alt_text || item.caption || `Gallery ${idx + 1}`} loading="lazy" />
            <div className="gallery-thumb-overlay">
              <Maximize2 size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="lightbox-close-btn"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close Lightbox"
              >
                <X size={24} />
              </button>

              {galleryList.length > 1 && (
                <>
                  <button className="lightbox-nav-btn lightbox-prev" onClick={handlePrev} aria-label="Previous image">
                    <ChevronLeft size={24} />
                  </button>
                  <button className="lightbox-nav-btn lightbox-next" onClick={handleNext} aria-label="Next image">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <img
                src={currentImg.image}
                alt={currentImg.caption || 'Gallery Image'}
                className="lightbox-main-img"
              />

              {currentImg.caption && <p className="lightbox-caption">{currentImg.caption}</p>}
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                {activeIdx + 1} of {galleryList.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
