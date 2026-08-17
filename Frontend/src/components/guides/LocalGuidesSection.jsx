import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck } from 'lucide-react';
import apiClient from '../../api/apiClient';
import LocalGuideCard from './LocalGuideCard';

const SAMPLE_GUIDES = [
  {
    id: 101,
    name: 'Ramesh Naidu',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Certified Tribal Heritage & Coffee Plantation Guide with 10+ years leading tourists through waterfalls and scenic valleys.',
    experience_years: 10,
    rating: 4.95,
    price_per_day: 1500,
    languages_spoken: 'Telugu, English, Hindi',
    contact_phone: '+91 98480 12345',
    is_verified: true
  },
  {
    id: 102,
    name: 'Ananya Sharma',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'Eco-Tourism & Botanical Specialist guiding nature lovers through pristine forest trails, caves, and viewpoints.',
    experience_years: 6,
    rating: 4.88,
    price_per_day: 1800,
    languages_spoken: 'English, Hindi, Bengali',
    contact_phone: '+91 98480 54321',
    is_verified: true
  }
];

export default function LocalGuidesSection({ destinationSlug, destinationName }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/travel-guides/local-guides/', {
      params: { destination: destinationSlug }
    })
      .then(res => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          setGuides(res.data.data);
        } else {
          setGuides(SAMPLE_GUIDES);
        }
      })
      .catch(err => {
        console.warn("Using default local guides:", err);
        setGuides(SAMPLE_GUIDES);
      })
      .finally(() => setLoading(false));
  }, [destinationSlug]);

  return (
    <section className="details-card" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <ShieldCheck size={14} /> Verified Local Experts
        </span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
          Hire a Local Guide in {destinationName || 'this Region'}
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
          Hire verified local experts fluent in regional languages for authentic cultural insights and hidden spot tours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {guides.map(guide => (
          <LocalGuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </section>
  );
}
