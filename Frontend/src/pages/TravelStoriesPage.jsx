import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import StoryCard from '../components/stories/StoryCard';
import { getStories } from '../services/storyService';

const ALL_STORIES = [
  {
    id: 701,
    title: 'Riding the Glass-Roofed Vistadome Express to Araku Valley',
    slug: 'vistadome-express-araku-valley',
    author: 'Priya Sharma',
    read_time: '6 min read',
    state_name: 'Andhra Pradesh',
    content: 'Watching cloud-draped mountain peaks and 58 tunnels pass overhead through the panoramic glass ceiling of the Vistadome train is an unforgettable Indian railway experience.',
    featured_image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600'
  },
  {
    id: 702,
    title: 'A Culinary Trail Through Araku Coffee & Tribal Bamboo Chicken',
    slug: 'culinary-trail-araku-coffee-bamboo-chicken',
    author: 'Vikramaditya Roy',
    read_time: '4 min read',
    state_name: 'Andhra Pradesh',
    content: 'Sampling organic coffee brewed straight from indigenous tribal farms and tasting marinated chicken roasted inside green bamboo stalks.',
    featured_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'
  },
  {
    id: 703,
    title: 'Chasing Sunrise Over Taj Mahal & Forts of Agra',
    slug: 'sunrise-over-taj-mahal-agra',
    author: 'Elena Rostova',
    read_time: '5 min read',
    state_name: 'Uttar Pradesh',
    content: 'Watching the morning sun illuminate white marble domes across Yamuna river bank with historical reflections of Mughal architecture.',
    featured_image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600'
  },
  {
    id: 704,
    title: 'Cruising Houseboats in Kerala Backwaters of Alleppey',
    slug: 'houseboats-kerala-backwaters-alleppey',
    author: 'Rahul Verma',
    read_time: '7 min read',
    state_name: 'Kerala',
    content: 'Gliding along emerald palm-lined canals on wooden Kettuvallam houseboats while savoring spicy Karimeen Pollichathu seafood.',
    featured_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600'
  },
  {
    id: 705,
    title: 'Exploring Royal Havelis & Thar Desert Dunes in Jaisalmer',
    slug: 'royal-havelis-thar-desert-jaisalmer',
    author: 'Aarav Mehta',
    read_time: '8 min read',
    state_name: 'Rajasthan',
    content: 'Camel safaris across golden sand dunes, sunset folk music in desert camps, and sandstone fortresses built in 1156 AD.',
    featured_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600'
  }
];

export default function TravelStoriesPage() {
  const [stories, setStories] = useState(ALL_STORIES);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getStories()
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setStories(res.data);
        }
      })
      .catch(err => console.warn("Using sample stories list:", err));
  }, []);

  const filteredStories = stories.filter(s =>
    searchQuery === '' ||
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.state_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="explore-container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', margin: '2rem 0 3rem 0' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <BookOpen size={16} /> Traveler Diaries & Journals
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0F172A', marginTop: '0.4rem' }}>
            India Travel Stories & Experiences
          </h1>
          <p style={{ color: '#64748B', maxWidth: '640px', margin: '0.5rem auto 0 auto', fontSize: '1rem' }}>
            Read inspiring firsthand travelogues, food trails, railway journeys, and cultural blogs written by fellow explorers.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid #E2E8F0',
          marginBottom: '2.5rem',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto'
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#64748B" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search story title, author, or state (e.g. Vistadome, Taj Mahal, Kerala)..."
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

        {/* Stories Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {filteredStories.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#F8FAFC', borderRadius: '16px', color: '#64748B' }}>
              <h3>No travel stories found for "{searchQuery}"</h3>
              <p>Try searching for a different destination or keyword.</p>
            </div>
          ) : (
            filteredStories.map(story => (
              <StoryCard key={story.id} story={story} />
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
