import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getDestinations } from '../../../services/destinationService';

import './TrendingDestinations.css';
import FeaturedDestination from './FeaturedDestination';
import DestinationEditorialGrid from './DestinationEditorialGrid';
import DestinationFilters from './DestinationFilters';

export default function TrendingDestinations() {
  const [featuredDests, setFeaturedDests] = useState([]);
  const [gridDests, setGridDests] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Featured Destinations (Top section)
  // We fetch a few featured items independently of the filters for the top rotation
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getDestinations({ featured: 'true', page_size: 5 });
        if (res.data) setFeaturedDests(res.data);
      } catch (err) {
        console.error("Error fetching featured destinations:", err);
      }
    };
    fetchFeatured();
  }, []);

  // Fetch Grid Destinations based on filters
  useEffect(() => {
    const fetchGrid = async () => {
      setIsLoading(true);
      try {
        const params = {
          page_size: 8,
          // We can use trending=true or just fetch generic if filtered
          // For a true "Trending" section, we could append trending: 'true' 
          // But when filtering, it might be better to just show top destinations for that filter
        };
        
        if (selectedRegion !== 'all') {
          params.region = selectedRegion;
        }
        
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        // If no specific filters, explicitly fetch trending or popular
        if (selectedRegion === 'all' && selectedCategory === 'all') {
          params.trending = 'true';
        }

        const res = await getDestinations(params);
        if (res.data) {
          setGridDests(res.data);
          // If the backend is paginated, it usually returns res.count
          // If our service strips it or returns direct array, we fallback to length or a separate count
          // Let's assume standard DRF pagination or custom response wrapper:
          setTotalCount(res.count || res.data.length || 1000); 
        }
      } catch (err) {
        console.error("Error fetching trending destinations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGrid();
  }, [selectedRegion, selectedCategory]);

  return (
    <section className="trending-editorial-section">
      <div className="container">
        <motion.div 
          className="trending-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="trending-title">Discover Your Next Destination</h2>
            <p className="trending-subtitle">Places worth experiencing, remembering and returning to.</p>
          </div>
          <div className="trending-meta">
            <span className="destination-count">Explore {totalCount > 100 ? `${Math.floor(totalCount / 100) * 100}+` : totalCount} Destinations</span>
          </div>
        </motion.div>

        {/* Filters */}
        <DestinationFilters 
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Featured Rotation (Top) */}
        <FeaturedDestination destinations={featuredDests} />

        {/* Editorial Grid (Bottom) */}
        {isLoading ? (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Loading destinations...</span>
          </div>
        ) : (
          <DestinationEditorialGrid destinations={gridDests} />
        )}

        {/* Explore All CTA */}
        <motion.div 
          className="explore-all-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link to="/destinations" className="explore-all-btn">
            Explore All Destinations →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
