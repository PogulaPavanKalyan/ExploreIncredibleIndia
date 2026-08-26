import React from 'react';
import { 
  DestinationCardSkeleton as NewCardSkeleton, 
  DestinationGridSkeleton as NewGridSkeleton,
  DestinationDetailSkeleton as NewDetailSkeleton
} from './common/SkeletonLoader';

export function DestinationCardSkeleton() {
  return <NewCardSkeleton />;
}

export function DestinationDetailsSkeleton() {
  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <NewDetailSkeleton />
    </div>
  );
}

export default function SkeletonGrid({ count = 8 }) {
  return <NewGridSkeleton count={count} />;
}
