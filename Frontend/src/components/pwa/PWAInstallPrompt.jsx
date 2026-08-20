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
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(135deg, #0F172A, #1E293B)',
          color: '#ffffff',
          padding: '0.85rem 1.1rem',
          borderRadius: '16px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 107, 53, 0.4)',
          maxWidth: '340px',
          width: 'calc(100% - 48px)',
          zIndex: 800, /* below modals, above background */
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF6B35, #FFB703)',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Compass size={20} color="#ffffff" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, margin: 0, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Dekho Bharat App
            </h4>
            <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '0.1rem 0 0.4rem 0', lineHeight: 1.2 }}>
              Fast offline access & travel guides.
            </p>
            <button
              onClick={handleInstallClick}
              style={{
                padding: '0.3rem 0.7rem',
                minHeight: '32px',
                borderRadius: '6px',
                background: '#FF6B35',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Download size={12} /> Install
            </button>
          </div>

          <button
            onClick={() => setShowInstallBanner(false)}
            aria-label="Close install prompt"
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', alignSelf: 'flex-start', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
