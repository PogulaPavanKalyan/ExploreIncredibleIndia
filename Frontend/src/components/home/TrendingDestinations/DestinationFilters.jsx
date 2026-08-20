import React, { useState, useEffect } from 'react';
import { getRegions } from '../../../services/regionService';
import { getCategories } from '../../../services/categoryService';

const DEFAULT_REGIONS = [
  { id: 'all', label: 'ALL REGIONS' },
  { id: 'south-india', label: 'SOUTH INDIA' },
  { id: 'north-india', label: 'NORTH INDIA' },
  { id: 'west-india', label: 'WEST INDIA' },
  { id: 'east-india', label: 'EAST INDIA' },
  { id: 'central-india', label: 'CENTRAL INDIA' },
  { id: 'northeast-india', label: 'NORTHEAST' }
];

const DEFAULT_CATEGORIES = [
  { id: 'all', label: 'ALL EXPERIENCES' },
  { id: 'temples', label: 'TEMPLES' },
  { id: 'jyotirlingas', label: 'JYOTIRLINGAS' },
  { id: 'beaches', label: 'BEACHES' },
  { id: 'mountains', label: 'MOUNTAINS' },
  { id: 'heritage', label: 'HERITAGE' },
  { id: 'nature', label: 'NATURE' },
  { id: 'wildlife', label: 'WILDLIFE' },
  { id: 'adventure', label: 'ADVENTURE' },
  { id: 'spiritual', label: 'SPIRITUAL' }
];

export default function DestinationFilters({ 
  selectedRegion, 
  setSelectedRegion, 
  selectedCategory, 
  setSelectedCategory,
  onResetAll 
}) {
  const [regions, setRegions] = useState(DEFAULT_REGIONS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    getRegions()
      .then(res => {
        const list = res?.data || res || [];
        if (Array.isArray(list) && list.length > 0) {
          const mapped = [{ id: 'all', label: 'ALL REGIONS' }, ...list.map(r => ({ id: r.slug, label: r.name.toUpperCase() }))];
          setRegions(mapped);
        }
      })
      .catch(() => {});

    getCategories()
      .then(res => {
        const list = res?.data || res || [];
        if (Array.isArray(list) && list.length > 0) {
          const mapped = [{ id: 'all', label: 'ALL EXPERIENCES' }, ...list.slice(0, 12).map(c => ({ id: c.slug, label: c.name.toUpperCase() }))];
          setCategories(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleRegionClick = (regionId) => {
    if (regionId === 'all') {
      setSelectedRegion('all');
    } else {
      setSelectedRegion(regionId);
    }
  };

  const handleCategoryClick = (catId) => {
    if (catId === 'all') {
      setSelectedCategory('all');
    } else {
      setSelectedCategory(catId);
    }
  };

  const hasActiveFilters = selectedRegion !== 'all' || selectedCategory !== 'all';

  return (
    <div className="destination-filters-container" role="region" aria-label="Destination Filters">
      {/* Row 1: Region Filters */}
      <div className="filter-group">
        <div className="filter-group-header">
          <span className="filter-group-label">FILTER BY REGION</span>
          {selectedRegion !== 'all' && (
            <button 
              className="filter-reset-link"
              onClick={() => setSelectedRegion('all')}
              aria-label="Reset region filter"
            >
              Clear Region
            </button>
          )}
        </div>
        <div className="filter-scroll-row" tabIndex={0} role="tablist" aria-label="Filter by region">
          {regions.map(region => {
            const isActive = selectedRegion === region.id;
            return (
              <button
                key={region.id}
                id={`filter-region-${region.id}`}
                className={`destination-filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleRegionClick(region.id)}
                aria-pressed={isActive}
                role="tab"
                aria-selected={isActive}
              >
                {region.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Row 2: Experience / Category Filters */}
      <div className="filter-group">
        <div className="filter-group-header">
          <span className="filter-group-label">FILTER BY EXPERIENCE</span>
          {selectedCategory !== 'all' && (
            <button 
              className="filter-reset-link"
              onClick={() => setSelectedCategory('all')}
              aria-label="Reset experience filter"
            >
              Clear Experience
            </button>
          )}
        </div>
        <div className="filter-scroll-row" tabIndex={0} role="tablist" aria-label="Filter by experience">
          {categories.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`filter-category-${cat.id}`}
                className={`destination-filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.id)}
                aria-pressed={isActive}
                role="tab"
                aria-selected={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Reset Indicator */}
      {hasActiveFilters && (
        <div className="active-filters-summary">
          <span className="active-filters-text">
            Filtering by: {selectedRegion !== 'all' && <strong className="filter-tag">{selectedRegion.replace('-', ' ').toUpperCase()}</strong>}
            {selectedRegion !== 'all' && selectedCategory !== 'all' && ' + '}
            {selectedCategory !== 'all' && <strong className="filter-tag">{selectedCategory.toUpperCase()}</strong>}
          </span>
          <button 
            className="clear-all-filters-btn"
            onClick={onResetAll}
            aria-label="Clear all active filters"
          >
            ✕ Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
