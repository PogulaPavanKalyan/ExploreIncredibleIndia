import React from 'react';

const regions = [
  { id: 'all', label: 'ALL' },
  { id: 'south-india', label: 'SOUTH INDIA' },
  { id: 'north-india', label: 'NORTH INDIA' },
  { id: 'west-india', label: 'WEST INDIA' },
  { id: 'east-india', label: 'EAST INDIA' },
  { id: 'central-india', label: 'CENTRAL INDIA' },
  { id: 'northeast-india', label: 'NORTHEAST' }
];

const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'temples', label: 'TEMPLES' },
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
  setSelectedCategory 
}) {
  return (
    <div className="trending-filters-wrapper">
      <div className="filter-row region-filters">
        {regions.map(region => (
          <button
            key={region.id}
            className={`filter-btn ${selectedRegion === region.id ? 'active' : ''}`}
            onClick={() => setSelectedRegion(region.id)}
            aria-pressed={selectedRegion === region.id}
          >
            {region.label}
          </button>
        ))}
      </div>
      
      <div className="filter-row category-filters">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
