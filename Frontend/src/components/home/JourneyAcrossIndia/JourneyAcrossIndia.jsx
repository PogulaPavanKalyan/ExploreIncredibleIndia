import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, MapPin, Sparkles } from 'lucide-react';
import India3DMap from './India3DMap';
import apiClient from '../../../api/apiClient';
import './JourneyAcrossIndia.css';

const REGIONS = ['ALL INDIA', 'SOUTH', 'NORTH', 'WEST', 'EAST', 'CENTRAL', 'NORTHEAST'];

const buildMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path.startsWith('/') ? '' : '/'}${path}`;
};

export default function JourneyAcrossIndia() {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState('ALL INDIA');
  const [destinations, setDestinations] = useState([]);
  const [activeDestination, setActiveDestination] = useState(null);
  const [isJourneyMode, setIsJourneyMode] = useState(false);
  const [journeyIndex, setJourneyIndex] = useState(0);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await apiClient.get('/places/?featured=true&page_size=20');
        if (res.data && res.data.data) {
          setDestinations(res.data.data);
          setActiveDestination(res.data.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch journey destinations", err);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(d => 
    activeRegion === 'ALL INDIA' || (d.region && d.region.toUpperCase() === activeRegion) || (d.category_name === activeRegion) // naive fallback if region missing
  );

  useEffect(() => {
    if (isJourneyMode && filteredDestinations.length > 0) {
      const interval = setInterval(() => {
        setJourneyIndex(prev => {
          if (prev >= filteredDestinations.length - 1) {
            setIsJourneyMode(false);
            clearInterval(interval);
            return prev;
          }
          const next = prev + 1;
          setActiveDestination(filteredDestinations[next]);
          return next;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isJourneyMode, filteredDestinations]);

  const startJourney = () => {
    setJourneyIndex(0);
    setActiveDestination(filteredDestinations[0]);
    setIsJourneyMode(true);
  };

  return (
    <section className="journey-section">
      
      {/* Background Gradient */}
      <div className="journey-bg" />

      <div className="journey-container">
        
        {/* Mobile Header */}
        <div className="journey-mobile-header">
          <h2 className="journey-title">JOURNEY ACROSS INDIA</h2>
          <p className="journey-subtitle">From the Himalayas to the Indian Ocean.</p>
        </div>

        {/* Desktop Header / Region Filter */}
        <div className="journey-header">
          <div className="journey-title-wrap">
            <h2 className="journey-title">JOURNEY ACROSS INDIA</h2>
            <p className="journey-subtitle">From the Himalayas to the Indian Ocean.</p>
          </div>
          
          <div className="journey-region-filter">
            {REGIONS.map(region => (
              <button 
                key={region}
                className={`region-btn ${activeRegion === region ? 'active' : ''}`}
                onClick={() => {
                  setActiveRegion(region);
                  setIsJourneyMode(false);
                }}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="journey-content-split">
          
          {/* LEFT: 3D Map */}
          <div className="journey-map-container">
            <India3DMap 
              destinations={filteredDestinations} 
              activeDestination={activeDestination}
              onMarkerClick={(d) => {
                setActiveDestination(d);
                setIsJourneyMode(false);
              }}
              isJourneyMode={isJourneyMode}
            />
            
            <div className="journey-map-footer">
              <span className="story-text">One country. Countless journeys.</span>
              {!isJourneyMode ? (
                <button className="start-journey-btn" onClick={startJourney}>
                  <Compass size={18} /> START JOURNEY
                </button>
              ) : (
                <button className="start-journey-btn active" onClick={() => setIsJourneyMode(false)}>
                  STOP JOURNEY
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Destination Panel */}
          <div className="journey-panel">
            <AnimatePresence mode="wait">
              {activeDestination && (
                <motion.div 
                  key={activeDestination.id}
                  className="destination-card"
                  initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="card-image-wrap">
                    <img 
                      src={activeDestination.main_image ? buildMediaUrl(activeDestination.main_image) : 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1000'} 
                      alt={activeDestination.name} 
                    />
                    <div className="card-image-overlay" />
                    
                    <div className="card-top-tags">
                      <span className="region-tag">{activeDestination.region || 'INDIA'}</span>
                    </div>
                  </div>

                  <div className="card-content">
                    <div className="card-meta">
                      <MapPin size={16} color="#FF6B35" />
                      <span>{activeDestination.state_name}</span>
                      <span className="dot">•</span>
                      <span>{activeDestination.category_name}</span>
                    </div>

                    <h3 className="card-title">{activeDestination.name.toUpperCase()}</h3>
                    
                    <p className="card-description">
                      {activeDestination.short_description || "Discover the incredible beauty and heritage of this amazing destination."}
                    </p>

                    <button 
                      className="explore-btn"
                      onClick={() => navigate(`/places/${activeDestination.slug}`)}
                    >
                      EXPLORE <Sparkles size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
