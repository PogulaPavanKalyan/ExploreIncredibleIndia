/**
 * Centralized Image URL Resolver & Error Handler
 * Resolves local media paths, external URLs, and provides fallback SVGs/placeholders.
 */

const BACKEND_URL = 'http://127.0.0.1:8000';

export const FALLBACK_DESTINATION_IMAGE = '/images/placeholders/destination.jpg';

/**
 * Resolves a full, safe URL from an image path or external URL.
 */
export function getImageUrl(imagePath, fallback = '') {
  if (!imagePath) return fallback;
  if (typeof imagePath !== 'string') return fallback;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  return `${BACKEND_URL}/${imagePath}`;
}

/**
 * Generates an accessible, clean SVG fallback data URL.
 */
export function getFallbackPlaceholder(name = 'Incredible India') {
  const safeName = String(name).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#334155" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bgGrad)" />
    <circle cx="300" cy="170" r="44" fill="#FF6B35" opacity="0.2" />
    <path d="M300 140 L310 165 L335 170 L315 188 L320 213 L300 200 L280 213 L285 188 L265 170 L290 165 Z" fill="#FF6B35" />
    <text x="300" y="245" font-family="sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${safeName}</text>
    <text x="300" y="275" font-family="sans-serif" font-size="13" font-weight="600" fill="#FFB703" text-anchor="middle">Dekho Bharat • Incredible India</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Resolves the primary image URL for a destination model or JSON payload.
 */
export function getDestinationImageUrl(destination) {
  if (!destination) return getFallbackPlaceholder('Destination');

  const destName = destination.name || 'Destination';

  // 1. Array of images with is_primary
  if (Array.isArray(destination.images) && destination.images.length > 0) {
    const primary = destination.images.find(img => img.is_primary);
    if (primary) {
      const pUrl = primary.image || primary.image_url;
      if (pUrl) return getImageUrl(pUrl);
    }
    const first = destination.images[0];
    const fUrl = typeof first === 'string' ? first : (first?.image || first?.image_url);
    if (fUrl) return getImageUrl(fUrl);
  }

  // 2. Direct properties: main_image, image, heroImage
  const directImg = destination.main_image || destination.image || destination.heroImage;
  if (directImg && typeof directImg === 'string') {
    return getImageUrl(directImg);
  }

  return getFallbackPlaceholder(destName);
}

/**
 * Unified image error handler with non-intrusive warning log.
 */
export function handleDestinationImageError(e, destinationName = 'Destination', originalUrl = '') {
  if (e && e.target) {
    const failedUrl = originalUrl || e.target.src;
    console.warn('FAILED DESTINATION IMAGE:', failedUrl);
    e.target.onerror = null;
    e.target.src = getFallbackPlaceholder(destinationName);
  }
}

export default {
  getImageUrl,
  getDestinationImageUrl,
  getFallbackPlaceholder,
  handleDestinationImageError,
  FALLBACK_DESTINATION_IMAGE,
};
