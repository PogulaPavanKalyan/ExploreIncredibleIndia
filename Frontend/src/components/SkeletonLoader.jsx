import React from 'react';

export function DestinationCardSkeleton() {
  return (
    <div className="card-skeleton" style={{
      background: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      height: '380px'
    }}>
      <div className="skeleton-box" style={{ height: '200px', width: '100%' }}></div>
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <div className="skeleton-box" style={{ height: '20px', width: '70%' }}></div>
        <div className="skeleton-box" style={{ height: '14px', width: '40%' }}></div>
        <div className="skeleton-box" style={{ height: '14px', width: '90%' }}></div>
        <div className="skeleton-box" style={{ height: '14px', width: '60%' }}></div>
        <div className="skeleton-box" style={{ height: '36px', width: '100%', marginTop: 'auto', borderRadius: '6px' }}></div>
      </div>
    </div>
  );
}

export function DestinationDetailsSkeleton() {
  return (
    <div className="container section-padding" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="skeleton-box" style={{ height: '320px', width: '100%', borderRadius: '16px' }}></div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="skeleton-box" style={{ height: '40px', width: '50%' }}></div>
          <div className="skeleton-box" style={{ height: '120px', width: '100%' }}></div>
          <div className="skeleton-box" style={{ height: '200px', width: '100%' }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="skeleton-box" style={{ height: '180px', width: '100%' }}></div>
          <div className="skeleton-box" style={{ height: '120px', width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}

export default function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid-destinations" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.75rem',
      width: '100%'
    }}>
      {Array.from({ length: count }).map((_, idx) => (
        <DestinationCardSkeleton key={idx} />
      ))}
    </div>
  );
}
