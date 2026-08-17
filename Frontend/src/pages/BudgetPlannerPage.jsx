import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Calendar, Users, Hotel, Utensils, Car, Compass, ShieldCheck, Printer, ArrowLeft, PieChart, Sparkles } from 'lucide-react';
import { estimateTripBudget } from '../services/budgetService';
import { getDestinations } from '../services/destinationService';
import PageTransition from '../components/PageTransition';

export default function BudgetPlannerPage() {
  const [destinations, setDestinations] = useState([]);
  const [selectedDest, setSelectedDest] = useState('araku-valley');
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [stayTier, setStayTier] = useState('mid');
  const [foodTier, setFoodTier] = useState('casual');
  const [transportMode, setTransportMode] = useState('taxi');

  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load destination options
  useEffect(() => {
    getDestinations({ page_size: 50 }).then(res => {
      if (res && res.data) {
        setDestinations(res.data);
      }
    }).catch(err => console.error(err));
  }, []);

  // Recalculate budget when inputs change
  useEffect(() => {
    const fetchEstimate = async () => {
      setLoading(true);
      const res = await estimateTripBudget({
        destination_slug: selectedDest,
        days,
        travelers,
        stay_tier: stayTier,
        food_tier: foodTier,
        transport_mode: transportMode
      });

      if (res && res.data) {
        setEstimate(res.data.breakdown);
      }
      setLoading(false);
    };

    fetchEstimate();
  }, [selectedDest, days, travelers, stayTier, foodTier, transportMode]);

  const handlePrint = () => {
    window.print();
  };

  const grandTotal = estimate?.grand_total || 0;
  const hotelCost = estimate?.hotel_cost || 0;
  const foodCost = estimate?.food_cost || 0;
  const transportCost = estimate?.transport_cost || 0;
  const activitiesCost = estimate?.activities_cost || 0;
  const contingencyCost = estimate?.contingency_cost || 0;

  const hotelPct = grandTotal ? Math.round((hotelCost / grandTotal) * 100) : 0;
  const foodPct = grandTotal ? Math.round((foodCost / grandTotal) * 100) : 0;
  const transportPct = grandTotal ? Math.round((transportCost / grandTotal) * 100) : 0;
  const activitiesPct = grandTotal ? Math.round((activitiesCost / grandTotal) * 100) : 0;
  const contingencyPct = grandTotal ? Math.round((contingencyCost / grandTotal) * 100) : 0;

  return (
    <PageTransition>
      <div className="budget-planner-page section-padding" style={{ minHeight: '85vh', background: 'var(--light-bg)', padding: '2.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.9rem', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 700, fontSize: '0.82rem' }}>
              <DollarSign size={14} /> Smart Trip Expense Calculator
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.6rem' }}>
              India Travel Budget Estimator
            </h1>
            <p style={{ color: '#64748B', maxWidth: '640px', margin: '0.4rem auto 0 auto', fontSize: '0.95rem' }}>
              Calculate itemized travel expenses for accommodation, food, transportation, entrance fees, and emergency reserve with real-time visual progress breakdown.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '2rem' }} className="mobile-single-col">
            {/* Left Controls Box */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>Trip Parameters</h3>

              {/* Destination Picker */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.88rem', color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Target Destination
                </label>
                <select
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="">General / All India</option>
                  {destinations.map(d => (
                    <option key={d.id} value={d.slug}>{d.name} ({d.state_name || d.state?.name})</option>
                  ))}
                </select>
              </div>

              {/* Duration Slider */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>Trip Duration</label>
                  <span style={{ fontWeight: 700, color: '#FF6B35' }}>{days} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#FF6B35' }}
                />
              </div>

              {/* Group Size Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.88rem', color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              {/* Stay Tier Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.88rem', color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Accommodation Tier
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                  {[
                    { key: 'budget', label: 'Homestay', price: '₹1.2k' },
                    { key: 'mid', label: 'Mid Hotel', price: '₹3.5k' },
                    { key: 'luxury', label: 'Resort', price: '₹8.5k' }
                  ].map(tier => (
                    <button
                      key={tier.key}
                      type="button"
                      onClick={() => setStayTier(tier.key)}
                      style={{
                        padding: '0.5rem 0.2rem',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: stayTier === tier.key ? '#FF6B35' : '#E2E8F0',
                        background: stayTier === tier.key ? 'rgba(255, 107, 53, 0.1)' : '#F8FAFC',
                        color: stayTier === tier.key ? '#FF6B35' : '#475569',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div>{tier.label}</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{tier.price}/nt</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dining Style Tier Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.88rem', color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Dining & Meals
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
                  {[
                    { key: 'street', label: 'Dhabas', price: '₹400/day' },
                    { key: 'casual', label: 'Casual', price: '₹1.2k/day' },
                    { key: 'fine', label: 'Fine Dine', price: '₹3.0k/day' }
                  ].map(tier => (
                    <button
                      key={tier.key}
                      type="button"
                      onClick={() => setFoodTier(tier.key)}
                      style={{
                        padding: '0.5rem 0.2rem',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: foodTier === tier.key ? '#0284C7' : '#E2E8F0',
                        background: foodTier === tier.key ? 'rgba(2, 132, 199, 0.1)' : '#F8FAFC',
                        color: foodTier === tier.key ? '#0284C7' : '#475569',
                        fontWeight: 600,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <div>{tier.label}</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{tier.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode of Transport Selection */}
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.88rem', color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Mode of Transport
                </label>
                <select
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="train">Vistadome / Train (₹800 / person)</option>
                  <option value="taxi">Private Car / Taxi (₹2,500 / day)</option>
                  <option value="flight">Flight (₹6,000 / person)</option>
                </select>
              </div>
            </div>

            {/* Right Output Dashboard Panel */}
            <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Total Group Estimate ({travelers} travelers, {days} days)</span>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.1 }}>
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
                    ~ ₹{estimate?.per_person_cost?.toLocaleString('en-IN')} per traveler
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={handlePrint}
                    style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Printer size={16} /> Print Budget
                  </button>
                  <Link
                    to="/travel-planner"
                    style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: '#FF6B35', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <Sparkles size={16} /> Create AI Itinerary
                  </Link>
                </div>
              </div>

              {/* Spending Category Visual Progress Bars */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PieChart size={18} color="#0284C7" /> Category Spending Distribution
                </h4>

                <div style={{ height: '14px', background: '#E2E8F0', borderRadius: '7px', display: 'flex', overflow: 'hidden', marginBottom: '1rem' }}>
                  <div style={{ width: `${hotelPct}%`, background: '#FF6B35' }} title={`Hotel: ${hotelPct}%`} />
                  <div style={{ width: `${foodPct}%`, background: '#0284C7' }} title={`Food: ${foodPct}%`} />
                  <div style={{ width: `${transportPct}%`, background: '#D97706' }} title={`Transport: ${transportPct}%`} />
                  <div style={{ width: `${activitiesPct}%`, background: '#10B981' }} title={`Activities: ${activitiesPct}%`} />
                  <div style={{ width: `${contingencyPct}%`, background: '#8B5CF6' }} title={`Emergency Fund: ${contingencyPct}%`} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF6B35' }} />
                    <span style={{ color: '#475569' }}>Hotel ({hotelPct}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284C7' }} />
                    <span style={{ color: '#475569' }}>Food ({foodPct}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D97706' }} />
                    <span style={{ color: '#475569' }}>Transport ({transportPct}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
                    <span style={{ color: '#475569' }}>Activities ({activitiesPct}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6' }} />
                    <span style={{ color: '#475569' }}>Emergency 10% ({contingencyPct}%)</span>
                  </div>
                </div>
              </div>

              {/* Itemized Receipt Table */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', borderBottom: '1px solid #E2E8F0' }}>
                  Itemized Cost Receipt
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', fontSize: '0.88rem' }}>
                  <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Hotel size={16} color="#FF6B35" /> Stay ({days} Nights, {stayTier.toUpperCase()})
                  </span>
                  <strong style={{ color: '#0F172A' }}>₹{hotelCost.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', fontSize: '0.88rem' }}>
                  <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Utensils size={16} color="#0284C7" /> Food & Dining ({foodTier.toUpperCase()})
                  </span>
                  <strong style={{ color: '#0F172A' }}>₹{foodCost.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', fontSize: '0.88rem' }}>
                  <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Car size={16} color="#D97706" /> Local Transport ({transportMode.toUpperCase()})
                  </span>
                  <strong style={{ color: '#0F172A' }}>₹{transportCost.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', fontSize: '0.88rem' }}>
                  <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Compass size={16} color="#10B981" /> Sightseeing & Tickets
                  </span>
                  <strong style={{ color: '#0F172A' }}>₹{activitiesCost.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', fontSize: '0.88rem', background: '#FAF5FF' }}>
                  <span style={{ color: '#6B21A8', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    <ShieldCheck size={16} color="#8B5CF6" /> Emergency Safety Reserve (10%)
                  </span>
                  <strong style={{ color: '#6B21A8' }}>₹{contingencyCost.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', background: '#F8FAFC', fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>
                  <span>Grand Total Trip Budget</span>
                  <span style={{ color: '#FF6B35' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
