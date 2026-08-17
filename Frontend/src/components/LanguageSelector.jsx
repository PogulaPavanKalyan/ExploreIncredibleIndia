import React, { useContext, useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' }
];

export default function LanguageSelector() {
  const { language, changeLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const activeLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.75rem',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid var(--border-color, #E2E8F0)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#0F172A',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease'
        }}
        title="Select Regional Language"
      >
        <Globe size={16} color="#FF6B35" />
        <span>{activeLang.flag} {activeLang.label}</span>
        <ChevronDown size={14} color="#64748B" />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          background: '#ffffff',
          borderRadius: '14px',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.18)',
          border: '1px solid #E2E8F0',
          zIndex: 200,
          minWidth: '150px',
          overflow: 'hidden',
          padding: '0.4rem 0'
        }}>
          {LANGUAGES.map(lang => (
            <div
              key={lang.code}
              onClick={() => { changeLanguage(lang.code); setIsOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.5rem 0.9rem',
                fontSize: '0.88rem',
                fontWeight: language === lang.code ? 700 : 500,
                color: language === lang.code ? '#FF6B35' : '#334155',
                background: language === lang.code ? 'rgba(255, 107, 53, 0.08)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              className="search-item-hover"
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
