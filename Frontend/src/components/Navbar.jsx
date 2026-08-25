import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, MapPin, Sparkles, Heart, Home, BookOpen, Flame, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import '../styles/navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-top-accent"></div>
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrap">
            <Compass className="logo-icon spin-on-hover" size={22} />
          </div>
          <div className="logo-text-group">
            <span className="logo-title">
              Dekho<span className="logo-highlight">Bharat</span>
            </span>
            <span className="logo-tagline">THE DIGITAL ATLAS OF INDIA</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links desktop-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <Home className="nav-icon" size={16} /> <span>Home</span>
          </Link>
          <Link to="/explore-india" className={`nav-link ${isActive('/explore-india') || isActive('/explore') ? 'active' : ''}`}>
            <MapPin className="nav-icon" size={16} /> <span>Explore Atlas</span>
          </Link>
          <Link to="/collections/jyotirlingas" className={`nav-link ${isActive('/collections/jyotirlingas') ? 'active' : ''}`}>
            <Flame className="nav-icon flame-icon" size={16} /> <span>12 Jyotirlingas</span>
          </Link>
          <Link to="/festivals" className={`nav-link ${isActive('/festivals') ? 'active' : ''}`}>
            <Sparkles className="nav-icon sparkle-icon" size={16} /> <span>Festivals</span>
          </Link>
          <Link to="/stories" className={`nav-link ${isActive('/stories') ? 'active' : ''}`}>
            <BookOpen className="nav-icon book-icon" size={16} /> <span>Stories</span>
          </Link>
          <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}>
            <Heart className="nav-icon heart-icon" size={16} /> <span>Favorites</span>
          </Link>
          <Link to="/travel-planner" className={`nav-link planner-btn ${isActive('/travel-planner') ? 'active' : ''}`}>
            <Sparkles className="planner-sparkle" size={16} />
            <span>AI Planner</span>
          </Link>
          <LanguageSelector />
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
                <span className="logo-title">Dekho<span className="logo-highlight">Bharat</span></span>
                <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>

              <div className="mobile-drawer-links">
                <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Home size={18} /> Home
                </Link>
                <Link to="/explore-india" className={`mobile-nav-link ${isActive('/explore-india') || isActive('/explore') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <MapPin size={18} /> Explore Atlas
                </Link>
                <Link to="/collections/jyotirlingas" className={`mobile-nav-link ${isActive('/collections/jyotirlingas') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Flame size={18} color="#F59E0B" /> 12 Jyotirlingas
                </Link>
                <Link to="/festivals" className={`mobile-nav-link ${isActive('/festivals') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles size={18} color="#FF6B35" /> Festivals
                </Link>
                <Link to="/stories" className={`mobile-nav-link ${isActive('/stories') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <BookOpen size={18} color="#38BDF8" /> Stories
                </Link>
                <Link to="/favorites" className={`mobile-nav-link ${isActive('/favorites') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Heart size={18} color="#EF4444" /> Favorites
                </Link>
                <Link to="/travel-planner" className="mobile-nav-link planner-mobile-highlight" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles size={18} /> AI Itinerary Planner
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
