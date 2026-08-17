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
import { latLngToVector3 } from './geoUtils';
import './JourneyAcrossIndia.css';

export function JourneyAcrossIndia() {
  const [destinations, setDestinations] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [regions, setRegions] = useState([]);
  const [activeRegion, setActiveRegion] = useState('ALL');
  const [activeDestination, setActiveDestination] = useState(null);
  const [isCinematic, setIsCinematic] = useState(false);
  const [cinematicIndex, setCinematicIndex] = useState(0);
  const [mapData, setMapData] = useState(null);
  
  // Accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Refs for 3D camera manipulation
  const controlsRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJourneyData = () => {
    setLoading(true);
    setError(null);
    
    Promise.all([
      apiClient.get('/journey/destinations/'),
      apiClient.get('/journey/regions/'),
      apiClient.get('/journey/featured/'),
      fetch('/india.json').then(res => res.json())
    ])
      .then(([destRes, regRes, featRes, mapRes]) => {
        const destData = destRes.data?.data || destRes.data || [];
        setDestinations(destData);
        if (destData.length > 0) setActiveDestination(destData[0]);
        
        setRegions(regRes.data?.data || regRes.data || []);
        setFeatured(featRes.data?.data || featRes.data || []);
        setMapData(mapRes);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJourneyData();
  }, []);

  const filteredDestinations = useMemo(() => {
    if (activeRegion === 'ALL') return destinations;
    return destinations.filter(d => d.region.toUpperCase() === activeRegion.toUpperCase());
  }, [destinations, activeRegion]);

  // When region changes, update activeDestination to first valid destination in that region
  useEffect(() => {
    if (filteredDestinations.length > 0) {
      // Only switch if current destination doesn't belong to the new filter
      const currentIsValid = activeRegion === 'ALL' || 
        (activeDestination && activeDestination.region.toUpperCase() === activeRegion.toUpperCase());
      if (!currentIsValid) {
        setActiveDestination(filteredDestinations[0]);
      }
    } else {
      // No destinations in this region
      setActiveDestination(null);
    }
  }, [filteredDestinations, activeRegion]);

  // Cinematic journey logic
  useEffect(() => {
    let interval;
    if (isCinematic && featured.length > 0) {
      setActiveDestination(featured[cinematicIndex]);
      
      // Preload next destination image to prevent blank frames
      const nextIndex = (cinematicIndex + 1) % featured.length;
      const nextDest = featured[nextIndex];
      if (nextDest && nextDest.image) {
        const img = new window.Image();
        img.src = nextDest.image.startsWith('http') ? nextDest.image : `http://127.0.0.1:8000${nextDest.image}`;
      }
      
      interval = setInterval(() => {
        setCinematicIndex(prev => (prev + 1) % featured.length);
      }, 5000); // Wait 5 seconds per destination
    }
    return () => clearInterval(interval);
  }, [isCinematic, cinematicIndex, featured]);

  // Update active destination when cinematic index changes
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

  const handleDestinationSelect = (dest) => {
    stopJourney();
    setActiveDestination(dest);
  };

  // Move Camera based on active destination
  const CameraAnimator = ({ activeDest, isCinematic }) => {
    useFrame((state) => {
      if (!controlsRef.current || !activeDest || prefersReducedMotion) return;
      
      const pos = latLngToVector3(activeDest.latitude, activeDest.longitude, 0);
      const targetPos = new THREE.Vector3(pos[0], pos[1], pos[2]);
      
      // Move camera target smoothly
      controlsRef.current.target.lerp(targetPos, 0.05);
      
      // If cinematic, maybe move camera slightly to give a flyover feel
      if (isCinematic) {
        const desiredCamPos = new THREE.Vector3(targetPos.x, 3, targetPos.z + 4);
        state.camera.position.lerp(desiredCamPos, 0.02);
      }
      
      controlsRef.current.update();
    });
    return null;
  };

  return (
    <motion.section 
      className="journey-section"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="journey-header">
        <h2 className="journey-title">Journey Across India</h2>
        <p className="journey-subtitle">From the Himalayas to the Indian Ocean.</p>
      </div>

      {/* Region Filters — above map so they never overlap it */}
      <div className="journey-filters">
        <button 
          className={`filter-btn ${activeRegion === 'ALL' ? 'active' : ''}`}
          onClick={() => { setActiveRegion('ALL'); stopJourney(); }}
          aria-label="Show all regions"
        >ALL INDIA</button>
        {Array.isArray(regions) && regions.map(r => (
          <button 
            key={r.id}
            className={`filter-btn ${activeRegion === r.name ? 'active' : ''}`}
            onClick={() => { setActiveRegion(r.name); stopJourney(); }}
            aria-label={`Filter by ${r.name}`}
          >{r.name.toUpperCase()}</button>
        ))}
      </div>

      {/* Map + Card Row */}
      <div className="journey-container">
        
        {/* 3D Map — main visual centrepiece */}
        <div className="journey-map-container" role="region" aria-label="Interactive India map">
          <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} color="#cda87c" />
            <pointLight position={[-10, 5, -5]} intensity={0.4} color="#4080ff" />
            
            <MapControls 
              ref={controlsRef} 
              enableDamping 
              dampingFactor={0.05} 
              minDistance={2} 
              maxDistance={15} 
              maxPolarAngle={Math.PI / 2.2} 
            />
            
            <Map3D mapData={mapData} reducedMotion={prefersReducedMotion} />
            
            <Markers 
              destinations={filteredDestinations} 
              activeDestination={activeDestination} 
              onSelect={handleDestinationSelect}
              reducedMotion={prefersReducedMotion}
            />
            
            <RouteLine 
              destinations={featured} 
              isCinematic={isCinematic} 
              reducedMotion={prefersReducedMotion}
            />

            <CameraAnimator activeDest={activeDestination} isCinematic={isCinematic} />
          </Canvas>
        </div>

        {/* Destination Info Card */}
        <OverlayUI 
          activeDestination={activeDestination}
          loading={loading}
          error={error}
          onRetry={fetchJourneyData}
        />
        
      </div>

      {/* Controls Row — below map/card */}
      <div className="journey-controls-row">
        <button 
          className={`start-journey-btn ${isCinematic ? 'active' : ''}`}
          onClick={isCinematic ? stopJourney : startJourney}
          disabled={loading || !!error || !activeDestination}
          aria-label={isCinematic ? 'Stop journey' : 'Start journey across India'}
        >
          {isCinematic ? '■ STOP JOURNEY' : '▶ START JOURNEY'}
        </button>
        <span className="storytelling-text">One country. Countless journeys.</span>
      </div>

    </motion.section>
  );
}
