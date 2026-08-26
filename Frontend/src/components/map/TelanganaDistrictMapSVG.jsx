import React from 'react';
import { MapPin, Sparkles, Layers } from 'lucide-react';
import './TelanganaDistrictMapSVG.css';

const TELANGANA_33_DISTRICTS = [
  { name: 'Adilabad', count: 3 },
  { name: 'Bhadradri Kothagudem', count: 2 },
  { name: 'Hanumakonda', count: 3 },
  { name: 'Hyderabad', count: 9 },
  { name: 'Jagtial', count: 2 },
  { name: 'Jangaon', count: 2 },
  { name: 'Jayashankar Bhupalpally', count: 2 },
  { name: 'Jogulamba Gadwal', count: 2 },
  { name: 'Kamareddy', count: 2 },
  { name: 'Karimnagar', count: 2 },
  { name: 'Khammam', count: 2 },
  { name: 'Kumuram Bheem Asifabad', count: 2 },
  { name: 'Mahabubabad', count: 1 },
  { name: 'Mahabubnagar', count: 2 },
  { name: 'Mancherial', count: 2 },
  { name: 'Medak', count: 2 },
  { name: 'Medchal-Malkajgiri', count: 1 },
  { name: 'Mulugu', count: 3 },
  { name: 'Nagarkurnool', count: 2 },
  { name: 'Nalgonda', count: 2 },
  { name: 'Narayanpet', count: 1 },
  { name: 'Nirmal', count: 3 },
  { name: 'Nizamabad', count: 3 },
  { name: 'Peddapalli', count: 2 },
  { name: 'Rajanna Sircilla', count: 1 },
  { name: 'Rangareddy', count: 1 },
  { name: 'Sangareddy', count: 1 },
  { name: 'Siddipet', count: 2 },
  { name: 'Suryapet', count: 1 },
  { name: 'Vikarabad', count: 2 },
  { name: 'Wanaparthy', count: 1 },
  { name: 'Warangal', count: 4 },
  { name: 'Yadadri Bhuvanagiri', count: 3 }
];

export default function TelanganaDistrictMapSVG({ activeDistrict, onSelectDistrict }) {
  return (
    <div className="ts-map-container">
      <div className="ts-map-header">
        <h3 className="ts-map-title">
          <MapPin size={18} color="#FF6B35" />
          <span>Telangana State — 33 Official Revenue Districts</span>
        </h3>
        <span className="ts-badge">33 Districts Active</span>
      </div>

      <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1rem 0', fontWeight: 500 }}>
        Select any of Telangana's 33 districts below to filter visiting places, waterfalls, temples, and UNESCO heritage sites:
      </p>

      {/* 33 Districts Filter Grid */}
      <div className="ts-district-grid">
        <button
          type="button"
          onClick={() => onSelectDistrict('all')}
          className={`ts-district-chip ${activeDistrict === 'all' ? 'active' : ''}`}
        >
          All 33 Districts
        </button>

        {TELANGANA_33_DISTRICTS.map((dist) => {
          const isActive = activeDistrict.toLowerCase() === dist.name.toLowerCase();
          return (
            <button
              key={dist.name}
              type="button"
              onClick={() => onSelectDistrict(dist.name)}
              className={`ts-district-chip ${isActive ? 'active' : ''}`}
              title={`View places in ${dist.name}`}
            >
              <span>{dist.name}</span>
              <span className="count">({dist.count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
