import React, { useState, useEffect } from 'react';
import { Hotel, Sparkles } from 'lucide-react';
import { getHotels } from '../../services/hotelService';
import HotelCard from './HotelCard';

const SAMPLE_HOTELS = [
  {
    id: 201,
    name: 'APTDC Haritha Hill Resort Araku',
    star_rating: 4,
    price_per_night: 3200,
    address: 'Near Araku Tribal Museum, Araku Valley',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    booking_url: '#'
  },
  {
    id: 202,
    name: 'Valley View Eco-Lodge & Homestay',
    star_rating: 3,
    price_per_night: 1800,
    address: 'Coffee Plantation Road, Araku Valley',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
    booking_url: '#'
  }
];

export default function HotelsSection({ destinationSlug, destinationName }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getHotels({ destination: destinationSlug })
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setHotels(res.data);
        } else {
          setHotels(SAMPLE_HOTELS);
        }
      })
      .catch(err => {
        console.warn("Using sample hotels:", err);
        setHotels(SAMPLE_HOTELS);
      })
      .finally(() => setLoading(false));
  }, [destinationSlug]);

  return (
    <section className="details-card" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Hotel size={14} /> Places to Stay
        </span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
          Recommended Stays in {destinationName || 'this Region'}
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
          Handpicked resorts, APTDC Haritha hotels, and eco-homestays near tourist attractions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {hotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </section>
  );
}
