import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import { getDestinations } from '../services/destinationService';
import { getStates } from '../services/stateService';
import { getCategories } from '../services/categoryService';
import DestinationCard from '../components/DestinationCard';
import PageTransition from '../components/PageTransition';
import SkeletonGrid from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import Advertisement from '../components/Advertisement';
import FilterDrawer from '../components/FilterDrawer';
import '../styles/explore.css';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialState = searchParams.get('state') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const [destinations, setDestinations] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, total_pages: 1 });
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadInitialFilterOptions = async () => {
      try {
        const [statesRes, catRes] = await Promise.all([
          getStates({ page_size: 50 }),
          getCategories({ page_size: 50 })
        ]);
        if (statesRes.data) setStatesList(statesRes.data);
        if (catRes.data) setCategoriesList(catRes.data);
      } catch (err) {
        console.error("Error loading filter lists:", err);
      }
    };
    loadInitialFilterOptions();
  }, []);

  const fetchFilteredData = async () => {
    setLoading(true);
    setError(false);
    try {
      const params = {
        search: query,
        state: selectedState,
        category: selectedCategory,
        budget: selectedBudget,
        travel_style: selectedStyle,
        sort: sortBy,
        page: pagination.page
      };
      const res = await getDestinations(params);
      if (res.data) {
        setDestinations(res.data);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.error("Error fetching places:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [query, selectedState, selectedCategory, selectedBudget, selectedStyle, sortBy, pagination.page]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedState('');
    setSelectedCategory('');
    setSelectedBudget('');
    setSelectedStyle('');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <PageTransition>
      <div className="explore-page section-padding">
        <div className="container">
          <div className="explore-header">
            <div>
              <span className="badge badge-primary">Discover India</span>
              <h1 className="explore-title">Explore All Tourist Destinations</h1>
            </div>

            <div className="explore-controls">
              {/* Mobile Filter Button */}
              <button
                className="btn-mobile-filter"
                onClick={() => setMobileFilterOpen(true)}
                aria-label="Open filter drawer"
              >
                <Filter size={18} /> Filters
              </button>

              <div className="sort-box">
                <ArrowUpDown size={16} />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort destinations">
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newly Added</option>
                  <option value="name">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="explore-page-container">
            {/* Left Desktop Filter Sidebar */}
            <aside className="filter-sidebar">
              <div className="filter-header">
                <div className="filter-title">
                  <SlidersHorizontal size={18} /> <span>Filters</span>
                </div>
                <button className="btn-clear-filters" onClick={handleClearFilters}>
                  <RotateCcw size={14} /> Clear
                </button>
              </div>

              <div className="filter-group">
                <label>Search Keyword</label>
                <div className="filter-search-input">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Filter by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>Select State / UT</label>
                <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                  <option value="">All Indian States</option>
                  {statesList.map(s => (
                    <option key={s.id} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Destination Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categoriesList.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Budget Level</label>
                <select value={selectedBudget} onChange={(e) => setSelectedBudget(e.target.value)}>
                  <option value="">Any Budget</option>
                  <option value="low">Budget / Economy</option>
                  <option value="medium">Moderate</option>
                  <option value="high">Luxury</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Travel Style</label>
                <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
                  <option value="">All Travel Styles</option>
                  <option value="family">Family Friendly</option>
                  <option value="couple">Romantic / Couple</option>
                  <option value="solo">Solo Travel</option>
                  <option value="adventure">Adventure</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="nature">Nature & Hill Station</option>
                  <option value="historical">Historical & Heritage</option>
                  <option value="beach">Beach Coastal</option>
                </select>
              </div>
            </aside>

            {/* Center Main Destination Content */}
            <main className="explore-main">
              {loading ? (
                <SkeletonGrid count={6} />
              ) : error ? (
                <ErrorState
                  title="Unable to load destinations"
                  message="There was an error communicating with the server."
                  onRetry={fetchFilteredData}
                />
              ) : destinations.length === 0 ? (
                <div className="empty-state-box">
                  <h3>No Destinations Found</h3>
                  <p>Try adjusting your search query or clearing your filter criteria.</p>
                  <button className="btn-cta-planner" onClick={handleClearFilters}>Reset All Filters</button>
                </div>
              ) : (
                <>
                  <div className="grid-destinations">
                    {destinations.map(d => (
                      <DestinationCard key={d.id} destination={d} />
                    ))}
                  </div>

                  {/* Inline Mobile/Tablet Advertisement */}
                  <Advertisement type="inline" index={1} />

                  {pagination.total_pages > 1 && (
                    <div className="pagination-wrap">
                      <button
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        Previous
                      </button>
                      <span>Page {pagination.page} of {pagination.total_pages}</span>
                      <button
                        disabled={pagination.page >= pagination.total_pages}
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>

            {/* Right Desktop Sticky Side Ad */}
            <aside className="explore-ad-col">
              <Advertisement type="sidebar-right" index={0} />
            </aside>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
          statesList={statesList}
          categoriesList={categoriesList}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          onClear={handleClearFilters}
        />
      </div>
    </PageTransition>
  );
}


