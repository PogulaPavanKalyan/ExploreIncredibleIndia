import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function HeroVideo({ 
  currentDestination, 
  isMuted, 
  toggleSound, 
  getMediaUrl 
}) {
  const ytPlayerRef = useRef(null);

  useEffect(() => {
    if (!currentDestination) return;

    const initPlayer = () => {
      ytPlayerRef.current = new window.YT.Player('hero-youtube-player', {
        events: {
          'onStateChange': (event) => {
             if (event.data === window.YT.PlayerState.ENDED) {
                 event.target.playVideo();
             }
          }
        }
      });
    };

    if (currentDestination.youtube_video_id) {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        window.onYouTubeIframeAPIReady = initPlayer;
      } else if (window.YT && window.YT.Player) {
        setTimeout(initPlayer, 500);
      }
    }
  }, [currentDestination]);

  useEffect(() => {
    if (ytPlayerRef.current && typeof ytPlayerRef.current.unMute === 'function') {
      if (isMuted) {
        ytPlayerRef.current.mute();
      } else {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(100);
      }
    }
  }, [isMuted]);

  return (
    <>
      <div className="hero-video-bg" style={{ overflow: 'hidden', backgroundColor: '#0f172a', position: 'absolute', inset: 0, zIndex: 0 }}>
        <AnimatePresence mode="wait">
          {currentDestination && currentDestination.youtube_video_id ? (
            <motion.div
              key={currentDestination.youtube_video_id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              <iframe
                id="hero-youtube-player"
                src={`https://www.youtube.com/embed/${currentDestination.youtube_video_id}?autoplay=1&mute=1&controls=0&showinfo=0&autohide=1&loop=1&playlist=${currentDestination.youtube_video_id}&playsinline=1&vq=hd1080&enablejsapi=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100vw',
                  height: '100vw', /* Aspect ratio hack: force it to be a square at minimum 100vw */
                  minWidth: '177.77vh', /* 16:9 Aspect ratio */
                  minHeight: '56.25vw',
                  transform: 'translate(-50%, -50%) scale(1.15)',
                }}
              />
            </motion.div>
          ) : currentDestination && currentDestination.desktop_video ? (
            <motion.video
              key={currentDestination.desktop_video}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              src={getMediaUrl(currentDestination.desktop_video)}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
          ) : currentDestination && currentDestination.image_url ? (
            <motion.img
              key={currentDestination.image_url}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              src={getMediaUrl(currentDestination.image_url)}
              alt={currentDestination.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
          ) : null}
        </AnimatePresence>
      </div>

      <div className="hero-bg-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.8) 100%)', zIndex: 1 }} />

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={toggleSound}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </motion.button>
    </>
  );
}
