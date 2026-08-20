import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, Layers, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { getCollections, getCollectionBySlug } from '../services/collectionService';
import { getDestinations } from '../services/destinationService';
import DestinationCard from '../components/home/TrendingDestinations/DestinationCard';
import PageTransition from '../components/PageTransition';
import './CollectionsPage.css';

const FALLBACK_CONFIG = {
  'jyotirlingas': {
    title: '12 Sacred Jyotirlingas of India',
    subtitle: 'The supreme radiant manifestations of the eternal cosmic light of Lord Shiva across India.',
    badge: '★ SACRED JYOTIRLINGA YATRA',
    filterParam: { pilgrimage_collection: 'jyotirlinga' },
    intro: 'According to the Shiva Purana, a Jyotirlinga (pillar of light) is the supreme reality out of which Shiva appeared. Completing the pilgrimage to all 12 holy Jyotirlingas — from Somnath in Gujarat and Kedarnath in the Himalayas to Rameshwaram in Tamil Nadu — is one of the highest spiritual journeys.',
  },
  'char-dham': {
    title: 'Maha Char Dham & Chota Char Dham',
    subtitle: 'The four cardinal spiritual gateways established by Adi Shankaracharya in the four corners of India.',
    badge: '★ CARDINAL DHAM PILGRIMAGE',
    filterParam: { pilgrimage_collection: 'char_dham' },
    intro: 'The Maha Char Dham comprises Badrinath in the North, Rameswaram in the South, Jagannath Puri in the East, and Dwarka in the West. Visiting all four Dhams is believed to help attain spiritual liberation.',
  },
  'south-indian-temples': {
    title: 'Grand South Indian Temples',
    subtitle: 'Architectural Marvels of Dravidian, Chola & Vijayanagara Dynasties.',
    badge: '★ DRAVIDIAN TEMPLE HERITAGE',
    filterParam: { region: 'south-india', category: 'temples' },
    intro: 'Experience soaring multi-tiered gopurams, thousand-pillared stone corridors, and living sacred traditions across Andhra Pradesh, Tamil Nadu, Telangana, and Karnataka.',
  },
  'best-beaches': {
    title: 'Best Indian Beaches & Coastal Havens',
    subtitle: 'Over 7,500 km of sun-kissed coastlines from Goa to Kerala and the Bay of Bengal.',
    badge: '★ COASTAL EXPEDITIONS',
    filterParam: { category: 'beaches' },
    intro: 'From the palm-fringed sands of Goa and Kovalam to the clifftop beaches of Varkala and the Blue Flag beach of Puri, explore India’s premier coastal retreats.',
  },
  'himalayan-escapes': {
    title: 'Himalayan Peaks & High Altitude Treks',
    subtitle: 'Snow-capped peaks, cold mountain deserts, and serene pine valleys.',
    badge: '★ HIMALAYAN FRONTIER',
    filterParam: { category: 'mountains' },
    intro: 'Discover the Great Himalayas spanning Ladakh, Himachal Pradesh, Uttarakhand, and Sikkim with high-altitude alpine passes and pristine glacier lakes.',
  },
  'unesco-heritage': {
    title: 'UNESCO World Heritage of India',
    subtitle: 'Centuries-Old Monolithic Monuments, Cave Frescoes & Ancient Empires.',
    badge: '★ UNESCO WORLD HERITAGE',
    filterParam: { tag: 'unesco' },
    intro: 'Tour world-renowned rock-cut monolithic cave temples at Ellora, royal Rajput palaces, and bio-engineering wonders preserved for eternity.',
  }
};

export default function CollectionsPage() {
  const { type = 'jyotirlingas', slug } = useParams();
  const activeSlug = slug || type || 'jyotirlingas';
  const navigate = useNavigate();

  const [collectionsList, setCollectionsList] = useState([]);
  const [collectionData, setCollectionData] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch available collections from Django API
  useEffect(() => {
    getCollections()
      .then((res) => {
        if (res && res.data && res.data.length > 0) {
          setCollectionsList(res.data);
        }
      })
      .catch((err) => console.warn('Could not load dynamic collections:', err));
  }, []);

  // 2. Fetch specific collection details or fallback
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getCollectionBySlug(activeSlug)
      .then((res) => {
        if (isMounted && res && res.data) {
          setCollectionData(res.data);
          setDestinations(res.data.destinations || []);
        }
      })
      .catch((err) => {
        console.warn(`Dynamic collection '${activeSlug}' not found in DB, falling back to filter query:`, err);
        const fallback = FALLBACK_CONFIG[activeSlug] || FALLBACK_CONFIG['jyotirlingas'];
        setCollectionData({
          name: fallback.title,
          subtitle: fallback.subtitle,
          description: fallback.intro,
          cover_image: ''
        });
        // Query destinations by fallback parameters
        getDestinations({ ...fallback.filterParam, page_size: 40 })
          .then((resDest) => {
            if (isMounted && resDest && resDest.data) {
              setDestinations(resDest.data);
            }
          })
          .catch(() => {
            if (isMounted) setDestinations([]);
          });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeSlug]);

  const navTabs = collectionsList.length > 0 
    ? collectionsList.map(c => ({ id: c.slug, label: c.name, count: c.destination_count }))
    : Object.keys(FALLBACK_CONFIG).map(k => ({ id: k, label: FALLBACK_CONFIG[k].title.split(' ')[0] + ' ' + (FALLBACK_CONFIG[k].title.split(' ')[1] || ''), count: null }));

  return (
    <PageTransition>
      <div className="collections-page">
        
        {/* Dynamic Breadcrumbs */}
        <div className="collections-breadcrumbs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link to="/explore-india" className="hover:text-orange-400 transition-colors">Explore India</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-orange-400 font-bold">{collectionData?.name || activeSlug}</span>
          </div>
        </div>

        {/* Hero Section with Glassmorphism and Background Cover */}
        <section 
          className="collections-hero-banner"
          style={{
            backgroundImage: collectionData?.cover_image ? `linear-gradient(to bottom, rgba(15, 23, 42, 0.85), #0b0f19), url(${collectionData.cover_image})` : undefined
          }}
        >
          <div className="collections-hero-content">
            <span className="collections-badge">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> CURATED TOURISM COLLECTION
            </span>
            <h1 className="collections-title">{collectionData?.name || 'India Travel Collection'}</h1>
            <p className="collections-subtitle">{collectionData?.subtitle || collectionData?.description}</p>

            {/* Collection Navigation Tabs */}
            <div className="collections-tabs-bar">
              {navTabs.map((tab) => {
                const isActive = activeSlug === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/collections/${tab.id}`)}
                    className={`collection-tab-pill ${isActive ? 'active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className="tab-count-tag">{tab.count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Collection Narrative Card */}
        {collectionData?.description && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
            <div className="collection-intro-card">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" /> ABOUT THIS COLLECTION
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {collectionData.description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4 text-teal-400" /> {destinations.length} Verified Destinations
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-amber-400" /> All-India Locations
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Destination Cards Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Places in this Collection ({destinations.length})
            </h3>
            <Link to="/explore-india" className="text-sm font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1">
              Explore All India <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-800/40 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map((dest) => (
                <DestinationCard
                  key={dest.id || dest.slug}
                  destination={dest}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/50 border border-white/10 rounded-2xl p-8">
              <Compass className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-slate-200">No destinations linked to this collection yet</h4>
              <p className="text-slate-400 text-sm mt-1">
                Destinations can be added directly via Django Admin.
              </p>
            </div>
          )}
        </section>

      </div>
    </PageTransition>
  );
}
