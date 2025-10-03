import React from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-blue-900 text-white py-3 px-6">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} {t('quebec_tax_calculator.footer.title')}</p>
        <p className="text-blue-200 text-xs mt-1">
          {t('quebec_tax_calculator.footer.disclaimer')}
        </p>
      </div>
    </footer>
  );
};