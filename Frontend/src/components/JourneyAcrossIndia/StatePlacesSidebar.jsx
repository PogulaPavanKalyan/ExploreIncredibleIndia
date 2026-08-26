import React, { useState, useMemo } from 'react';
import { Search, MapPin, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'all', label: 'All Places', icon: '✨' },
  { id: 'temple', label: 'Temples & Spiritual', icon: '🏛️' },
  { id: 'park', label: 'Parks & Nature', icon: '🌲' },
  { id: 'fort', label: 'History & Forts', icon: '🏰' },
  { id: 'water', label: 'Lakes & Beaches', icon: '🏖️' }
];

export function StatePlacesSidebar({ stateName, places, activePlace, onSelectPlace }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter places based on category tab & search query
  const filteredPlaces = useMemo(() => {
    if (!Array.isArray(places)) return [];
    return places.filter(place => {
      // State match guard
      const pState = (place.state || '').toString().toLowerCase();
      const targetState = (stateName || '').toString().toLowerCase();
      const matchesState = !targetState || pState === targetState || pState.includes(targetState) || targetState.includes(pState);

      // Category filter match
      const placeCategory = (place.category || '').toLowerCase();
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'temple' && (placeCategory.includes('temple') || placeCategory.includes('spiritual') || placeCategory.includes('shrine'))) ||
        (selectedCategory === 'park' && (placeCategory.includes('park') || placeCategory.includes('nature') || placeCategory.includes('wildlife') || placeCategory.includes('hill'))) ||
        (selectedCategory === 'fort' && (placeCategory.includes('fort') || placeCategory.includes('heritage') || placeCategory.includes('history') || placeCategory.includes('monument'))) ||
        (selectedCategory === 'water' && (placeCategory.includes('lake') || placeCategory.includes('beach') || placeCategory.includes('waterfall') || placeCategory.includes('river')));

      // Search query match
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        (place.destination || '').toLowerCase().includes(query) ||
        (place.district || '').toLowerCase().includes(query) ||
        (place.short_description || '').toLowerCase().includes(query);

      return matchesState && matchesCategory && matchesQuery;
    });
  }, [places, stateName, selectedCategory, searchQuery]);

  // Auto-focus top matching place on 3D map canvas whenever user searches or selects a category tab
  React.useEffect(() => {
    if (filteredPlaces.length > 0 && (searchQuery.trim() !== '' || selectedCategory !== 'all')) {
      onSelectPlace(filteredPlaces[0]);
    }
  }, [searchQuery, selectedCategory]);

  return (
    <div className="state-places-sidebar">
      {/* ── Sidebar Top Header & Search ── */}
      <div className="sidebar-header">
        <div className="sidebar-title-badge">
          <Sparkles className="icon-sparkle" />
          <span>Attractions & Landmarks</span>
        </div>
        <h2 className="sidebar-heading">Explore {stateName}</h2>
        <p className="sidebar-subtext">
          Showing {filteredPlaces.length} curated destinations across districts
        </p>

        {/* Search Bar */}
        <div className="sidebar-search-box">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search temples, parks, forts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="sidebar-search-input"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="category-tabs-container">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{cat.icon}</span>
              <span className="tab-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable Places Cards List ── */}
      <div className="places-list-container">
        {filteredPlaces.length === 0 ? (
          <div className="empty-places-state">
            <div className="empty-icon">🔍</div>
            <h4>No Places Found</h4>
            <p>Try resetting search or picking another category.</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="reset-filter-btn"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPlaces.map(place => {
            const isActive = activePlace && (activePlace.id === place.id || activePlace.destination === place.destination);

            return (
              <div
                key={place.id || place.destination}
                onClick={() => onSelectPlace(place)}
                className={`place-card-item ${isActive ? 'active' : ''}`}
              >
                {/* Place Image Thumbnail */}
                <div className="place-card-thumb">
                  <img src={place.image} alt={place.destination} loading="lazy" />
                  <span className="place-cat-badge">{place.category}</span>
                </div>

                {/* Place Content Details */}
                <div className="place-card-body">
                  <div className="place-header-row">
                    <h3 className="place-card-title">{place.destination}</h3>
                    {place.district && (
                      <span className="place-district-tag">
                        <MapPin size={12} /> {place.district}
                      </span>
                    )}
                  </div>

                  <p className="place-card-desc">
                    {place.short_description || place.description}
                  </p>

                  <div className="place-card-footer">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlace(place);
                      }} 
                      className="focus-3d-btn"
                    >
                      <Navigation size={12} /> Focus 3D Map
                    </button>
                    {place.slug && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/places/${place.slug}`);
                        }}
                        className="explore-dest-btn"
                      >
                        Explore <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
