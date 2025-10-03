import React from 'react';
import { formatCurrency, formatPercentage } from './utils/formatters';
import { Alert } from './Alert';
import { minimumWage } from './data/minimumWage';
import { TaxPieChart } from './TaxPieChart';
import { RRSP_DOLLAR_LIMITS, TFSA_LIMITS } from './data/contributionLimits';
import { useTranslation } from '@/contexts/LanguageContext';

interface ResultsProps {
  results: {
    netIncome: number;
    totalTax: number;
    federalTax: number;
    provincialTax: number;
    cpp: number;
    ei: number;
    effectiveTaxRate: number;
    federalTaxRate: number;
    provincialTaxRate: number;
    rrspContribution: number;
    tfsaContribution: number;
    takeHomeAfterContributions: number;
    deductions: Array<{
      id: string;
      name: string;
      type: 'percentage' | 'amount';
      amount: number;
      calculatedAmount: number;
      description?: string;
    }>;
  };
  grossIncome: number;
  province: string;
  taxYear: string;
}

export const Results: React.FC<ResultsProps> = ({ results, grossIncome, province, taxYear }) => {
  const { t } = useTranslation();
  const {
    netIncome,
    totalTax,
    federalTax,
    provincialTax,
    cpp,
    ei,
    effectiveTaxRate,
    federalTaxRate,
    provincialTaxRate,
    rrspContribution,
    tfsaContribution,
    takeHomeAfterContributions,
    deductions
  } = results;

  const minWage = minimumWage[taxYear]?.[province] || 0;
  const minAnnualSalary = minWage * 40 * 52;
  const isBelowMinimum = grossIncome < minAnnualSalary;

  const rrspLimit = RRSP_DOLLAR_LIMITS[taxYear];
  const tfsaLimit = TFSA_LIMITS[taxYear];

  const totalDeductions = deductions.reduce((sum, d) => sum + d.calculatedAmount, 0);

  return (
    <div className="p-6 bg-white space-y-6 animate-fadeIn">
      {isBelowMinimum && (
        <Alert
          message={t('quebec_tax_calculator.results.below_minimum_wage', {
            grossIncome: formatCurrency(grossIncome),
            minAnnualSalary: formatCurrency(minAnnualSalary),
            minWage: formatCurrency(minWage),
            province,
            taxYear
          })}
        />
      )}

      <h3 className="text-xl font-semibold text-blue-900 border-b border-gray-200 pb-2">{t('quebec_tax_calculator.results.title')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-blue-800 mb-3">{t('quebec_tax_calculator.results.income_breakdown')}</h4>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('quebec_tax_calculator.results.gross_income')}:</span>
              <span className="font-medium text-blue-400">{formatCurrency(grossIncome)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t('quebec_tax_calculator.results.total_deductions')}:</span>
              <span className="font-medium text-blue-400">-{formatCurrency(totalTax + cpp + ei)}</span>
            </div>

            {deductions.map(deduction => (
              <div key={deduction.id} className="flex justify-between">
                <span className="text-gray-600">{deduction.name}:</span>
                <span className="font-medium text-blue-400">-{formatCurrency(deduction.calculatedAmount)}</span>
              </div>
            ))}

            {rrspContribution > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quebec_tax_calculator.results.rrsp_contribution')}:</span>
                <span className="font-medium text-blue-400">-{formatCurrency(rrspContribution)}</span>
              </div>
            )}

            {tfsaContribution > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('quebec_tax_calculator.results.tfsa_contribution')}:</span>
                <span className="font-medium text-blue-400">-{formatCurrency(tfsaContribution)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span className="text-blue-900">{t('quebec_tax_calculator.results.take_home_pay')}:</span>
              <span className="text-green-500">{formatCurrency(takeHomeAfterContributions)}</span>
            </div>

            <div className="text-xs text-gray-500 text-right">
              {t('quebec_tax_calculator.results.monthly')}: {formatCurrency(takeHomeAfterContributions / 12)}
            </div>
            <div className="text-xs text-gray-500 text-right">
              {t('quebec_tax_calculator.results.bi_weekly')}: {formatCurrency(takeHomeAfterContributions / 26)}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-blue-800 mb-3">{t('quebec_tax_calculator.results.tax_details')}</h4>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('quebec_tax_calculator.results.federal_tax')}:</span>
              <span className="font-medium text-blue-600">{formatCurrency(federalTax)} ({formatPercentage(federalTaxRate)})</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t('quebec_tax_calculator.results.provincial_tax')}:</span>
              <span className="font-medium text-blue-400">{formatCurrency(provincialTax)} ({formatPercentage(provincialTaxRate)})</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t('quebec_tax_calculator.results.cpp_contribution')}:</span>
              <span className="font-medium text-blue-400">{formatCurrency(cpp)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t('quebec_tax_calculator.results.ei_premium')}:</span>
              <span className="font-medium text-blue-400">{formatCurrency(ei)}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span className="text-blue-900">{t('quebec_tax_calculator.results.total_tax_paid')}:</span>
              <span className="text-blue-400">{formatCurrency(totalTax)} ({formatPercentage(effectiveTaxRate)})</span>
            </div>
          </div>
        </div>
      </div>

      {(rrspContribution > 0 || tfsaContribution > 0) && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-blue-800 mb-3">{t('quebec_tax_calculator.results.retirement_savings')}</h4>

          {rrspContribution > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{t('quebec_tax_calculator.results.rrsp_contribution')}:</span>
                <span className="font-medium text-blue-600">{formatCurrency(rrspContribution)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(rrspContribution / rrspLimit) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t('quebec_tax_calculator.results.limit_of', {
                  amount: formatCurrency(rrspContribution),
                  limit: formatCurrency(rrspLimit)
                })}
              </div>
            </div>
          )}

          {tfsaContribution > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">{t('quebec_tax_calculator.results.tfsa_contribution')}:</span>
                <span className="font-medium text-green-600">{formatCurrency(tfsaContribution)}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${(tfsaContribution / tfsaLimit) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t('quebec_tax_calculator.results.limit_of', {
                  amount: formatCurrency(tfsaContribution),
                  limit: formatCurrency(tfsaLimit)
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-gray-100 pt-8">
        <TaxPieChart 
          netIncome={takeHomeAfterContributions} 
          totalTax={totalTax + cpp + ei + rrspContribution + tfsaContribution} 
        />
      </div>
      
      <div className="relative pt-5">
        <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div
              className="bg-blue-600"
              style={{ width: `${federalTaxRate * 100}%` }}
              title={`${t('quebec_tax_calculator.results.federal_tax')}: ${formatPercentage(federalTaxRate)}`}
            />
            <div
              className="bg-blue-400"
              style={{ width: `${provincialTaxRate * 100}%` }}
              title={`${t('quebec_tax_calculator.results.provincial_tax')}: ${formatPercentage(provincialTaxRate)}`}
            />
            <div
              className="bg-green-500"
              style={{ width: `${100 - (effectiveTaxRate * 100)}%` }}
              title={`${t('quebec_tax_calculator.results.take_home')}: ${formatPercentage(1 - effectiveTaxRate)}`}
            />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-blue-600">{t('quebec_tax_calculator.results.federal_tax')}: {formatPercentage(federalTaxRate)}</span>
          <span className="text-blue-400">{t('quebec_tax_calculator.results.provincial_tax')}: {formatPercentage(provincialTaxRate)}</span>
          <span className="text-green-500">{t('quebec_tax_calculator.results.take_home')}: {formatPercentage(1 - effectiveTaxRate)}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 italic">
        {t('quebec_tax_calculator.results.disclaimer')}
      </p>
    </div>
  );
};