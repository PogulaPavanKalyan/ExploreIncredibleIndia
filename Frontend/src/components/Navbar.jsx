import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, MapPin, Sparkles, User, LogOut, Menu, X, Heart, Home, Grid, BookOpen, Trophy, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import '../styles/navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => { 
      document.body.style.overflow = 'auto'; 
      document.documentElement.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-bg">
            <Compass className="logo-icon" />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">Dekho Bharat</span>
            <span className="logo-tagline">The Digital Atlas of India</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="navbar-links desktop-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <Home className="nav-icon" /> Home
          </Link>
          <Link to="/explore-india" className={`nav-link ${isActive('/explore-india') || isActive('/explore') ? 'active' : ''}`}>
            <MapPin className="nav-icon" /> Explore Atlas
          </Link>
          <Link to="/collections/jyotirlingas" className={`nav-link ${isActive('/collections/jyotirlingas') ? 'active' : ''}`}>
            <Flame className="nav-icon" style={{ color: '#F59E0B' }} /> 12 Jyotirlingas
          </Link>
          <Link to="/festivals" className={`nav-link ${isActive('/festivals') ? 'active' : ''}`}>
            <Sparkles className="nav-icon" color="#FF6B35" /> Festivals
          </Link>
          <Link to="/stories" className={`nav-link ${isActive('/stories') ? 'active' : ''}`}>
            <BookOpen className="nav-icon" color="#0284C7" /> Stories
          </Link>
          <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
            <Heart className="nav-icon" style={{ color: '#EF4444' }} /> Favorites
          </Link>
          <Link to="/travel-planner" className={`nav-link planner-highlight ${isActive('/travel-planner') ? 'active' : ''}`}>
            <Sparkles className="nav-icon" /> AI Planner
          </Link>
          <LanguageSelector />
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Animated Slide-in Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="mobile-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              <div className="mobile-drawer-header">
                <span className="logo-title">DEKHO<span className="logo-highlight">BHARAT</span></span>
                <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={24} />
                </button>
              </div>

              <div className="mobile-drawer-links">
                <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Home size={20} /> Home
                </Link>
                <Link to="/explore-india" className={`mobile-nav-link ${isActive('/explore-india') || isActive('/explore') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <MapPin size={20} /> Explore India Atlas
                </Link>
                <Link to="/collections/jyotirlingas" className={`mobile-nav-link ${isActive('/collections/jyotirlingas') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Flame size={20} color="#F59E0B" /> 12 Jyotirlingas
                </Link>
                <Link to="/festivals" className={`mobile-nav-link ${isActive('/festivals') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles size={20} color="#FF6B35" /> Festivals
                </Link>
                <Link to="/stories" className={`mobile-nav-link ${isActive('/stories') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <BookOpen size={20} color="#0284C7" /> Stories
                </Link>
                <Link to="/favorites" className={`mobile-nav-link ${isActive('/favorites') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Heart size={20} color="#EF4444" /> Favorites
                </Link>
                <Link to="/travel-planner" className="mobile-nav-link planner-mobile-highlight" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles size={20} /> AI Itinerary Planner
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
