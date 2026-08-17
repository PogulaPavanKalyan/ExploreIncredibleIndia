import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import { getRestaurants } from '../../services/restaurantService';
import RestaurantCard from './RestaurantCard';

const SAMPLE_RESTAURANTS = [
  {
    id: 301,
    name: 'Araku Bamboo Chicken House',
    cuisine_type: 'Authentic Tribal Delicacies',
    rating: 4.85,
    avg_cost_for_two: 600,
    address: 'Near Araku Railway Station, Vizag Road',
    famous_dishes: 'Bamboo Chicken, Bongu Biryani, Tribal Herbal Tea',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600'
  },
  {
    id: 302,
    name: 'Vasundhara Andhra Dining & Coffee House',
    cuisine_type: 'South Indian & Araku Coffee',
    rating: 4.70,
    avg_cost_for_two: 500,
    address: 'Tribal Museum Road, Araku Valley',
    famous_dishes: 'Andhra Meal Thali, Fresh Organic Coffee, Rava Dosa',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
  }
];

export default function RestaurantsSection({ destinationSlug, destinationName }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRestaurants({ destination: destinationSlug })
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          setRestaurants(res.data);
        } else {
          setRestaurants(SAMPLE_RESTAURANTS);
        }
      })
      .catch(err => {
        console.warn("Using sample restaurants:", err);
        setRestaurants(SAMPLE_RESTAURANTS);
      })
      .finally(() => setLoading(false));
  }, [destinationSlug]);

  return (
    <section className="details-card" style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Utensils size={14} /> Local Cuisine & Restaurants
        </span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
          Famous Food & Eateries in {destinationName || 'this Region'}
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
          Discover authentic regional thalis, tribal delicacies, and iconic local coffee houses.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {restaurants.map(rest => (
          <RestaurantCard key={rest.id} restaurant={rest} />
        ))}
      </div>
    </section>
  );
}
