import React from 'react';
import './SkeletonLoader.css';

/**
 * 1. Single Destination Card Skeleton
 */
export function DestinationCardSkeleton() {
  return (
    <div className="skeleton-card-chassis">
      <div className="skeleton-shimmer skeleton-card-media" />
      <div className="skeleton-card-body">
        <div className="skeleton-shimmer skeleton-line short" />
        <div className="skeleton-shimmer skeleton-line title" />
        <div className="skeleton-shimmer skeleton-line" />
        <div className="skeleton-card-footer">
          <div className="skeleton-shimmer skeleton-line short" style={{ width: '35%' }} />
          <div className="skeleton-shimmer skeleton-line short" style={{ width: '25%' }} />
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Grid of Destination Cards Skeleton
 */
export function DestinationGridSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-grid-4">
      {[...Array(count)].map((_, i) => (
        <DestinationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * 3. Hero Banner Skeleton
 */
export function HeroSkeleton() {
  return (
    <div className="skeleton-shimmer skeleton-hero-banner">
      <div className="skeleton-shimmer skeleton-line short" style={{ width: '20%', height: '24px' }} />
      <div className="skeleton-shimmer skeleton-line title" style={{ width: '60%', height: '48px' }} />
      <div className="skeleton-shimmer skeleton-line" style={{ width: '40%', height: '18px' }} />
      <div className="skeleton-shimmer skeleton-line" style={{ width: '30%', height: '42px', borderRadius: '9999px' }} />
    </div>
  );
}

/**
 * 4. Collection / Jyotirlingas Header Skeleton
 */
export function CollectionHeaderSkeleton() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
      <HeroSkeleton />
      <div className="skeleton-shimmer skeleton-detail-content-box" style={{ height: '140px', borderRadius: '20px' }} />
    </div>
  );
}

/**
 * 5. Destination Details Page Skeleton
 */
export function DestinationDetailSkeleton() {
  return (
    <div className="skeleton-detail-layout">
      <div className="skeleton-shimmer skeleton-detail-hero" />
      <div className="skeleton-detail-info-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton-shimmer skeleton-info-card" />
        ))}
      </div>
      <div className="skeleton-shimmer skeleton-detail-content-box" />
    </div>
  );
}

/**
 * 6. State Page Skeleton
 */
export function StatePageSkeleton() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <HeroSkeleton />
      <DestinationGridSkeleton count={8} />
    </div>
  );
}

/**
 * 7. Admin Table Skeleton
 */
export function AdminTableSkeleton({ rows = 6 }) {
  return (
    <div className="skeleton-table-container">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="skeleton-shimmer skeleton-table-row" />
      ))}
    </div>
  );
}

export default {
  DestinationCardSkeleton,
  DestinationGridSkeleton,
  HeroSkeleton,
  CollectionHeaderSkeleton,
  DestinationDetailSkeleton,
  StatePageSkeleton,
  AdminTableSkeleton,
};
