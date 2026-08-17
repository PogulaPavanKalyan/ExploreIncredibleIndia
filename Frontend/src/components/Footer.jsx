import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Mail, Phone, MapPin, Send, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/footer.css';

export default function Footer() {
  const [openSections, setOpenSections] = useState({
    quick: false,
    categories: false,
    states: false,
    contact: false
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <Compass className="footer-logo-icon" />
            <span>DEKHO BHARAT</span>
          </div>
          <p className="footer-desc">
            Discover India’s breathtaking destinations, secret hidden gems, sacred temples, historic forts, and pristine natural beauty.
          </p>
          <div className="newsletter-box">
            <h4>Subscribe for Weekly Travel Guides</h4>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" aria-label="Email address for newsletter" />
              <button type="button" className="btn-subscribe" aria-label="Subscribe to newsletter">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-links-grid">
          {/* Quick Links */}
          <div className={`footer-col ${openSections.quick ? 'open' : ''}`}>
            <h4 onClick={() => toggleSection('quick')} className="footer-collapsible-title">
              <span>Quick Links</span>
              <ChevronDown size={18} className="footer-accordion-icon" />
            </h4>
            <ul className="footer-link-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/explore">Explore All Destinations</Link></li>
              <li><Link to="/travel-planner">AI Travel Planner</Link></li>
              <li><Link to="/explore?featured=true">Featured Places</Link></li>
              <li><Link to="/explore?trending=true">Trending Experiences</Link></li>
            </ul>
          </div>

          {/* Popular States */}
          <div className={`footer-col ${openSections.states ? 'open' : ''}`}>
            <h4 onClick={() => toggleSection('states')} className="footer-collapsible-title">
              <span>Popular States</span>
              <ChevronDown size={18} className="footer-accordion-icon" />
            </h4>
            <ul className="footer-link-list">
              <li><Link to="/explore?state=andhra-pradesh">Andhra Pradesh</Link></li>
              <li><Link to="/explore?state=telangana">Telangana</Link></li>
              <li><Link to="/explore?state=kerala">Kerala</Link></li>
              <li><Link to="/explore?state=karnataka">Karnataka</Link></li>
              <li><Link to="/explore?state=rajasthan">Rajasthan</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className={`footer-col ${openSections.categories ? 'open' : ''}`}>
            <h4 onClick={() => toggleSection('categories')} className="footer-collapsible-title">
              <span>Categories</span>
              <ChevronDown size={18} className="footer-accordion-icon" />
            </h4>
            <ul className="footer-link-list">
              <li><Link to="/explore?category=hill-stations">Hill Stations</Link></li>
              <li><Link to="/explore?category=beaches">Beaches & Coastal</Link></li>
              <li><Link to="/explore?category=forts">Forts & Heritage</Link></li>
              <li><Link to="/explore?category=historical-places">Historical Places</Link></li>
              <li><Link to="/explore?category=hidden-gems">Hidden Gems</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className={`footer-col ${openSections.contact ? 'open' : ''}`}>
            <h4 onClick={() => toggleSection('contact')} className="footer-collapsible-title">
              <span>Contact & Support</span>
              <ChevronDown size={18} className="footer-accordion-icon" />
            </h4>
            <ul className="contact-list footer-link-list">
              <li><MapPin size={16} /> Visakhapatnam & Hyderabad, India</li>
              <li><Mail size={16} /> support@dekhobharat.com</li>
              <li><Phone size={16} /> +91 1800-123-BHARAT</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-flex">
          <p>© 2026 Dekho Bharat. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
            <Link to="/explore" style={{ color: '#94a3b8' }}>Privacy Policy</Link>
            <span style={{ color: '#475569' }}>•</span>
            <Link to="/explore" style={{ color: '#94a3b8' }}>Terms of Service</Link>
          </div>
          <p className="made-with">Crafted with <Heart size={14} className="heart-icon" /> for Incredible India</p>
        </div>
      </div>
    </footer>
  );
}

