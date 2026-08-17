import React from 'react';
import { Compass } from 'lucide-react';

export default function SceneLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      color: '#ffffff',
      gap: '0.75rem',
      background: 'transparent'
    }}>
      <Compass
        size={32}
        style={{
          animation: 'spin 3s linear infinite',
          color: '#FF6B35'
        }}
      />
      <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', opacity: 0.8 }}>
        Loading 3D Experience...
      </span>
    </div>
  );
}
