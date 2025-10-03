import React from 'react';
import { Calculator } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="bg-blue-900 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-center">
        <Calculator className="w-6 h-6 mr-2" />
        <h1 className="text-xl md:text-2xl font-semibold">{t('quebec_tax_calculator.header.title')}</h1>
      </div>
    </header>
  );
};