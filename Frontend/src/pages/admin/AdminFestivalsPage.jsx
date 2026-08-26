import React, { useState } from 'react';
import { Sparkles, Edit3, Trash2 } from 'lucide-react';
import './AdminPages.css';

export default function AdminFestivalsPage() {
  const [festivals] = useState([
    { id: 1, name: 'Kumbh Mela 2026', location: 'Prayagraj, Uttar Pradesh', season: 'Winter / Spring', dates: 'Jan 14 - Feb 26, 2026' },
    { id: 2, name: 'Rath Yatra Puri', location: 'Puri, Odisha', season: 'Monsoon', dates: 'June / July' },
    { id: 3, name: 'Hornbill Festival', location: 'Kohima, Nagaland', season: 'Winter', dates: 'Dec 1 - Dec 10' },
    { id: 4, name: 'Pushkar Camel Fair', location: 'Pushkar, Rajasthan', season: 'Winter', dates: 'November' },
    { id: 5, name: 'Dev Deepawali', location: 'Varanasi, Uttar Pradesh', season: 'Winter', dates: 'Kartik Purnima' },
  ]);

  return (
    <div className="admin-festivals-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Cultural Festivals & Spiritual Yatras</h1>
          <p className="admin-page-subtitle">Add and manage cultural events, dates, ritual guides, and local festivities.</p>
        </div>
        <button type="button" className="btn-submit">+ Add Festival Event</button>
      </div>

      <div className="admin-table-panel">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Festival Event</th>
              <th>Location</th>
              <th>Season & Dates</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {festivals.map((fest) => (
              <tr key={fest.id}>
                <td>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>{fest.name}</span>
                </td>
                <td><span style={{ fontWeight: 600, color: '#cbd5e1' }}>{fest.location}</span></td>
                <td><span style={{ color: '#38bdf8', fontWeight: 700 }}>{fest.dates}</span></td>
                <td><span className="status-badge published">● Verified Event</span></td>
                <td style={{ textAlign: 'right' }}>
                  <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                    <button className="action-icon-btn" title="Edit Festival"><Edit3 size={15} /></button>
                    <button className="action-icon-btn delete" title="Delete Festival"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
