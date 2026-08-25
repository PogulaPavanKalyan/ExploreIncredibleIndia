import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import ExploreIndiaPage from './pages/ExploreIndiaPage';
import CollectionsPage from './pages/CollectionsPage';
import StatePage from './pages/StatePage';
import CityPage from './pages/CityPage';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import FavoritesPage from './pages/FavoritesPage';
import PlanYourTripPage from './pages/PlanYourTripPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import FestivalsPage from './pages/FestivalsPage';
import TravelStoriesPage from './pages/TravelStoriesPage';
import StoryDetailPage from './pages/StoryDetailPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RegionPage from './pages/RegionPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import { State3DExplorer } from './components/JourneyAcrossIndia/State3DExplorer';
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
              <Route path="explore" element={<ExploreIndiaPage />} />
              <Route path="explore/:slug" element={<ExploreIndiaPage />} />
              <Route path="explore/:slug/:category" element={<ExploreIndiaPage />} />
              <Route path="explore-india" element={<ExploreIndiaPage />} />
              <Route path="explore-india/:slug" element={<ExploreIndiaPage />} />
              <Route path="explore-india/:slug/:category" element={<ExploreIndiaPage />} />
              <Route path="collections/:type" element={<CollectionsPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="jyotirlingas" element={<CollectionsPage />} />
              <Route path="festivals" element={<FestivalsPage />} />
              <Route path="stories" element={<TravelStoriesPage />} />
              <Route path="stories/:slug" element={<StoryDetailPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="search" element={<SearchResultsPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="regions/:slug" element={<RegionPage />} />
              <Route path="states/:slug" element={<StatePage />} />
              <Route path="state-3d/:stateSlug" element={<State3DExplorer />} />
              <Route path="india/:slug" element={<StatePage />} />
              <Route path="cities/:slug" element={<CityPage />} />
              <Route path="places/:slug" element={<DestinationDetailsPage />} />
              <Route path="destinations/:slug" element={<DestinationDetailsPage />} />
              <Route path="plan-your-trip" element={<PlanYourTripPage />} />
              <Route path="travel-planner" element={<PlanYourTripPage />} />
              <Route path="budget-planner" element={<BudgetPlannerPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="dashboard" element={<UserDashboardPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
