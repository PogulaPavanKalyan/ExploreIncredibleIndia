import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import DestinationImage from '../common/DestinationImage';
import { buildMediaUrl } from '../../utils/imageUtils';

export default function DestinationGallerySection({ destination }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!destination) return null;

  // Extract all unique images
  const rawImages = [];
  if (destination.main_image) {
    rawImages.push({
      url: destination.main_image,
      caption: `${destination.name} - Landmark View`,
      credit: destination.source_name || "Official Photography"
    });
  }

  if (destination.images && Array.isArray(destination.images)) {
    destination.images.forEach(img => {
      const imgUrl = typeof img === 'string' ? img : (img.image || img.image_url || img.url);
      if (imgUrl && !rawImages.some(r => r.url === imgUrl)) {
        rawImages.push({
          url: imgUrl,
          caption: img.caption || img.alt_text || `${destination.name} Experience`,
          credit: img.photographer || img.credit || destination.source_name || "Dekho Bharat Archives"
        });
      }
    });
  }

  // If no extra images, provide at least the primary destination representation
  if (rawImages.length === 0) {
    rawImages.push({
      url: destination.main_image || '',
      caption: `${destination.name} - Incredible India`,
      credit: "Dekho Bharat Archives"
    });
  }

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : rawImages.length - 1));
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < rawImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="details-card destination-gallery-section" id="gallery" style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF6B1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Visual Atlas
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={24} color="#FF6B1A" /> Real Destination Photography
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
          {rawImages.length} High-Res {rawImages.length === 1 ? 'Photo' : 'Photos'}
        </span>
      </div>

      {/* Editorial Responsive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        {rawImages.slice(0, 8).map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: idx === 0 ? '300px' : '220px',
              gridColumn: idx === 0 ? 'span 2' : 'span 1',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}
            className="gallery-thumb-wrap"
          >
            <DestinationImage
              destination={destination}
              src={img.url}
              alt={img.caption}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0) 50%)',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#ffffff', fontSize: '0.82rem', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                  {img.caption}
                </span>
                <span style={{ color: '#ffffff', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                  <Maximize2 size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(5, 10, 20, 0.95)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <X size={24} />
          </button>

          {/* Left Arrow */}
          {rawImages.length > 1 && (
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                left: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronLeft size={30} />
            </button>
          )}

          {/* Main Photo Display */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '1100px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{ maxHeight: '72vh', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <DestinationImage
                destination={destination}
                src={rawImages[lightboxIndex].url}
                alt={rawImages[lightboxIndex].caption}
                style={{
                  maxHeight: '72vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                }}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#ffffff' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {rawImages[lightboxIndex].caption}
              </h4>
              <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.82rem' }}>
                Photo {lightboxIndex + 1} of {rawImages.length} • {rawImages[lightboxIndex].credit}
              </p>
            </div>
          </div>

          {/* Right Arrow */}
          {rawImages.length > 1 && (
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronRight size={30} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
