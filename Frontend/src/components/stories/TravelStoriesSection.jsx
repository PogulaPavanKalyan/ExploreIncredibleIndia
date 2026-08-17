import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStories } from '../../services/storyService';
import StoryCard from './StoryCard';

const SAMPLE_STORIES = [
  {
    id: 601,
    title: 'Riding the Glass-Roofed Vistadome Express to Araku Valley',
    slug: 'vistadome-express-araku-valley',
    author: 'Priya Sharma',
    read_time: '6 min read',
    state_name: 'Andhra Pradesh',
    content: 'Watching cloud-draped mountain peaks and 58 tunnels pass overhead through the panoramic glass ceiling of the Vistadome train is an unforgettable Indian railway experience.',
    featured_image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600'
  },
  {
    id: 602,
    title: 'A Culinary Trail Through Araku Coffee & Tribal Bamboo Chicken',
    slug: 'culinary-trail-araku-coffee-bamboo-chicken',
    author: 'Vikramaditya Roy',
    read_time: '4 min read',
    state_name: 'Andhra Pradesh',
    content: 'Sampling organic coffee brewed straight from indigenous tribal farms and tasting marinated chicken roasted inside green bamboo stalks.',
    featured_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'
  }
];

export default function TravelStoriesSection({ stateSlug, destinationName }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStories({ state: stateSlug })
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setStories(res.data);
        } else {
          setStories(SAMPLE_STORIES);
        }
      })
      .catch(err => {
        console.warn("Using sample travel stories:", err);
        setStories(SAMPLE_STORIES);
      })
      .finally(() => setLoading(false));
  }, [stateSlug]);

  return (
    <section className="details-card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <BookOpen size={14} /> Travelogues & Photo Stories
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
            Stories from {destinationName || 'this Region'}
          </h2>
        </div>

        <Link to="/stories" style={{ color: '#FF6B35', fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          Explore All Stories <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </section>
  );
}
