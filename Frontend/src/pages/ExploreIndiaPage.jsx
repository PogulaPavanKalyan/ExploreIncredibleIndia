import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, MapPin, Sparkles, Filter, Grid, List, Search, 
  X, ChevronRight, Navigation, Layers, RotateCcw, ArrowRight, Home
} from 'lucide-react';

function formatBreadcrumbLabel(str) {
  if (!str || str === 'all') return '';
  const labelMap = {
    'mountains': 'Mountains',
    'beaches': 'Beaches',
    'temples': 'Temples',
    'heritage': 'Heritage',
    'nature': 'Nature',
    'wildlife': 'Wildlife',
    'waterfalls': 'Waterfalls',
    'adventure': 'Adventure',
    'food-culture': 'Food & Culture',
    'spiritual': 'Spiritual',
    'south-india': 'South India',
    'north-india': 'North India',
    'west-india': 'West India',
    'east-india': 'East India',
    'central-india': 'Central India',
    'northeast-india': 'Northeast India',
    'jyotirlingas': '12 Jyotirlingas'
  };
  if (labelMap[str.toLowerCase()]) return labelMap[str.toLowerCase()];

  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}
import { 
  getDestinations, 
  getPlatformStats, 
  getDistricts,
  getNearbyDestinations 
} from '../services/destinationService';
import { getStates } from '../services/stateService';
import DestinationCard from '../components/home/TrendingDestinations/DestinationCard';
import '../components/home/TrendingDestinations/TrendingDestinations.css';
import PageTransition from '../components/PageTransition';
import InteractiveRegionMap from '../components/explore/InteractiveRegionMap';
import IndiaByInterest from '../components/explore/IndiaByInterest';
import { handleDestinationImageError } from '../utils/imageUrl';
import './ExploreIndiaPage.css';

const REGIONS = [
  { id: 'all', label: 'ALL REGIONS' },
  { id: 'south-india', label: 'SOUTH INDIA' },
  { id: 'north-india', label: 'NORTH INDIA' },
  { id: 'west-india', label: 'WEST INDIA' },
  { id: 'east-india', label: 'EAST INDIA' },
  { id: 'central-india', label: 'CENTRAL INDIA' },
  { id: 'northeast-india', label: 'NORTHEAST' },
];

const CATEGORIES = [
  { id: 'all', label: 'ALL CATEGORIES' },
  { id: 'temples', label: 'TEMPLES & PILGRIMAGE' },
  { id: 'spiritual', label: 'SPIRITUAL & SACRED' },
  { id: 'beaches', label: 'BEACHES & COASTAL' },
  { id: 'mountains', label: 'MOUNTAINS & HILLS' },
  { id: 'heritage', label: 'HERITAGE & FORTS' },
  { id: 'nature', label: 'WATERFALLS & NATURE' },
  { id: 'wildlife', label: 'WILDLIFE & SAFARIS' },
  { id: 'adventure', label: 'ADVENTURE & TREKKING' },
  { id: 'food', label: 'FOOD & CULTURE' },
];

const ACTIVITIES = [
  { id: 'trekking', label: 'Trekking' },
  { id: 'hiking', label: 'Hiking' },
  { id: 'camping', label: 'Camping' },
  { id: 'rafting', label: 'Rafting' },
  { id: 'boating', label: 'Boating' },
  { id: 'photography', label: 'Photography' },
  { id: 'heritage-walk', label: 'Heritage Walk' },
  { id: 'skiing', label: 'Skiing' },
];

