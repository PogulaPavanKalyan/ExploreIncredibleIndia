import * as THREE from 'three';

// Center coordinates for India
export const INDIA_CENTER = { lat: 22.5, lng: 82.5 };
const SCALE = 0.65; // Scale factor mapping lat/lng offset to 3D scene units

/**
 * Standardizes state names for seamless data matching across GeoJSON and destination data
 */
export function normalizeStateName(rawName) {
  if (!rawName) return 'Unknown';
  const nameMap = {
    'Orissa': 'Odisha',
    'Uttaranchal': 'Uttarakhand',
    'Andaman & Nicobar Island': 'Andaman & Nicobar Islands',
    'Andaman and Nicobar': 'Andaman & Nicobar Islands',
    'Arunanchal Pradesh': 'Arunachal Pradesh',
    'Dadara & Nagar Havelli': 'Dadra & Nagar Haveli',
    'Dadra and Nagar Haveli': 'Dadra & Nagar Haveli',
    'Daman and Diu': 'Daman & Diu',
    'Jammu and Kashmir': 'Jammu & Kashmir',
    'NCT of Delhi': 'Delhi',
  };
  return nameMap[rawName] || rawName;
}

/**
 * Converts latitude and longitude coordinates into a 3D Vector3 position [x, y, z]
 */
export function latLngToVector3(lat, lng, yHeight = 0) {
  const numLat = typeof lat === 'number' ? (isNaN(lat) ? INDIA_CENTER.lat : lat) : (parseFloat(lat) || INDIA_CENTER.lat);
  const numLng = typeof lng === 'number' ? (isNaN(lng) ? INDIA_CENTER.lng : lng) : (parseFloat(lng) || INDIA_CENTER.lng);

  const latOffset = numLat - INDIA_CENTER.lat;
  const lngOffset = numLng - INDIA_CENTER.lng;

  const x = lngOffset * SCALE;
  const z = -latOffset * SCALE;

  return [x, yHeight, z];
}

/**
 * Extracts 3D line points from GeoJSON coordinates, filtering out internal shared district borders for MultiPolygons
 */
export function extractGeoJsonLines(geojson, yHeight = 0) {
  const lines = [];
  if (!geojson) return lines;

  if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
    geojson.features.forEach(feature => {
      lines.push(...extractGeoJsonLines(feature, yHeight));
    });
    return lines;
  }

  const geometry = geojson.geometry || geojson;
  if (!geometry || !geometry.type) return lines;

  const type = geometry.type;
  const coordinates = geometry.coordinates;

  if (type === 'Polygon') {
    coordinates.forEach(ring => {
      const segmentLine = [];
      for (let i = 0; i < ring.length - 1; i++) {
        segmentLine.push(
          latLngToVector3(ring[i][1], ring[i][0], yHeight),
          latLngToVector3(ring[i + 1][1], ring[i + 1][0], yHeight)
        );
      }
      lines.push(segmentLine);
    });
  } else if (type === 'MultiPolygon') {
    if (coordinates.length === 1) {
      coordinates[0].forEach(ring => {
        const segmentLine = [];
        for (let i = 0; i < ring.length - 1; i++) {
          segmentLine.push(
            latLngToVector3(ring[i][1], ring[i][0], yHeight),
            latLngToVector3(ring[i + 1][1], ring[i + 1][0], yHeight)
          );
        }
        lines.push(segmentLine);
      });
    } else {
      // Filter out internal shared district borders for MultiPolygon state features (e.g. AP, TS)
      const pKey = p => p[0].toFixed(4) + ',' + p[1].toFixed(4);
      const edgeCount = new Map();
      const edgePoints = new Map();

      coordinates.forEach(poly => {
        poly.forEach(ring => {
          for (let i = 0; i < ring.length - 1; i++) {
            const k1 = pKey(ring[i]);
            const k2 = pKey(ring[i + 1]);
            if (k1 === k2) continue;

            const edgeKey = k1 < k2 ? (k1 + '|' + k2) : (k2 + '|' + k1);
            edgeCount.set(edgeKey, (edgeCount.get(edgeKey) || 0) + 1);
            if (!edgePoints.has(edgeKey)) {
              edgePoints.set(edgeKey, [ring[i], ring[i + 1]]);
            }
          }
        });
      });

      const segmentLine = [];
      edgeCount.forEach((count, edgeKey) => {
        // Keep ONLY outer boundary edges that appear exactly ONCE
        if (count === 1) {
          const [p1, p2] = edgePoints.get(edgeKey);
          segmentLine.push(
            latLngToVector3(p1[1], p1[0], yHeight),
            latLngToVector3(p2[1], p2[0], yHeight)
          );
        }
      });
      if (segmentLine.length > 0) {
        lines.push(segmentLine);
      }
    }
  }

  return lines;
}

/**
 * Converts GeoJSON polygons into THREE.Shape objects for 3D extrusion/mesh rendering
 */
