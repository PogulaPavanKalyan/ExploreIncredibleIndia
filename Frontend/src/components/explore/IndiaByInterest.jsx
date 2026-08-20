import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Compass, Waves, Mountain, ShieldAlert, Castle, 
  TreePine, Users, Heart, Calendar, Eye, Camera, ArrowRight 
} from 'lucide-react';
import './IndiaByInterest.css';

const INTEREST_THEMES = [
  {
    id: 'spiritual',
    title: 'Spiritual India',
    subtitle: 'Ancient Temples & Sacred Jyotirlingas',
    icon: Sparkles,
    color: '#f59e0b',
    category: 'temples',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'adventure',
    title: 'Adventure India',
    subtitle: 'High Himalayan Treks & White Water Rafting',
    icon: Compass,
    color: '#ef4444',
    category: 'adventure',
    image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'beaches',
    title: 'Beach Escapes',
    subtitle: 'Sun-Kissed Sands & Turquoise Waves',
    icon: Waves,
    color: '#06b6d4',
    category: 'beaches',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mountains',
    title: 'Mountain Escapes',
    subtitle: 'Snowy Peaks & Misty Hill Stations',
    icon: Mountain,
    color: '#10b981',
    category: 'mountains',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'wildlife',
    title: 'Wildlife India',
    subtitle: 'Royal Bengal Tigers & One-Horned Rhinos',
    icon: ShieldAlert,
    color: '#84cc16',
    category: 'wildlife',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'heritage',
    title: 'Heritage & Forts',
    subtitle: 'UNESCO Palaces & 1000-Year Monoliths',
    icon: Castle,
    color: '#eab308',
    category: 'heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'nature',
    title: 'Nature & Waterfalls',
    subtitle: 'Cascading Falls & Rainforest Canopies',
    icon: TreePine,
    color: '#14b8a6',
    category: 'nature',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'family',
    title: 'Family Trips',
    subtitle: 'Kid-Friendly Resorts & Scenic Getaways',
    icon: Users,
    color: '#3b82f6',
    category: 'nature',
    tag: 'family-friendly',
    image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'romantic',
    title: 'Romantic Getaways',
    subtitle: 'Lakeside Palaces & Sunset Horizons',
    icon: Heart,
    color: '#ec4899',
    category: 'heritage',
    tag: 'romantic',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'weekend',
    title: 'Weekend Trips',
    subtitle: 'Short 1-2 Day Escapes Near Major Cities',
    icon: Calendar,
    color: '#8b5cf6',
    category: 'adventure',
    tag: 'weekend-trip',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'offbeat',
    title: 'Offbeat India',
    subtitle: 'Hidden Caves, Living Bridges & Cold Deserts',
    icon: Eye,
    color: '#6366f1',
    category: 'nature',
    tag: 'hidden-gem',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photography',
    title: 'Photography Havens',
    subtitle: 'Golden Hour Vistas & Architectural Wonders',
    icon: Camera,
    color: '#f97316',
    category: 'heritage',
    tag: 'photography',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b718?auto=format&fit=crop&w=600&q=80'
  }
];

export default function IndiaByInterest({ onSelectTheme }) {
  return (
    <section className="interest-section">
      <div className="interest-header">
        <div className="interest-badge">
          <Sparkles className="w-4 h-4 text-orange-400" /> Curated Experiences
        </div>
        <h3 className="interest-title">Explore India by Interest</h3>
        <p className="interest-subtitle">
          Find your dream Indian journey tailored to your travel mood, passions, and style.
        </p>
      </div>

      <div className="interest-grid">
        {INTEREST_THEMES.map((theme, idx) => {
          const IconComp = theme.icon;
          return (
            <motion.div
              key={theme.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="theme-card"
              onClick={() => onSelectTheme(theme)}
            >
              <div className="theme-bg" style={{ backgroundImage: `url(${theme.image})` }} />
              <div className="theme-overlay" />
              
              <div className="theme-content">
                <div 
                  className="theme-icon-box"
                  style={{ backgroundColor: `${theme.color}25`, borderColor: `${theme.color}50` }}
                >
                  <IconComp className="w-5 h-5" style={{ color: theme.color }} />
                </div>
                
                <div>
                  <h4 className="theme-name">{theme.title}</h4>
                  <p className="theme-sub">{theme.subtitle}</p>
                </div>

                <div className="theme-cta-row">
                  <span className="cta-link" style={{ color: theme.color }}>
                    Explore places <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
