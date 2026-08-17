// Simple utility to map geo coordinates to 3D space
// India Bounds roughly:
// Lat: 8 to 37
// Lng: 68 to 97

export const INDIA_CENTER = { lat: 22.5, lng: 82.5 };
const SCALE = 0.65; // Increased from 0.5 for better map presence

export function latLngToVector3(lat, lng, yHeight = 0) {
  // Center coordinates
  const latOffset = lat - INDIA_CENTER.lat;
  const lngOffset = lng - INDIA_CENTER.lng;

  // Simple equirectangular projection
  // X = longitude, Z = -latitude (since Z goes negative into screen)
  const x = lngOffset * SCALE;
  const z = -latOffset * SCALE;

  // Returning an array [x, y, z] to easily pass to Three.js Vector3
  return [x, yHeight, z];
}

// Convert GeoJSON coords to an array of Three.js Vectors
export function extractGeoJsonLines(geojson, yHeight = 0) {
  const lines = [];
  
  if (!geojson || !geojson.geometry) return lines;

  const type = geojson.geometry.type;
  const coordinates = geojson.geometry.coordinates;

  if (type === 'Polygon') {
    coordinates.forEach(ring => {
      const line = ring.map(coord => latLngToVector3(coord[1], coord[0], yHeight));
      lines.push(line);
    });
  } else if (type === 'MultiPolygon') {
    coordinates.forEach(polygon => {
      polygon.forEach(ring => {
        const line = ring.map(coord => latLngToVector3(coord[1], coord[0], yHeight));
        lines.push(line);
      });
    });
  }

  return lines;
}
