import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { handleDestinationImageError } from '../../utils/imageUrl';
import './FinalCTA.css';

// 6 Real, verified representative tourism destinations covering all corners of India
const FINAL_SHOWCASE_DESTINATIONS = [
  {
    name: 'Tirumala Tirupati',
    state: 'Andhra Pradesh',
    regionTag: 'Sacred South',
    slug: 'tirumala-tirupati-temple',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
  },
  {
    name: 'Munnar & Tea Hills',
    state: 'Kerala',
    regionTag: 'Tropical South',
    slug: 'munnar-kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
  },
  {
    name: 'Pangong & Ladakh Passes',
    state: 'Ladakh',
    regionTag: 'Himalayas North',
    slug: 'pangong-lake-ladakh',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800',
  },
  {
    name: 'Amer Fort & Heritage',
    state: 'Rajasthan',
    regionTag: 'Royal West',
    slug: 'amber-fort-jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
  },
  {
    name: 'Cherrapunji Cascades',
    state: 'Meghalaya',
    regionTag: 'Lush Northeast',
    slug: 'cherrapunji-meghalaya',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800',
  },
  {
    name: 'Palolem Beach',
    state: 'Goa',
    regionTag: 'Coastal West',
    slug: 'palolem-beach-goa',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  },
];

// Interactive regional landmark pins
const REGIONAL_PINS = [
  { id: 'north', name: 'Himalayas & Ladakh', state: 'North', x: 260, y: 110 },
  { id: 'west', name: 'Rajasthan & Desert Forts', state: 'West', x: 190, y: 260 },
  { id: 'central', name: 'Khajuraho & Varanasi', state: 'Central', x: 380, y: 280 },
  { id: 'northeast', name: 'Meghalaya & Living Bridges', state: 'Northeast', x: 570, y: 230 },
  { id: 'east', name: 'Puri & Bengal Coast', state: 'East', x: 470, y: 360 },
  { id: 'south', name: 'Tirupati & Kerala Backwaters', state: 'South', x: 300, y: 470 },
];

export default function FinalCTA() {
  const navigate = useNavigate();
  const [activePin, setActivePin] = useState(null);

  return (
    <section className="final-cta-section" aria-label="Closing Call to Adventure across Incredible India">
      {/* Ambient Lighting & Grid */}
      <div className="final-cta-ambient-glow" aria-hidden="true" />
      <div className="final-cta-grid-mesh" aria-hidden="true" />

      {/* 3D India Map Vector Silhouette & Glowing Route Connections */}
      <div className="final-cta-map-backdrop" aria-hidden="true">
        <svg viewBox="0 0 700 600" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* India Outline Glow Gradient */}
            <linearGradient id="indiaOutlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#FF6B1A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
            </linearGradient>

            {/* Glowing Route Arc Gradient */}
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#FF6B1A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Stylized Contour Map of India */}
          <path
            d="M 270 40 
               C 300 45, 340 70, 350 110 
               C 365 140, 420 150, 460 160 
               C 510 170, 580 190, 610 220 
               C 620 250, 570 270, 540 270 
               C 490 280, 470 320, 480 370 
               C 460 410, 400 440, 360 490 
               C 330 530, 300 570, 290 570 
               C 280 570, 270 510, 250 460 
               C 230 410, 200 360, 200 320 
               C 170 290, 140 250, 160 210 
               C 180 170, 210 140, 240 100 
               Z"
            stroke="url(#indiaOutlineGrad)"
            strokeWidth="2.5"
            fill="rgba(13, 27, 42, 0.4)"
          />

          {/* Inner Geometric Contour Rings for 3D Landmass Elevation */}
          <path
            d="M 275 70 
               C 310 95, 335 130, 360 160 
               C 410 180, 470 195, 520 230 
               C 490 255, 450 290, 440 340 
               C 410 390, 360 440, 320 490 
               C 290 530, 280 530, 270 470 
               C 240 400, 210 340, 210 290 
               C 190 240, 220 170, 250 120 
               Z"
            stroke="rgba(255, 107, 26, 0.25)"
            strokeWidth="1.5"
            strokeDasharray="4, 6"
          />

          {/* Animated Glowing Routes Connecting Regions */}
          {/* North to South */}
          <path
            d="M 260 110 Q 340 290 300 470"
            stroke="url(#routeGrad)"
            strokeWidth="2"
            fill="none"
            className="final-cta-route-line"
          />
          {/* North to West */}
          <path
            d="M 260 110 Q 200 180 190 260"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            fill="none"
            className="final-cta-route-line"
          />
          {/* West to Central */}
          <path
            d="M 190 260 Q 290 270 380 280"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            fill="none"
            className="final-cta-route-line"
          />
          {/* Central to East */}
          <path
            d="M 380 280 Q 420 320 470 360"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            fill="none"
            className="final-cta-route-line"
          />
          {/* East to Northeast */}
          <path
            d="M 470 360 Q 520 280 570 230"
            stroke="url(#routeGrad)"
            strokeWidth="1.5"
            fill="none"
            className="final-cta-route-line"
          />

          {/* Interactive Geographic Regional Landmark Pins */}
          {REGIONAL_PINS.map((pin) => (
            <g
              key={pin.id}
              className="final-cta-map-pin"
              transform={`translate(${pin.x}, ${pin.y})`}
              onMouseEnter={() => setActivePin(pin)}
              onMouseLeave={() => setActivePin(null)}
            >
              {/* Outer Pulse Circle */}
              <circle cx="0" cy="0" r="14" fill="#FF6B1A" className="final-cta-map-pin-pulse" />
              {/* Pin Base */}
              <circle cx="0" cy="0" r="5" fill="#FF6B1A" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          ))}
        </svg>
      </div>

      <div className="final-cta-container">
        {/* Central Content */}
        <div className="final-cta-content">
          {/* 3D Floating Rotating Compass Badge */}
          <motion.div
            className="final-cta-compass-badge"
            initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Compass size={38} strokeWidth={1.8} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="final-cta-tag">✦ YOUR JOURNEY BEGINS HERE</span>
          </motion.div>

          <motion.h2
            className="final-cta-title"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            YOUR NEXT ADVENTURE
            <br />
            <span className="gradient-text">IS SOMEWHERE IN INDIA.</span>
          </motion.h2>

          <motion.p
            className="final-cta-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover sacred temples, Himalayan journeys, tropical beaches, ancient heritage,
            wildlife, food, culture and unforgettable experiences across India.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="final-cta-button-group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/explore-india" className="final-cta-primary-btn" id="final-cta-explore-india">
              <span>EXPLORE INCREDIBLE INDIA</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/places" className="final-cta-secondary-btn" id="final-cta-explore-destinations">
              <span>EXPLORE DESTINATIONS</span>
            </Link>
          </motion.div>
        </div>

        {/* 6 Tourism Destination Floating Cards Showcase */}
        <motion.div
          className="final-cta-showcase-grid"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {FINAL_SHOWCASE_DESTINATIONS.map((dest, idx) => (
            <Link
              key={idx}
              to={`/places/${dest.slug}`}
              className="final-cta-dest-card"
              id={`final-cta-card-${idx}`}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="final-cta-card-img"
                loading="lazy"
                onError={(e) => handleDestinationImageError(e, dest.name, dest.image)}
              />

              <div className="final-cta-card-overlay">
                <span className="final-cta-card-tag">{dest.regionTag}</span>
                <h3 className="final-cta-card-title">{dest.name}</h3>
                
                <div className="final-cta-card-footer">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={12} color="#FF6B1A" />
                    {dest.state}
                  </span>
                  <span className="final-cta-card-arrow">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
