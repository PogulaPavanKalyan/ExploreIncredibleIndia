import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCityBySlug } from '../services/cityService';
import { getDestinations } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import PageTransition from '../components/PageTransition';
import SkeletonGrid from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import Advertisement from '../components/Advertisement';
import { buildMediaUrl, getDestinationPlaceholder } from '../utils/imageUtils';
import '../styles/explore.css';

export default function CityPage() {
  const { slug } = useParams();
  const [city, setCity] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCityData = async () => {
    setLoading(true);
    setError(false);
    try {
      const cityRes = await getCityBySlug(slug);
      if (cityRes.data) {
        setCity(cityRes.data);
        const destRes = await getDestinations({ city: slug, page_size: 20 });
        if (destRes.data) {
          setDestinations(destRes.data);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error loading city page:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, [slug]);

  if (loading) return <div className="container section-padding"><SkeletonGrid count={6} /></div>;
  if (error || !city) return <div className="container section-padding"><ErrorState title="City Not Found" message="Could not locate city details." onRetry={fetchCityData} /></div>;

  const bgImg = city.image || city.banner_image || city.thumbnail_image
    ? buildMediaUrl(city.image || city.banner_image || city.thumbnail_image)
    : getDestinationPlaceholder(city.name);

  return (
    <PageTransition>
      <div className="city-page">
        <div className="hero-section" style={{ backgroundImage: `url(${bgImg})` }}>
          <div className="hero-bg-overlay"></div>
          <div className="container hero-container">
            <span className="badge badge-gold">Explore City</span>
            <h1 className="hero-title">{city.name}</h1>
            <p className="hero-subtitle">{city.description}</p>
          </div>
        </div>

        <div className="container section-padding">
          <div className="layout-with-ads">
            <Advertisement type="sidebar-left" index={0} />

            <div>
              <div className="section-header">
                <div>
                  <span className="badge badge-primary">City Attractions</span>
                  <h2 className="section-title">Things to Do & Places to Visit in {city.name}</h2>
                </div>
              </div>

              {destinations.length === 0 ? (
                <p>No destinations listed for {city.name} yet.</p>
              ) : (
                <div className="grid-destinations">
                  {destinations.map(d => (
                    <DestinationCard key={d.id} destination={d} />
                  ))}
                </div>
              )}

              <Advertisement type="inline" index={1} />
            </div>

            <Advertisement type="sidebar-right" index={2} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