export default function ExploreIndiaPage() {
  const { slug, category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Deduce initial filters from either route slug or searchParams
  const deduceSlugFilter = () => {
    const filters = {};
    if (category) {
      filters.category = category.toLowerCase();
    }
    if (!slug) return filters;
    const sl = slug.toLowerCase();
    if (REGIONS.some(r => r.id === sl)) {
      filters.region = sl;
    } else if (CATEGORIES.some(c => c.id === sl)) {
      filters.category = sl;
    } else if (sl === 'historical') {
      filters.category = 'heritage';
    } else if (sl === 'waterfalls') {
      filters.category = 'nature';
    } else if (sl === 'trekking') {
      filters.category = 'adventure';
      filters.activity = 'trekking';
    } else if (sl === 'jyotirlingas') {
      filters.collection = 'jyotirlinga';
    } else {
      filters.state = sl;
    }
    return filters;
  };

  const initialRouteFilters = deduceSlugFilter();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedRegion, setSelectedRegion] = useState(initialRouteFilters.region || searchParams.get('region') || 'all');
  const [selectedState, setSelectedState] = useState(initialRouteFilters.state || searchParams.get('state') || 'all');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(initialRouteFilters.category || searchParams.get('category') || 'all');
  const [selectedActivity, setSelectedActivity] = useState(initialRouteFilters.activity || searchParams.get('activity') || 'all');
  const [selectedCollection, setSelectedCollection] = useState(initialRouteFilters.collection || searchParams.get('collection') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [viewMode, setViewMode] = useState('grid');

  // GPS Nearby Mode
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Data State
  const [destinations, setDestinations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Platform Stats and States list
  useEffect(() => {
    getPlatformStats()
      .then((res) => {
        if (res && res.data) setStats(res.data);
      })
      .catch((err) => console.warn('Stats error:', err));

    getStates()
      .then((res) => {
        if (res && res.data) setStatesList(res.data);
      })
      .catch((err) => console.warn('States list error:', err));
  }, []);

  // 2. Fetch Districts whenever selectedState changes
  useEffect(() => {
    if (selectedState && selectedState !== 'all') {
      getDistricts(selectedState)
        .then((res) => {
          if (res && res.data) setDistrictsList(res.data);
        })
        .catch(() => setDistrictsList([]));
    } else {
      setDistrictsList([]);
      setSelectedDistrict('all');
    }
  }, [selectedState]);

  // 3. Fetch Destinations based on active multi-filters
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (userCoords) {
      // Nearby mode
      getNearbyDestinations(userCoords.latitude, userCoords.longitude, 250, selectedCategory !== 'all' ? selectedCategory : undefined)
        .then((res) => {
          if (isMounted && res && res.data) {
            setDestinations(res.data);
            setTotalCount(res.data.length);
          }
        })
        .catch(() => {
          if (isMounted) {
            setDestinations([]);
            setTotalCount(0);
          }
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
      return;
    }

    const params = {
      page_size: 40,
    };

    if (searchQuery.trim()) params.q = searchQuery.trim();
    if (selectedRegion !== 'all') params.region = selectedRegion;
    if (selectedState !== 'all') params.state = selectedState;
    if (selectedDistrict !== 'all') params.district = selectedDistrict;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedActivity !== 'all') params.activity = selectedActivity;
    if (selectedCollection !== 'all') params.pilgrimage_collection = selectedCollection;
    if (sortBy) params.sort = sortBy;

    // Sync to URL
    const newParams = {};
    Object.keys(params).forEach((k) => {
      if (params[k] && params[k] !== 'all') newParams[k] = params[k];
    });
    setSearchParams(newParams, { replace: true });

    getDestinations(params)
      .then((res) => {
        if (isMounted && res && res.data) {
          setDestinations(res.data);
          const count = res.pagination?.total !== undefined ? res.pagination.total : res.data.length;
          setTotalCount(count);
        }
      })
      .catch((err) => {
        console.error('Error fetching atlas destinations:', err);
        if (isMounted) {
          setDestinations([]);
          setTotalCount(0);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    searchQuery,
    selectedRegion,
    selectedState,
    selectedDistrict,
    selectedCategory,
    selectedActivity,
    selectedCollection,
    sortBy,
    userCoords
  ]);

  // Handle Region Selection from Map or Pill Bar
  const handleSelectRegion = (regionId) => {
    setUserCoords(null);
    setSelectedRegion(regionId);
    setSelectedState('all');
    setSelectedDistrict('all');
  };

  // Handle Interest Theme Click
  const handleSelectTheme = (theme) => {
    setUserCoords(null);
    if (theme.category) setSelectedCategory(theme.category);
    if (theme.tag) setSelectedActivity(theme.tag);
    // Smooth scroll down to destination results
    const destSection = document.getElementById('destinations-results-grid');
    if (destSection) {
      destSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Geolocation "Near Me"
  const handleNearMeClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setSelectedRegion('all');
        setSelectedState('all');
      },
      (err) => {
        setIsLocating(false);
        alert("Unable to retrieve your location. Showing all destinations.");
      }
    );
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedCategory('all');
    setSelectedActivity('all');
    setSelectedCollection('all');
    setUserCoords(null);
  };

  // Active State Object for Banner
  const activeStateObj = statesList.find(s => s.slug === selectedState || s.name.toLowerCase() === selectedState.toLowerCase());

  // Dynamic Region Destination Counts
  const regionCounts = {
    'south-india': stats?.regions?.['south-india'] || 16,
    'north-india': stats?.regions?.['north-india'] || 9,
    'west-india': stats?.regions?.['west-india'] || 4,
    'east-india': stats?.regions?.['east-india'] || 3,
    'central-india': stats?.regions?.['central-india'] || 2,
    'northeast-india': stats?.regions?.['northeast-india'] || 2
  };

  return (
    <PageTransition>
      <div className="explore-page-root">
        
        {/* Dynamic Sleek Glassmorphic Breadcrumbs Bar */}
        <div className="explore-breadcrumbs-bar">
          <div className="explore-breadcrumbs-container">
            <Link to="/" className="breadcrumb-item-link">
              <Home size={14} className="breadcrumb-icon" />
              <span>Home</span>
            </Link>

            <ChevronRight size={14} className="breadcrumb-separator" />

            <Link to="/explore-india" className="breadcrumb-item-link active-base">
              <Compass size={14} className="breadcrumb-icon" />
              <span>Explore Atlas</span>
            </Link>

            {selectedRegion !== 'all' && (
              <>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-pill region-pill">
                  <MapPin size={12} />
                  <span>{formatBreadcrumbLabel(selectedRegion)}</span>
                </span>
              </>
            )}

            {activeStateObj && (
              <>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-pill state-pill">
                  <span>📍 {activeStateObj.name}</span>
                </span>
              </>
            )}

            {selectedCategory !== 'all' && (
              <>
                <ChevronRight size={14} className="breadcrumb-separator" />
                <span className="breadcrumb-pill category-pill">
                  <Sparkles size={12} />
                  <span>{formatBreadcrumbLabel(selectedCategory)}</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Cinematic Hero Section */}
        <section className="explore-hero-section">
          <div className="explore-hero-glow" />
          <div className="explore-container relative z-10 text-center">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="explore-hero-badge">
                <Compass className="w-4 h-4 text-orange-400 animate-spin-slow" />
                <span>ALL-INDIA TOURISM DISCOVERY</span>
              </div>

              <h1 className="explore-hero-title">
                Explore <span className="gradient-text">Incredible India</span>
              </h1>

              <p className="explore-hero-subtitle">
                From Himalayan snow peaks to tropical coastal backwaters, discover verified heritage, sacred temples, and offbeat adventures.
              </p>
            </motion.div>

            {/* Quick Live Stats Pills */}
            <div className="explore-stats-pills">
              <div className="stat-pill">
                <span className="stat-num">{stats?.total_destinations || totalCount || 50}+</span>
                <span className="stat-label">Destinations</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num">{stats?.total_states || statesList.length || 28}</span>
                <span className="stat-label">States & UTs</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num">6</span>
                <span className="stat-label">Macro Regions</span>
              </div>
              <div className="stat-pill">
                <span className="stat-num">100%</span>
                <span className="stat-label">Verified Data</span>
              </div>
            </div>

          </div>
        </section>

        {/* Main Content Area */}
        <div className="explore-container py-8">
          
          {/* Interactive Region Map & Mobile Selector */}
          <InteractiveRegionMap
            selectedRegion={selectedRegion}
            onSelectRegion={handleSelectRegion}
            statsByRegion={regionCounts}
          />

          {/* Active State / Region Dynamic Showcase Banner */}
          {activeStateObj && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="active-state-banner"
            >
              <div className="banner-left">
                <span className="banner-tag">EXPLORING STATE</span>
                <h2 className="banner-state-name">{activeStateObj.name}</h2>
                <p className="banner-desc">
                  {activeStateObj.description || `Discover sacred temples, scenic nature, and rich cultural traditions across ${activeStateObj.name}.`}
                </p>
                <div className="banner-metrics">
                  <span className="metric-item">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <b>{totalCount}</b> Destinations in {activeStateObj.name}
                  </span>
                  {activeStateObj.capital && (
                    <span className="metric-item">
                      <MapPin className="w-4 h-4 text-teal-400" />
                      Capital: <b>{activeStateObj.capital}</b>
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setSelectedState('all')}
                className="banner-close-btn"
                title="Clear state filter"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Explore by Interest (Curated Thematic Grid) */}
          <IndiaByInterest onSelectTheme={handleSelectTheme} />

          {/* Filter & Search Bar Section */}
          <div id="destinations-results-grid" className="explore-filter-toolbar">
            
            <div className="search-input-box">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setUserCoords(null);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Filter places in India (e.g. Munnar, Tirupati, Trekking)..."
                className="search-text-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-btn">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>

            <div className="toolbar-actions">
              {/* Geolocation Button */}
              <button
                onClick={handleNearMeClick}
                className={`near-me-btn ${userCoords ? 'active' : ''}`}
                title="Discover places near my current GPS location"
              >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{userCoords ? 'Near My Location' : 'Places Near Me'}</span>
              </button>

              {/* State Dropdown Selector */}
              <select
                value={selectedState}
                onChange={(e) => {
                  setUserCoords(null);
                  setSelectedState(e.target.value);
                }}
                className="toolbar-select"
              >
                <option value="all">All States & UTs</option>
                {statesList.map((st) => (
                  <option key={st.id || st.slug} value={st.slug || st.name}>
                    {st.name}
                  </option>
                ))}
              </select>

              {/* District Dropdown Selector (if state selected) */}
              {districtsList.length > 0 && (
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="all">All Districts</option>
                  {districtsList.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              )}

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="toolbar-select"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>

              {/* Grid / List View Toggle */}
              <div className="view-toggle-group">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Category Chips Bar */}
          <div className="category-chips-bar">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`cat-chip-btn ${isSelected ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Active Filter Tags Row with Reset */}
          {(selectedRegion !== 'all' || selectedState !== 'all' || selectedCategory !== 'all' || selectedActivity !== 'all' || userCoords || searchQuery) && (
            <div className="active-filters-row">
              <span className="text-xs font-bold text-slate-400">ACTIVE FILTERS:</span>
              
              {selectedRegion !== 'all' && (
                <span className="filter-pill">
                  Region: {selectedRegion.replace('-', ' ')}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedRegion('all')} />
                </span>
              )}
              {selectedState !== 'all' && (
                <span className="filter-pill">
                  State: {selectedState}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedState('all')} />
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="filter-pill">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedActivity !== 'all' && (
                <span className="filter-pill">
                  Activity: {selectedActivity}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedActivity('all')} />
                </span>
              )}
              {userCoords && (
                <span className="filter-pill gps">
                  📍 Near GPS Location
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setUserCoords(null)} />
                </span>
              )}

              <button onClick={handleResetFilters} className="reset-all-btn">
                <RotateCcw className="w-3 h-3" /> Reset All
              </button>
            </div>
          )}

          {/* Results Summary Bar */}
          <div className="results-summary-bar">
            <h3 className="results-heading">
              {isLoading ? 'Discovering destinations...' : `Showing ${totalCount} Indian Destination${totalCount === 1 ? '' : 's'}`}
            </h3>
            {userCoords && (
              <span className="gps-indicator">
                <Compass className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                Sorted by direct proximity from your location
              </span>
            )}
          </div>

          {/* Destinations Grid / List Display */}
          {isLoading ? (
            <div className="destinations-skeleton-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <div className={`destinations-display-layout ${viewMode}`}>
              {destinations.map((dest) => (
                <DestinationCard
                  key={dest.id || dest.slug}
                  destination={dest}
                />
              ))}
            </div>
          ) : (
            <div className="no-destinations-box">
              <Compass className="w-12 h-12 text-slate-500 mx-auto mb-3 animate-pulse" />
              <h4 className="text-xl font-bold text-slate-200">No destinations found matching your criteria</h4>
              <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
                Try clearing active filters or exploring other states and categories across India.
              </p>
              <button onClick={handleResetFilters} className="clear-filter-btn">
                Reset Filters & Explore All India
              </button>
            </div>
          )}

        </div>

      </div>
    </PageTransition>
  );
}
