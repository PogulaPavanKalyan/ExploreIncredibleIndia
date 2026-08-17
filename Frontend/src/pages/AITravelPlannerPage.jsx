import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, DollarSign, Users, Compass, CheckCircle, Clock, Navigation, Printer, ExternalLink, ShieldCheck } from 'lucide-react';
import { generateAITravelPlan } from '../api/travelPlannerApi';
import PageTransition from '../components/PageTransition';
import '../styles/planner.css';

const QUICK_INTERESTS = [
  'Nature & Mountains',
  'Waterfalls',
  'Beaches & Coastal',
  'Heritage & Forts',
  'Wildlife & National Parks',
  'Culinary & Food',
  'Temples & Pilgrimage'
];

export default function AITravelPlannerPage() {
  const [startingLocation, setStartingLocation] = useState('Hyderabad');
  const [destination, setDestination] = useState('Araku Valley');
  const [durationDays, setDurationDays] = useState(4);
  const [budget, setBudget] = useState(25000);
  const [numTravelers, setNumTravelers] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState(['Nature & Mountains', 'Waterfalls']);
  const [transport, setTransport] = useState('train');

  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await generateAITravelPlan({
        starting_location: startingLocation,
        destination,
        duration_days: durationDays,
        budget,
        num_travelers: numTravelers,
        interests: selectedInterests.join(', '),
        transport_preference: transport
      });

      if (res.success) {
        setAiPlan(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Could not connect to AI planner service. Ensure Django backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageTransition>
      <div className="planner-page section-padding" style={{ minHeight: '85vh', background: 'var(--light-bg)' }}>
        <div className="container">
          <div className="planner-header text-center" style={{ marginBottom: '2.5rem' }}>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', borderRadius: '20px', background: 'rgba(255, 183, 3, 0.15)', color: '#D97706', fontWeight: 700, fontSize: '0.82rem' }}>
              <Sparkles size={14} /> AI Powered Travel Engine
            </span>
            <h1 className="planner-title" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.6rem' }}>
              Smart India Travel & Itinerary Planner
            </h1>
            <p className="planner-subtitle" style={{ color: '#64748B', maxWidth: '640px', margin: '0.4rem auto 0 auto', fontSize: '0.95rem' }}>
              Select your budget, trip duration, starting city, and preferences to receive a personalized day-by-day travel plan backed by real database destinations.
            </p>
          </div>

          <div className="planner-layout">
            {/* Left Input Form Box */}
            <form onSubmit={handleSubmit} className="planner-form-card" style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>Customize Trip Parameters</h3>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155', marginBottom: '0.35rem' }}>
                  <MapPin size={15} color="#FF6B35" /> Starting City
                </label>
                <input
                  type="text"
                  value={startingLocation}
                  onChange={(e) => setStartingLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, Visakhapatnam, Mumbai"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.88rem', color: '#334155', marginBottom: '0.35rem' }}>
                  <Compass size={15} color="#0284C7" /> Destination / State
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Araku Valley, Goa, Kerala, Rajasthan"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                    <Calendar size={14} /> Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                    <DollarSign size={14} /> Budget (₹)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>
                    <Users size={14} /> Travelers
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={numTravelers}
                    onChange={(e) => setNumTravelers(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem', display: 'block' }}>
                    Mode of Transport
                  </label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
                  >
                    <option value="train">Vistadome / Train</option>
                    <option value="flight">Flight</option>
                    <option value="car">Private Car / Taxi</option>
                    <option value="bus">Luxury Bus</option>
                  </select>
                </div>
              </div>

              {/* Quick Interest Checkbox Tags */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
                  Select Interests & Vibe
                </label>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {QUICK_INTERESTS.map(tag => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <span
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        style={{
                          padding: '0.35rem 0.7rem',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: isSelected ? '#FF6B35' : '#F1F5F9',
                          color: isSelected ? '#ffffff' : '#475569',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected ? '✓ ' : ''}{tag}
                      </span>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #FF6B35, #E85D04)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? "Generating Smart Itinerary..." : "✨ Generate AI Travel Plan"}
              </button>
            </form>

            {/* Right Output Results Panel */}
            <div className="planner-output-card" style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
              {!aiPlan ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748B' }}>
                  <Sparkles size={48} color="#FF6B35" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A' }}>
                    Your Custom Day-by-Day Itinerary Will Appear Here
                  </h3>
                  <p style={{ maxWidth: '420px', margin: '0.5rem auto 0 auto', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Adjust your starting city, days, and budget on the left, then click Generate to create an authentic India travel plan!
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.3rem 0' }}>
                        {aiPlan.title}
                      </h2>
                      <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                        Origin: <strong>{aiPlan.starting_location}</strong> | Destination: <strong>{aiPlan.destination}</strong> ({aiPlan.duration_days} Days)
                      </p>
                    </div>

                    <button
                      onClick={handlePrint}
                      style={{
                        padding: '0.45rem 0.9rem',
                        borderRadius: '8px',
                        background: '#F1F5F9',
                        color: '#0F172A',
                        border: '1px solid #CBD5E1',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Printer size={15} /> Print / Save PDF
                    </button>
                  </div>

                  {/* Estimated Budget Summary Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', background: '#F8FAFC', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '2rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Hotel / Stay</span>
                      <strong style={{ fontSize: '1rem', color: '#0F172A' }}>₹{aiPlan.budget_breakdown?.estimated_hotel_cost}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Food & Dining</span>
                      <strong style={{ fontSize: '1rem', color: '#0F172A' }}>₹{aiPlan.budget_breakdown?.estimated_food_cost}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Transport</span>
                      <strong style={{ fontSize: '1rem', color: '#0F172A' }}>₹{aiPlan.budget_breakdown?.estimated_transport_cost}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Total Estimated</span>
                      <strong style={{ fontSize: '1.05rem', color: '#FF6B35' }}>₹{aiPlan.budget_breakdown?.total_estimated_budget}</strong>
                    </div>
                  </div>

                  {/* Day-by-Day Schedule Accordion */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Day-by-Day Schedule</h3>
                    {aiPlan.day_by_day_itinerary?.map(day => (
                      <div key={day.day} style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ background: '#FF6B35', color: '#ffffff', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                            DAY {day.day}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Navigation size={13} /> {day.distance_km || 30} km ({day.estimated_travel_time || '2 hrs'})
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
                          {day.title}
                        </h4>
                        <p style={{ color: '#334155', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 0.75rem 0' }}>
                          {day.description}
                        </p>

                        {day.places && day.places.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {day.places.map((p, idx) => (
                              <Link
                                key={idx}
                                to={`/places/${p.slug}`}
                                style={{ padding: '0.3rem 0.6rem', background: '#F1F5F9', color: '#0284C7', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                              >
                                <Compass size={12} /> {p.name} <ExternalLink size={10} />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Useful Travel Tips */}
                  {aiPlan.travel_tips && (
                    <div style={{ background: '#FFFBEB', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#B45309', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ShieldCheck size={16} /> Essential Travel Tips
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#78350F' }}>
                        {aiPlan.travel_tips.map((tip, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
