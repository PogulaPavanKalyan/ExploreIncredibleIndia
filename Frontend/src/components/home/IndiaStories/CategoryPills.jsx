import React from 'react';

const STORY_CATEGORIES = [
  { id: 'all', label: 'ALL STORIES' },
  { id: 'hidden', label: 'HIDDEN INDIA' },
  { id: 'culture', label: 'CULTURE' },
  { id: 'food', label: 'FOOD STORIES' },
  { id: 'heritage', label: 'ROYAL & HERITAGE' },
  { id: 'spiritual', label: 'SACRED INDIA' },
  { id: 'adventure', label: 'ADVENTURE' },
  { id: 'wildlife', label: 'WILD INDIA' },
  { id: 'nature', label: 'NATURE' },
  { id: 'mountain', label: 'MOUNTAINS' },
  { id: 'coastal', label: 'COASTAL' },
];

export default function CategoryPills({ activeCategory, onSelectCategory }) {
  return (
    <div className="stories-category-filter" role="tablist" aria-label="Story categories">
      <div className="category-pills-row">
        {STORY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`story-tab-${cat.id}`}
              className={`category-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls="stories-content-panel"
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
