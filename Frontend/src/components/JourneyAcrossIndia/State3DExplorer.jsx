import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, MapPin, Sparkles, X, Share2, Heart } from 'lucide-react';
import apiClient from '../../api/apiClient';
import { StateDistrictMap3D } from './StateDistrictMap3D';
import { StatePlacesSidebar } from './StatePlacesSidebar';
import { getPlacesForState } from './statePlacesData';
import { extractStateFeatures, normalizeStateName } from './geoUtils';
import './State3DExplorer.css';

export function State3DExplorer({ stateItem: propStateItem, onClose }) {
  const { stateSlug } = useParams();
  const navigate = useNavigate();
  
  const [mapData, setMapData] = useState(null);
  const [backendPlaces, setBackendPlaces] = useState([]);
  const [backendStateData, setBackendStateData] = useState(null);
  const [activePlace, setActivePlace] = useState(null);
  const [liked, setLiked] = useState(false);

  // 1. Fetch public/india_states.json dataset
  useEffect(() => {
    fetch('/india_states.json')
      .then(res => res.json())
      .then(data => setMapData(data))
      .catch(err => console.error("Error loading india_states.json in 3D explorer:", err));
  }, []);

  // Determine target state feature
  const stateFeature = useMemo(() => {
    if (!mapData) return propStateItem || null;
    const allFeatures = extractStateFeatures(mapData);
    
    // Find matching state feature by prop or URL slug
    const targetName = propStateItem ? propStateItem.name : (stateSlug ? stateSlug.replace(/-/g, ' ') : '');
    const normalizedTarget = normalizeStateName(targetName).toLowerCase();

    const matched = allFeatures.find(feat => 
      feat.name.toLowerCase() === normalizedTarget ||
      feat.rawName.toLowerCase() === normalizedTarget ||
      feat.name.toLowerCase().includes(normalizedTarget) ||
      normalizedTarget.includes(feat.name.toLowerCase())
    );

    return matched || propStateItem || allFeatures[0] || null;
  }, [mapData, propStateItem, stateSlug]);

  const stateName = stateFeature ? stateFeature.name : (propStateItem ? propStateItem.name : 'Indian State');

  // 2. Fetch state data & tourist destinations dynamically from Backend API
  useEffect(() => {
    if (!stateName) return;

    const slugName = stateName.toLowerCase().replace(/\s+/g, '-');
    
    // Fetch state details & destinations from backend API
    Promise.all([
      apiClient.get(`/destinations/?state=${slugName}&page_size=200`).catch(() => null),
      apiClient.get(`/destinations/?page_size=200`).catch(() => null),
      apiClient.get(`/states/${slugName}/`).catch(() => null)
    ]).then(([destRes, allDestRes, stateRes]) => {
      const stateDestData = destRes?.data?.data || destRes?.data?.results || destRes?.data;
      const allDestData = allDestRes?.data?.data || allDestRes?.data?.results || allDestRes?.data;
      const sData = stateRes?.data?.data || stateRes?.data;

      if (sData) setBackendStateData(sData);

      let fetchedRaw = [];
      if (Array.isArray(stateDestData) && stateDestData.length > 0) {
        fetchedRaw = stateDestData;
      } else if (Array.isArray(allDestData) && allDestData.length > 0) {
        fetchedRaw = allDestData.filter(d => {
          const sName = (d.state_name || d.state?.name || d.state || '').toString().toLowerCase();
          const target = stateName.toLowerCase();
          return sName === target || sName.includes(target) || target.includes(sName);
        });
      }

      if (fetchedRaw.length > 0) {
        const formatted = fetchedRaw.map(d => ({
          id: d.id || d.slug,
          destination: d.name || d.destination,
          slug: d.slug,
          state: d.state_name || d.state?.name || stateName,
          district: d.district || d.city?.name || 'Telangana',
          category: d.category || d.famous_for || 'Attraction',
          latitude: parseFloat(d.latitude) || 17.5,
          longitude: parseFloat(d.longitude) || 78.5,
          rating: d.avg_rating || 4.8,
          image: d.main_image || d.cover_image || d.image || 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800',
          short_description: d.short_description || d.famous_for || d.description
        }));
        setBackendPlaces(formatted);
      }
    });
  }, [stateName]);

  // Combine backend places with local places dataset for 100% complete coverage
  const places = useMemo(() => {
    const localPlaces = getPlacesForState(stateName);
    const combined = backendPlaces && backendPlaces.length > 0 ? [...backendPlaces] : [...localPlaces];

    if (backendPlaces && backendPlaces.length > 0) {
      localPlaces.forEach(lp => {
        const exists = combined.some(bp => 
          (bp.destination || bp.name || '').toLowerCase() === (lp.destination || '').toLowerCase()
        );
        if (!exists) {
          combined.push(lp);
        }
      });
    }

    // STRICT FILTER: Keep ONLY places belonging to the active state
    return combined.filter(p => {
      const st = (p.state || '').toString().toLowerCase();
      const target = stateName.toLowerCase();
      return st === target || st.includes(target) || target.includes(st);
    });
  }, [stateName, backendPlaces]);

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  if (!mapData) {
    return (
      <div className="state-3d-explorer-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712', zIndex: 99999 }}>
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#38bdf8' }}>✨ Loading 3D District Explorer...</div>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Preparing WebGL 3D map for {stateName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="state-3d-explorer-overlay">
      {/* ── Top Glassmorphic Navigation Header Bar ── */}
      <header className="state-explorer-header">
        <div className="header-left">
          <button onClick={handleBack} className="back-map-btn">
            <ArrowLeft size={18} /> Back to India Map
          </button>
          <div className="header-divider"></div>
          <div className="state-header-badge">
            <span className="badge-flag">🇮🇳</span>
            <span className="badge-state-name">{stateName}</span>
          </div>
        </div>

        <div className="header-center">
          <div className="explorer-title">
            <Compass className="compass-icon spin-slow" size={20} />
            <span>Interactive 3D District Explorer</span>
          </div>
        </div>

        <div className="header-right">
          <button onClick={() => setLiked(!liked)} className={`action-icon-btn ${liked ? 'liked' : ''}`}>
            <Heart size={18} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : '#ffffff'} />
          </button>
          <button className="action-icon-btn">
            <Share2 size={18} />
          </button>
          <button onClick={handleBack} className="close-explorer-btn">
            <X size={20} />
          </button>
        </div>
      </header>

      {/* ── Main Split View Workspace ── */}
      <div className="state-explorer-workspace">
        {/* LEFT PANEL (60%): Interactive 3D District Canvas */}
        <div className="workspace-left-canvas">
          <StateDistrictMap3D
            stateFeature={stateFeature}
            places={places}
            activePlace={activePlace}
            onSelectPlace={setActivePlace}
          />
        </div>

        {/* RIGHT PANEL (40%): Categorized Tourist Places & Attractions */}
        <div className="workspace-right-sidebar">
          <StatePlacesSidebar
            stateName={stateName}
            places={places}
            activePlace={activePlace}
            onSelectPlace={setActivePlace}
          />
        </div>
      </div>
    </div>
  );
}
