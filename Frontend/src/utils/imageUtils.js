const BACKEND_URL = 'http://127.0.0.1:8000';

/**
 * Builds full media URL for relative Django upload paths or absolute URLs.
 */
export function buildMediaUrl(imagePath) {
  if (!imagePath) return '';
  if (typeof imagePath !== 'string') return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  return `${BACKEND_URL}/${imagePath}`;
}

/**
 * Generates a clean, destination-specific SVG placeholder data URI.
 * Guarantees zero cross-destination image leakage.
 */
export function getDestinationPlaceholder(destinationName = 'Destination') {
  const cleanName = destinationName.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#334155" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    <circle cx="300" cy="170" r="45" fill="#FF6B35" opacity="0.15" />
    <path d="M300 140 L310 165 L335 170 L315 188 L320 213 L300 200 L280 213 L285 188 L265 170 L290 165 Z" fill="#FF6B35" />
    <text x="300" y="245" font-family="sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${cleanName}</text>
    <text x="300" y="275" font-family="sans-serif" font-size="14" font-weight="600" fill="#FFB703" text-anchor="middle">Image Coming Soon • Incredible India</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Returns primary destination image URL or location-specific fallback.
 */
export function getDestinationPrimaryImage(destination) {
  if (!destination) return getDestinationPlaceholder();

  const name = destination.name || 'Tourist Place';

  // 1. Search in images array for is_primary = true
  if (Array.isArray(destination.images) && destination.images.length > 0) {
    const primaryObj = destination.images.find(img => img.is_primary);
    if (primaryObj) {
      const raw = primaryObj.image || primaryObj.image_url;
      if (raw) return buildMediaUrl(raw);
    }
    // 2. Fall back to first image in array
    const firstObj = destination.images[0];
    const firstRaw = typeof firstObj === 'string' ? firstObj : (firstObj?.image || firstObj?.image_url);
    if (firstRaw) return buildMediaUrl(firstRaw);
  }

  // 3. Fall back to main_image or image property
  const mainProp = destination.main_image || destination.image || destination.heroImage;
  if (mainProp && typeof mainProp === 'string') {
    return buildMediaUrl(mainProp);
  }

  // 4. Return location-specific placeholder
  return getDestinationPlaceholder(name);
}

/**
 * Image error handler preventing broken image icons and logging failed URLs during development.
 */
export function handleImageError(event, destinationName = 'Destination', originalUrl = '') {
  if (event && event.target) {
    const failedSrc = originalUrl || event.target.src;
    console.warn(`FAILED DESTINATION IMAGE:\n${failedSrc}`);
    event.target.onerror = null; // Prevent infinite error loops
    event.target.src = getDestinationPlaceholder(destinationName);
  }
}

