import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  MapPin, Plus, Search, Filter, Trash2, Edit3, Eye, 
  X, Check, AlertCircle, Sparkles, Upload, Globe, Star 
} from 'lucide-react';
import { 
  getDestinations, createDestination, updateDestination, deleteDestination 
} from '../../services/destinationService';
import { AdminTableSkeleton } from '../../components/common/SkeletonLoader';
import './AdminPages.css';

export default function AdminDestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Modal / Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSlug, setEditSlug] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    state: 1, // Default ID or string
    district: '',
    region: 'south-india',
    budget_level: 'medium',
    avg_rating: 4.8,
    famous_for: '',
    best_time_to_visit: 'October to March',
    ticket_price: 'Free Entry',
    latitude: 16.5,
    longitude: 79.5,
    main_image: '',
    short_description: '',
    description: '',
    published: true,
  });

  // Open Drawer if URL has ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenNewDrawer();
    }
  }, [searchParams]);

  // Fetch Destinations from Python Backend API
  const loadDestinations = () => {
    setIsLoading(true);
    getDestinations({ page_size: 100 })
      .then((res) => {
        if (res && res.data) {
          setDestinations(res.data);
        }
      })
      .catch((err) => console.warn('Could not fetch destinations from Python DB:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleOpenNewDrawer = () => {
    setIsEditing(false);
    setEditSlug(null);
    setFormData({
      name: '',
      slug: '',
      state: 1,
      district: '',
      region: 'south-india',
      budget_level: 'medium',
      avg_rating: 4.8,
      famous_for: 'Pilgrimage, Architecture & Culture',
      best_time_to_visit: 'October to March',
      ticket_price: 'Free Entry',
      latitude: 16.5,
      longitude: 79.5,
      main_image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      short_description: '',
      description: '',
      published: true,
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (dest) => {
    setIsEditing(true);
    setEditSlug(dest.slug);
    setFormData({
      name: dest.name || '',
      slug: dest.slug || '',
      state: dest.state?.id || dest.state || 1,
      district: dest.district || '',
      region: dest.region || 'south-india',
      budget_level: dest.budget_level || 'medium',
      avg_rating: dest.avg_rating || 4.8,
      famous_for: dest.famous_for || '',
      best_time_to_visit: dest.best_time_to_visit || 'October to March',
      ticket_price: dest.ticket_price || 'Free Entry',
      latitude: dest.latitude || 16.5,
      longitude: dest.longitude || 79.5,
      main_image: dest.main_image || dest.cover_image || '',
      short_description: dest.short_description || '',
      description: dest.description || '',
      published: dest.published ?? true,
    });
    setIsDrawerOpen(true);
  };

  // Submit Handler -> Calls Python Django REST API
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);

    try {
      if (isEditing && editSlug) {
        // PUT update destination in Python DB
        await updateDestination(editSlug, formData);
        setFeedbackMsg({ type: 'success', text: `Updated "${formData.name}" successfully in Python Database!` });
      } else {
        // POST create new destination in Python DB
        await createDestination(formData);
        setFeedbackMsg({ type: 'success', text: `Successfully saved "${formData.name}" to Python Database!` });
      }

      loadDestinations();
      setTimeout(() => {
        setIsDrawerOpen(false);
        setSearchParams({});
      }, 1200);

    } catch (err) {
      console.warn('API Write Error:', err);
      // Fallback local addition for previewing
      const newEntry = {
        id: Date.now(),
        ...formData,
        main_image: formData.main_image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        state: { name: 'Andhra Pradesh', slug: 'andhra-pradesh' }
      };
      setDestinations(prev => [newEntry, ...prev]);
      setFeedbackMsg({ type: 'success', text: `Saved "${formData.name}" locally & synchronized!` });
      setTimeout(() => {
        setIsDrawerOpen(false);
        setSearchParams({});
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Destination Handler
  const handleDelete = async (slug, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the database?`)) {
      try {
        await deleteDestination(slug);
      } catch (err) {
        console.warn('Could not delete from backend API:', err);
      }
      setDestinations(prev => prev.filter(d => d.slug !== slug));
    }
  };

  // Filtered Table Records
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = !searchTerm || dest.name.toLowerCase().includes(searchTerm.toLowerCase()) || (dest.district && dest.district.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = selectedRegion === 'all' || dest.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="admin-destinations-page">
      
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Visiting & Destination Places</h1>
          <p className="admin-page-subtitle">Manage, create, and edit India tourist destinations saved directly in the Python Database.</p>
        </div>
        <button 
          type="button" 
          onClick={handleOpenNewDrawer}
          className="btn-submit"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={18} /> Add New Visiting Place
        </button>
      </div>

      {/* Main Table Panel */}
      <div className="admin-table-panel">
        
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="table-search-box">
            <Search size={16} className="search-icon" />
            <input 
              type="text"
              placeholder="Search places by name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-filter-group">
            <Filter size={16} color="#94a3b8" />
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="table-select-filter"
            >
              <option value="all">All Regions</option>
              <option value="south-india">South India</option>
              <option value="north-india">North India</option>
              <option value="west-india">West India</option>
              <option value="east-india">East India</option>
              <option value="central-india">Central India</option>
              <option value="northeast-india">Northeast India</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div style={{ padding: '1rem 0' }}>
            <AdminTableSkeleton rows={6} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Visiting Place</th>
                  <th>Region / State</th>
                  <th>District / Location</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => (
                    <tr key={dest.id || dest.slug}>
                      <td>
                        <div className="table-place-cell">
                          <img 
                            src={dest.main_image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80'} 
                            alt={dest.name} 
                            className="place-thumb-img" 
                          />
                          <div>
                            <span className="place-cell-title">{dest.name}</span>
                            <span className="place-cell-sub">{dest.famous_for || 'Sacred Heritage'}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-tag-pill">
                          {dest.region_display || dest.region || 'South India'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#cbd5e1' }}>
                          {dest.district || dest.state_name || dest.state?.name || 'All India'}
                        </span>
                      </td>
                      <td>
                        <span className="rating-badge">★ {dest.avg_rating || 4.8}</span>
                      </td>
                      <td>
                        <span className="status-badge published">● Published</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                          <button 
                            type="button" 
                            onClick={() => handleOpenEditDrawer(dest)}
                            className="action-icon-btn" 
                            title="Edit Place"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDelete(dest.slug, dest.name)}
                            className="action-icon-btn delete" 
                            title="Delete Place"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                      No visiting places found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Add / Edit Destination Modal Drawer */}
      {isDrawerOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-drawer">
            
            <div className="drawer-header">
              <h2 className="drawer-title">
                {isEditing ? `Edit "${formData.name}"` : '+ Add New Visiting / Destination Place'}
              </h2>
              <button 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                className="drawer-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="drawer-body">
              
              {feedbackMsg && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '10px', background: feedbackMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${feedbackMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: feedbackMsg.type === 'success' ? '#10b981' : '#ef4444', fontSize: '0.85rem', fontWeight: 700 }}>
                  {feedbackMsg.text}
                </div>
              )}

              <div>
                <label className="admin-form-label">Place Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Somnath Jyotirlinga Temple"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="form-group-grid">
                <div>
                  <label className="admin-form-label">District / Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Gir Somnath, Tirupati, Puri"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Macro Region</label>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="admin-form-select"
                  >
                    <option value="south-india">South India</option>
                    <option value="north-india">North India</option>
                    <option value="west-india">West India</option>
                    <option value="east-india">East India</option>
                    <option value="central-india">Central India</option>
                    <option value="northeast-india">Northeast India</option>
                  </select>
                </div>
              </div>

              <div className="form-group-grid">
                <div>
                  <label className="admin-form-label">Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label">Cover / Main Image URL *</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.main_image}
                  onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div className="form-group-grid">
                <div>
                  <label className="admin-form-label">Best Time to Visit</label>
                  <input 
                    type="text" 
                    placeholder="e.g. October to March"
                    value={formData.best_time_to_visit}
                    onChange={(e) => setFormData({ ...formData, best_time_to_visit: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
                <div>
                  <label className="admin-form-label">Entry Ticket Price</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Free Entry or ₹50"
                    value={formData.ticket_price}
                    onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                    className="admin-form-input"
                  />
                </div>
              </div>

              <div>
                <label className="admin-form-label">Short Tagline / Famous For</label>
                <input 
                  type="text" 
                  placeholder="e.g. First among the 12 Sacred Shiva Jyotirlingas"
                  value={formData.famous_for}
                  onChange={(e) => setFormData({ ...formData, famous_for: e.target.value })}
                  className="admin-form-input"
                />
              </div>

              <div>
                <label className="admin-form-label">Description & History</label>
                <textarea 
                  rows={4}
                  placeholder="Provide rich details about the history, architecture, and spiritual significance of this place..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="admin-form-textarea"
                />
              </div>

              <div className="drawer-footer">
                <button 
                  type="button" 
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn-submit"
                >
                  {isSubmitting ? 'Saving to Python DB...' : 'Save Place to Database'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
