import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ title = "Something went wrong", message = "Unable to load data at this time.", onRetry }) {
  return (
    <div style={{
      padding: '3rem 1.5rem',
      textAlign: 'center',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      margin: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
    }}>
      <AlertCircle size={48} color="#ef4444" />
      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{title}</h3>
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem', maxWidth: '420px' }}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: '#004e64',
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            minHeight: '44px',
            marginTop: '0.5rem'
          }}
        >
          <RefreshCw size={16} /> Try Again
        </button>
      )}
    </div>
  );
}
