import React, { useState, useEffect, Suspense, lazy } from 'react';
import { getDestinations } from '../../services/destinationService';
import { normalizeArrayResponse } from '../../utils/apiUtils';

import CinematicHero from '../../components/home/Hero/CinematicHero';
import PageTransition from '../../components/PageTransition';
import SkeletonGrid from '../../components/SkeletonLoader';
import '../../components/home/Hero/Hero.css';
import '../../styles/home.css';

// Lazy loaded components for performance
const JourneyAcrossIndia = lazy(() => import('../../components/JourneyAcrossIndia/JourneyAcrossIndia').then(module => ({ default: module.JourneyAcrossIndia })));
const QuickExplore = lazy(() => import('../../components/home/QuickExplore'));
const RegionExplorer = lazy(() => import('../../components/home/RegionExplorer/RegionExplorer'));
const TrendingDestinations = lazy(() => import('../../components/home/TrendingDestinations/TrendingDestinations'));
const IndiaStories = lazy(() => import('../../components/home/IndiaStories/IndiaStories'));
const HiddenIndia = lazy(() => import('../../components/home/HiddenIndia'));
const JourneyBuilder = lazy(() => import('../../components/home/JourneyBuilder'));
const FinalCTA = lazy(() => import('../../components/home/FinalCTA'));
const FlyAcrossIndia = lazy(() => import('../../components/home/FlyAcrossIndia'));
const InteractiveIndiaMap = lazy(() => import('../../components/map/InteractiveIndiaMap'));

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  
  const [trendingDestinations, setTrendingDestinations] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, gemsRes] = await Promise.all([
          getDestinations({ featured: 'true', page_size: 6 }),
          getDestinations({ is_hidden_gem: 'true', page_size: 3 })
        ]);
        setTrendingDestinations(normalizeArrayResponse(trendingRes));
        setHiddenGems(normalizeArrayResponse(gemsRes));

      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleFlyStart = () => setIsFlying(true);
    window.addEventListener('start-fly-across-india', handleFlyStart);
    return () => window.removeEventListener('start-fly-across-india', handleFlyStart);
  }, []);

  return (
    <PageTransition>
      <div className="home-page">
        {/* Fly Across India Signature Feature */}
        <Suspense fallback={null}>
          <FlyAcrossIndia isActive={isFlying} onClose={() => setIsFlying(false)} />
        </Suspense>

        {/* 1. Cinematic Hero Section */}
        <CinematicHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
        />

        <Suspense fallback={<div style={{ height: '100vh', background: '#020617' }} />}>
          {/* 1.5 Journey Across India (Phase 11) */}
          <JourneyAcrossIndia />
        </Suspense>



        <Suspense fallback={<div style={{ height: '300px', background: '#020617' }} />}>
          {/* 2. Quick Explore (Phase 10) */}
          <QuickExplore />

          {/* 3. Trending Destinations (Phase 12 / Enhanced) */}
          {loading ? (
            <div className="container" style={{ padding: '4rem 0' }}>
              <SkeletonGrid count={3} />
            </div>
          ) : (
            <TrendingDestinations />
          )}

          {/* 4. India Stories (One Country. Thousands of Stories.) */}
          <IndiaStories />

          {/* 5. Region Explorer (Phase 11 / Enhanced Cinematic) */}
          <RegionExplorer />

          {/* 6. Interactive Map (Phase 14) */}
          <section style={{ padding: '6rem 0', background: '#0f172a' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '3rem', color: '#fff', fontWeight: 800 }}>EXPLORE INDIA</h2>
              </div>
              <InteractiveIndiaMap />
            </div>
          </section>

          {/* 7. Hidden Gems (Phase 16) */}
          <HiddenIndia destinations={hiddenGems} />

          {/* 8. Journey Builder (Phase 17) */}
          <JourneyBuilder />

          {/* 9. Final CTA (Phase 20) */}
          <FinalCTA />
        </Suspense>
      </div>
    </PageTransition>
  );
}
