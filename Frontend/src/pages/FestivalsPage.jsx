import React, { useState, useEffect } from 'react';
import { Calendar, Search, Sparkles, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import FestivalCard from '../components/festivals/FestivalCard';
import { getFestivals } from '../services/festivalService';

const ALL_FESTIVALS = [
  {
    id: 501,
    name: 'Makar Sankranti & Pongal Harvest Festival',
    month_celebrated: 'January',
    state_name: 'Andhra Pradesh, Tamil Nadu, Telangana',
    description: 'Vibrant harvest festival celebrated with colorful rangoli patterns, traditional kite flying, bull-taming games, and sweet jaggery rice dishes.',
    image: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=600'
  },
  {
    id: 502,
    name: 'Pushkar Camel Fair & Cultural Carnival',
    month_celebrated: 'November',
    state_name: 'Rajasthan',
    description: 'World-famous livestock fair and cultural extravaganza held in Pushkar, featuring folk music, camel decoration contests, and sacred lake dips.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600'
  },
  {
    id: 503,
    name: 'Hornbill Festival of Nagaland',
    month_celebrated: 'December',
    state_name: 'Nagaland',
    description: 'The Festival of Festivals showcasing tribal dance, traditional archery, Naga cuisine, rock concerts, and indigenous craft exhibitions.',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600'
  },
  {
    id: 504,
    name: 'Durga Puja Cultural Extravaganza',
    month_celebrated: 'October',
    state_name: 'West Bengal',
    description: 'UNESCO Intangible Cultural Heritage festival featuring magnificent themed pandals, dhak drum beats, traditional dance, and grand idols.',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600'
  },
  {
    id: 505,
    name: 'Onam Harvest & Snake Boat Race Utsav',
    month_celebrated: 'August - September',
    state_name: 'Kerala',
    description: 'Grand Malayali harvest festival with intricate flower rangolis (Pookkalam), grand Sadya feasts on banana leaves, and thrilling Vallam Kali boat races.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600'
  },
  {
    id: 506,
    name: 'Rann Utsav White Desert Festival',
    month_celebrated: 'November - February',
    state_name: 'Gujarat',
    description: 'Magical tent city carnival under full moon night over white salt desert featuring Kutchi folk dances, stargazing, and handicraft bazaars.',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600'
  }
];

const MONTHS = ['All Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState(ALL_FESTIVALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All Months');

  useEffect(() => {
    getFestivals()
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setFestivals(res.data);
        }
      })
      .catch(err => console.warn("Using sample festivals list:", err));
  }, []);

  const filteredFestivals = festivals.filter(f => {
    const matchesQuery = searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.state_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMonth = selectedMonth === 'All Months' ||
      f.month_celebrated.toLowerCase().includes(selectedMonth.toLowerCase());

    return matchesQuery && matchesMonth;
  });

  return (
    <PageTransition>
      <div className="explore-container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', margin: '2rem 0 3rem 0' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} /> Cultural Heritage Calendar
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.4rem' }}>
            Indian Cultural Festivals & Fairs
          </h1>
          <p style={{ color: '#64748B', maxWidth: '640px', margin: '0.5rem auto 0 auto', fontSize: '1rem' }}>
            Experience India's vibrant celebrations, harvest festivals, temple utsavams, and desert carnivals throughout the year.
          </p>
        </div>

        {/* Search & Month Filter Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid #E2E8F0',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={18} color="#64748B" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search festival name, state, or ritual (e.g. Hornbill, Rajasthan, Boat Race)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          {/* Month Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {MONTHS.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  border: 'none',
                  background: selectedMonth === m ? '#FF6B35' : '#F1F5F9',
                  color: selectedMonth === m ? '#ffffff' : '#475569',
                  fontWeight: selectedMonth === m ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Festivals Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {filteredFestivals.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#F8FAFC', borderRadius: '16px', color: '#64748B' }}>
              <h3>No festivals found for "{selectedMonth}"</h3>
              <p>Try searching for a different month or keyword.</p>
            </div>
          ) : (
            filteredFestivals.map(fest => (
              <FestivalCard key={fest.id} festival={fest} />
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
