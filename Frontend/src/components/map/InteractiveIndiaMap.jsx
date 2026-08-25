import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { getStates } from '../../services/stateService';
import StateMapCard from './StateMapCard';
import '../../styles/india-map.css';

// Projection parameters for India bounding box
const MIN_LNG = 68.0;
const MAX_LNG = 97.5;
const MIN_LAT = 6.8;
const MAX_LAT = 37.5;
const MAP_WIDTH = 800;
const MAP_HEIGHT = 700;

function projectLngLat(lng, lat) {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 720 + 40;
  const y = 670 - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 620;
  return [parseFloat(x.toFixed(1)), parseFloat(y.toFixed(1))];
}

function convertRingToSvgPath(ring) {
  if (!ring || ring.length === 0) return '';
  return ring.map((pt, i) => {
    const [x, y] = projectLngLat(pt[0], pt[1]);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ' Z';
}

function getEdgeKey(p1, p2) {
  const k1 = `${p1[0].toFixed(3)},${p1[1].toFixed(3)}`;
  const k2 = `${p2[0].toFixed(3)},${p2[1].toFixed(3)}`;
  return k1 < k2 ? `${k1}|${k2}` : `${k2}|${k1}`;
}

function geometryToOuterPath(geometry) {
  if (!geometry || !geometry.coordinates) return { fillD: '', strokeD: '' };
  
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  const edgeCounts = new Map();
  const edgeSegments = [];

  polys.forEach((poly) => {
    const ring = poly[0];
    if (!ring || ring.length < 3) return;
    for (let i = 0; i < ring.length - 1; i++) {
      const p1 = ring[i];
      const p2 = ring[i + 1];
      const key = getEdgeKey(p1, p2);
      edgeCounts.set(key, (edgeCounts.get(key) || 0) + 1);
      edgeSegments.push({ p1, p2, key });
    }
  });

  const outerLines = [];
  edgeSegments.forEach(({ p1, p2, key }) => {
    if (edgeCounts.get(key) === 1) {
      const [x1, y1] = projectLngLat(p1[0], p1[1]);
      const [x2, y2] = projectLngLat(p2[0], p2[1]);
      outerLines.push(`M ${x1} ${y1} L ${x2} ${y2}`);
    }
  });

  const fillD = polys.map(poly => convertRingToSvgPath(poly[0])).join(' ');
  const strokeD = outerLines.join(' ');

  return { fillD, strokeD };
}

function calculateCentroid(geometry) {
  let sumX = 0, sumY = 0, count = 0;
  const processRing = (ring) => {
    ring.forEach(pt => {
      const [x, y] = projectLngLat(pt[0], pt[1]);
      sumX += x;
      sumY += y;
      count++;
    });
  };

  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach(processRing);
  } else if (geometry.type === 'MultiPolygon') {
    let largestRing = [];
    geometry.coordinates.forEach(poly => {
      if (poly[0] && poly[0].length > largestRing.length) {
        largestRing = poly[0];
      }
    });
    processRing(largestRing);
  }

  if (count === 0) return { x: 400, y: 350 };
  return { x: parseFloat((sumX / count).toFixed(1)), y: parseFloat((sumY / count).toFixed(1)) };
}

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function InteractiveIndiaMap() {
  const navigate = useNavigate();
  const [geoStates, setGeoStates] = useState([]);
  const [apiStates, setApiStates] = useState({});
  const [activeState, setActiveState] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load GeoJSON map data for India
  useEffect(() => {
    fetch('/india_states.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          const parsed = data.features.map((feature, idx) => {
            const name = feature.properties.ST_NM || feature.properties.NAME_1 || `State ${idx}`;
            const slug = slugify(name);
            const { fillD, strokeD } = geometryToOuterPath(feature.geometry);
            const centroid = calculateCentroid(feature.geometry);
            return {
              id: slug || `state-${idx}`,
              name,
              slug,
              fillD,
              strokeD,
              cx: centroid.x,
              cy: centroid.y
            };
          });
          setGeoStates(parsed);
        }
      })
      .catch(err => console.error("Error loading India GeoJSON map:", err))
      .finally(() => setLoading(false));
  }, []);

  // Load state stats from API
  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await getStates({ page_size: 50 });
        if (res.data) {
          const mapData = {};
          res.data.forEach(s => {
            mapData[s.slug] = s;
          });
          setApiStates(mapData);
        }
      } catch (err) {
        console.warn("Could not load dynamic map states from API:", err);
      }
    };
    loadStates();
  }, []);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setActiveState(null);
    setSearchQuery('');
  };

  const handleStateClick = (stateSlug) => {
    navigate(`/explore?state=${stateSlug}`);
  };

  const handleStateHover = (st) => {
    const apiData = apiStates[st.slug] || {
      name: st.name,
      slug: st.slug,
      destinations_count: 5,
      capital: 'Capital City'
    };
    setActiveState(apiData);
  };

  const filteredStates = useMemo(() => {
    return geoStates.map(st => {
      const isMatched = searchQuery
        ? st.name.toLowerCase().includes(searchQuery.toLowerCase())
        : false;
      return { ...st, isMatched };
    });
  }, [geoStates, searchQuery]);

  return (
    <div className="india-map-wrapper">
      {/* Map Toolbar */}
      <div className="map-toolbar">
        <div className="map-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search state on map (e.g. Goa, Kerala)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="map-controls-group">
          <button className="btn-map-control" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button className="btn-map-control" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button className="btn-map-control" onClick={handleResetZoom} title="Reset View">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* SVG Viewport */}
      <div className="map-viewport">
        {loading ? (
          <div style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>
            Loading Vector Map...
          </div>
        ) : (
          <svg
            viewBox="0 0 800 700"
            className="india-svg-map"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {filteredStates.map((st) => {
              const isSelected = activeState?.slug === st.slug;
              return (
                <g
                  key={st.id}
                  className={`state-path-group ${isSelected ? 'selected' : ''} ${st.isMatched ? 'highlighted' : ''}`}
                  onMouseEnter={() => handleStateHover(st)}
                  onClick={() => handleStateClick(st.slug)}
                  style={{ cursor: 'pointer' }}
                >
                  <path d={st.fillD} className="state-fill-path" />
                  <path d={st.strokeD} className="state-path" />
                  <title>{st.name}</title>
                </g>
              );
            })}

            {/* Floating Marker Pins for States */}
            {filteredStates.map((st) => {
              if (!st.cx || !st.cy || isNaN(st.cx) || isNaN(st.cy)) return null;
              const isSelected = activeState?.slug === st.slug;
              return (
                <g key={`node-group-${st.id}`} onClick={() => handleStateClick(st.slug)} style={{ cursor: 'pointer' }}>
                  <circle
                    cx={st.cx}
                    cy={st.cy}
                    r={isSelected ? 7 : 4}
                    fill={isSelected ? '#FFB703' : '#FF6B35'}
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                    style={{ transition: 'all 0.2s ease' }}
                    onMouseEnter={() => handleStateHover(st)}
                  />
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover Info Card */}
        <StateMapCard state={activeState} onClose={() => setActiveState(null)} />
      </div>
    </div>
  );
}
