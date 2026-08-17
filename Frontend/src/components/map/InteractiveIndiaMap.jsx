import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ZoomIn, ZoomOut, RotateCcw, MapPin, Compass, Sparkles } from 'lucide-react';
import { getStates } from '../../services/stateService';
import StateMapCard from './StateMapCard';

// Comprehensive Vector Path definitions for Indian States & UTs
const STATE_PATHS = [
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', slug: 'andhra-pradesh', d: 'M 480 340 L 530 350 L 510 420 L 460 410 L 440 370 Z' },
  { id: 'telangana', name: 'Telangana', slug: 'telangana', d: 'M 440 320 L 490 310 L 510 350 L 450 360 Z' },
  { id: 'rajasthan', name: 'Rajasthan', slug: 'rajasthan', d: 'M 220 160 L 320 150 L 330 240 L 230 250 L 190 200 Z' },
  { id: 'gujarat', name: 'Gujarat', slug: 'gujarat', d: 'M 160 240 L 230 250 L 220 310 L 150 300 L 140 270 Z' },
  { id: 'maharashtra', name: 'Maharashtra', slug: 'maharashtra', d: 'M 250 280 L 410 270 L 440 340 L 280 350 Z' },
  { id: 'goa', name: 'Goa', slug: 'goa', d: 'M 280 360 L 310 360 L 300 380 L 280 375 Z' },
  { id: 'kerala', name: 'Kerala', slug: 'kerala', d: 'M 360 440 L 390 440 L 410 500 L 380 510 Z' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', slug: 'tamil-nadu', d: 'M 400 430 L 470 420 L 460 500 L 400 500 Z' },
  { id: 'karnataka', name: 'Karnataka', slug: 'karnataka', d: 'M 310 350 L 410 340 L 400 440 L 330 420 Z' },
  { id: 'delhi', name: 'Delhi', slug: 'delhi', d: 'M 350 145 L 370 145 L 365 160 L 350 155 Z' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', slug: 'himachal-pradesh', d: 'M 330 80 L 380 70 L 390 110 L 340 115 Z' },
  { id: 'jammu-and-kashmir', name: 'Jammu & Kashmir', slug: 'jammu-and-kashmir', d: 'M 290 40 L 350 30 L 340 85 L 290 80 Z' },
  { id: 'ladakh', name: 'Ladakh', slug: 'ladakh', d: 'M 340 20 L 430 15 L 420 70 L 345 65 Z' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', slug: 'uttar-pradesh', d: 'M 370 140 L 490 150 L 480 220 L 360 200 Z' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', slug: 'madhya-pradesh', d: 'M 320 220 L 460 210 L 450 280 L 300 270 Z' },
  { id: 'west-bengal', name: 'West Bengal', slug: 'west-bengal', d: 'M 540 210 L 590 200 L 570 290 L 530 280 Z' },
  { id: 'odisha', name: 'Odisha', slug: 'odisha', d: 'M 480 260 L 560 250 L 540 320 L 470 310 Z' },
  { id: 'assam', name: 'Assam', slug: 'assam', d: 'M 620 180 L 690 175 L 680 210 L 610 205 Z' },
  { id: 'punjab', name: 'Punjab', slug: 'punjab', d: 'M 300 100 L 340 95 L 335 140 L 295 135 Z' },
  { id: 'bihar', name: 'Bihar', slug: 'bihar', d: 'M 480 180 L 560 175 L 550 220 L 470 210 Z' }
];

export default function InteractiveIndiaMap() {
  const navigate = useNavigate();
  const [apiStates, setApiStates] = useState({});
  const [activeState, setActiveState] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const filteredPaths = STATE_PATHS.map(st => {
    const isMatched = searchQuery
      ? st.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    return { ...st, isMatched };
  });

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
        <svg
          viewBox="100 10 620 520"
          className="india-svg-map"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {filteredPaths.map((st) => {
            const isSelected = activeState?.slug === st.slug;
            return (
              <path
                key={st.id}
                d={st.d}
                className={`state-path ${isSelected ? 'selected' : ''} ${st.isMatched ? 'highlighted' : ''}`}
                onMouseEnter={() => handleStateHover(st)}
                onClick={() => handleStateClick(st.slug)}
              >
                <title>{st.name}</title>
              </path>
            );
          })}

          {/* Marker Nodes */}
          {STATE_PATHS.map((st) => (
            <circle
              key={`node-${st.id}`}
              cx={parseInt(st.d.split(' ')[1]) + 20}
              cy={parseInt(st.d.split(' ')[2]) + 10}
              r={st.slug === activeState?.slug ? 7 : 4}
              fill={st.slug === activeState?.slug ? '#FFB703' : '#FF6B35'}
              stroke="#FFFFFF"
              strokeWidth={1.5}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => handleStateClick(st.slug)}
            />
          ))}
        </svg>

        {/* Hover Info Card */}
        <StateMapCard state={activeState} onClose={() => setActiveState(null)} />
      </div>
    </div>
  );
}
