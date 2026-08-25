import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Sparkles, ArrowRight, Layers } from 'lucide-react';
import './InteractiveRegionMap.css';

const REGION_DEFINITIONS = [
  {
    id: 'north-india',
    name: 'North India',
    hindi: 'उत्तर भारत',
    color: '#3b82f6',
    states: ['Jammu and Kashmir', 'Ladakh', 'Himachal Pradesh', 'Uttarakhand', 'Punjab', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Rajasthan'],
    highlights: ['Himalayan Peaks', 'Ganga Ghats', 'Royal Palaces', 'Snow Treks'],
    pin: { cx: 200, cy: 110 }
  },
  {
    id: 'south-india',
    name: 'South India',
    hindi: 'दक्षिण भारत',
    color: '#10b981',
    states: ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Goa', 'Puducherry'],
    highlights: ['Ancient Gopurams', 'Backwaters', 'Western Ghats', 'Tropical Beaches'],
    pin: { cx: 180, cy: 350 }
  },
  {
    id: 'west-india',
    name: 'West India',
    hindi: 'पश्चिम भारत',
    color: '#f59e0b',
    states: ['Maharashtra', 'Gujarat', 'Goa', 'Dadra and Nagar Haveli'],
    highlights: ['Ajanta & Ellora Caves', 'Sahyadri Forts', 'Arabian Sea Coasts', 'Rann of Kutch'],
    pin: { cx: 110, cy: 230 }
  },
  {
    id: 'east-india',
    name: 'East India',
    hindi: 'पूर्वी भारत',
    color: '#8b5cf6',
    states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
    highlights: ['Puri Jagannath', 'Konark Sun Temple', 'Sundarbans', 'Darjeeling Hills'],
    pin: { cx: 310, cy: 240 }
  },
  {
    id: 'central-india',
    name: 'Central India',
    hindi: 'मध्य भारत',
    color: '#ec4899',
    states: ['Madhya Pradesh', 'Chhattisgarh'],
    highlights: ['Khajuraho Temples', 'Tiger Reserves', 'Kanha & Bandhavgarh', 'Narmada Gorges'],
    pin: { cx: 210, cy: 240 }
  },
  {
    id: 'northeast-india',
    name: 'Northeast India',
    hindi: 'पूर्वोत्तर भारत',
    color: '#06b6d4',
    states: ['Assam', 'Meghalaya', 'Sikkim', 'Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'],
    highlights: ['Living Root Bridges', 'Kaziranga Rhinos', 'Tea Valleys', 'Monasteries'],
    pin: { cx: 410, cy: 160 }
  }
];

const STATE_TO_REGION = {
  // North India
  'Jammu & Kashmir': 'north-india',
  'Jammu and Kashmir': 'north-india',
  'Ladakh': 'north-india',
  'Himachal Pradesh': 'north-india',
  'Uttarakhand': 'north-india',
  'Uttaranchal': 'north-india',
  'Punjab': 'north-india',
  'Haryana': 'north-india',
  'Delhi': 'north-india',
  'NCT of Delhi': 'north-india',
  'Uttar Pradesh': 'north-india',
  'Rajasthan': 'north-india',
  'Chandigarh': 'north-india',

  // South India
  'Andhra Pradesh': 'south-india',
  'Telangana': 'south-india',
  'Karnataka': 'south-india',
  'Tamil Nadu': 'south-india',
  'Kerala': 'south-india',
  'Goa': 'south-india',
  'Puducherry': 'south-india',
  'Pondicherry': 'south-india',
  'Lakshadweep': 'south-india',
  'Andaman & Nicobar Island': 'south-india',
  'Andaman & Nicobar Islands': 'south-india',
  'Andaman and Nicobar': 'south-india',

  // West India
  'Maharashtra': 'west-india',
  'Gujarat': 'west-india',
  'Dadra & Nagar Haveli': 'west-india',
  'Dadra and Nagar Haveli': 'west-india',
  'Dadara & Nagar Havelli': 'west-india',
  'Daman and Diu': 'west-india',
  'Daman & Diu': 'west-india',

  // East India
  'West Bengal': 'east-india',
  'Odisha': 'east-india',
  'Orissa': 'east-india',
  'Bihar': 'east-india',
  'Jharkhand': 'east-india',

  // Central India
  'Madhya Pradesh': 'central-india',
  'Chhattisgarh': 'central-india',

  // Northeast India
  'Assam': 'northeast-india',
  'Meghalaya': 'northeast-india',
  'Sikkim': 'northeast-india',
  'Arunachal Pradesh': 'northeast-india',
  'Arunanchal Pradesh': 'northeast-india',
  'Nagaland': 'northeast-india',
  'Manipur': 'northeast-india',
  'Mizoram': 'northeast-india',
  'Tripura': 'northeast-india',
};

// Projection logic mapping lat/lng to 500x480 SVG space
const MIN_LNG = 68.0;
const MAX_LNG = 97.5;
const MIN_LAT = 6.8;
const MAX_LAT = 37.5;

function projectLngLat(lng, lat) {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 430 + 30;
  const y = 450 - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 410;
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

export default function InteractiveRegionMap({ selectedRegion, onSelectRegion, statsByRegion = {} }) {
  const [geoFeatures, setGeoFeatures] = useState([]);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/india_states.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.features) {
          const features = data.features.map((f, idx) => {
            const rawName = f.properties.ST_NM || f.properties.NAME_1 || '';
            const regionId = STATE_TO_REGION[rawName] || 'north-india';
            const { fillD, strokeD } = geometryToOuterPath(f.geometry);
            return {
              id: `feature-${idx}`,
              name: rawName,
              regionId,
              fillD,
              strokeD
            };
          });
          setGeoFeatures(features);
        }
      })
      .catch(err => console.error("Error loading India GeoJSON for region map:", err))
      .finally(() => setLoading(false));
  }, []);

  const activeRegion = hoveredRegion || REGION_DEFINITIONS.find(r => r.id === selectedRegion) || REGION_DEFINITIONS[1];

  return (
    <div className="interactive-map-wrapper">
      <div className="map-glass-card">
        
        {/* Header Bar */}
        <div className="map-card-header">
          <div className="header-left">
            <span className="map-badge">
              <Compass className="w-4 h-4 animate-spin-slow" /> Interactive India Map
            </span>
            <h3 className="map-title">Explore by Macro Regions</h3>
          </div>
          <p className="map-subtitle">
            Click any region to filter states and discover verified Indian destinations.
          </p>
        </div>

        {/* Mobile / Tablet Touch Pill Bar */}
        <div className="mobile-region-chips">
          {REGION_DEFINITIONS.map((r) => {
            const isSelected = selectedRegion === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id)}
                className={`region-chip-btn ${isSelected ? 'active' : ''}`}
                style={{
                  '--region-accent': r.color
                }}
              >
                <span className="chip-dot" style={{ backgroundColor: r.color }} />
                <span className="chip-text">{r.name}</span>
                {statsByRegion[r.id] !== undefined && (
                  <span className="chip-count">{statsByRegion[r.id]}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Split View: Vector Visual on Left + Interactive Intelligence Panel on Right */}
        <div className="map-desktop-grid">
          
          {/* Visual Interactive Map Area */}
          <div className="svg-map-container">
            {loading ? (
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600, padding: '2rem' }}>
                Loading Macro Region Map...
              </div>
            ) : (
              <svg 
                viewBox="0 0 500 480" 
                className="india-svg-map"
                aria-label="Map of India Macro Regions"
              >
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Decorative Grid Circles */}
                <circle cx="250" cy="240" r="210" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 8" />
                <circle cx="250" cy="240" r="140" fill="none" stroke="rgba(255,255,255,0.04)" />
                <line x1="250" y1="20" x2="250" y2="460" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
                <line x1="20" y1="240" x2="480" y2="240" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />

                {/* Real India GeoJSON State Vectors Color-Coded by Region */}
                {geoFeatures.map((f) => {
                  const regDef = REGION_DEFINITIONS.find(r => r.id === f.regionId);
                  const regColor = regDef ? regDef.color : '#3b82f6';
                  const isSelected = selectedRegion === f.regionId;
                  const isHovered = hoveredRegion?.id === f.regionId;

                  return (
                    <g
                      key={f.id}
                      className={`region-poly ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                      onMouseEnter={() => regDef && setHoveredRegion(regDef)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => onSelectRegion(f.regionId)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* State Fill */}
                      <path
                        d={f.fillD}
                        fill={isSelected ? regColor : (isHovered ? `${regColor}dd` : `${regColor}40`)}
                        stroke="none"
                      />
                      {/* Outer Boundary Perimeter Stroke (No District Lines!) */}
                      <path
                        d={f.strokeD}
                        fill="none"
                        stroke={isSelected || isHovered ? '#ffffff' : regColor}
                        strokeWidth={isSelected ? 1.8 : (isHovered ? 1.5 : 0.75)}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter={isSelected ? 'url(#glow)' : 'none'}
                      />
                      <title>{f.name} ({regDef?.name})</title>
                    </g>
                  );
                })}

                {/* Dynamic Region Center Marker Pins */}
                {REGION_DEFINITIONS.map((r) => {
                  const isSelected = selectedRegion === r.id;
                  const isHovered = hoveredRegion?.id === r.id;
                  return (
                    <g 
                      key={`pin-${r.id}`}
                      transform={`translate(${r.pin.cx}, ${r.pin.cy})`}
                      className="map-marker-pin"
                      onMouseEnter={() => setHoveredRegion(r)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => onSelectRegion(r.id)}
                    >
                      <circle 
                        r={isSelected || isHovered ? 12 : 8} 
                        fill={r.color} 
                        stroke="#ffffff"
                        strokeWidth={1.8}
                        className={isSelected ? 'pulse-active' : ''}
                      />
                      <circle r="3.5" fill="#ffffff" />
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          {/* Region Intelligence Detail Panel */}
          <div className="region-intel-panel">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRegion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="intel-card"
                style={{ borderLeftColor: activeRegion.color }}
              >
                <div className="intel-top">
                  <div className="intel-title-box">
                    <span className="hindi-badge">{activeRegion.hindi}</span>
                    <h4 className="intel-title">{activeRegion.name}</h4>
                  </div>
                  {statsByRegion[activeRegion.id] !== undefined && (
                    <div className="intel-count-badge">
                      <Layers className="w-4 h-4 text-orange-400" />
                      <span>{statsByRegion[activeRegion.id]} Places</span>
                    </div>
                  )}
                </div>

                <div className="intel-highlights">
                  <span className="section-label">KEY EXPERIENCES:</span>
                  <div className="highlights-tags">
                    {activeRegion.highlights.map((h, i) => (
                      <span key={i} className="highlight-tag">
                        <Sparkles className="w-3 h-3 text-amber-400" /> {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="intel-states">
                  <span className="section-label">INCLUDED STATES & UTs:</span>
                  <div className="states-wrap">
                    {activeRegion.states.map((st, i) => (
                      <span key={i} className="state-micro-pill">
                        <MapPin className="w-3 h-3 text-slate-400" /> {st}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectRegion(activeRegion.id)}
                  className="explore-region-cta"
                  style={{ background: `linear-gradient(135deg, ${activeRegion.color}, #f97316)` }}
                >
                  <span>Explore {activeRegion.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
