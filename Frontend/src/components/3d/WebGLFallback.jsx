import React from 'react';
import { Compass, Sparkles, MapPin } from 'lucide-react';

export default function WebGLFallback() {
  return (
    <div className="hero-bg-overlay" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(255, 107, 53, 0.15) 0%, rgba(15, 23, 42, 0.85) 100%)',
      pointerEvents: 'none'
    }}>
      <div style={{
        textAlign: 'center',
        opacity: 0.25,
        transform: 'scale(1.2)'
      }}>
        <Compass size={120} style={{ color: '#FF6B35', strokeWidth: 1 }} />
      </div>
    </div>
  );
}
