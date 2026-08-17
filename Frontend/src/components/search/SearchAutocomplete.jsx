import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass, Sparkles, Clock, X, ArrowRight, Building, Grid } from 'lucide-react';
import { globalSearch } from '../../services/searchService';

const POPULAR_SEARCHES = [
  "Waterfalls near Hyderabad",
  "Beaches in Goa",
  "Hill stations",
  "Kerala",
  "Rajasthan Forts"
];

export default function SearchAutocomplete({ placeholder = "Search destinations, states, categories...", onSearchSubmit }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ destinations: [], states: [], cities: [], categories: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      setRecentSearches(saved.slice(0, 5));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search input trigger
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val.trim()) {
      setSuggestions({ destinations: [], states: [], cities: [], categories: [] });
      setIsOpen(true);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    debounceRef.current = setTimeout(async () => {
      const res = await globalSearch(val);
      if (res && res.data) {
        setSuggestions(res.data);
      }
      setLoading(false);
    }, 300);
  };

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    try {
      const saved = JSON.parse(localStorage.getItem('recent_searches') || '[]');
      const filtered = saved.filter(s => s.toLowerCase() !== term.toLowerCase());
      const updated = [term.trim(), ...filtered].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (err) {
      console.warn("Could not save search history:", err);
    }
  };

  const handleSearchExecute = (targetQuery) => {
    const q = targetQuery || query;
    if (!q || !q.trim()) return;
    saveRecentSearch(q);
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(q);
    } else {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchExecute();
    }
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    localStorage.removeItem('recent_searches');
    setRecentSearches([]);
  };

  const hasSuggestions =
    suggestions.destinations.length > 0 ||
    suggestions.states.length > 0 ||
    suggestions.cities.length > 0 ||
    suggestions.categories.length > 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Search Input Box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#ffffff',
        borderRadius: 'var(--radius-full, 9999px)',
        padding: '0.6rem 1.25rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        border: '1px solid var(--border-color)',
        transition: 'all 0.2s ease'
      }}>
        <Search size={18} color="#FF6B35" style={{ flexShrink: 0, marginRight: '0.75rem' }} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '0.95rem',
            color: '#0F172A',
            background: 'transparent'
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '0.2rem' }}
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => handleSearchExecute()}
          style={{
            background: 'var(--primary, #FF6B35)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            marginLeft: '0.5rem',
            flexShrink: 0
          }}
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Autocomplete Popup Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.2)',
          border: '1px solid #E2E8F0',
          zIndex: 100,
          padding: '1rem',
          maxHeight: '420px',
          overflowY: 'auto'
        }}>
          {loading && (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748B', fontSize: '0.88rem' }}>
              Searching incredible places...
            </div>
          )}

          {/* 1. Direct Suggestions List */}
          {!loading && query.trim() && hasSuggestions && (
            <div>
              {suggestions.destinations.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Destinations
                  </div>
                  {suggestions.destinations.map(d => (
                    <div
                      key={d.id}
                      onClick={() => { saveRecentSearch(d.name); setIsOpen(false); navigate(`/places/${d.slug}`); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.6rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      className="search-item-hover"
                    >
                      <MapPin size={15} color="#FF6B35" />
                      <div>
                        <strong style={{ fontSize: '0.88rem', color: '#0F172A', display: 'block' }}>{d.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{d.state_name || d.state?.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {suggestions.states.length > 0 && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    States
                  </div>
                  {suggestions.states.map(s => (
                    <div
                      key={s.id}
                      onClick={() => { saveRecentSearch(s.name); setIsOpen(false); navigate(`/explore?state=${s.slug}`); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.6rem', borderRadius: '8px', cursor: 'pointer' }}
                      className="search-item-hover"
                    >
                      <Building size={15} color="#0284C7" />
                      <span style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 600 }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {suggestions.categories.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Categories
                  </div>
                  {suggestions.categories.map(c => (
                    <div
                      key={c.id}
                      onClick={() => { saveRecentSearch(c.name); setIsOpen(false); navigate(`/explore?category=${c.slug}`); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.6rem', borderRadius: '8px', cursor: 'pointer' }}
                      className="search-item-hover"
                    >
                      <Grid size={15} color="#D97706" />
                      <span style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 600 }}>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div
                onClick={() => handleSearchExecute()}
                style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', color: '#FF6B35', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <span>View all search results for "{query}"</span>
                <ArrowRight size={14} />
              </div>
            </div>
          )}

          {/* 2. No Results Fallback */}
          {!loading && query.trim() && !hasSuggestions && (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#64748B' }}>
              <p style={{ fontSize: '0.88rem', margin: 0 }}>No direct matches for "{query}"</p>
              <button
                onClick={() => handleSearchExecute()}
                style={{ marginTop: '0.5rem', background: '#F1F5F9', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', color: '#0F172A', fontWeight: 600, cursor: 'pointer' }}
              >
                Search all destinations →
              </button>
            </div>
          )}

          {/* 3. Empty Search Query Defaults: Recent & Popular */}
          {!query.trim() && (
            <div>
              {recentSearches.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Recent Searches</span>
                    <button onClick={clearRecentSearches} style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: '#EF4444', cursor: 'pointer' }}>Clear</button>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {recentSearches.map(term => (
                      <span
                        key={term}
                        onClick={() => handleSearchExecute(term)}
                        style={{ padding: '0.3rem 0.65rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '20px', fontSize: '0.78rem', color: '#334155', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Clock size={12} color="#64748B" /> {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Popular Searches</span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {POPULAR_SEARCHES.map(term => (
                    <span
                      key={term}
                      onClick={() => handleSearchExecute(term)}
                      style={{ padding: '0.35rem 0.7rem', background: 'rgba(255, 107, 53, 0.08)', color: '#FF6B35', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Sparkles size={12} /> {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
