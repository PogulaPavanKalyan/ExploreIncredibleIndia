import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRegionBySlug } from '../services/regionService';
import { getDestinationsByRegion } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import PageTransition from '../components/PageTransition';
import SkeletonGrid from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import { buildMediaUrl, getDestinationPlaceholder } from '../utils/imageUtils';
import '../styles/explore.css';

export default function RegionPage() {
  const { slug } = useParams();
  const [region, setRegion] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchRegionData = async () => {
    setLoading(true);
    setError(false);
    try {
      const regionRes = await getRegionBySlug(slug);
      if (regionRes.data || regionRes) {
        const rData = regionRes.data || regionRes;
        setRegion(rData);
        const destRes = await getDestinationsByRegion(slug, { page_size: 24 });
        if (destRes.data) {
          setDestinations(destRes.data);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error loading region page:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegionData();
  }, [slug]);

  if (loading) return <div className="container section-padding"><SkeletonGrid count={6} /></div>;
  if (error || !region) return <div className="container section-padding"><ErrorState title="Region Not Found" message="Could not locate region details." onRetry={fetchRegionData} /></div>;

  const bgImg = region.poster_image 
    ? buildMediaUrl(region.poster_image)
    : getDestinationPlaceholder(region.name);

  return (
    <PageTransition>
      <div className="state-page region-page">
        {/* Region Hero Banner */}
        <div className="hero-section" style={{ backgroundImage: `url(${bgImg})` }}>
          <div className="hero-bg-overlay"></div>
          <div className="container hero-container">
            <span className="badge badge-gold">Macro Region of India</span>
            <h1 className="hero-title">{region.name}</h1>
            <p className="hero-subtitle">{region.tagline || region.description}</p>
            {region.description && region.tagline && (
              <p style={{ maxWidth: '700px', margin: '0.5rem auto 0 auto', opacity: 0.9, fontSize: '0.95rem' }}>
                {region.description}
              </p>
            )}
          </div>
        </div>

        <div className="container section-padding">
          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div>
              <span className="badge badge-primary">Highlights</span>
              <h2 className="section-title">Destinations in {region.name}</h2>
            </div>
            <Link to="/explore" style={{ color: '#ff6b35', fontWeight: 600, textDecoration: 'none' }}>
              Explore all India →
            </Link>
          </div>

          {destinations.length === 0 ? (
            <div className="empty-state-box" style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
              <p>No destinations currently listed in {region.name}.</p>
              <Link to="/explore" style={{ color: '#ff6b35', fontWeight: 600 }}>Explore all destinations</Link>
            </div>
          ) : (
            <div className="grid-destinations" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {destinations.map(d => (
                <DestinationCard key={d.id || d.slug} destination={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
