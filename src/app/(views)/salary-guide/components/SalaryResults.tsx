import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line
} from 'recharts';
import { Download, TrendingUp, BarChart2, DollarSign } from 'lucide-react';
import { SalaryData } from './types';
import { useTranslation } from '@/contexts/LanguageContext';

interface SalaryResultsProps {
  data: SalaryData;
  searchParams: {
    jobTitle: string;
    location: string;
    experience: string;
  };
}

const SalaryResults: React.FC<SalaryResultsProps> = ({ data, searchParams }) => {
  const { t } = useTranslation();
  const { jobTitle, location, experience } = searchParams;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const percentileData = [
    { name: t('salary_guide.chart.low'), value: data.percentile25 },
    { name: t('salary_guide.chart.median'), value: data.percentile50 },
    { name: t('salary_guide.chart.high'), value: data.percentile75 }
  ];

  // Hypothetical historical data (would be provided by API in a real app)
  const trendData = [
    { year: '2019', salary: data.percentile50 * 0.85 },
    { year: '2020', salary: data.percentile50 * 0.90 },
    { year: '2021', salary: data.percentile50 * 0.95 },
    { year: '2022', salary: data.percentile50 * 0.98 },
    { year: '2023', salary: data.percentile50 },
    { year: '2024', salary: data.percentile50 * 1.03 }
  ];

  // Industry comparison data (would be provided by API in a real app)
  const industryData = [
    { name: t('salary_guide.industries.finance'), value: data.percentile50 * 1.15 },
    { name: t('salary_guide.industries.technology'), value: data.percentile50 * 1.1 },
    { name: t('salary_guide.industries.healthcare'), value: data.percentile50 * 0.95 },
    { name: t('salary_guide.industries.education'), value: data.percentile50 * 0.8 },
    { name: t('salary_guide.industries.retail'), value: data.percentile50 * 0.75 }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="card glass"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-300 dark:text-gray-200">
              {jobTitle}
              {location && ` in ${location}`}
            </h2>
            {experience && (
              <p className="text-gray-400 dark:text-gray-400">
                {t('salary_guide.results.experience')} {experience} {t('salary_guide.results.years')}
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 flex items-center px-4 py-2 cursor-pointer dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-700  dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('salary_guide.results.export')}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-900/100 rounded-xl p-4">
            <div className="flex items-center text-primary-600 dark:text-primary-400 mb-2">
              <DollarSign className="w-5 h-5 mr-1 text-blue-400" />
              <span className="font-medium text-blue-400">{t('salary_guide.results.salary_range')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-300 dark:text-gray-200">
              {formatCurrency(data.min)} - {formatCurrency(data.max)}
            </p>
          </div>

          <div className="bg-cyan-900/100 rounded-xl p-4">
            <div className="flex items-center text-accent-600 dark:text-accent-400 mb-2">
              <BarChart2 className="w-5 h-5 mr-1 text-cyan-400" />
              <span className="font-medium text-cyan-400">{t('salary_guide.results.median_salary')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-300 dark:text-gray-200">
              {formatCurrency(data.percentile50)}
            </p>
          </div>

          <div className="bg-green-900/100  rounded-xl p-4">
            <div className="flex items-center text-success-600 dark:text-success-400 mb-2">
              <TrendingUp className="w-5 h-5 mr-1  text-green-400" />
              <span className="font-medium text-green-400">{t('salary_guide.results.growth_outlook')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-300 dark:text-gray-200">
              +3% {t('salary_guide.results.per_year')}
            </p>
          </div>
        </div>

        <div className="h-80 mb-30">
          <h3 className="font-bold text-gray-300 mb-10 text-2xl  ">{t('salary_guide.results.salary_distribution')}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={percentileData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis dataKey="name" type="category" />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), t('salary_guide.chart.salary')]}
                contentStyle={{
                  backgroundColor: 'rgba(150, 150, 150, 0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-60 mb-10">
            <h3 className="font-bold text-2xl text-gray-300 dark:text-gray-300 mb-4">{t('salary_guide.results.historical_trend')}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), t('salary_guide.chart.salary')]}
                  contentStyle={{
                    backgroundColor: 'rgba(150, 150, 150, 0.9)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="salary" fill="rgba(59, 130, 246, 0.2)" stroke="#3B82F6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="h-60 mb-10">
            <h3 className="font-bold text-2xl text-gray-300 dark:text-gray-300 mb-4">{t('salary_guide.results.industry_comparison')}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={industryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), t('salary_guide.chart.salary')]}
                  contentStyle={{
                    backgroundColor: 'rgba(150, 150, 150, 0.9)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="#0D9488" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        {t('salary_guide.results.data_updated')} {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SalaryResults;