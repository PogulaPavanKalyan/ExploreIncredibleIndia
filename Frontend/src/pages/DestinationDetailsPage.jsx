import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Ticket, Calendar, Navigation, Plus, Send, Compass, Lightbulb, Image as ImageIcon, ArrowLeft, Landmark, Sparkles, CheckCircle2 } from 'lucide-react';
import { getDestinationBySlug } from '../services/destinationService';
import { getReviews, submitReview } from '../api/reviewApi';
import { AuthContext } from '../context/AuthContext';
import FavoriteButton from '../components/FavoriteButton';
import PageTransition from '../components/PageTransition';
import ImageGallery from '../components/ImageGallery';
import { DestinationDetailsSkeleton } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import Advertisement from '../components/Advertisement';
import Destination3DVisual from '../components/3d/Destination3DVisual';
import DestinationSeasonalGrid from '../components/destination/DestinationSeasonalGrid';
import DestinationTimeline from '../components/destination/DestinationTimeline';
import RatingBreakdown from '../components/reviews/RatingBreakdown';
import ReviewCard from '../components/reviews/ReviewCard';
import WeatherWidget from '../components/weather/WeatherWidget';
import HowToReachSection from '../components/destination/HowToReachSection';
import NearbyPlacesSection from '../components/destination/NearbyPlacesSection';
import LocalGuidesSection from '../components/guides/LocalGuidesSection';
import HotelsSection from '../components/hotels/HotelsSection';
import RestaurantsSection from '../components/restaurants/RestaurantsSection';
import FestivalsSection from '../components/festivals/FestivalsSection';
import TravelStoriesSection from '../components/stories/TravelStoriesSection';
import SEOHead from '../components/seo/SEOHead';
import { getCategoryTheme } from '../utils/categoryThemes';
import { getDestinationPrimaryImage, handleImageError } from '../utils/imageUtils';
import '../styles/destination.css';

