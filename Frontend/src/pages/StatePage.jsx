import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Calendar } from 'lucide-react';
import { getStateBySlug } from '../services/stateService';
import { getDestinations } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import PageTransition from '../components/PageTransition';
import SkeletonGrid from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import Advertisement from '../components/Advertisement';
import { buildMediaUrl, getDestinationPlaceholder } from '../utils/imageUtils';
import '../styles/explore.css';

export default function StatePage() {
  const { slug } = useParams();
  const [state, setState] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStateData = async () => {
    setLoading(true);
    setError(false);
    try {
      const stateRes = await getStateBySlug(slug);
      if (stateRes.data) {
        setState(stateRes.data);
        const destRes = await getDestinations({ state: slug, page_size: 20 });
        if (destRes.data) {
          setDestinations(destRes.data);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error loading state page:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStateData();
  }, [slug]);

  if (loading) return <div className="container section-padding"><SkeletonGrid count={6} /></div>;
  if (error || !state) return <div className="container section-padding"><ErrorState title="State Not Found" message="Could not locate state details." onRetry={fetchStateData} /></div>;

  const bgImg = state.image || state.banner_image || state.thumbnail_image
    ? buildMediaUrl(state.image || state.banner_image || state.thumbnail_image)
    : getDestinationPlaceholder(state.name);

  return (
    <PageTransition>
      <div className="state-page">
        {/* State Hero Banner */}
        <div className="hero-section" style={{ backgroundImage: `url(${bgImg})` }}>
          <div className="hero-bg-overlay"></div>
          <div className="container hero-container">
            <span className="badge badge-gold">Indian State</span>
            <h1 className="hero-title">{state.name}</h1>
            <p className="hero-subtitle">{state.short_description || state.description}</p>
            <div className="hero-tags">
              <span>Capital: <strong>{state.capital}</strong></span>
              {state.best_time_to_visit && <span>Best Time: <strong>{state.best_time_to_visit}</strong></span>}
            </div>
          </div>
        </div>

        <div className="container section-padding">
          <div className="layout-with-ads">
            <Advertisement type="sidebar-left" index={0} />

            <div>
              {/* Overview & Culture Grid */}
              <div className="state-info-grid mb-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="info-card" style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#004e64' }}>
                    <Compass className="info-icon" /> Overview & Culture
                  </h3>
                  <p style={{ marginTop: '0.75rem', color: '#475569' }}>{state.description || state.culture_info || 'Rich historical culture and heritage.'}</p>
                </div>

                <div className="info-card" style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#004e64' }}>
                    <Calendar className="info-icon" /> Best Time to Visit
                  </h3>
                  <p style={{ marginTop: '0.75rem', color: '#475569' }}>{state.best_time_to_visit || 'October to March offers pleasant weather across the region.'}</p>
                </div>
              </div>

              {/* Tourist Destinations in this State */}
              <div className="section-header">
                <div>
                  <span className="badge badge-primary">Must Visit</span>
                  <h2 className="section-title">Top Tourist Attractions in {state.name}</h2>
                </div>
              </div>

              {destinations.length === 0 ? (
                <p>No destinations found for {state.name}.</p>
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

