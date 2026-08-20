import React, { useState } from 'react';
import { Film, Play, ShieldCheck, Clock, Eye } from 'lucide-react';
import { handleDestinationImageError } from '../../utils/imageUrl';
import './DestinationVideoGallery.css';

export default function DestinationVideoGallery({ destination }) {
  const videoList = destination.videos && destination.videos.length > 0
    ? destination.videos
    : (destination.primary_video ? [destination.primary_video] : []);

  const [activeIndex, setActiveIndex] = useState(0);

  if (videoList.length === 0) {
    return (
      <section className="dest-video-gallery-section" id="destination-videos">
        <div className="dest-video-gallery-header">
          <div className="dest-video-gallery-title-wrap">
            <div className="dest-video-gallery-icon">
              <Film size={24} />
            </div>
            <div>
              <h2 className="dest-video-gallery-title">Watch {destination.name}</h2>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
                Cinematic Guides & Cultural Documentaries
              </span>
            </div>
          </div>
        </div>

        <div className="dest-video-coming-soon">
          <Film size={40} color="#FF6B1A" style={{ marginBottom: '1rem' }} />
          <h4 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Official Travel Video Coming Soon</h4>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto' }}>
            Our editorial team is verifying official tourism footage for {destination.name}.
          </p>
        </div>
      </section>
    );
  }

  const currentVideo = videoList[activeIndex] || videoList[0];
  const rawUrl = currentVideo.video_url || '';
  const isDirectMp4 = rawUrl.endsWith('.mp4') || rawUrl.endsWith('.webm');
  
  let embedUrl = null;
  if (!isDirectMp4 && rawUrl) {
    if (rawUrl.includes('youtube.com/embed/')) {
      embedUrl = rawUrl;
    } else if (rawUrl.includes('watch?v=')) {
      embedUrl = rawUrl.replace('watch?v=', 'embed/');
    } else if (rawUrl.includes('youtu.be/')) {
      const vidId = rawUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}`;
    } else if (rawUrl.includes('vimeo.com/')) {
      const vimeoId = rawUrl.split('vimeo.com/')[1]?.split('?')[0];
      embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
    }
  }

  return (
    <section className="dest-video-gallery-section" id="video-experience">
      <div className="dest-video-gallery-header">
        <div className="dest-video-gallery-title-wrap">
          <div className="dest-video-gallery-icon">
            <Film size={24} />
          </div>
          <div>
            <h2 className="dest-video-gallery-title">Experience {destination.name}</h2>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>
              Cinematic Documentaries, Temple Tours & Aerial Perspectives
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>{videoList.length} Verified Video{videoList.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Main Active Player */}
      <div className="dest-video-active-player">
        {isDirectMp4 ? (
          <video
            src={rawUrl}
            className="dest-active-iframe"
            controls
            playsInline
            poster={currentVideo.thumbnail_url || destination.main_image}
          />
        ) : embedUrl ? (
          <iframe
            src={`${embedUrl}?autoplay=0&rel=0`}
            title={currentVideo.title || destination.name}
            className="dest-active-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="dest-video-coming-soon">
            <p>Video player unavailable</p>
          </div>
        )}
      </div>

      {/* Playlist / Multi-video Selector */}
      {videoList.length > 1 && (
        <div className="dest-video-playlist-grid">
          {videoList.map((vid, idx) => (
            <div
              key={vid.id || idx}
              className={`dest-video-playlist-card ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              role="button"
              tabIndex={0}
            >
              <div className="dest-video-card-thumb-wrap">
                <img
                  src={vid.thumbnail_url || destination.main_image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600'}
                  alt={vid.title}
                  className="dest-video-card-thumb"
                  onError={(e) => handleDestinationImageError(e, vid.title)}
                />
                <div className="dest-video-card-play-icon">
                  <Play size={16} fill="currentColor" />
                </div>
                {vid.duration && (
                  <span className="dest-video-duration-tag">{vid.duration}</span>
                )}
              </div>

              <div className="dest-video-card-info">
                <div className="dest-video-card-type">
                  {vid.video_type_display || vid.video_type || 'Travel Video'}
                </div>
                <h4 className="dest-video-card-title">{vid.title}</h4>
                <span className="dest-video-card-source">Source: {vid.source || 'Incredible India'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
