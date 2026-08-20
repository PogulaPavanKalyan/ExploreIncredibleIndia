import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  searchDestinations, 
  getSearchAutocomplete,
  getPlatformStats
} from '../services/destinationService';
import { getRegions } from '../services/regionService';
import { getCategories } from '../services/categoryService';
import PageTransition from '../components/PageTransition';
import DestinationImage from '../components/common/DestinationImage';
import { 
  Search, MapPin, Navigation, Compass, SlidersHorizontal, 
  X, Check, Star, Clock, Calendar, ArrowRight, Sparkles, 
  AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import './SearchResultsPage.css';

const SAMPLE_QUERIES = [
  "best trekking places near Hyderabad",
  "temples near Vijayawada",
  "best beaches in Kerala",
  "Jyotirlingas in India",
  "places to visit in Tamil Nadu",
  "best waterfalls near Bangalore",
  "historical places in Rajasthan",
  "best Himalayan destinations",
  "wildlife places near Mumbai",
  "weekend trips from Hyderabad",
  "spiritual places in South India"
];

const REGION_OPTIONS = [
  { id: 'all', label: 'All Regions' },
  { id: 'south-india', label: 'South India' },
  { id: 'north-india', label: 'North India' },
  { id: 'west-india', label: 'West India' },
  { id: 'east-india', label: 'East India' },
  { id: 'central-india', label: 'Central India' },
  { id: 'northeast-india', label: 'Northeast India' }
];

const CATEGORY_OPTIONS = [
  { id: 'all', label: 'All Categories' },
  { id: 'temples', label: 'Temples' },
  { id: 'beaches', label: 'Beaches' },
  { id: 'trekking', label: 'Trekking' },
  { id: 'mountains', label: 'Mountains' },
  { id: 'waterfalls', label: 'Waterfalls' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'historical', label: 'Historical' },
  { id: 'adventure', label: 'Adventure' }
];

const RADIUS_OPTIONS = [
  { id: 'all', label: 'Any Distance' },
  { id: '25', label: '< 25 km' },
  { id: '50', label: '< 50 km' },
  { id: '100', label: '< 100 km' },
  { id: '200', label: '< 200 km' }
];

const DURATION_OPTIONS = [
  { id: 'all', label: 'Any Duration' },
  { id: '1_day', label: '1 Day' },
  { id: 'weekend', label: 'Weekend (2 Days)' },
  { id: 'multi_day', label: '3+ Days' }
];

const RATING_OPTIONS = [
  { id: 'all', label: 'All Ratings' },
  { id: '4.5', label: '4.5+ ★ Outstanding' },
  { id: '4.0', label: '4.0+ ★ Very Good' }
];

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'nearest', label: 'Nearest' },
  { id: 'highest_rated', label: 'Highest Rated' },
  { id: 'popular', label: 'Popular' },
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' }
];

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const rawQuery = searchParams.get('q') || '';
  const urlLat = searchParams.get('lat');
  const urlLng = searchParams.get('lng');
  const initialCategory = searchParams.get('category') || 'all';
  const initialRegion = searchParams.get('region') || 'all';
  const initialSort = searchParams.get('sort') || 'relevance';

  const [inputQuery, setInputQuery] = useState(rawQuery);
  const [userCoords, setUserCoords] = useState(urlLat && urlLng ? { lat: urlLat, lng: urlLng } : null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsErrorMsg, setGpsErrorMsg] = useState('');

  // Results State
  const [results, setResults] = useState([]);
  const [intent, setIntent] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Filters State
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRadius, setSelectedRadius] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState(initialSort);

  // Mobile Filter Drawer State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Autocomplete State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef(null);

  // 1. Fetch Search Results
  const fetchResults = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const extraFilters = {
        sort: sortBy
      };
      if (selectedRegion !== 'all') extraFilters.region = selectedRegion;
      if (selectedCategory !== 'all') extraFilters.category = selectedCategory;
      if (selectedDuration !== 'all') extraFilters.duration = selectedDuration;
      if (selectedRating !== 'all') extraFilters.rating = selectedRating;
      if (selectedRadius !== 'all') extraFilters.radius = selectedRadius;

      const res = await searchDestinations(rawQuery || 'near me', userCoords, extraFilters);
      if (res && res.data) {
        let destList = res.data.destinations || [];
        
        // Client-side quick filter guards if API already scored
        if (selectedRadius !== 'all') {
          const maxR = parseFloat(selectedRadius);
          destList = destList.filter(d => d.distance_km === undefined || d.distance_km === null || d.distance_km <= maxR);
        }
        if (selectedRating !== 'all') {
          const minR = parseFloat(selectedRating);
          destList = destList.filter(d => parseFloat(d.avg_rating || 0) >= minR);
        }

        setResults(destList);
        setIntent(res.data.intent || {});
        setTotalCount(res.data.total_destinations || destList.length);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      setTotalCount(0);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [rawQuery, userCoords, sortBy, selectedRegion, selectedCategory, selectedRadius, selectedDuration, selectedRating]);

  // 2. Autocomplete Suggestions Debounced
  useEffect(() => {
    let timer;
    if (inputQuery.trim().length >= 2 && showSuggestions) {
      timer = setTimeout(() => {
        getSearchAutocomplete(inputQuery.trim())
          .then((res) => {
            if (res && res.data) setSuggestions(res.data);
          })
          .catch(() => setSuggestions([]));
      }, 200);
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(timer);
  }, [inputQuery, showSuggestions]);

  // Click outside autocomplete dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (queryText) => {
    const q = queryText !== undefined ? queryText : inputQuery;
    setShowSuggestions(false);
    setGpsErrorMsg('');
    const newParams = new URLSearchParams();
    if (q) newParams.set('q', q);
    if (userCoords?.lat && userCoords?.lng) {
      newParams.set('lat', userCoords.lat);
      newParams.set('lng', userCoords.lng);
    }
    if (selectedCategory !== 'all') newParams.set('category', selectedCategory);
    if (selectedRegion !== 'all') newParams.set('region', selectedRegion);
    if (sortBy !== 'relevance') newParams.set('sort', sortBy);
    setSearchParams(newParams);
  };

  const handleGpsRequest = () => {
    if (!navigator.geolocation) {
      setGpsErrorMsg('Geolocation is not supported by your browser. Please search by city.');
      return;
    }
    setIsGpsLoading(true);
    setGpsErrorMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude.toFixed(4), lng: pos.coords.longitude.toFixed(4) };
        setUserCoords(coords);
        setIsGpsLoading(false);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('lat', coords.lat);
        newParams.set('lng', coords.lng);
        if (!rawQuery) newParams.set('q', 'places near me');
        setSearchParams(newParams);
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsErrorMsg('Location access was not allowed. Search by city instead.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetFilters = () => {
    setSelectedRegion('all');
    setSelectedCategory('all');
    setSelectedRadius('all');
    setSelectedDuration('all');
    setSelectedRating('all');
    setSortBy('relevance');
    setIsMobileDrawerOpen(false);
  };

  const hasActiveFilters = selectedRegion !== 'all' || selectedCategory !== 'all' || selectedRadius !== 'all' || selectedDuration !== 'all' || selectedRating !== 'all';

  return (
    <PageTransition>
      <div className="nlp-search-page" id="search-root">
        
        {/* TOP SEARCH HERO BANNER */}
        <section className="nlp-search-hero">
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FF6B1A', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'inline-block', marginBottom: '0.5rem' }}>
              ✦ SMART TRAVEL DISCOVERY
            </span>
            <h1 className="nlp-search-title">
              Explore India by Natural Query & Distance
            </h1>
            <p className="nlp-search-subtitle">
              Discover verified temples, trekking escapes, secluded beaches, and historic forts with exact distance calculations.
            </p>

            {/* Central Smart Search Bar */}
            <div className="nlp-input-wrapper" ref={searchWrapRef} style={{ maxWidth: '780px', margin: '1.75rem auto 1rem auto' }}>
              <div className="nlp-input-bar">
                <Search size={22} className="nlp-search-icon" color="#FF6B1A" />
                <input
                  type="text"
                  placeholder="Where do you want to explore in India?"
                  value={inputQuery}
                  onChange={(e) => {
                    setInputQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  className="nlp-search-field"
                  aria-label="Search destination"
                  id="smart-search-input"
                />
                {inputQuery && (
                  <button
                    className="nlp-clear-btn"
                    onClick={() => {
                      setInputQuery('');
                      setSuggestions([]);
                    }}
                    aria-label="Clear search input"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  className="nlp-submit-btn"
                  onClick={() => handleSearchSubmit()}
                  id="btn-submit-search"
                >
                  <span>Search</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="nlp-autocomplete-dropdown" role="listbox">
                  {suggestions.map((sug, i) => (
                    <div
                      key={i}
                      className="nlp-autocomplete-item"
                      onClick={() => {
                        setInputQuery(sug);
                        handleSearchSubmit(sug);
                      }}
                    >
                      <Compass size={15} color="#FF6B1A" />
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Location & Sample Queries */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button
                onClick={handleGpsRequest}
                disabled={isGpsLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: userCoords ? '#10B981' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '0.45rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                id="btn-use-location"
              >
                <Navigation size={14} fill={userCoords ? "#ffffff" : "none"} />
                {isGpsLoading ? 'Locating...' : userCoords ? 'Location Active' : 'Use My Location'}
              </button>

              {/* Sample Quick Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {SAMPLE_QUERIES.slice(0, 4).map((sq) => (
                  <button
                    key={sq}
                    onClick={() => {
                      setInputQuery(sq);
                      handleSearchSubmit(sq);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94A3B8',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '0.35rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>

            {gpsErrorMsg && (
              <p style={{ color: '#F87171', fontSize: '0.82rem', marginTop: '0.5rem' }}>
                <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {gpsErrorMsg}
              </p>
            )}

            {/* Extracted NLP Intent Summary Banner */}
            {intent && (intent.location_name || intent.category || intent.state_name || intent.max_distance_km) && (
              <div className="nlp-intent-summary-card" style={{ maxWidth: '820px', margin: '1.5rem auto 0 auto' }}>
                <div className="nlp-intent-badge-group">
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8' }}>INTENT RECOGNIZED:</span>
                  {intent.location_name && (
                    <span className="nlp-intent-pill location">📍 {intent.location_name}</span>
                  )}
                  {intent.state_name && (
                    <span className="nlp-intent-pill location">🗺️ {intent.state_name}</span>
                  )}
                  {intent.category && (
                    <span className="nlp-intent-pill category">★ {intent.subcategory || intent.category}</span>
                  )}
                  {intent.difficulty && (
                    <span className="nlp-intent-pill difficulty">🥾 {intent.difficulty.toUpperCase()}</span>
                  )}
                  {intent.max_distance_km && (
                    <span className="nlp-intent-pill radius">📏 Within {Math.round(intent.max_distance_km)} km</span>
                  )}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* RESULTS & FILTER SECTION */}
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem 1.5rem' }}>
          
          {/* Header Controls: Count, Mobile Filter Trigger, and Sorting */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF6B1A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SEARCH RESULTS
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '0.1rem 0 0 0' }}>
                {rawQuery ? `“${rawQuery}”` : 'Explore Destinations'}
              </h2>
              <span style={{ fontSize: '0.88rem', color: '#94A3B8', fontWeight: 600 }}>
                {totalCount} {totalCount === 1 ? 'destination found' : 'destinations found'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="mobile-filter-trigger-btn"
                style={{
                  display: 'none',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: hasActiveFilters ? '#FF6B1A' : '#1E293B',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
                id="btn-mobile-filters"
              >
                <SlidersHorizontal size={16} /> Filters {hasActiveFilters && '(Active)'}
              </button>

              {/* Sorting Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#1E293B', padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  id="select-sort-by"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id} style={{ background: '#0F172A', color: '#ffffff' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Layout: Desktop Sidebar (Left) + Results Grid (Right) */}
          <div className="search-layout-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* DESKTOP FILTER SIDEBAR */}
            <aside className="search-filter-sidebar" style={{ background: '#0F172A', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <SlidersHorizontal size={18} color="#FF6B1A" /> Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    style={{ background: 'none', border: 'none', color: '#FF6B1A', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Region Filter */}
              <div className="sidebar-filter-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.6rem' }}>
                  REGION
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {REGION_OPTIONS.map(r => (
                    <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: selectedRegion === r.id ? '#FF6B1A' : '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="region"
                        checked={selectedRegion === r.id}
                        onChange={() => setSelectedRegion(r.id)}
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="sidebar-filter-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.6rem' }}>
                  CATEGORY
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {CATEGORY_OPTIONS.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: selectedCategory === c.id ? '#FF6B1A' : '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === c.id}
                        onChange={() => setSelectedCategory(c.id)}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance Radius */}
              <div className="sidebar-filter-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.6rem' }}>
                  DISTANCE RADIUS
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {RADIUS_OPTIONS.map(rad => (
                    <label key={rad.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: selectedRadius === rad.id ? '#FF6B1A' : '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="radius"
                        checked={selectedRadius === rad.id}
                        onChange={() => setSelectedRadius(rad.id)}
                      />
                      {rad.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="sidebar-filter-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.6rem' }}>
                  DURATION
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {DURATION_OPTIONS.map(dur => (
                    <label key={dur.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: selectedDuration === dur.id ? '#FF6B1A' : '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="duration"
                        checked={selectedDuration === dur.id}
                        onChange={() => setSelectedDuration(dur.id)}
                      />
                      {dur.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="sidebar-filter-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.6rem' }}>
                  RATING
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {RATING_OPTIONS.map(rat => (
                    <label key={rat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: selectedRating === rat.id ? '#FF6B1A' : '#CBD5E1', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rat.id}
                        onChange={() => setSelectedRating(rat.id)}
                      />
                      {rat.label}
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* RESULTS LIST & CARDS */}
            <main className="search-results-list-wrap">
              {isLoading ? (
                /* Shimmer Skeletons */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ background: '#0F172A', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', height: '380px' }}>
                      <div style={{ height: '180px', background: 'rgba(255,255,255,0.05)' }} className="shimmer" />
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ width: '40%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '0.75rem' }} className="shimmer" />
                        <div style={{ width: '75%', height: '22px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginBottom: '0.75rem' }} className="shimmer" />
                        <div style={{ width: '90%', height: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} className="shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : hasError ? (
                /* Error State */
                <div style={{ background: '#0F172A', borderRadius: '20px', padding: '3.5rem 2rem', textAlign: 'center', border: '1px dashed rgba(239,68,68,0.3)' }}>
                  <AlertCircle size={44} color="#EF4444" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>Unable to load destinations</h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                    There was a problem retrieving search results. Please check your network or try again.
                  </p>
                  <button
                    onClick={fetchResults}
                    style={{ background: '#FF6B1A', color: '#ffffff', border: 'none', padding: '0.75rem 1.8rem', borderRadius: '25px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <RefreshCw size={15} /> Try Again
                  </button>
                </div>
              ) : results.length === 0 ? (
                /* No Results State with helpful alternative recommendations */
                <div style={{ background: '#0F172A', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.15)' }}>
                  <Compass size={48} color="#FF6B1A" style={{ margin: '0 auto 1.25rem auto' }} />
                  <h3 style={{ fontSize: '1.5rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.6rem' }}>
                    No Destinations Found for Your Search
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.75rem auto' }}>
                    We couldn't find matches for "{rawQuery}". Try expanding your distance radius or explore top Indian travel categories below:
                  </p>

                  {/* Alternative Discovery Suggestions */}
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '640px', margin: '0 auto' }}>
                    <button
                      onClick={handleResetFilters}
                      style={{ background: '#FF6B1A', color: '#ffffff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      Reset All Filters
                    </button>
                    <button
                      onClick={() => handleSearchSubmit("Temples in India")}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      🛕 Temples
                    </button>
                    <button
                      onClick={() => handleSearchSubmit("Best beaches in Kerala")}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      🏖️ Beaches
                    </button>
                    <button
                      onClick={() => handleSearchSubmit("Best trekking places near Hyderabad")}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      🥾 Trekking
                    </button>
                    <button
                      onClick={() => handleSearchSubmit("Jyotirlingas in India")}
                      style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', padding: '0.6rem 1.2rem', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      ★ Jyotirlingas
                    </button>
                  </div>
                </div>
              ) : (
                /* Results Grid with Result Cards */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
                  {results.map((dest, idx) => {
                    const stateTitle = dest.state?.name || dest.state_name || 'India';
                    const cityTitle = dest.city?.name || dest.city_name || dest.district || '';
                    const locationLabel = cityTitle ? `${cityTitle}, ${stateTitle}` : stateTitle;
                    const catTitle = dest.categories?.[0]?.name || dest.category_name || 'Destination';
                    const rating = dest.avg_rating ? parseFloat(dest.avg_rating).toFixed(1) : '4.8';

                    return (
                      <motion.div
                        key={dest.id || dest.slug}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
                        style={{
                          background: '#0F172A',
                          borderRadius: '24px',
                          border: '1px solid rgba(255,255,255,0.08)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                        }}
                        className="search-item-hover"
                      >
                        {/* Media Thumbnail Box */}
                        <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                          <DestinationImage
                            destination={dest}
                            src={dest.main_image}
                            alt={dest.name}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to top, rgba(15,23,42,0.9) 0%, transparent 60%)'
                          }} />

                          {/* Distance Tag if calculated */}
                          {dest.distance_km !== undefined && dest.distance_km !== null && (
                            <div style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              background: 'rgba(15, 23, 42, 0.85)',
                              backdropFilter: 'blur(8px)',
                              color: '#ffffff',
                              padding: '0.3rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              border: '1px solid rgba(255,255,255,0.15)'
                            }}>
                              <Navigation size={12} color="#FF6B1A" />
                              <span>~{dest.distance_km} km</span>
                            </div>
                          )}

                          {/* Category Tag */}
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            background: 'rgba(255, 107, 26, 0.25)',
                            color: '#FFB280',
                            border: '1px solid rgba(255, 107, 26, 0.4)',
                            backdropFilter: 'blur(6px)',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}>
                            {catTitle}
                          </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={13} color="#FF6B1A" /> {locationLabel}
                            </span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#F59E0B', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Star size={13} fill="#F59E0B" color="#F59E0B" /> {rating}
                            </span>
                          </div>

                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                            {dest.name}
                          </h3>

                          <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1rem 0', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {dest.short_description || dest.description || `Discover the heritage and attractions of ${dest.name}.`}
                          </p>

                          {/* Footer Meta & Explore Button */}
                          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                              {dest.best_time_to_visit && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Calendar size={12} /> {dest.best_time_to_visit}
                                </span>
                              )}
                            </div>

                            <Link
                              to={`/destinations/${dest.slug}`}
                              style={{
                                color: '#FF6B1A',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.35rem 0.75rem',
                                borderRadius: '8px',
                                background: 'rgba(255,107,26,0.1)',
                                transition: 'all 0.2s ease'
                              }}
                              id={`explore-btn-${dest.slug}`}
                            >
                              EXPLORE →
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </main>

          </div>
        </div>

        {/* MOBILE SLIDE-IN FILTER DRAWER (<768px) */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  background: '#0F172A',
                  width: '85%',
                  maxWidth: '360px',
                  height: '100%',
                  padding: '1.75rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    Filters
                  </h3>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Region Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    REGION
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {REGION_OPTIONS.map(r => (
                      <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: selectedRegion === r.id ? '#FF6B1A' : '#CBD5E1' }}>
                        <input
                          type="radio"
                          name="mob_region"
                          checked={selectedRegion === r.id}
                          onChange={() => setSelectedRegion(r.id)}
                        />
                        {r.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                    CATEGORY
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {CATEGORY_OPTIONS.map(c => (
                      <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: selectedCategory === c.id ? '#FF6B1A' : '#CBD5E1' }}>
                        <input
                          type="radio"
                          name="mob_category"
                          checked={selectedCategory === c.id}
                          onChange={() => setSelectedCategory(c.id)}
                        />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Drawer Footer Buttons */}
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleResetFilters}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: '#1E293B', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: '#FF6B1A', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
