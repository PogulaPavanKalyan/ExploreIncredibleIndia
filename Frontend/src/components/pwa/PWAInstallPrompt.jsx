import React, { useState, useEffect } from 'react';
import { Download, WifiOff, X, Compass, CheckCircle2 } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Network status listener
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // BeforeInstallPrompt listener
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User installed Dekho Bharat PWA');
    }
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  return (
    <>
      {/* Offline Status Badge */}
      {isOffline && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          background: '#0F172A',
          color: '#ffffff',
          border: '1px solid #FF6B35',
          padding: '0.65rem 1.1rem',
          borderRadius: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.84rem',
          fontWeight: 700,
          zIndex: 9999
        }}>
          <WifiOff size={16} color="#FF6B35" />
          <span>Offline Mode — Browsing Cached Destinations</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showInstallBanner && !isOffline && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '20px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(255, 107, 53, 0.4)',
          maxWidth: '360px',
          width: 'calc(100% - 40px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Compass size={24} color="#ffffff" />
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              Install Dekho Bharat App
            </h4>
            <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '0.15rem 0 0.5rem 0', lineHeight: 1.3 }}>
              Fast offline access & instant travel planning on your device.
            </p>
            <button
              onClick={handleInstallClick}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: '8px',
                background: '#FF6B35',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Download size={13} /> Add to Home Screen
            </button>
          </div>

          <button
            onClick={() => setShowInstallBanner(false)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', alignSelf: 'flex-start' }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
