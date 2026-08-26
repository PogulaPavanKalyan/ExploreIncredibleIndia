import React, { useState } from 'react';
import { Layers, Plus, Edit3, Trash2, CheckCircle } from 'lucide-react';
import './AdminPages.css';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState([
    { id: 1, name: '12 Sacred Jyotirlingas of India', slug: 'jyotirlingas', count: 12, category: 'Pilgrimage', featured: true },
    { id: 2, name: 'Maha Char Dham & Chota Char Dham', slug: 'char-dham', count: 8, category: 'Pilgrimage', featured: true },
    { id: 3, name: 'Grand South Indian Temples', slug: 'south-indian-temples', count: 16, category: 'Architecture', featured: true },
    { id: 4, name: 'Best Indian Beaches & Coastal Havens', slug: 'best-beaches', count: 13, category: 'Coastal', featured: true },
    { id: 5, name: 'Himalayan Peaks & High Altitude Treks', slug: 'himalayan-escapes', count: 22, category: 'Mountains', featured: true },
    { id: 6, name: 'UNESCO World Heritage of India', slug: 'unesco-heritage', count: 42, category: 'Heritage', featured: true },
  ]);

  return (
    <div className="admin-collections-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Thematic & Pilgrimage Collections</h1>
          <p className="admin-page-subtitle">Manage spiritual yatras, UNESCO heritage lists, and curated travel trails.</p>
        </div>
        <button type="button" className="btn-submit">+ Create Collection</button>
      </div>

      <div className="admin-table-panel">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Collection Title</th>
              <th>Category</th>
              <th>Linked Places</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col.id}>
                <td>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>{col.name}</span>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>/collections/{col.slug}</span>
                </td>
                <td><span className="category-tag-pill">{col.category}</span></td>
                <td><span style={{ fontWeight: 800, color: '#ff6b35' }}>{col.count} Verified Places</span></td>
                <td><span className="status-badge published">● Active Showcase</span></td>
                <td style={{ textAlign: 'right' }}>
                  <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                    <button className="action-icon-btn" title="Edit Collection"><Edit3 size={15} /></button>
                    <button className="action-icon-btn delete" title="Delete Collection"><Trash2 size={15} /></button>
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
