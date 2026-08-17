import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Compass, Building, Grid, Sparkles, ArrowLeft } from 'lucide-react';
import { globalSearch } from '../services/searchService';
import DestinationCard from '../components/DestinationCard';
import PageTransition from '../components/PageTransition';
import SkeletonGrid from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import SearchAutocomplete from '../components/search/SearchAutocomplete';
import { buildMediaUrl, getDestinationPlaceholder, handleImageError } from '../utils/imageUtils';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');

  const [results, setResults] = useState({ destinations: [], states: [], cities: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults({ destinations: [], states: [], cities: [], categories: [] });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await globalSearch(query);
        if (res && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error("Error executing search:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const totalDestinations = results.destinations?.length || 0;
  const totalStates = results.states?.length || 0;
  const totalCities = results.cities?.length || 0;
  const totalCategories = results.categories?.length || 0;
  const totalCount = totalDestinations + totalStates + totalCities + totalCategories;

  return (
    <PageTransition>
      <div className="search-results-page" style={{ minHeight: '80vh', padding: '2.5rem 0', background: 'var(--light-bg)' }}>
        <div className="container">
          {/* Top Search Input Header */}
          <div style={{ maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
            <SearchAutocomplete
              placeholder="Search destinations, states, or natural queries (e.g. waterfalls near Hyderabad)..."
              onSearchSubmit={(q) => setSearchParams({ q })}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Link to="/explore" style={{ color: '#FF6B35', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
              <ArrowLeft size={16} /> Explore All Places
            </Link>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginTop: '0.5rem' }}>
              {query ? `Search Results for "${query}"` : 'Advanced India Travel Search'}
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
              Found {totalCount} matching result{totalCount === 1 ? '' : 's'} across India
            </p>
          </div>

          {/* Categorized Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', overflowX: 'auto' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                background: activeTab === 'all' ? '#0F172A' : 'transparent',
                color: activeTab === 'all' ? '#ffffff' : '#64748B',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Results ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('destinations')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                background: activeTab === 'destinations' ? '#FF6B35' : 'transparent',
                color: activeTab === 'destinations' ? '#ffffff' : '#64748B',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Destinations ({totalDestinations})
            </button>
            <button
              onClick={() => setActiveTab('states')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                background: activeTab === 'states' ? '#0284C7' : 'transparent',
                color: activeTab === 'states' ? '#ffffff' : '#64748B',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              States ({totalStates})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: 'none',
                background: activeTab === 'categories' ? '#D97706' : 'transparent',
                color: activeTab === 'categories' ? '#ffffff' : '#64748B',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Categories ({totalCategories})
            </button>
          </div>

          {/* Results Content Body */}
          {loading ? (
            <SkeletonGrid count={6} />
          ) : totalCount === 0 ? (
            <ErrorState
              title="No Places Found"
              message={`We couldn't find any tourist spots matching "${query}". Try searching for popular destinations like "Goa", "Araku Valley", or "Kerala".`}
            />
          ) : (
            <div>
              {/* Destinations Section */}
              {(activeTab === 'all' || activeTab === 'destinations') && totalDestinations > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                    Destinations ({totalDestinations})
                  </h3>
                  <div className="grid-destinations">
                    {results.destinations.map(place => (
                      <DestinationCard key={place.id} destination={place} />
                    ))}
                  </div>
                </div>
              )}

              {/* States Section */}
              {(activeTab === 'all' || activeTab === 'states') && totalStates > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                    States ({totalStates})
                  </h3>
                  <div className="grid-states">
                    {results.states.map(state => {
                      const stateImg = state.image || state.banner_image || state.thumbnail_image
                        ? buildMediaUrl(state.image || state.banner_image || state.thumbnail_image)
                        : getDestinationPlaceholder(state.name);
                      return (
                        <Link key={state.id} to={`/explore?state=${state.slug}`} className="state-card">
                          <img src={stateImg} alt={state.name} loading="lazy" onError={(e) => handleImageError(e, state.name)} />
                          <div className="state-card-overlay">
                            <h3>{state.name}</h3>
                            <p>{state.destinations_count || 5}+ Places to Explore</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories Section */}
              {(activeTab === 'all' || activeTab === 'categories') && totalCategories > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                    Categories ({totalCategories})
                  </h3>
                  <div className="grid-categories">
                    {results.categories.map(cat => {
                      const catImg = cat.image
                        ? buildMediaUrl(cat.image)
                        : getDestinationPlaceholder(cat.name);
                      return (
                        <Link key={cat.id} to={`/explore?category=${cat.slug}`} className="category-card">
                          <div className="category-image">
                            <img src={catImg} alt={cat.name} loading="lazy" onError={(e) => handleImageError(e, cat.name)} />
                          </div>
                          <div className="category-info">
                            <h4>{cat.name}</h4>
                            <span>{cat.destinations_count || 10}+ Destinations</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
