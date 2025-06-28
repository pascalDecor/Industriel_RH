"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { frCA, enCA } from '../locales';

type Language = 'fr' | 'en';
type Translations = typeof frCA;

interface LanguageContextType {
  language: Language;
  t: (key: keyof typeof frCA) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>('fr');
  
  const translations: Record<Language, Translations> = {
    fr: frCA,
    en: enCA,
  };

  const t = (key: keyof typeof frCA) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};