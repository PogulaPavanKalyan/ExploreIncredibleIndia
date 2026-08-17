import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import HeroVideo from './HeroVideo';
import HeroContent from './HeroContent';
import HeroNavigation from './HeroNavigation';
import Hero3DScene from './Hero3DScene';
import './Hero.css';

const REGIONS = ['SOUTH', 'NORTH', 'WEST', 'EAST', 'CENTRAL', 'NORTHEAST'];

const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function CinematicHero() {
  const navigate = useNavigate();
  
  const [currentDestination, setCurrentDestination] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const fetchInProgress = useRef(false);

  const fetchRandomDestination = async (region = null, excludeId = null) => {
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;
    try {
      let url = '/places/hero/random/';
      const params = new URLSearchParams();
      if (region) params.append('region', region);
      if (excludeId) params.append('exclude', excludeId);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await apiClient.get(url);
      const data = res.data;
      
      if (data.success && data.data) {
        setCurrentDestination(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch hero destination", err);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  useEffect(() => {
    // Initial fetch based on region rotation logic
    const lastRegionIdx = parseInt(sessionStorage.getItem('heroLastRegionIdx') || '-1');
    const nextRegionIdx = (lastRegionIdx + 1) % REGIONS.length;
    sessionStorage.setItem('heroLastRegionIdx', nextRegionIdx.toString());
    
    const lastDestId = sessionStorage.getItem('heroLastDestId');
    fetchRandomDestination(REGIONS[nextRegionIdx], lastDestId);
  }, []);

  const handleNext = () => {
    if (!currentDestination) return;
    const nextRegionIdx = (REGIONS.indexOf(currentDestination.region) + 1) % REGIONS.length;
    fetchRandomDestination(REGIONS[nextRegionIdx], currentDestination.id);
  };

  useEffect(() => {
    if (!currentDestination) return;
    
    sessionStorage.setItem('heroLastDestId', currentDestination.id);
    
    // Auto rotate every N seconds
    const duration = (currentDestination.display_duration || 10) * 1000;
    const timer = setTimeout(() => {
      handleNext();
    }, duration);
    return () => clearTimeout(timer);
  }, [currentDestination]);

  const toggleSound = () => setIsMuted(!isMuted);

  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', height: '100vh', width: '100%' }}>
      
      <HeroVideo 
        currentDestination={currentDestination} 
        isMuted={isMuted} 
        toggleSound={toggleSound} 
        getMediaUrl={getMediaUrl} 
      />
      
      <Hero3DScene currentDestination={currentDestination} />

      <div className="container hero-container" style={{ position: 'relative', zIndex: 5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '4rem', paddingBottom: '1rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.1rem', letterSpacing: '0.3em', color: '#fff', textTransform: 'uppercase', opacity: 0.8, animation: 'fadeIn 0.8s ease-out' }}>
            Discover India
          </h1>
        </div>

        <HeroContent 
          currentDestination={currentDestination} 
          navigate={navigate} 
        />

        <HeroNavigation 
          currentDestination={currentDestination} 
          fetchRandomDestination={fetchRandomDestination} 
        />
        
      </div>
    </section>
  );
}
