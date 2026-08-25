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
          gap: '0.45rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#f8fafc',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
        }}
        title="Select Regional Language"
      >
        <Globe size={15} color="#ff8c42" />
        <span>{activeLang.flag} {activeLang.label}</span>
        <ChevronDown size={14} color="#94a3b8" />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: '#0f172a',
          borderRadius: '16px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 300,
          minWidth: '160px',
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
                gap: '0.65rem',
                padding: '0.55rem 1rem',
                fontSize: '0.88rem',
                fontWeight: language === lang.code ? 700 : 500,
                color: language === lang.code ? '#ff8c42' : '#cbd5e1',
                background: language === lang.code ? 'rgba(255, 107, 53, 0.15)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
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
