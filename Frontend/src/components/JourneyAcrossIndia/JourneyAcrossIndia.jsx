import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MapControls } from '@react-three/drei';
import apiClient from '../../api/apiClient';
import * as THREE from 'three';

import { Map3D } from './Map3D';
import { Markers } from './Markers';
import { RouteLine } from './RouteLine';
import { OverlayUI } from './OverlayUI';
import { State3DExplorer } from './State3DExplorer';
import { latLngToVector3 } from './geoUtils';
import './JourneyAcrossIndia.css';

const FALLBACK_DESTINATIONS = [
  {
    id: 'f1',
    destination: 'Taj Mahal, Agra',
    slug: 'taj-mahal',
    state: 'Uttar Pradesh',
    region: 'North India',
    latitude: 27.1751,
    longitude: 78.0421,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    short_description: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of Mughal emperor Shah Jahan.',
    category: 'Heritage'
  },
  {
    id: 'f2',
    destination: 'Leh & Ladakh',
    slug: 'leh-ladakh',
    state: 'Ladakh',
    region: 'North India',
    latitude: 34.1526,
    longitude: 77.5771,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800',
    short_description: 'High-altitude cold desert surrounded by breathtaking snow-capped mountain peaks, ancient monasteries, and lakes.',
    category: 'Adventure'
  },
  {
    id: 'f3',
    destination: 'Varanasi Ghats',
    slug: 'varanasi',
    state: 'Uttar Pradesh',
    region: 'North India',
    latitude: 25.3176,
    longitude: 82.9739,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
    short_description: 'The spiritual heart of India along the sacred Ganges river, famed for ancient ghats and evening Ganga Aarti.',
    category: 'Spiritual'
  },
  {
    id: 'f4',
    destination: 'Jaipur Pink City',
    slug: 'jaipur',
    state: 'Rajasthan',
    region: 'West India',
    latitude: 26.9239,
    longitude: 75.8267,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    short_description: 'Capital of Rajasthan featuring iconic royal palaces like Hawa Mahal and Amber Fort with vibrant bazaars.',
    category: 'Culture'
  },
  {
    id: 'f5',
    destination: 'Goa Coastline',
    slug: 'goa',
    state: 'Goa',
    region: 'West India',
    latitude: 15.2993,
    longitude: 74.1240,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    short_description: 'Sun-drenched golden beaches, Portuguese heritage churches, lively beach shacks, and tropical spice plantations.',
    category: 'Beaches'
  },
  {
    id: 'f6',
    destination: 'Munnar Hills',
    slug: 'munnar',
    state: 'Kerala',
    region: 'South India',
    latitude: 10.0889,
    longitude: 77.0595,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800',
    short_description: 'Picturesque hill station in God’s Own Country, famed for sprawling tea gardens and misty mountain peaks.',
    category: 'Nature'
  },
  {
    id: 'f7',
    destination: 'Hampi Ruins',
    slug: 'hampi',
    state: 'Karnataka',
    region: 'South India',
    latitude: 15.3350,
    longitude: 76.4600,
    image: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?w=800',
    short_description: 'UNESCO World Heritage Site with surreal boulder landscapes and stone temples of the Vijayanagara Empire.',
    category: 'Heritage'
  },
  {
    id: 'f8',
    destination: 'Darjeeling Tea Hills',
    slug: 'darjeeling',
    state: 'West Bengal',
    region: 'East India',
    latitude: 27.0410,
    longitude: 88.2663,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    short_description: 'Queen of the Hills offering views of Mount Kanchenjunga, world-renowned tea gardens, and Himalayan Railway.',
    category: 'Nature'
  },
  {
    id: 'f9',
    destination: 'Kaziranga Reserve',
    slug: 'kaziranga',
    state: 'Assam',
    region: 'Northeast India',
    latitude: 26.5775,
    longitude: 93.1711,
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800',
    short_description: 'Home to two-thirds of the world’s one-horned rhinos, lush elephant grass marshes, and rich wildlife safaris.',
    category: 'Wildlife'
  },
  {
    id: 'f10',
    destination: 'Khajuraho Temples',
    slug: 'khajuraho',
    state: 'Madhya Pradesh',
    region: 'Central India',
    latitude: 24.8318,
    longitude: 79.9199,
    image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800',
    short_description: 'Famous group of medieval Hindu and Jain temples renowned for their intricate stone carvings and grandeur.',
    category: 'Heritage'
  },
  {
    id: 'f11',
    destination: 'Golden Temple, Amritsar',
    slug: 'golden-temple',
    state: 'Punjab',
    region: 'North India',
    latitude: 31.6200,
    longitude: 74.8765,
    image: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800',
    short_description: 'Holiest shrine of Sikhism, surrounded by a sacred pool of nectar, radiating peace and community service.',
    category: 'Spiritual'
  },
  {
    id: 'f12',
    destination: 'Mysore Palace',
    slug: 'mysore',
    state: 'Karnataka',
    region: 'South India',
    latitude: 12.3051,
    longitude: 76.6551,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    short_description: 'Grand royal residence of the Wadiyar dynasty featuring Indo-Saracenic architecture and illuminated domes.',
    category: 'Culture'
  },
  {
    id: 'f13',
    destination: 'Charminar, Hyderabad',
    slug: 'charminar-hyderabad',
    state: 'Telangana',
    region: 'South India',
    latitude: 17.3616,
    longitude: 78.4747,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800',
    short_description: 'Iconic 16th-century mosque with four ornate minarets located in the heart of historic Hyderabad.',
    category: 'Heritage'
  },
  {
    id: 'f14',
    destination: 'Tirumala Venkateswara Temple',
    slug: 'tirupati-temple',
    state: 'Andhra Pradesh',
    region: 'South India',
    latitude: 13.6833,
    longitude: 79.3500,
    image: 'https://images.unsplash.com/photo-1621831971712-421714207865?w=800',
    short_description: 'Sacred hill shrine dedicated to Lord Venkateswara on the Tirumala Hills, celebrated worldwide.',
    category: 'Spiritual'
  }
];

