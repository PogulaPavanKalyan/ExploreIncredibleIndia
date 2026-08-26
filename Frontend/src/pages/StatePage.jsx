import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Calendar, Box, Layers, MapPin } from 'lucide-react';
import { getStateBySlug } from '../services/stateService';
import { getDestinations } from '../services/destinationService';
import DestinationCard from '../components/DestinationCard';
import PageTransition from '../components/PageTransition';
import SkeletonGrid from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import Advertisement from '../components/Advertisement';
import { buildMediaUrl, getDestinationPlaceholder } from '../utils/imageUtils';
import TelanganaDistrictMapSVG from '../components/map/TelanganaDistrictMapSVG';
import { State3DExplorer } from '../components/JourneyAcrossIndia/State3DExplorer';
import '../styles/explore.css';

export default function StatePage() {
  const { slug } = useParams();
  const [state, setState] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [show3DExplorer, setShow3DExplorer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStateData = async () => {
    setLoading(true);
    setError(false);
    try {
      const stateRes = await getStateBySlug(slug);
      if (stateRes.data) {
        setState(stateRes.data);
        const params = { state: slug, page_size: 100 };
        if (selectedDistrict && selectedDistrict !== 'all') {
          params.district = selectedDistrict;
        }
        const destRes = await getDestinations(params);
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
    setSelectedDistrict('all');
  }, [slug]);

  useEffect(() => {
    fetchStateData();
  }, [slug, selectedDistrict]);

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <span className="badge badge-gold">Indian State</span>
              
              {/* 3D State Map Launch Icon Button */}
              <button
                type="button"
                onClick={() => setShow3DExplorer(true)}
                className="btn-3d-hero-trigger"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ea580c 100%)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: '0 4px 16px rgba(255, 107, 53, 0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.5px'
                }}
              >
                <Box size={16} />
                <span>Explore 3D State Map</span>
              </button>
            </div>

            <h1 className="hero-title">{state.name}</h1>
            <p className="hero-subtitle">{state.short_description || state.description}</p>
            <div className="hero-tags">
              <span>Capital: <strong>{state.capital}</strong></span>
              {state.best_time_to_visit && <span>Best Time: <strong>{state.best_time_to_visit}</strong></span>}
            </div>
          </div>
        </div>

        {/* 3D State Map Modal Overlay */}
        {show3DExplorer && (
          <State3DExplorer
            stateItem={state}
            onClose={() => setShow3DExplorer(false)}
          />
        )}

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

              {/* Interactive Telangana 33-District Vector Map */}
              {(slug === 'telangana' || state.slug === 'telangana') && (
                <TelanganaDistrictMapSVG
                  activeDistrict={selectedDistrict}
                  onSelectDistrict={(d) => setSelectedDistrict(d)}
                />
              )}

              {/* Tourist Destinations in this State */}
              <div className="section-header">
                <div>
                  <span className="badge badge-primary">Must Visit</span>
                  <h2 className="section-title">
                    {selectedDistrict !== 'all' 
                      ? `Visiting Places in ${selectedDistrict} District, ${state.name}` 
                      : `Top Tourist Attractions in ${state.name}`}
                  </h2>
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

