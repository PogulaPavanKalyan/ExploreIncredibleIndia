import React from 'react';
import { Calendar, Sun, CloudRain, Sparkles } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DestinationSeasonalGrid({ seasonMonths = {}, bestTimeText = '' }) {
  // Determine rating status for each month
  const getMonthStatus = (month) => {
    if (seasonMonths[month]) return seasonMonths[month];
    const textLower = (bestTimeText || '').toLowerCase();
    
    if (textLower.includes(month.toLowerCase())) return 'best';
    
    // Default winter/post-monsoon suitability for India
    if (['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].includes(month)) return 'good';
    return 'fair';
  };

  return (
    <div className="seasonal-tracker">
      <div className="seasonal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#1E293B' }}>
          <Calendar size={18} style={{ color: '#FF6B35' }} />
          <span>Best Time to Visit — Seasonal Guide</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', gap: '0.75rem' }}>
          <span style={{ color: '#15803D', fontWeight: 600 }}>🟢 Optimal</span>
          <span style={{ color: '#B45309', fontWeight: 600 }}>🟡 Pleasant</span>
          <span style={{ color: '#64748B', fontWeight: 600 }}>⚪ Moderate</span>
        </div>
      </div>

      <div className="month-grid">
        {MONTHS.map((m) => {
          const status = getMonthStatus(m);
          return (
            <div key={m} className={`month-pill ${status}`}>
              <div>{m}</div>
              <div style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>
                {status === 'best' ? '🟢 Best' : status === 'good' ? '🟡 Good' : '⚪ Fair'}
              </div>
            </div>
          );
        })}
      </div>

      {bestTimeText && (
        <p style={{ marginTop: '1rem', fontSize: '0.88rem', color: '#475569', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
          <strong>Recommendation:</strong> {bestTimeText}
        </p>
      )}
    </div>
  );
}
