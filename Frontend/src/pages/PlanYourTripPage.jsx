import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MapPin, Calendar, DollarSign, Users, Compass, 
  CheckCircle2, Clock, Navigation, Printer, Share2, Bookmark, 
  RotateCcw, ArrowRight, ArrowLeft, Layers, ChevronDown, 
  ExternalLink, Waves, Mountain, ShieldAlert, Heart, Camera, 
  Utensils, Check, AlertCircle, Copy
} from 'lucide-react';
import { planTrip } from '../services/plannerService';
import PageTransition from '../components/PageTransition';
import './PlanYourTripPage.css';

const QUICK_CITIES = ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Vijayawada', 'Kochi', 'Jaipur', 'Kolkata'];

const DURATION_OPTIONS = [
  { value: 1, label: '1 Day', sub: 'Quick Day Trip' },
  { value: 2, label: '2 Days', sub: 'Weekend Getaway' },
  { value: 3, label: '3 Days', sub: 'Long Weekend' },
  { value: 4, label: '4 Days', sub: 'Short Vacation' },
  { value: 5, label: '5 Days', sub: 'Exploration' },
  { value: 7, label: '7 Days', sub: 'One Week Tour' },
  { value: 10, label: '10+ Days', sub: 'Grand India Tour' }
];

const BUDGET_OPTIONS = [
  { value: 4000, label: '₹2,000 – ₹5,000', sub: 'Budget / Backpacker' },
  { value: 8000, label: '₹5,000 – ₹10,000', sub: 'Standard / Pocket-friendly' },
  { value: 15000, label: '₹10,000 – ₹20,000', sub: 'Comfort / Mid-range' },
  { value: 35000, label: '₹20,000 – ₹50,000', sub: 'Premium / Leisure' },
  { value: 65000, label: '₹50,000+', sub: 'Luxury & Exclusive' }
];

const TRAVEL_STYLES = [
  { id: 'spiritual', label: 'Spiritual & Temples', icon: Sparkles, color: '#f59e0b' },
  { id: 'adventure', label: 'Adventure & Trekking', icon: Compass, color: '#ef4444' },
  { id: 'nature', label: 'Nature & Waterfalls', icon: Mountain, color: '#10b981' },
  { id: 'beaches', label: 'Beaches & Coastal', icon: Waves, color: '#06b6d4' },
  { id: 'mountains', label: 'Himalayas & Hills', icon: Mountain, color: '#3b82f6' },
  { id: 'heritage', label: 'Heritage & Forts', icon: Layers, color: '#eab308' },
  { id: 'wildlife', label: 'Wildlife & Safaris', icon: ShieldAlert, color: '#84cc16' },
  { id: 'food', label: 'Food & Culture', icon: Utensils, color: '#f97316' },
  { id: 'family', label: 'Family Friendly', icon: Users, color: '#a855f7' },
  { id: 'romantic', label: 'Romantic Escapes', icon: Heart, color: '#ec4899' },
  { id: 'photography', label: 'Photography', icon: Camera, color: '#14b8a6' },
  { id: 'offbeat', label: 'Offbeat & Hidden Gems', icon: Compass, color: '#6366f1' }
];

const COMPANIONS = [
  { id: 'solo', label: 'Solo Explorer', sub: 'Traveling independently' },
  { id: 'couple', label: 'Couple / Romantic', sub: 'Two travelers' },
  { id: 'family', label: 'Family', sub: 'With kids and parents' },
  { id: 'friends', label: 'Friends Group', sub: 'Travel buddies' },
  { id: 'group', label: 'Organized Group', sub: 'Larger party' }
];

