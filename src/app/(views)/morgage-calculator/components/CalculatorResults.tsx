"use client";


import React from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

interface ResultsProps {
  results: {
    biWeekly: number;
    monthly: number;
    annual: number;
    valid: boolean;
  };
}

const CalculatorResults: React.FC<ResultsProps> = ({ results }) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`bg-blue-900 text-white p-6 md:p-8 transition-all duration-500 ${results.valid ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      {results.valid && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-xl font-medium mb-4 text-blue-100">{t('mortgage_calculator.results.title')}</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-blue-800 pb-3">
              <span className="text-blue-100">{t('mortgage_calculator.results.bi_weekly_payment')}:</span>
              <span className="text-xl font-semibold">{formatCurrency(results.biWeekly)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-blue-800 pb-3">
              <span className="text-blue-100">{t('mortgage_calculator.results.monthly_payment')}:</span>
              <span className="text-xl font-semibold">{formatCurrency(results.monthly)}</span>
            </div>

            <div className="flex justify-between items-center pb-3">
              <span className="text-blue-100">{t('mortgage_calculator.results.annual_payment')}:</span>
              <span className="text-xl font-semibold">{formatCurrency(results.annual)}</span>
            </div>
          </div>

          <p className="text-xs text-blue-200 mt-4">
            {t('mortgage_calculator.results.disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CalculatorResults;