export function extractGeoJsonShapes(geojson) {
  const shapes = [];
  if (!geojson) return shapes;

  const processPolygon = (coordinates) => {
    const outerRing = coordinates[0];
    if (!outerRing || outerRing.length < 3) return;

    const shape = new THREE.Shape();
    outerRing.forEach((coord, index) => {
      const lat = coord[1];
      const lng = coord[0];
      const x = (lng - INDIA_CENTER.lng) * SCALE;
      const y = (lat - INDIA_CENTER.lat) * SCALE; // Maps to +Y in 2D shape space

      if (index === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    });

    // Handle holes if any
    for (let i = 1; i < coordinates.length; i++) {
      const holeRing = coordinates[i];
      if (holeRing.length < 3) continue;
      const holePath = new THREE.Path();
      holeRing.forEach((coord, index) => {
        const lat = coord[1];
        const lng = coord[0];
        const x = (lng - INDIA_CENTER.lng) * SCALE;
        const y = (lat - INDIA_CENTER.lat) * SCALE;

        if (index === 0) {
          holePath.moveTo(x, y);
        } else {
          holePath.lineTo(x, y);
        }
      });
      shape.holes.push(holePath);
    }

    shapes.push(shape);
  };

  const geometry = geojson.geometry || geojson;
  if (!geometry) return shapes;

  if (geometry.type === 'Polygon') {
    processPolygon(geometry.coordinates);
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates.forEach(polygonCoords => {
      processPolygon(polygonCoords);
    });
  }

  return shapes;
}

/**
 * Extracts structured state items from a state-level FeatureCollection
 */
export function extractStateFeatures(geojson) {
  if (!geojson) return [];
  
  const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
  if (!Array.isArray(features)) return [];

  return features.map((feature, idx) => {
    const props = feature.properties || {};
    const rawName = props.NAME_1 || props.ST_NM || props.name || props.state_name || `State ${idx + 1}`;
    const name = normalizeStateName(rawName);
    const id = props.ID_1 || feature.id || props.state_code || props.id || `state-${idx}`;
    const region = props.region || 'India';
    
    const shapes = extractGeoJsonShapes(feature);
    const borderLines = extractGeoJsonLines(feature, 0.25); // Elevate line geometry ABOVE top surface (0.20) so internal state borders are 100% visible!

    // Calculate bounding box center lat/lng for accurate label positioning
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    let pointCount = 0;
    const geometry = feature.geometry || feature;
    
    if (geometry && geometry.coordinates) {
      const coords = geometry.type === 'Polygon' ? [geometry.coordinates] : 
                     geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
      
      coords.forEach(poly => {
        poly.forEach(ring => {
          ring.forEach(pt => {
            const lng = pt[0];
            const lat = pt[1];
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
            pointCount++;
          });
        });
      });
    }

    const centerLat = pointCount > 0 ? (minLat + maxLat) / 2 : 22.5;
    const centerLng = pointCount > 0 ? (minLng + maxLng) / 2 : 82.5;
    const centerPos = latLngToVector3(centerLat, centerLng, 0.4);

    return {
      id,
      name,
      rawName,
      region,
      shapes,
      borderLines,
      centerLat,
      centerLng,
      centerPos
    };
  });
}

/**
 * Extracts structured district items for a specific state from district-level GeoJSON
 */
export function extractDistrictFeatures(districtGeoJson, targetStateName) {
  if (!districtGeoJson || !targetStateName) return [];
  const features = districtGeoJson.type === 'FeatureCollection' ? districtGeoJson.features : [districtGeoJson];
  if (!Array.isArray(features)) return [];

  const normalizedTarget = normalizeStateName(targetStateName).toLowerCase();

  const stateDistricts = features.filter(f => {
    const props = f.properties || {};
    const stName = props.NAME_1 || props.ST_NM || props.state_name || props.state || '';
    const normName = normalizeStateName(stName).toLowerCase();
    return normName === normalizedTarget || normName.includes(normalizedTarget) || normalizedTarget.includes(normName);
  });

  return stateDistricts.map((feature, idx) => {
    const props = feature.properties || {};
    const districtName = props.NAME_2 || props.DISTRICT || props.district || props.dist_name || `District ${idx + 1}`;
    const id = props.ID_2 || props.district_code || feature.id || `dist-${idx}`;

    const shapes = extractGeoJsonShapes(feature);
    const borderLines = extractGeoJsonLines(feature, 0.26);

    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    let pointCount = 0;
    const geometry = feature.geometry || feature;

    if (geometry && geometry.coordinates) {
      const coords = geometry.type === 'Polygon' ? [geometry.coordinates] : 
                     geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
      coords.forEach(poly => {
        poly.forEach(ring => {
          ring.forEach(pt => {
            const lng = pt[0], lat = pt[1];
            if (lng < minLng) minLng = lng;
            if (lng > maxLng) maxLng = lng;
            if (lat < minLat) minLat = lat;
            if (lat > maxLat) maxLat = lat;
            pointCount++;
          });
        });
      });
    }

    const centerLat = pointCount > 0 ? (minLat + maxLat) / 2 : 22.5;
    const centerLng = pointCount > 0 ? (minLng + maxLng) / 2 : 82.5;
    const centerPos = latLngToVector3(centerLat, centerLng, 0.42);

    return {
      id,
      name: districtName,
      shapes,
      borderLines,
      centerLat,
      centerLng,
      centerPos
    };
  });
}