export default function DestinationDetailsPage() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);

  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getDestinationBySlug(slug);
      if (res.data) {
        setDestination(res.data);
        const revRes = await getReviews({ destination: slug });
        if (revRes.data) setReviews(revRes.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error loading destination details:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newComment) return;

    setSubmittingReview(true);
    const newRevObj = {
      id: Date.now(),
      title: newTitle,
      comment: newComment,
      rating: newRating,
      user_details: { username: user ? user.username : 'Traveler' },
      created_at: new Date().toISOString()
    };

    try {
      await submitReview({
        destination: destination.id,
        rating: newRating,
        title: newTitle,
        comment: newComment
      });
    } catch (err) {
      // Silently fallback to local state for guest reviews
    } finally {
      setReviews(prev => [newRevObj, ...prev]);
      alert("Review submitted successfully!");
      setNewTitle('');
      setNewComment('');
      setSubmittingReview(false);
    }
  };

  if (loading) return <DestinationDetailsSkeleton />;
  if (error || !destination) {
    return (
      <div className="container section-padding">
        <ErrorState
          title="Destination Not Found"
          message="We couldn't find the requested tourist destination."
          onRetry={fetchDetails}
        />
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/explore" style={{ color: '#ff6b35', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Explore All Places
          </Link>
        </div>
      </div>
    );
  }

  const categoriesList = destination.categories && destination.categories.length > 0 
    ? destination.categories 
    : (destination.category ? [destination.category] : []);

  // Calculate destination visual theme dynamically
  const theme = getCategoryTheme(categoriesList);

  const heroImage = getDestinationPrimaryImage(destination);

  const destinationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": destination.name,
    "description": destination.description || destination.overview,
    "image": heroImage,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": destination.city?.name || '',
      "addressRegion": destination.state?.name || 'India',
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": destination.latitude || 17.6868,
      "longitude": destination.longitude || 83.2185
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": destination.avg_rating || 4.7,
      "reviewCount": destination.total_reviews || 12
    }
  };

  return (
    <PageTransition>
      <SEOHead
        title={`${destination.name} - ${destination.category?.name || 'Destination'} in ${destination.state?.name || 'India'} | Dekho Bharat`}
        description={destination.description ? destination.description.slice(0, 160) : `Explore ${destination.name} in ${destination.state?.name}. Discover best time to visit, ticket prices, map routes, local food, weather, and stays.`}
        image={heroImage}
        schema={destinationSchema}
      />
      <div className="destination-details-page destination-story-page">
        {/* Destination Header Banner with Category Theme Accent */}
        <div className="details-hero" style={{ background: theme.gradientBg }}>
          <img 
            src={heroImage} 
            alt={destination.name} 
            className="details-hero-img"
            onError={(e) => handleImageError(e, destination.name)} 
          />
          <div className="details-hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.85) 100%)' }}></div>
          
          <div className="container details-hero-content">
            <div className="breadcrumb">
              <Link to="/">Home</Link> / <Link to="/explore">Explore</Link> / <span>{destination.name}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className={`themed-hero-badge ${theme.badgeClass}`}>
                <Sparkles size={13} /> {theme.name}
              </span>
              {destination.is_hidden_gem && (
                <span className="themed-hero-badge" style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}>
                  Hidden Gem
                </span>
              )}
            </div>

            <h1 className="details-title">{destination.name}</h1>
            <div className="details-meta-row">
              <div className="meta-badge">
                <MapPin size={16} /> <span>{destination.city ? `${destination.city.name}, ` : ''}{destination.state?.name}</span>
              </div>
              <div className="meta-badge">
                <Star size={16} fill="#FFB703" color="#FFB703" /> <span>{destination.avg_rating || 4.7} ({destination.total_reviews || 0} Reviews)</span>
              </div>
              {categoriesList.map(cat => (
                <div key={cat.id || cat.name} className="meta-badge category">
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container section-padding">
          <div className="layout-with-ads">
            {/* Desktop Left Sidebar Ad */}
            <Advertisement type="sidebar-left" index={0} />

            {/* Main Center Storytelling Content Column */}
            <div>
              {/* Quick Specs Grid */}
              <div className="specs-grid">
                <div className="spec-card">
                  <div className="spec-icon-wrap" style={{ background: theme.primaryColor }}>
                    <Calendar size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Best Season</span>
                    <strong style={{ color: '#0F172A', fontSize: '0.92rem' }}>{destination.best_time_to_visit || "Oct – Mar"}</strong>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon-wrap" style={{ background: theme.secondaryColor }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Timings</span>
                    <strong style={{ color: '#0F172A', fontSize: '0.92rem' }}>{destination.opening_time ? `${destination.opening_time} - ${destination.closing_time}` : 'All Day Access'}</strong>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon-wrap" style={{ background: '#D97706' }}>
                    <Ticket size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Entry Fee</span>
                    <strong style={{ color: '#0F172A', fontSize: '0.92rem' }}>{parseFloat(destination.ticket_price) > 0 ? `₹${destination.ticket_price}` : 'Free Entry'}</strong>
                  </div>
                </div>

                <div className="spec-card">
                  <div className="spec-icon-wrap" style={{ background: '#0284C7' }}>
                    <Navigation size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Recommended Duration</span>
                    <strong style={{ color: '#0F172A', fontSize: '0.92rem' }}>{destination.recommended_duration || '1 – 2 Days'}</strong>
                  </div>
                </div>
              </div>

              <div className="details-layout">
                {/* Main Story Content */}
                <div className="details-main">
                  {/* About Destination Section with Category 3D Visual */}
                  <section className="details-card">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '1.5rem', alignItems: 'center' }} className="mobile-single-col">
                      <div>
                        <h2 style={{ color: '#0F172A' }}>About {destination.name}</h2>
                        <p className="description-text">{destination.short_description}</p>
                        {destination.description && destination.description !== destination.short_description && (
                          <p className="description-text" style={{ marginTop: '1rem' }}>{destination.description}</p>
                        )}

                        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {theme.tags.map(t => (
                            <span key={t} style={{ padding: '0.3rem 0.75rem', background: '#F1F5F9', color: '#334155', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Category-Themed 3D Object Canvas */}
                      <div>
                        <Destination3DVisual modelType={theme.modelType} themeColor={theme.primaryColor} />
                      </div>
                    </div>
                  </section>

                  {/* Seasonal Best Time Tracker Grid */}
                  <DestinationSeasonalGrid seasonMonths={theme.seasonMonths} bestTimeText={destination.best_time_to_visit} />

                  {/* History & Legacy Section */}
                  <DestinationTimeline historyText={destination.history} destinationName={destination.name} />

                  {/* Photo Lightbox Gallery */}
                  <section className="details-card">
                    <h2><ImageIcon size={20} /> Real Destination Photography</h2>
                    <ImageGallery images={destination.images} fallbackImage={heroImage} />
                  </section>

                  {/* Nearby Attractions / Things To Do */}
                  {destination.attractions && destination.attractions.length > 0 && (
                    <section className="details-card">
                      <h2><Compass size={20} /> Top Things To Do in {destination.name}</h2>
                      <div className="attractions-list" style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                        {destination.attractions.map(attr => (
                          <div key={attr.id} className="attraction-item glass-card" style={{ padding: '1.25rem', borderRadius: '12px', borderLeft: `4px solid ${theme.primaryColor}` }}>
                            <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1.05rem', fontWeight: 700 }}>{attr.name}</h4>
                            {attr.description && <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '0.88rem', lineHeight: 1.5 }}>{attr.description}</p>}
                            {attr.ticket_price && parseFloat(attr.ticket_price) > 0 && (
                              <span style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: '0.78rem', fontWeight: 700, color: '#D97706' }}>
                                Entry: ₹{attr.ticket_price}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Travel Tips */}
                  {destination.travel_tips && destination.travel_tips.length > 0 && (
                    <section className="details-card">
                      <h2><Lightbulb size={20} /> Useful Traveler Advice</h2>
                      <ul className="travel-tips-list" style={{ marginTop: '1rem', paddingLeft: '1.2rem', color: '#334155' }}>
                        {destination.travel_tips.map(tip => (
                          <li key={tip.id} style={{ marginBottom: '0.66rem', lineHeight: 1.5 }}>
                            <strong>{tip.title || 'Advice'}:</strong> {tip.description}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Mobile Inline Advertisement */}
                  <Advertisement type="inline" index={1} />

                  {/* How to Reach & Interactive Map */}
                  {/* How to Reach & Interactive Transport Guide */}
                  <HowToReachSection destination={destination} />

                  {/* Responsive Map Container Section */}
                  <section className="details-card">
                    <h2>Location Map & Coordinates</h2>
                    <div style={{
                      width: '100%',
                      height: '320px',
                      background: '#e2e8f0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                      marginTop: '1rem'
                    }}>
                      <iframe
                        title="Destination Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        src={`https://maps.google.com/maps?q=${destination.latitude || 17.6868},${destination.longitude || 83.2185}&z=12&output=embed`}
                        style={{ border: 0 }}
                      />
                    </div>
                  </section>

                  {/* Nearby Places Section */}
                  <NearbyPlacesSection destinationSlug={destination.slug} destinationName={destination.name} />

                  {/* Verified Local Guides Section */}
                  <LocalGuidesSection destinationSlug={destination.slug} destinationName={destination.name} />

                  {/* Hotels & Stay Options Section */}
                  <HotelsSection destinationSlug={destination.slug} destinationName={destination.name} />

                  {/* Restaurants & Local Dining Section */}
                  <RestaurantsSection destinationSlug={destination.slug} destinationName={destination.name} />

                  {/* Cultural Festivals & Celebrations Section */}
                  <FestivalsSection stateSlug={destination.state?.slug} destinationName={destination.name} />

                  {/* Travel Stories & Photo Journals Section */}
                  <TravelStoriesSection stateSlug={destination.state?.slug} destinationName={destination.name} />

                  {/* Reviews Section */}
                  <section className="details-card">
                    <h2>User Reviews & Ratings</h2>
                    
                    {/* Rating Distribution Breakdown */}
                    <RatingBreakdown
                      reviews={reviews}
                      avgRating={destination.avg_rating || 4.7}
                      totalReviews={destination.total_reviews || reviews.length}
                    />

                    {/* Write Review Form */}
                    <form onSubmit={handleReviewSubmit} className="review-form">
                      <h4>Write Your Review</h4>
                      <div className="rating-select">
                        <label>Rating: </label>
                        <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}>
                          <option value="5">5 ★★★★★ (Excellent)</option>
                          <option value="4">4 ★★★★☆ (Good)</option>
                          <option value="3">3 ★★★☆☆ (Average)</option>
                          <option value="2">2 ★★☆☆☆ (Poor)</option>
                          <option value="1">1 ★☆☆☆☆ (Terrible)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="Review Title (e.g. Breathtaking Views & Great Experience!)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                      />
                      <textarea
                        rows="3"
                        placeholder="Share your traveler experience at this destination..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      ></textarea>
                      <button type="submit" className="btn-submit-review" disabled={submittingReview}>
                        <Send size={16} /> Submit Review
                      </button>
                    </form>

                    {/* Reviews List */}
                    <div className="reviews-list" style={{ marginTop: '1.5rem' }}>
                      {reviews.length === 0 ? (
                        <p className="no-reviews">No reviews yet. Be the first to review this destination!</p>
                      ) : (
                        reviews.map(r => (
                          <ReviewCard key={r.id} review={r} />
                        ))
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Quick Actions Sidebar */}
                <aside className="details-sidebar">
                  <WeatherWidget destinationSlug={destination.slug} destinationName={destination.name} />

                  <div className="sidebar-box">
                    <h3>Quick Actions</h3>
                    <div className="action-buttons">
                      <FavoriteButton destinationId={destination.id} initialFavorited={false} />
                      <Link to="/travel-planner" className="btn-sidebar-action">
                        <Plus size={16} /> Add to AI Itinerary
                      </Link>
                    </div>
                  </div>

                  <div className="sidebar-box">
                    <h3>Location Coordinates</h3>
                    <p><strong>Latitude:</strong> {destination.latitude || '17.6868'}</p>
                    <p><strong>Longitude:</strong> {destination.longitude || '83.2185'}</p>
                  </div>
                </aside>
              </div>
            </div>

            {/* Desktop Right Sidebar Ad */}
            <Advertisement type="sidebar-right" index={2} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}



