"use client";

import { useState } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import Button from './ui/button';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'primary' | 'light' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function LanguageSelector({ 
  className = '',
  variant = 'primary',
  size = 'md' 
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { 
      code: 'fr', 
      label: t('language.canada_french'),
      flag: '🇨🇦'
    },
    { 
      code: 'en', 
      label: t('language.canada_english'),
      flag: '🇨🇦'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button 
        variant={variant} 
        size={size} 
        onClick={() => setIsOpen(!isOpen)}
        className="!rounded-full text-[11px] flex items-center gap-2"
      >
        <Button 
          variant="light" 
          size={size} 
          className="!rounded-full text-[11px] mr-1 pointer-events-none"
        >
          <span className="mr-1">{currentLanguage?.flag}</span>
          {currentLanguage?.label}
        </Button>
        <span className="hidden sm:inline">{t('footer.select_region')}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                    language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}