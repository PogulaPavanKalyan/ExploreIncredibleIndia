import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import ExplorePage from './pages/ExplorePage';
import StatePage from './pages/StatePage';
import CityPage from './pages/CityPage';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage';
import AITravelPlannerPage from './pages/AITravelPlannerPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import FestivalsPage from './pages/FestivalsPage';
import TravelStoriesPage from './pages/TravelStoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RegionPage from './pages/RegionPage';
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt';
import { trackPageView } from './services/analyticsService';

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <PageViewTracker />
          <PWAInstallPrompt />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="festivals" element={<FestivalsPage />} />
              <Route path="stories" element={<TravelStoriesPage />} />
              <Route path="stories/:slug" element={<StoryDetailPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="search" element={<SearchResultsPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="regions/:slug" element={<RegionPage />} />
              <Route path="states/:slug" element={<StatePage />} />
              <Route path="cities/:slug" element={<CityPage />} />
              <Route path="places/:slug" element={<DestinationDetailsPage />} />
              <Route path="travel-planner" element={<AITravelPlannerPage />} />
              <Route path="budget-planner" element={<BudgetPlannerPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

