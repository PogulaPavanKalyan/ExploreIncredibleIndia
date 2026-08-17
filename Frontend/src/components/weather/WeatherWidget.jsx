import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, CloudFog, CloudSun, Wind, Droplets, Calendar } from 'lucide-react';
import apiClient from '../../api/apiClient';

export default function WeatherWidget({ destinationSlug, destinationName }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destinationSlug) return;
    setLoading(true);
    apiClient.get(`/places/${destinationSlug}/weather/`)
      .then(res => {
        if (res.data && res.data.data) {
          setWeather(res.data.data);
        }
      })
      .catch(err => {
        console.warn("Could not fetch weather data:", err);
      })
      .finally(() => setLoading(false));
  }, [destinationSlug]);

  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'sunny':
        return <Sun size={24} color="#FFB703" />;
      case 'misty':
        return <CloudFog size={24} color="#94A3B8" />;
      case 'rainy':
        return <CloudRain size={24} color="#0284C7" />;
      default:
        return <CloudSun size={24} color="#FF6B35" />;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
        Loading live climate forecast...
      </div>
    );
  }

  if (!weather || !weather.current) {
    return null;
  }

  const current = weather.current;

  return (
    <div style={{
      background: '#ffffff',
      padding: '1.25rem',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF6B35', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Climate & Weather
          </span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {destinationName || 'Destination'} Weather
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#FFFBEB', padding: '0.4rem 0.8rem', borderRadius: '20px', border: '1px solid #FDE68A' }}>
          {getWeatherIcon(current.icon)}
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{current.temp_c}°C</span>
          <span style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: 600 }}>{current.condition}</span>
        </div>
      </div>

      {/* Metrics Row: Humidity & Wind */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem', background: '#F8FAFC', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
          <Droplets size={15} color="#0284C7" />
          <span>Humidity: <strong>{current.humidity_pct}%</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569' }}>
          <Wind size={15} color="#10B981" />
          <span>Wind: <strong>{current.wind_kmh} km/h</strong></span>
        </div>
      </div>

      {/* 5-Day Forecast Grid */}
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>
        5-DAY FORECAST
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
        {weather.forecast_5_days?.map((day, idx) => (
          <div
            key={idx}
            style={{
              textAlign: 'center',
              padding: '0.5rem 0.2rem',
              background: idx === 0 ? 'rgba(255, 107, 53, 0.08)' : '#F8FAFC',
              borderRadius: '10px',
              border: idx === 0 ? '1px solid #FF6B35' : '1px solid #E2E8F0'
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block' }}>{day.day_name}</span>
            <div style={{ margin: '0.2rem 0' }}>
              {getWeatherIcon(day.icon)}
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#0F172A', display: 'block' }}>{day.temp_c}°C</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
