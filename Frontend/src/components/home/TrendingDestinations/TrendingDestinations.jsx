import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getDestinations } from '../../../services/destinationService';

import './TrendingDestinations.css';
import FeaturedDestination from './FeaturedDestination';
import DestinationEditorialGrid from './DestinationEditorialGrid';
import DestinationFilters from './DestinationFilters';
import { DestinationGridSkeleton } from '../../common/SkeletonLoader';

export default function TrendingDestinations() {
  const [featuredDests, setFeaturedDests] = useState([]);
  const [gridDests, setGridDests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Fetch Featured Destinations (Top Section)
  useEffect(() => {
    let isMounted = true;
    const fetchFeatured = async () => {
      try {
        const res = await getDestinations({ featured: 'true', page_size: 6 });
        if (isMounted && res.data) {
          setFeaturedDests(res.data);
        }
      } catch (err) {
        console.error("Error fetching featured destinations:", err);
      }
    };
    fetchFeatured();
    return () => { isMounted = false; };
  }, [retryTrigger]);

  // Fetch Grid Destinations based on active Region + Category filters
  useEffect(() => {
    let isMounted = true;
    const fetchGrid = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const params = {
          page_size: 12,
        };
        
        if (selectedRegion !== 'all') {
          params.region = selectedRegion;
        }
        
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }

        const res = await getDestinations(params);
        if (isMounted && res.data) {
          setGridDests(res.data);
          const count = res.pagination?.total !== undefined 
            ? res.pagination.total 
            : (res.count !== undefined ? res.count : res.data.length);
          setTotalCount(count);
        }
      } catch (err) {
        console.error("Error fetching filtered destinations:", err);
        if (isMounted) {
          setGridDests([]);
          setTotalCount(0);
          setHasError(true);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchGrid();
    return () => { isMounted = false; };
  }, [selectedRegion, selectedCategory, retryTrigger]);

  const handleResetFilters = useCallback(() => {
    setSelectedRegion('all');
    setSelectedCategory('all');
  }, []);

  const handleRetry = () => {
    setRetryTrigger(prev => prev + 1);
  };

  return (
    <section className="trending-editorial-section" id="discover-destinations">
      <div className="trending-container">
        {/* Section Header */}
        <motion.div 
          className="trending-header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="trending-header-text">
            <span className="destination-count">
              EXPLORE {totalCount} {totalCount === 1 ? 'DESTINATION' : 'DESTINATIONS'}
            </span>
            <h2 className="trending-title">Discover Your Next Destination</h2>
            <p className="trending-subtitle">
              Authentic Indian landscapes, timeless monuments, serene backwaters and sacred sanctuaries.
            </p>
          </div>
        </motion.div>

        {/* Region & Experience Filters */}
        <DestinationFilters 
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onResetAll={handleResetFilters}
        />

        {/* Dynamic Featured Destination (Top) */}
        <FeaturedDestination destinations={featuredDests} />

        {/* Filtered Grid Section */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ width: '100%', margin: '2rem 0' }}
            >
              <DestinationGridSkeleton count={8} />
            </motion.div>
          ) : hasError ? (
            <motion.div
              key="error-state"
              className="destination-empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className="empty-state-title" style={{ color: '#ef4444' }}>Unable to load destinations</h3>
              <p className="empty-state-subtitle">
                Please check your network connection or try reloading.
              </p>
              <button 
                className="empty-state-reset-btn"
                onClick={handleRetry}
                style={{ background: '#FF6B1A', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedRegion}-${selectedCategory}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <DestinationEditorialGrid 
                destinations={gridDests} 
                onResetFilters={handleResetFilters}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explore All CTA */}
        <motion.div 
          className="explore-all-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/explore" className="explore-all-btn" id="explore-all-destinations-btn">
            <span>Explore All Destinations</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
