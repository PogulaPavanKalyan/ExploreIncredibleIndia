import React, { useState } from 'react';
import { X, Calendar, Compass, DollarSign, Clock, CheckCircle, Sparkles, Printer, MapPin, Coffee, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../data/translations';

export default function ItineraryPlanner({
  lang,
  onClose,
  initialDestination
}) {
  const t = translations[lang] || translations.en;

  const [destinationName, setDestinationName] = useState(initialDestination ? initialDestination.name : 'Golden Triangle (Delhi - Agra - Jaipur)');
  const [days, setDays] = useState('3');
  const [style, setStyle] = useState('Family');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    
    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {}

    // Mock intelligent generator logic
    const numDays = parseInt(days, 10);
    const dayPlans = [];

    for (let i = 1; i <= numDays; i++) {
      if (i === 1) {
        dayPlans.push({
          day: 1,
          title: `Arrival & Historic Exploration in ${destinationName}`,
          morning: "Arrival at hub station/airport, hotel check-in. Morning heritage walking tour with local guide.",
          afternoon: "Sample traditional authentic lunch. Visit top monument & museum complex with fast-track entry ticket.",
          evening: "Sunset viewpoint visit & local bazaar handicraft shopping.",
          night: "Welcome dinner at regional rooftop restaurant."
        });
      } else if (i === 2) {
        dayPlans.push({
          day: 2,
          title: `Spiritual Sanctuary & Cultural Heritage`,
          morning: "Sunrise prayer session / morning aarti by the riverfront or temple complex.",
          afternoon: "Explore architectural marvels, hidden stepwells, and ancient artisan quarters.",
          evening: "Cultural dance performance / light and sound show.",
          night: "Try famous local street food specialties."
        });
      } else if (i === 3) {
        dayPlans.push({
          day: 3,
          title: `Nature Trail & Authentic Village Excursion`,
          morning: "Early morning boat ride / nature trail or wildlife safari.",
          afternoon: "Visit nearby eco-village, organic tea/spice plantation, or craft village.",
          evening: "Souvenir shopping and photo stop at scenic vista point.",
          night: "Relaxing ayurvedic spa or campfire dinner."
        });
      } else {
        dayPlans.push({
          day: i,
          title: `Offbeat Discoveries & Departure Prep`,
          morning: "Leisurely breakfast and visit to local hidden gem attraction.",
          afternoon: "Packing, souvenir pickup, and transfer to airport/station.",
          evening: "Departure with memorable photos and experiences.",
          night: "Safe journey home!"
        });
      }
    }

    const multiplier = style === 'Luxury' ? 3.5 : style === 'Backpacker' ? 0.7 : 1.5;
    const estimatedCost = Math.round(numDays * 3500 * multiplier);

    setGeneratedItinerary({
      destination: destinationName,
      days: numDays,
      style: style,
      budget: `₹${estimatedCost.toLocaleString()} per person`,
      dayPlans: dayPlans
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 107, 53, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={24} color="var(--primary-saffron)" />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t.generateItinerary}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Customized Day-by-Day Route & Budget Planner</p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Input Form */}
          <form onSubmit={handleGenerate} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Destination / Region:
              </label>
              <input
                type="text"
                value={destinationName}
                onChange={(e) => setDestinationName(e.target.value)}
                className="input-field"
                style={{ height: '42px', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                {t.duration}:
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="select-field"
                style={{ width: '100%', height: '42px' }}
              >
                <option value="1">1 Day Express Tour</option>
                <option value="3">3 Days Weekend Getaway</option>
                <option value="5">5 Days Classic Circuit</option>
                <option value="7">7 Days Deep Explorer</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                {t.travelStyle}:
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="select-field"
                style={{ width: '100%', height: '42px' }}
              >
                <option value="Family">👨‍👩‍👧‍👦 Family & Comfortable</option>
                <option value="Spiritual">🛕 Spiritual & Pilgrimage</option>
                <option value="Backpacker">🎒 Backpacker & Budget</option>
                <option value="Luxury">👑 Luxury & Heritage</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
                <Sparkles size={16} />
                <span>{t.generate}</span>
              </button>
            </div>
          </form>

          {/* Generated Result Output */}
          {generatedItinerary && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              
              {/* Summary Header */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(255,184,0,0.1) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255,107,53,0.3)',
                marginBottom: '20px'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>
                    📍 {generatedItinerary.destination} ({generatedItinerary.days} Days)
                  </h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary-gold)' }}>
                    Style: {generatedItinerary.style} | Estimated Budget: {generatedItinerary.budget}
                  </span>
                </div>

                <button onClick={handlePrint} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
                  <Printer size={16} />
                  <span>{t.printExport}</span>
                </button>
              </div>

              {/* Day-by-Day Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {generatedItinerary.dayPlans.map((dp) => (
                  <div key={dp.day} className="glass-card" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span className="badge badge-saffron" style={{ fontSize: '0.85rem' }}>Day {dp.day}</span>
                      <h5 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{dp.title}</h5>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.88rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-gold)', fontWeight: 600, marginBottom: '4px' }}>
                          <Sun size={14} /> Morning
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{dp.morning}</p>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-saffron)', fontWeight: 600, marginBottom: '4px' }}>
                          <Coffee size={14} /> Afternoon
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{dp.afternoon}</p>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '4px' }}>
                          <Moon size={14} /> Evening & Night
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{dp.evening}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
