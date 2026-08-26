import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, Layers, Sparkles, BookOpen, Users, 
  Search, PlusCircle, LogOut, ChevronLeft, ChevronRight, Database, 
  ShieldCheck, ExternalLink 
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const menuItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/destinations', label: 'Visiting Places', icon: MapPin },
    { path: '/admin/collections', label: 'Collections', icon: Layers },
    { path: '/admin/festivals', label: 'Festivals & Yatras', icon: Sparkles },
    { path: '/admin/stories', label: 'Travel Journals', icon: BookOpen },
    { path: '/admin/users', label: 'Users & Roles', icon: Users },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/admin/destinations?search=${encodeURIComponent(globalSearch)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`admin-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      
      {/* Admin Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand-logo">
            <span className="brand-badge-icon">🇮🇳</span>
            {!isSidebarCollapsed && (
              <span className="brand-text">Dekho<span className="brand-highlight">Bharat</span> Admin</span>
            )}
          </Link>
          <button 
            type="button" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="sidebar-toggle-btn"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`admin-menu-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon className="menu-icon" size={18} />
                {!isSidebarCollapsed && <span className="menu-label">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" target="_blank" className="admin-footer-btn" title="View Public Website">
            <ExternalLink size={16} />
            {!isSidebarCollapsed && <span>View Public Site</span>}
          </Link>
          <button type="button" onClick={handleLogout} className="admin-footer-btn logout" title="Sign Out">
            <LogOut size={16} />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Admin Content Wrapper */}
      <div className="admin-main-wrapper">
        
        {/* Admin Top Header */}
        <header className="admin-top-header">
          <div className="header-left">
            <div className="db-status-pill" title="Connected to Python Django Backend">
              <Database size={14} className="status-icon" />
              <span>Python Backend: Active</span>
            </div>
            <div className="security-badge" title="Authenticated Superadmin Session">
              <ShieldCheck size={14} className="shield-icon" />
              <span>Superadmin</span>
            </div>
          </div>

          <div className="header-right">
            <form onSubmit={handleSearchSubmit} className="admin-global-search">
              <Search size={16} className="search-icon" />
              <input 
                type="text"
                placeholder="Search DB destinations, collections..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="admin-search-input"
              />
            </form>

            <Link to="/admin/destinations?action=new" className="admin-add-btn">
              <PlusCircle size={16} />
              <span>+ Add Visiting Place</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="admin-page-body">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
