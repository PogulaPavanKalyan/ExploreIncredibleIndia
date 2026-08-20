import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getRegions } from '../../../services/regionService';

import './RegionExplorer.css';
import RegionNavigation from './RegionNavigation';
import RegionMedia from './RegionMedia';
import RegionStats from './RegionStats';
import RegionDestinations from './RegionDestinations';
import Region3DMarker from './Region3DMarker';

export default function RegionExplorer() {
  const [regions, setRegions] = useState([]);
  const [activeRegion, setActiveRegion] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await getRegions();
        const regionsData = data.data || data || [];
        setRegions(regionsData);
        if (regionsData.length > 0) {
          setActiveRegion(regionsData[0]);
        }
      } catch (error) {
        console.error("Failed to load regions:", error);
      }
    };
    fetchRegions();
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  if (!regions || regions.length === 0 || !activeRegion) {
    return <div className="region-explorer-section" style={{minHeight: '20vh'}} />
  }

  const regionSlug = activeRegion.slug || 'south-india';
  const themeClass = `theme-${regionSlug}`;

  return (
    <section 
      className={`region-explorer-section ${themeClass}`}
      ref={sectionRef}
    >
      <div className="container">
        {/* Header */}
        <motion.div 
          className="region-explorer-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="region-explorer-title">Explore India By Region</h2>
          <p className="region-explorer-subtitle">One country. Six worlds to discover.</p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <RegionNavigation 
            regions={regions} 
            activeRegion={activeRegion} 
            onSelect={setActiveRegion} 
          />
        </motion.div>

        {/* Interactive Cinematic Container */}
        <motion.div 
          className="region-content-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Layer 1: Media Background */}
          <RegionMedia region={activeRegion} mousePos={mousePos} />
          
          {/* Layer 2: 3D Marker */}
          <Region3DMarker region={activeRegion} mousePos={mousePos} />
          
          {/* Layer 3: Info & Stats */}
          <RegionStats region={activeRegion} mousePos={mousePos} />
          
          {/* Layer 4: Destination Previews */}
          <RegionDestinations region={activeRegion} mousePos={mousePos} />
          
        </motion.div>
      </div>
    </section>
  );
}
