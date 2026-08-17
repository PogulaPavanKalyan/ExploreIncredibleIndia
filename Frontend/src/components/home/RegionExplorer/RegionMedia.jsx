import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegionMedia({ region, mousePos }) {
  const videoRef = useRef(null);
  
  // Choose video source based on screen size
  const isMobile = window.innerWidth <= 768;
  const videoSrc = isMobile && region.mobile_video ? region.mobile_video : region.desktop_video;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [videoSrc]);

  // Parallax calculations
  const layerStyle = { 
    transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.05)` 
  };

  return (
    <div className="region-media-layer">
      <AnimatePresence mode="wait">
        <motion.div
          key={region.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        >
          <div style={{ width: '100%', height: '100%', ...layerStyle }}>
            {videoSrc ? (
              <video
                ref={videoRef}
                src={videoSrc}
                poster={region.poster_image}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img src={region.poster_image} alt={region.name} />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="region-media-overlay" />
    </div>
  );
}
