import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { getFestivals } from '../../services/festivalService';
import FestivalCard from './FestivalCard';

const SAMPLE_FESTIVALS = [
  {
    id: 401,
    name: 'Itika Pongal & Tribal Dhimsa Utsav',
    month_celebrated: 'January',
    state_name: 'Andhra Pradesh',
    description: 'Grand harvest festival celebrated in Araku hill region featuring traditional tribal Dhimsa dance, community feasts, and vibrant folklore rituals.',
    image: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=600'
  },
  {
    id: 402,
    name: 'Visakha Utsav & Beach Carnival',
    month_celebrated: 'December - January',
    state_name: 'Andhra Pradesh',
    description: 'Annual cultural extravaganza showcasing regional handicrafts, traditional Andhra thali food stalls, folk music concerts, and fireworks.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600'
  }
];

export default function FestivalsSection({ stateSlug, destinationName }) {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getFestivals({ state: stateSlug })
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setFestivals(res.data);
        } else {
          setFestivals(SAMPLE_FESTIVALS);
        }
      })
      .catch(err => {
        console.warn("Using sample festivals:", err);
        setFestivals(SAMPLE_FESTIVALS);
      })
      .finally(() => setLoading(false));
  }, [stateSlug]);

  return (
    <section className="details-card" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Sparkles size={14} /> Cultural Celebrations & Fairs
        </span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
          Festivals Celebrated in {destinationName || 'this Region'}
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
          Plan your trip to experience authentic regional music, traditional dances, and cultural rituals.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {festivals.map(fest => (
          <FestivalCard key={fest.id} festival={fest} />
        ))}
      </div>
    </section>
  );
}
