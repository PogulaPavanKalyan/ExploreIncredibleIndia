import React, { createContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('app_language') || 'en';
    } catch {
      return 'en';
    }
  });

  const changeLanguage = (code) => {
    if (translations[code]) {
      setLanguage(code);
      try {
        localStorage.setItem('app_language', code);
      } catch (err) {
        console.warn("Could not save language to localStorage:", err);
      }
    }
  };

  // Translation helper function
  const t = (key) => {
    const dict = translations[language] || translations['en'];
    if (!key) return '';
    
    // Support nested key lookups (e.g. 'regions.North')
    if (key.includes('.')) {
      const parts = key.split('.');
      let val = dict;
      for (const p of parts) {
        val = val?.[p];
      }
      return val || translations['en']?.[parts[0]]?.[parts[1]] || key;
    }

    return dict[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
