import React, { useState } from 'react';
import { BookOpen, Edit3, Trash2 } from 'lucide-react';
import './AdminPages.css';

export default function AdminStoriesPage() {
  const [stories] = useState([
    { id: 1, title: 'Mystic Trails of Spiti Valley: A High Altitude Odyssey', author: 'Editorial Board', readTime: '6 min read', date: 'August 2026' },
    { id: 2, title: 'Living Chola Temples: Granite Architectural Wonders', author: 'Dr. R. K. Sharma', readTime: '9 min read', date: 'August 2026' },
    { id: 3, title: 'Secrets of the Sundarbans Mangrove Frontier', author: 'Nature Guild', readTime: '7 min read', date: 'July 2026' },
    { id: 4, title: 'The Royal Forts of Rajputana: Living Palaces of Rajasthan', author: 'Editorial Board', readTime: '11 min read', date: 'July 2026' },
  ]);

  return (
    <div className="admin-stories-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Editorial Travel Journals & Stories</h1>
          <p className="admin-page-subtitle">Publish travel guides, architectural reviews, and heritage articles.</p>
        </div>
        <button type="button" className="btn-submit">+ Write New Story</button>
      </div>

      <div className="admin-table-panel">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Journal Title</th>
              <th>Author</th>
              <th>Read Time</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id}>
                <td>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>{story.title}</span>
                </td>
                <td><span style={{ fontWeight: 600, color: '#cbd5e1' }}>{story.author}</span></td>
                <td><span style={{ color: '#a855f7', fontWeight: 700 }}>{story.readTime}</span></td>
                <td><span className="status-badge published">● Published</span></td>
                <td style={{ textAlign: 'right' }}>
                  <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                    <button className="action-icon-btn" title="Edit Story"><Edit3 size={15} /></button>
                    <button className="action-icon-btn delete" title="Delete Story"><Trash2 size={15} /></button>
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