const FALLBACK_REGIONS = [
  { id: 1, name: 'North India' },
  { id: 2, name: 'South India' },
  { id: 3, name: 'West India' },
  { id: 4, name: 'East India' },
  { id: 5, name: 'Central India' },
  { id: 6, name: 'Northeast India' }
];

export function JourneyAcrossIndia() {
  const [destinations, setDestinations] = useState(FALLBACK_DESTINATIONS);
  const [featured, setFeatured] = useState(FALLBACK_DESTINATIONS.slice(0, 6));
  const [regions, setRegions] = useState(FALLBACK_REGIONS);
  const [activeRegion, setActiveRegion] = useState('ALL');
  const [activeDestination, setActiveDestination] = useState(FALLBACK_DESTINATIONS[0]);
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [showStateExplorer, setShowStateExplorer] = useState(false);
  const [isCinematic, setIsCinematic] = useState(false);
  const [cinematicIndex, setCinematicIndex] = useState(0);
  const [mapData, setMapData] = useState(null);
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const controlsRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch State-level Map GeoJSON independently so map rendering is never blocked
  useEffect(() => {
    fetch('/india_states.json')
      .then(res => res.json())
      .then(data => setMapData(data))
      .catch(() => {
        fetch('/india.json')
          .then(res => res.json())
          .then(data => setMapData(data))
          .catch(err => console.error('Failed to load India GeoJSON map:', err));
      });
  }, []);


  // 2. Fetch destination & region data from backend API with fallback
  const fetchJourneyData = () => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      apiClient.get('/journey/destinations/').catch(() => null),
      apiClient.get('/journey/regions/').catch(() => null),
      apiClient.get('/journey/featured/').catch(() => null)
    ])
      .then(([destRes, regRes, featRes]) => {
        const destData = destRes?.data?.data || destRes?.data;
        if (Array.isArray(destData) && destData.length > 0) {
          setDestinations(destData);
          setActiveDestination(destData[0]);
        } else {
          setDestinations(FALLBACK_DESTINATIONS);
          setActiveDestination(FALLBACK_DESTINATIONS[0]);
        }

        const regData = regRes?.data?.data || regRes?.data;
        if (Array.isArray(regData) && regData.length > 0) {
          setRegions(regData);
        } else {
          setRegions(FALLBACK_REGIONS);
        }

        const featData = featRes?.data?.data || featRes?.data;
        if (Array.isArray(featData) && featData.length > 0) {
          setFeatured(featData);
        } else {
          setFeatured(FALLBACK_DESTINATIONS.slice(0, 6));
        }

        setLoading(false);
      })
      .catch(() => {
        setDestinations(FALLBACK_DESTINATIONS);
        setActiveDestination(FALLBACK_DESTINATIONS[0]);
        setRegions(FALLBACK_REGIONS);
        setFeatured(FALLBACK_DESTINATIONS.slice(0, 6));
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJourneyData();
  }, []);

  const filteredDestinations = useMemo(() => {
    if (activeRegion === 'ALL') return destinations;
    return destinations.filter(d => (d.region || '').toUpperCase() === activeRegion.toUpperCase());
  }, [destinations, activeRegion]);

  useEffect(() => {
    if (filteredDestinations.length > 0) {
      const currentIsValid = activeRegion === 'ALL' || 
        (activeDestination && (activeDestination.region || '').toUpperCase() === activeRegion.toUpperCase());
      if (!currentIsValid) {
        setActiveDestination(filteredDestinations[0]);
      }
    } else {
      setActiveDestination(null);
    }
  }, [filteredDestinations, activeRegion]);

  // Cinematic flight journey timer
  useEffect(() => {
    let interval;
    if (isCinematic && featured.length > 0) {
      setActiveDestination(featured[cinematicIndex]);
      interval = setInterval(() => {
        setCinematicIndex(prev => (prev + 1) % featured.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isCinematic, cinematicIndex, featured]);

  useEffect(() => {
    if (isCinematic && featured.length > 0) {
      setActiveDestination(featured[cinematicIndex]);
    }
  }, [cinematicIndex, isCinematic, featured]);

  const startJourney = () => {
    setIsCinematic(true);
    setCinematicIndex(0);
    setActiveRegion('ALL');
  };

  const stopJourney = () => {
    setIsCinematic(false);
  };

  const resetView = () => {
    stopJourney();
    setSelectedState(null);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.object.position.set(0, 6, 9);
      controlsRef.current.update();
    }
  };

  const handleDestinationSelect = (dest) => {
    stopJourney();
    setActiveDestination(dest);
  };

  const handleStateSelect = (stateItem) => {
    stopJourney();
    setSelectedState(stateItem);
    setShowStateExplorer(true);
  };


  // Lerp 3D camera to active destination target
  const CameraAnimator = ({ activeDest, isCinematic }) => {
    useFrame((state) => {
      if (!controlsRef.current || !activeDest || prefersReducedMotion) return;
      
      const pos = latLngToVector3(activeDest.latitude, activeDest.longitude, 0);
      const targetPos = new THREE.Vector3(pos[0], pos[1], pos[2]);
      
      const dist = controlsRef.current.target.distanceTo(targetPos);
      if (dist > 0.001) {
        controlsRef.current.target.lerp(targetPos, 0.06);
        controlsRef.current.update();
      }
      
      if (isCinematic) {
        const desiredCamPos = new THREE.Vector3(targetPos.x * 0.8, 3.8, targetPos.z + 4.5);
        if (state.camera.position.distanceTo(desiredCamPos) > 0.001) {
          state.camera.position.lerp(desiredCamPos, 0.03);
          controlsRef.current.update();
        }
      }
    });
    return null;
  };

  return (
    <motion.section 
      className="journey-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      aria-label="Interactive 3D Journey Across India"
    >
      {/* ── Section Title & Navigation Tabs ── */}
      <div className="journey-header">
        <div className="journey-title-container">
          <span className="badge badge-gold">Interactive 3D Experience</span>
          <h2 className="journey-main-title">Journey Across India</h2>
          <p className="journey-subtitle">Click any state to launch 3D District Explorer or fly across landmarks</p>
        </div>

        {/* Region Filter Buttons */}
        <div className="region-filter-tabs" role="tablist" aria-label="Filter destinations by region">
          {regions.map(reg => (
            <button
              key={reg.id || reg.code}
              role="tab"
              aria-selected={activeRegion === reg.code}
              className={`region-tab-btn ${activeRegion === reg.code ? 'active' : ''}`}
              onClick={() => {
                stopJourney();
                setActiveRegion(reg.code);
              }}
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Side-by-Side Split Workspace Layout (3D Map Left 65%, Places Carousel Right 35%) ── */}
      <div className="journey-workspace-split">
        {/* LEFT COLUMN (65% Width): 3D WebGL Map Viewport */}
        <div className="journey-map-column">
          {/* Floating Quick Reset Button */}
          <button 
            className="reset-view-btn"
            onClick={resetView}
            title="Reset Camera to All India View"
            aria-label="Reset Camera View"
          >
            🎯 Reset View
          </button>

          {/* 3D WebGL Canvas */}
          <div className="canvas-wrapper">
            <Canvas
              camera={{ position: [0, 6, 9], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            >
              {/* Illumination Lights */}
              <ambientLight intensity={1.2} />
              <directionalLight 
                position={[10, 20, 15]} 
                intensity={2.5} 
                color="#ffffff"
              />
              <directionalLight 
                position={[-10, 15, -10]} 
                intensity={1.0} 
                color="#38bdf8" 
              />

              {/* 3D Map Land Extrusions with Upward State Elevation */}
              <Map3D 
                mapData={mapData}
                hoveredState={hoveredState}
                onHoverState={setHoveredState}
                selectedState={selectedState}
                onSelectState={handleStateSelect}
                reducedMotion={prefersReducedMotion}
              />

              {/* 3D Flight Arc Connections between Landmarks */}
              <RouteLine 
                destinations={filteredDestinations}
                activeDestination={activeDestination}
                reducedMotion={prefersReducedMotion}
              />

              {/* 3D Glowing Gemstone Markers */}
              <Markers 
                destinations={filteredDestinations}
                activeDestination={activeDestination}
                hoveredState={hoveredState}
                selectedState={selectedState}
                onSelect={handleDestinationSelect}
                reducedMotion={prefersReducedMotion}
              />

              {/* Interactive Orbit Camera Controls */}
              <MapControls 
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI / 2.15}
                minDistance={3.0}
                maxDistance={18.0}
                dampingFactor={0.05}
              />

              {/* Smooth Lerp Camera Animator */}
              <CameraAnimator activeDest={activeDestination} isCinematic={isCinematic} />
            </Canvas>
          </div>
        </div>

        {/* RIGHT COLUMN (35% Width): Important Places Carousel & Sidebar */}
        <div className="journey-places-sidebar-column">
          <div className="sidebar-header-box">
            <div className="sidebar-badge">✨ Featured Landmarks</div>
            <h3 className="sidebar-title">Important Places Across India</h3>
            <p className="sidebar-sub">Click any landmark card to fly 3D camera to its location</p>
          </div>

          <div className="places-carousel-list">
            {filteredDestinations.map((dest) => {
              const isActive = activeDestination && (activeDestination.id === dest.id || activeDestination.destination === dest.destination);
              return (
                <div 
                  key={dest.id || dest.destination}
                  onClick={() => handleDestinationSelect(dest)}
                  className={`landmark-card-item ${isActive ? 'active' : ''}`}
                >
                  <div className="landmark-thumb">
                    <img src={dest.image} alt={dest.destination} loading="lazy" />
                    <span className="landmark-state-badge">{dest.state}</span>
                  </div>
                  <div className="landmark-info">
                    <div className="landmark-title-row">
                      <h4 className="landmark-name">{dest.destination}</h4>
                      <span className="landmark-category">{dest.category}</span>
                    </div>
                    <p className="landmark-desc">{dest.short_description}</p>
                    <div className="landmark-footer-row">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDestinationSelect(dest);
                        }}
                        className="fly-pin-btn"
                      >
                        📍 Fly to Landmark
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Control Bar ── */}
      <div className="journey-controls-row">
        <button 
          className={`start-journey-btn ${isCinematic ? 'active' : ''}`}
          onClick={isCinematic ? stopJourney : startJourney}
          disabled={loading || !activeDestination}
          aria-label={isCinematic ? 'Stop cinematic journey' : 'Start cinematic journey across India'}
        >
          {isCinematic ? '■ STOP JOURNEY' : '▶ START CINEMATIC JOURNEY'}
        </button>
        <span className="storytelling-text">One land. 1000+ timeless stories.</span>
      </div>

      {/* ── Dedicated 3D State Explorer View ── */}
      {showStateExplorer && (
        <State3DExplorer 
          stateItem={selectedState} 
          onClose={() => setShowStateExplorer(false)} 
        />
      )}

    </motion.section>
  );
}
