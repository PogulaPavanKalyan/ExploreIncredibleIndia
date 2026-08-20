import React, { useState, useEffect } from 'react';
import { getDestinationPrimaryImage, getDestinationPlaceholder, handleImageError, buildMediaUrl } from '../../utils/imageUtils';

export default function DestinationImage({
  destination,
  src,
  alt,
  className = '',
  loading = 'lazy',
  style = {},
  fallbackName = 'Destination',
  ...props
}) {
  const destName = destination?.name || fallbackName;
  const initialSrc = src 
    ? buildMediaUrl(src)
    : (destination ? getDestinationPrimaryImage(destination) : getDestinationPlaceholder(destName));

  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextSrc = src 
      ? buildMediaUrl(src)
      : (destination ? getDestinationPrimaryImage(destination) : getDestinationPlaceholder(destName));
    setCurrentSrc(nextSrc);
    setHasError(false);
  }, [src, destination?.id, destination?.main_image, destination?.slug]);

  const onError = (e) => {
    if (!hasError) {
      if (import.meta.env.DEV) {
        console.warn(`[DestinationImage Fallback] Failed image for "${destName}":`, currentSrc);
      }
      setHasError(true);
      const fallback = getDestinationPlaceholder(destName);
      setCurrentSrc(fallback);
      if (e?.target) {
        e.target.onerror = null;
        e.target.src = fallback;
      }
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt || `${destName} - Dekho Bharat`}
      className={`destination-media-image ${className}`}
      loading={loading}
      onError={onError}
      style={{
        objectFit: 'cover',
        display: 'block',
        width: '100%',
        ...style
      }}
      {...props}
    />
  );
}
