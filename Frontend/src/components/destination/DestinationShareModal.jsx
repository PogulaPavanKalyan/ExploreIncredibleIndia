import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

export default function DestinationShareModal({ destination, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !destination) return null;

  const url = window.location.href;
  const shareTitle = `Explore ${destination.name}, ${destination.state?.name || destination.state_name || 'India'} on Dekho Bharat`;
  const shareText = `${destination.short_description || `Discover the beauty and history of ${destination.name}`}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      bg: '#25D366',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + '\n' + url)}`
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      bg: '#000000',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'Facebook',
      icon: 'f',
      bg: '#1877F2',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'LinkedIn',
      icon: 'in',
      bg: '#0A66C2',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: url
        });
      } catch (err) {
        // User cancelled share
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        maxWidth: '460px',
        width: '100%',
        padding: '1.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B'
          }}
          aria-label="Close share dialog"
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
          Share Destination
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
          Share <strong>{destination.name}</strong> with friends and family.
        </p>

        {/* Share buttons row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {shareLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                padding: '0.75rem 0.5rem',
                borderRadius: '16px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: link.bg,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 800
              }}>
                {link.icon}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>
                {link.name}
              </span>
            </a>
          ))}
        </div>

        {/* Copy Link Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#F1F5F9',
          borderRadius: '12px',
          padding: '0.4rem 0.5rem 0.4rem 0.9rem',
          border: '1px solid #CBD5E1'
        }}>
          <input
            type="text"
            readOnly
            value={url}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#334155',
              fontFamily: 'monospace'
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: copied ? '#10B981' : '#FF6B1A',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Native Mobile Share if supported */}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '12px',
              background: '#0F172A',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Share2 size={16} /> More Share Options
          </button>
        )}
      </div>
    </div>
  );
}
