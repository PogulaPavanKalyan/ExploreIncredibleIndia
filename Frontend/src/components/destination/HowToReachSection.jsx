import React, { useState } from 'react';
import { Plane, Train, Car, Bus, Navigation, MapPin } from 'lucide-react';

export default function HowToReachSection({ destination }) {
  const [activeTab, setActiveTab] = useState('air');

  const airInfo = destination.airport_information || `Nearest airport is Visakhapatnam International Airport (VTZ), approximately 115 km from Araku Valley. Taxis and private cabs are available outside the terminal.`;
  const railInfo = destination.railway_information || `Araku Railway Station (ARK) connects directly to Visakhapatnam Junction. Take the famous Vistadome Glass-top Coach through 84 tunnels and 58 bridges for breathtaking valley views.`;
  const roadInfo = destination.how_to_reach || destination.bus_information || `Well connected by NH-516E. A scenic 3.5-hour drive (115 km) from Visakhapatnam via Ghat roads. State APSRTC buses operate regular daily services.`;
  const localInfo = destination.local_transport || `Local auto-rickshaws, shared jeeps, and private taxis are easily available for sight-seeing between tourist spots.`;

  return (
    <div style={{
      background: '#ffffff',
      padding: '1.5rem',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '2rem'
    }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Travel & Navigation Guide
        </span>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0 0 0' }}>
          How to Reach {destination.name}
        </h3>
      </div>

      {/* Tabs Row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => setActiveTab('air')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'air' ? '#0284C7' : 'transparent',
            color: activeTab === 'air' ? '#ffffff' : '#64748B',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plane size={16} /> By Air
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('train')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'train' ? '#FF6B35' : 'transparent',
            color: activeTab === 'train' ? '#ffffff' : '#64748B',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Train size={16} /> By Train
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('road')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'road' ? '#10B981' : 'transparent',
            color: activeTab === 'road' ? '#ffffff' : '#64748B',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Car size={16} /> By Road
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('local')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'local' ? '#8B5CF6' : 'transparent',
            color: activeTab === 'local' ? '#ffffff' : '#64748B',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Bus size={16} /> Local Transit
        </button>
      </div>

      {/* Content Display Panel */}
      <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        {activeTab === 'air' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0284C7', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plane size={18} /> Nearest Airport & Air Connectivity
            </h4>
            <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {airInfo}
            </p>
          </div>
        )}

        {activeTab === 'train' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FF6B35', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Train size={18} /> Railway Station & Train Routes
            </h4>
            <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {railInfo}
            </p>
          </div>
        )}

        {activeTab === 'road' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#10B981', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Car size={18} /> Highways, Driving & Bus Routes
            </h4>
            <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {roadInfo}
            </p>
          </div>
        )}

        {activeTab === 'local' && (
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#8B5CF6', margin: '0 0 0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bus size={18} /> Local Cabs, Jeeps & Autos
            </h4>
            <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {localInfo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
