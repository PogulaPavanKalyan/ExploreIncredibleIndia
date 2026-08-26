import React, { useState } from 'react';
import { Users, ShieldCheck, UserCheck, Trash2 } from 'lucide-react';
import './AdminPages.css';

export default function AdminUsersPage() {
  const [users] = useState([
    { id: 1, username: 'admin', email: 'admin@dekhobharat.gov.in', role: 'Superadmin', status: 'Active', joined: 'Jan 2026' },
    { id: 2, username: 'pavan_kalyan', email: 'pavan@exploreindia.com', role: 'Content Lead', status: 'Active', joined: 'Feb 2026' },
    { id: 3, username: 'sreekanth_editor', email: 'editor@dekhobharat.com', role: 'Editor', status: 'Active', joined: 'Mar 2026' },
    { id: 4, username: 'rahul_traveler', email: 'rahul@gmail.com', role: 'Traveler', status: 'Active', joined: 'Apr 2026' },
  ]);

  return (
    <div className="admin-users-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">User Accounts & Administrative Roles</h1>
          <p className="admin-page-subtitle">Manage system administrators, content editors, and registered travelers.</p>
        </div>
        <button type="button" className="btn-submit">+ Invite New Admin User</button>
      </div>

      <div className="admin-table-panel">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Username & Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <span style={{ fontWeight: 800, color: '#ffffff', display: 'block' }}>{u.username}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.email}</span>
                </td>
                <td>
                  <span className="category-tag-pill" style={{ background: u.role === 'Superadmin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)', color: u.role === 'Superadmin' ? '#ef4444' : '#38bdf8', borderColor: u.role === 'Superadmin' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)' }}>
                    {u.role}
                  </span>
                </td>
                <td><span style={{ color: '#cbd5e1', fontWeight: 600 }}>{u.joined}</span></td>
                <td><span className="status-badge published">● Active Session</span></td>
                <td style={{ textAlign: 'right' }}>
                  <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                    <button className="action-icon-btn delete" title="Revoke User"><Trash2 size={15} /></button>
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
