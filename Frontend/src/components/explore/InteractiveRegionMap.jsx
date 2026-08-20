import React, { useState } from 'react';
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
    coordinates: { x: '42%', y: '22%' },
    svgPath: 'M 180,30 L 250,20 L 300,50 L 320,110 L 260,160 L 190,140 L 150,90 Z'
  },
  {
    id: 'south-india',
    name: 'South India',
    hindi: 'दक्षिण भारत',
    color: '#10b981',
    states: ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Goa', 'Puducherry'],
    highlights: ['Ancient Gopurams', 'Backwaters', 'Western Ghats', 'Tropical Beaches'],
    coordinates: { x: '48%', y: '75%' },
    svgPath: 'M 160,260 L 240,260 L 260,330 L 210,430 L 160,350 Z'
  },
  {
    id: 'west-india',
    name: 'West India',
    hindi: 'पश्चिम भारत',
    color: '#f59e0b',
    states: ['Maharashtra', 'Gujarat', 'Goa', 'Dadra and Nagar Haveli'],
    highlights: ['Ajanta & Ellora Caves', 'Sahyadri Forts', 'Arabian Sea Coasts', 'Rann of Kutch'],
    coordinates: { x: '25%', y: '48%' },
    svgPath: 'M 90,160 L 180,150 L 190,260 L 130,280 L 80,210 Z'
  },
  {
    id: 'east-india',
    name: 'East India',
    hindi: 'पूर्वी भारत',
    color: '#8b5cf6',
    states: ['West Bengal', 'Odisha', 'Bihar', 'Jharkhand'],
    highlights: ['Puri Jagannath', 'Konark Sun Temple', 'Sundarbans', 'Darjeeling Hills'],
    coordinates: { x: '68%', y: '45%' },
    svgPath: 'M 260,180 L 350,180 L 340,260 L 250,260 Z'
  },
  {
    id: 'central-india',
    name: 'Central India',
    hindi: 'मध्य भारत',
    color: '#ec4899',
    states: ['Madhya Pradesh', 'Chhattisgarh'],
    highlights: ['Khajuraho Temples', 'Tiger Reserves', 'Kanha & Bandhavgarh', 'Narmada Gorges'],
    coordinates: { x: '46%', y: '44%' },
    svgPath: 'M 180,170 L 260,170 L 260,250 L 180,240 Z'
  },
  {
    id: 'northeast-india',
    name: 'Northeast India',
    hindi: 'पूर्वोत्तर भारत',
    color: '#06b6d4',
    states: ['Assam', 'Meghalaya', 'Sikkim', 'Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura'],
    highlights: ['Living Root Bridges', 'Kaziranga Rhinos', 'Tea Valleys', 'Monasteries'],
    coordinates: { x: '82%', y: '28%' },
    svgPath: 'M 350,140 L 440,130 L 460,190 L 360,200 Z'
  }
];

export default function InteractiveRegionMap({ selectedRegion, onSelectRegion, statsByRegion = {} }) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

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
            <svg 
              viewBox="0 0 500 500" 
              className="india-svg-map"
              aria-label="Map of India Macro Regions"
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="grid-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(249, 115, 22, 0.2)" />
                  <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                </linearGradient>
              </defs>

              {/* Decorative Subtle Coordinates Grid */}
              <circle cx="250" cy="250" r="210" fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 8" />
              <circle cx="250" cy="250" r="140" fill="none" stroke="rgba(255,255,255,0.04)" />
              <line x1="250" y1="20" x2="250" y2="480" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
              <line x1="20" y1="250" x2="480" y2="250" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />

              {/* Region Vector Polygons */}
              {REGION_DEFINITIONS.map((r) => {
                const isSelected = selectedRegion === r.id;
                const isHovered = hoveredRegion?.id === r.id;

                return (
                  <g 
                    key={r.id}
                    className="region-group"
                    onMouseEnter={() => setHoveredRegion(r)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => onSelectRegion(r.id)}
                  >
                    <path
                      d={r.svgPath}
                      className={`region-poly ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                      fill={isSelected ? r.color : (isHovered ? `${r.color}cc` : `${r.color}40`)}
                      stroke={isSelected || isHovered ? '#ffffff' : r.color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      filter={isSelected ? 'url(#glow)' : 'none'}
                    />
                  </g>
                );
              })}

              {/* Dynamic Interactive Pin Markers */}
              {REGION_DEFINITIONS.map((r) => {
                const isSelected = selectedRegion === r.id;
                return (
                  <g 
                    key={`pin-${r.id}`}
                    transform={`translate(${r.coordinates.x.replace('%','') * 4.8}, ${r.coordinates.y.replace('%','') * 4.8})`}
                    className="map-marker-pin"
                    onClick={() => onSelectRegion(r.id)}
                  >
                    <circle 
                      r={isSelected ? 14 : 9} 
                      fill={r.color} 
                      className={isSelected ? 'pulse-active' : ''}
                    />
                    <circle r="4" fill="#ffffff" />
                  </g>
                );
              })}
            </svg>
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
