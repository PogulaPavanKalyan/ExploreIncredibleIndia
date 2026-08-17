import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getFavorites } from '../api/favoriteApi';
import { getItineraries } from '../api/itineraryApi';
import DestinationCard from '../components/DestinationCard';
import UserBadgesWidget from '../components/gamification/UserBadgesWidget';
import AnalyticsWidget from '../components/analytics/AnalyticsWidget';
import { User, Heart, Compass, LogOut } from 'lucide-react';
import '../styles/dashboard.css';

export default function UserDashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const favRes = await getFavorites();
        if (favRes.success) {
          setFavorites(favRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="dashboard-page section-padding">
      <div className="container">
        {/* User Profile Header */}
        <div className="dashboard-user-header">
          <div className="avatar-circle">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h2>{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</h2>
            <p>{user.email} • Role: <strong>{user.role}</strong></p>
          </div>
          <button className="btn-logout-dash" onClick={logout}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Gamification Level & Badges Widget */}
        <UserBadgesWidget favoritesCount={favorites.length} reviewsCount={2} itinerariesCount={1} />

        {/* Real-time Platform Analytics Widget */}
        <AnalyticsWidget />

        {/* Dashboard Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={16} /> Saved Favorites ({favorites.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'itineraries' ? 'active' : ''}`}
            onClick={() => setActiveTab('itineraries')}
          >
            <Compass size={16} /> My Travel Plans
          </button>
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {activeTab === 'favorites' && (
            <div>
              {loading ? (
                <p>Loading favorites...</p>
              ) : favorites.length === 0 ? (
                <div className="empty-state-box">
                  <h3>No Favorites Saved Yet</h3>
                  <p>Explore places across India and click the heart icon to save them to your dashboard.</p>
                </div>
              ) : (
                <div className="grid-destinations">
                  {favorites.map(f => (
                    <DestinationCard key={f.id} destination={f.destination_details} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'itineraries' && (
            <div className="empty-state-box">
              <h3>Create Your First Travel Plan</h3>
              <p>Use our AI Travel Planner to build custom trip plans.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
