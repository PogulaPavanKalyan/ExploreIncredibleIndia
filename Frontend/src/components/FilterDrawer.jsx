import React from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterDrawer({
  isOpen,
  onClose,
  statesList,
  categoriesList,
  selectedState,
  setSelectedState,
  selectedCategory,
  setSelectedCategory,
  selectedBudget,
  setSelectedBudget,
  selectedStyle,
  setSelectedStyle,
  onClear
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="filter-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="filter-drawer-content"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} color="#ff6b35" />
                <h3>Filter Destinations</h3>
              </div>
              <button className="filter-drawer-close" onClick={onClose} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>

            <div className="filter-drawer-body">
              <div className="filter-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Select State / UT</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{ width: '100%', minHeight: '44px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">All Indian States</option>
                  {statesList.map(s => (
                    <option key={s.id} value={s.slug}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: '100%', minHeight: '44px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">All Categories</option>
                  {categoriesList.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Budget Level</label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  style={{ width: '100%', minHeight: '44px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">Any Budget</option>
                  <option value="low">Budget / Economy</option>
                  <option value="medium">Moderate</option>
                  <option value="high">Luxury</option>
                </select>
              </div>

              <div className="filter-group">
                <label style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>Travel Style</label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  style={{ width: '100%', minHeight: '44px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="">All Styles</option>
                  <option value="family">Family Friendly</option>
                  <option value="couple">Romantic / Couple</option>
                  <option value="solo">Solo Travel</option>
                  <option value="adventure">Adventure</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="nature">Nature & Hill Station</option>
                  <option value="historical">Historical & Heritage</option>
                  <option value="beach">Beach Coastal</option>
                </select>
              </div>
            </div>

            <div className="filter-drawer-footer">
              <button
                type="button"
                onClick={onClear}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <RotateCcw size={16} /> Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: '#ff6b35',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Check size={16} /> Apply Filters
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
