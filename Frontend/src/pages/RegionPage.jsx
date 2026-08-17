import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RegionPage() {
  const { slug } = useParams();

  return (
    <div className="container" style={{ padding: '8rem 0', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#fff' }}>
        Region: <span style={{ textTransform: 'capitalize' }}>{slug?.replace('-', ' ')}</span>
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        The dedicated cinematic page for this region is currently under construction.
      </p>
      <Link to="/" style={{ color: '#cda87c', textDecoration: 'none', borderBottom: '1px solid #cda87c' }}>
        ← Return Home
      </Link>
    </div>
  );
}
