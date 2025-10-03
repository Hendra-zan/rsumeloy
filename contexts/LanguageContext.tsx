
"use client";

import React, { createContext, useState, useCallback, useMemo } from 'react';
import { translations } from '../lib/translations';
import { LanguageContextType } from '../types';

export const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