const REGION_PREFERENCES = [
  { id: 'all', label: 'Surprise Me', sub: 'Anywhere across Incredible India' },
  { id: 'south-india', label: 'South India', sub: 'Temples, backwaters & coasts' },
  { id: 'north-india', label: 'North India', sub: 'Himalayas, heritage & Ganga' },
  { id: 'west-india', label: 'West India', sub: 'Forts, caves & Arabian beaches' },
  { id: 'east-india', label: 'East India', sub: 'Odisha coast, Darjeeling & heritage' },
  { id: 'central-india', label: 'Central India', sub: 'Ancient architecture & tiger parks' },
  { id: 'northeast-india', label: 'Northeast India', sub: 'Living bridges & tea hills' }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PlanYourTripPage() {
  const navigate = useNavigate();

  // Wizard Step State (1 through 7, or 'result')
  const [currentStep, setCurrentStep] = useState(1);

  // Preference Form States
  const [startLocation, setStartLocation] = useState('Hyderabad');
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [durationDays, setDurationDays] = useState(3);
  const [budgetAmount, setBudgetAmount] = useState(10000);
  const [selectedStyles, setSelectedStyles] = useState(['spiritual', 'nature']);
  const [companion, setCompanion] = useState('family');
  const [preferredRegion, setPreferredRegion] = useState('south-india');
  const [travelMonth, setTravelMonth] = useState(new Date().getMonth() + 1);

  // Generated Plan & UI States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadingMessages = [
    'Discovering verified destinations across India...',
    'Matching your travel style & seasonal suitability...',
    'Calculating travel distances & logistics...',
    'Generating personalized day-by-day itinerary...'
  ];

  // Sequential loading text rotation
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle Style Selection
  const toggleStyle = (styleId) => {
    if (selectedStyles.includes(styleId)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== styleId));
      }
    } else {
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  // GPS "Use My Location"
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setStartLocation('Current Location (GPS)');
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve GPS coordinates. Please type city name.');
      }
    );
  };

  // Generate Trip Handler
  const handleGenerateTrip = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        starting_location: startLocation,
        duration: durationDays,
        budget: budgetAmount,
        interests: selectedStyles,
        companion: companion,
        region: preferredRegion,
        travel_month: travelMonth,
        ...(userCoords ? { lat: userCoords.lat, lng: userCoords.lng } : {})
      };

      const res = await planTrip(payload);
      if (res && res.success && res.data) {
        setGeneratedPlan(res.data);
        setCurrentStep('result');
      } else {
        setErrorMessage(res?.message || 'Unable to generate trip plan.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not connect to the trip planning service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Save Trip to LocalStorage
  const handleSaveTrip = () => {
    if (!generatedPlan) return;
    try {
      const savedTrips = JSON.parse(localStorage.getItem('dekho_bharat_saved_trips') || '[]');
      const newTripEntry = {
        id: `trip-${Date.now()}`,
        savedAt: new Date().toISOString(),
        plan: generatedPlan
      };
      savedTrips.unshift(newTripEntry);
      localStorage.setItem('dekho_bharat_saved_trips', JSON.stringify(savedTrips.slice(0, 20)));
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 3000);
    } catch (err) {
      console.error('Error saving trip to localStorage:', err);
    }
  };

  // Share Trip (Web Share API / Copy Link)
  const handleShareTrip = async () => {
    const shareText = `Check out my ${durationDays}-Day India Itinerary for ${generatedPlan?.summary?.primary_destination || 'Incredible India'} on Dekho Bharat!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: generatedPlan?.summary?.title || 'India Travel Plan',
          text: shareText,
          url: shareUrl
        });
        return;
      } catch (err) {
        // Fallback to copy
      }
    }

    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <PageTransition>
      <div className="planner-page-root">
        
        {/* Save Toast Notification */}
        <AnimatePresence>
          {saveSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="planner-toast"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Itinerary saved to your device successfully!</span>
            </motion.div>
          )}
          {copiedLink && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="planner-toast"
            >
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
              <span>Trip link copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Header Bar (Screen only) */}
        <header className="planner-hero-header no-print">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="planner-hero-badge">
              <Sparkles className="w-4 h-4 text-orange-400 animate-spin-slow" />
              AI-POWERED INDIA TRIP PLANNER
            </span>
            <h1 className="planner-hero-title">
              Plan Your <span className="gradient-text">Perfect India Trip</span>
            </h1>
            <p className="planner-hero-subtitle">
              Tell us what you love. We'll help you discover where to go, what to see, and how to make the most of your journey with real verified destinations.
            </p>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* ───────────────────────────────────────────────────────────── */}
          {/* STEP-BY-STEP WIZARD VIEW */}
          {/* ───────────────────────────────────────────────────────────── */}
          {currentStep !== 'result' && (
            <div className="planner-wizard-card">
              
              {/* Wizard Progress Steps Bar */}
              <div className="wizard-progress-bar">
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
                  />
                </div>
                <div className="step-counter">
                  <span>STEP {currentStep} OF 7</span>
                  <span className="step-topic">
                    {currentStep === 1 && 'Starting Location'}
                    {currentStep === 2 && 'Trip Duration'}
                    {currentStep === 3 && 'Approximate Budget'}
                    {currentStep === 4 && 'Travel Style & Interests'}
                    {currentStep === 5 && 'Travel Companion'}
                    {currentStep === 6 && 'Preferred Region'}
                    {currentStep === 7 && 'Travel Season'}
                  </span>
                </div>
              </div>

              {/* Step Content Panels */}
              <div className="wizard-step-body">
                
                {/* STEP 1: Starting Location */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-panel">
                    <h3 className="step-question">Where are you starting your journey from?</h3>
                    <p className="step-instruction">Type your city or pick from popular origin hubs across India.</p>

                    <div className="location-input-group">
                      <MapPin className="w-5 h-5 text-orange-400" />
                      <input
                        type="text"
                        value={startLocation}
                        onChange={(e) => {
                          setUserCoords(null);
                          setStartLocation(e.target.value);
                        }}
                        placeholder="e.g. Hyderabad, Bangalore, Mumbai, Delhi..."
                        className="location-text-input"
                      />
                      <button
                        type="button"
                        onClick={handleUseMyLocation}
                        className={`location-gps-btn ${userCoords ? 'active' : ''}`}
                      >
                        <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                        <span>Use My Location</span>
                      </button>
                    </div>

                    <div className="quick-cities-row">
                      <span className="quick-label">POPULAR ORIGINS:</span>
                      {QUICK_CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setUserCoords(null);
                            setStartLocation(city);
                          }}
                          className={`quick-city-chip ${startLocation === city ? 'active' : ''}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Duration */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-panel">
                    <h3 className="step-question">How many days do you have for this trip?</h3>
                    <p className="step-instruction">Select your available travel window to craft an ideal pace.</p>

                    <div className="duration-options-grid">
                      {DURATION_OPTIONS.map((opt) => {
                        const isSelected = durationDays === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => setDurationDays(opt.value)}
                            className={`duration-card ${isSelected ? 'active' : ''}`}
                          >
                            <Calendar className="w-6 h-6 text-orange-400 mb-2" />
                            <div className="duration-val">{opt.label}</div>
                            <div className="duration-sub">{opt.sub}</div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Budget */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-panel">
                    <h3 className="step-question">What is your approximate budget tier?</h3>
                    <p className="step-instruction">Helps us curate appropriate lodging, transport, and experiences.</p>

                    <div className="budget-options-grid">
                      {BUDGET_OPTIONS.map((b) => {
                        const isSelected = budgetAmount === b.value;
                        return (
                          <div
                            key={b.value}
                            onClick={() => setBudgetAmount(b.value)}
                            className={`budget-card ${isSelected ? 'active' : ''}`}
                          >
                            <DollarSign className="w-6 h-6 text-emerald-400 mb-2" />
                            <div className="budget-val">{b.label}</div>
                            <div className="budget-sub">{b.sub}</div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Travel Style & Interests */}
                {currentStep === 4 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-panel">
                    <h3 className="step-question">What experiences excite you the most?</h3>
                    <p className="step-instruction">Select all that apply — our engine blends them into a harmonious itinerary.</p>

                    <div className="styles-options-grid">
                      {TRAVEL_STYLES.map((st) => {
                        const isSelected = selectedStyles.includes(st.id);
                        const IconComp = st.icon;
                        return (
                          <div
                            key={st.id}
                            onClick={() => toggleStyle(st.id)}
                            className={`style-card ${isSelected ? 'active' : ''}`}
                            style={{ '--accent-color': st.color }}
                          >
                            <div className="style-icon-wrap" style={{ color: st.color }}>
                              <IconComp className="w-5 h-5" />
                            </div>
                            <span className="style-label">{st.label}</span>
                            {isSelected && <Check className="w-4 h-4 text-orange-400 check-badge" />}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Travel Companion */}
                {currentStep === 5 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-panel">
                    <h3 className="step-question">Who are you traveling with?</h3>
                    <p className="step-instruction">Helps tailor family convenience, romantic settings, or adventure gear.</p>

                    <div className="companion-options-grid">
                      {COMPANIONS.map((comp) => {
                        const isSelected = companion === comp.id;
                        return (
                          <div
                            key={comp.id}
                            onClick={() => setCompanion(comp.id)}
                            className={`companion-card ${isSelected ? 'active' : ''}`}
                          >
                            <Users className="w-6 h-6 text-purple-400 mb-2" />
                            <div className="companion-val">{comp.label}</div>
                            <div className="companion-sub">{comp.sub}</div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: Preferred Region */}
                {currentStep === 6 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-panel">
                    <h3 className="step-question">Do you have a preferred region in India?</h3>
                    <p className="step-instruction">Pick a specific region or let our AI surprise you with all-India picks.</p>

                    <div className="region-options-grid">
                      {REGION_PREFERENCES.map((reg) => {
                        const isSelected = preferredRegion === reg.id;
                        return (
                          <div
                            key={reg.id}
                            onClick={() => setPreferredRegion(reg.id)}
                            className={`region-pref-card ${isSelected ? 'active' : ''}`}
                          >
                            <Compass className="w-6 h-6 text-cyan-400 mb-2" />
                            <div className="region-val">{reg.label}</div>
                            <div className="region-sub">{reg.sub}</div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 7: Season / Month */}
                {currentStep === 7 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="step-panel">
                    <h3 className="step-question">When are you planning to travel?</h3>
                    <p className="step-instruction">We match seasonal climates, monsoon alerts, and temple festivals.</p>

                    <div className="months-grid">
                      {MONTHS.map((m, idx) => {
                        const monthNum = idx + 1;
                        const isSelected = travelMonth === monthNum;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setTravelMonth(monthNum)}
                            className={`month-pill ${isSelected ? 'active' : ''}`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>

                    {errorMessage && (
                      <div className="error-banner mt-6">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </motion.div>
                )}

              </div>

              {/* Wizard Bottom Navigation Bar */}
              <div className="wizard-nav-footer">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="wizard-back-btn"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}

                {currentStep < 7 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="wizard-next-btn"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateTrip}
                    disabled={isLoading}
                    className="wizard-submit-btn"
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-5 h-5 animate-spin" />
                        <span>Generating Itinerary...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>CREATE MY TRIP</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="planner-loading-overlay">
                  <div className="loading-card">
                    <Compass className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Crafting Your India Itinerary</h4>
                    <p className="text-sm text-slate-300 transition-all duration-300">
                      {loadingMessages[loadingTextIndex]}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ───────────────────────────────────────────────────────────── */}
          {/* GENERATED ITINERARY RESULTS VIEW */}
          {/* ───────────────────────────────────────────────────────────── */}
          {currentStep === 'result' && generatedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="itinerary-result-container"
            >
              
              {/* Result Actions Toolbar (Screen Only) */}
              <div className="itinerary-actions-bar no-print">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="action-btn secondary"
                >
                  <RotateCcw className="w-4 h-4" /> Modify Preferences
                </button>

                <div className="flex items-center gap-2">
                  <button onClick={handleSaveTrip} className="action-btn" title="Save trip locally">
                    <Bookmark className="w-4 h-4 text-emerald-400" /> Save Trip
                  </button>
                  <button onClick={handleShareTrip} className="action-btn" title="Share trip link">
                    <Share2 className="w-4 h-4 text-teal-400" /> Share
                  </button>
                  <button onClick={handlePrint} className="action-btn" title="Print itinerary">
                    <Printer className="w-4 h-4 text-purple-400" /> Print
                  </button>
                  <button onClick={handleGenerateTrip} className="action-btn primary" title="Regenerate with different picks">
                    <Sparkles className="w-4 h-4" /> Regenerate
                  </button>
                </div>
              </div>

              {/* Trip Summary Hero Card */}
              <div className="trip-summary-card">
                <div className="summary-badge">
                  <Sparkles className="w-4 h-4 text-orange-400" /> VERIFIED INDIA ITINERARY
                </div>
                <h2 className="summary-title">{generatedPlan.summary.title}</h2>
                <div className="summary-tags-grid">
                  <div className="summary-tag">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Origin: <b>{generatedPlan.summary.starting_location}</b></span>
                  </div>
                  <div className="summary-tag">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <span>Duration: <b>{generatedPlan.summary.duration_days} Days</b></span>
                  </div>
                  <div className="summary-tag">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Est. Budget: <b>₹{Number(generatedPlan.summary.estimated_budget).toLocaleString()}</b></span>
                  </div>
                  <div className="summary-tag">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span>Style: <b>{generatedPlan.summary.travel_style}</b></span>
                  </div>
                </div>
              </div>

              {/* Route Timeline Bar */}
              {generatedPlan.route_points && generatedPlan.route_points.length > 1 && (
                <div className="route-timeline-card">
                  <span className="route-title">
                    <Navigation className="w-4 h-4 text-orange-400" /> TRAVEL ROUTE OVERVIEW
                  </span>
                  <div className="route-stops-flow">
                    {generatedPlan.route_points.map((pt, i) => (
                      <React.Fragment key={i}>
                        <div className={`route-stop-node ${pt.type}`}>
                          <span className="node-dot" />
                          <span className="node-name">{pt.name}</span>
                        </div>
                        {i < generatedPlan.route_points.length - 1 && (
                          <div className="route-connector-line" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-by-Day Itinerary Cards */}
              <div className="days-itinerary-list">
                <h3 className="section-title">Day-by-Day Experience Schedule</h3>
                
                {generatedPlan.itinerary.map((dayPlan) => (
                  <div key={dayPlan.day} className="day-schedule-card">
                    <div className="day-header">
                      <span className="day-number-badge">DAY {dayPlan.day}</span>
                      <h4 className="day-title">{dayPlan.title}</h4>
                    </div>

                    <div className="schedule-timeline">
                      <div className="timeline-segment">
                        <span className="time-label morning">🌅 MORNING</span>
                        <p className="time-desc">{dayPlan.morning}</p>
                      </div>
                      <div className="timeline-segment">
                        <span className="time-label afternoon">☀️ AFTERNOON</span>
                        <p className="time-desc">{dayPlan.afternoon}</p>
                      </div>
                      <div className="timeline-segment">
                        <span className="time-label evening">🌇 EVENING</span>
                        <p className="time-desc">{dayPlan.evening}</p>
                      </div>
                      <div className="timeline-segment">
                        <span className="time-label night">🌙 NIGHT</span>
                        <p className="time-desc">{dayPlan.night}</p>
                      </div>
                    </div>

                    {/* Associated Destination Cards */}
                    {dayPlan.destinations && dayPlan.destinations.length > 0 && (
                      <div className="day-destinations-row">
                        {dayPlan.destinations.map((d, dIdx) => (
                          <div key={dIdx} className="day-dest-mini-card">
                            <img src={d.image} alt={d.name} className="mini-card-img" />
                            <div className="mini-card-body">
                              <span className="mini-cat-tag">{d.category}</span>
                              <h5 className="mini-dest-name">{d.name}</h5>
                              <p className="mini-dest-loc">{d.location}</p>
                              <p className="mini-dest-desc">{d.short_description}</p>
                              <Link
                                to={`/destinations/${d.slug}`}
                                className="mini-explore-link"
                              >
                                <span>Explore Details</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Budget Breakdown Card */}
              {generatedPlan.budget_estimate && (
                <div className="budget-breakdown-card">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Estimated Trip Cost Breakdown</h3>
                  </div>

                  <div className="budget-grid-breakdown">
                    <div className="budget-metric">
                      <span className="metric-label">Travel & Transit</span>
                      <span className="metric-val">₹{Number(generatedPlan.budget_estimate.travel).toLocaleString()}</span>
                    </div>
                    <div className="budget-metric">
                      <span className="metric-label">Stay & Accommodation</span>
                      <span className="metric-val">₹{Number(generatedPlan.budget_estimate.stay).toLocaleString()}</span>
                    </div>
                    <div className="budget-metric">
                      <span className="metric-label">Food & Dining</span>
                      <span className="metric-val">₹{Number(generatedPlan.budget_estimate.food).toLocaleString()}</span>
                    </div>
                    <div className="budget-metric">
                      <span className="metric-label">Attractions & Entry</span>
                      <span className="metric-val">₹{Number(generatedPlan.budget_estimate.activities).toLocaleString()}</span>
                    </div>
                    <div className="budget-metric">
                      <span className="metric-label">Contingency Buffer</span>
                      <span className="metric-val">₹{Number(generatedPlan.budget_estimate.contingency).toLocaleString()}</span>
                    </div>
                    <div className="budget-metric total">
                      <span className="metric-label">Estimated Total</span>
                      <span className="metric-val text-emerald-400 font-black">
                        ₹{Number(generatedPlan.budget_estimate.total).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="budget-disclaimer">
                    ℹ️ <b>Approximate estimate:</b> {generatedPlan.budget_estimate.disclaimer}
                  </p>
                </div>
              )}

              {/* Alternative Trips Carousel */}
              {generatedPlan.alternatives && generatedPlan.alternatives.length > 0 && (
                <div className="alternative-trips-section no-print">
                  <h3 className="section-title">Other Trips You May Like</h3>
                  <div className="alternatives-grid">
                    {generatedPlan.alternatives.map((alt, i) => (
                      <div key={i} className="alt-trip-card">
                        <h4 className="alt-title">{alt.title}</h4>
                        <div className="alt-meta">
                          <span>{alt.duration}</span> • <span>Est: {alt.budget}</span>
                        </div>
                        {alt.destinations && alt.destinations[0] && (
                          <div className="alt-dest-preview">
                            <img src={alt.destinations[0].image} alt={alt.destinations[0].name} className="alt-dest-img" />
                            <div className="alt-dest-info">
                              <span className="font-bold text-white text-sm">{alt.destinations[0].name}</span>
                              <span className="text-xs text-slate-400">{alt.destinations[0].location}</span>
                            </div>
                          </div>
                        )}
                        <Link to={`/destinations/${alt.destinations[0]?.slug}`} className="alt-explore-cta">
                          <span>Explore This Trip</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </main>

      </div>
    </PageTransition>
  );
}
