import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import InputField from '../../morgage-calculator/components/InputField';
import SelectField from '../../morgage-calculator/components/SelectField';
import Button from '@/components/ui/button';
import { useTranslation } from '@/contexts/LanguageContext';

interface SalaryFormProps {
  onSearch: (jobTitle: string, location: string, experience: string) => void;
  loading: boolean;
}

const SalaryForm: React.FC<SalaryFormProps> = ({ onSearch, loading }) => {
  const { t } = useTranslation();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobTitle.trim()) {
      onSearch(jobTitle, location, experience);
    }
  };

  const handleClear = () => {
    setJobTitle('');
    setLocation('');
    setExperience('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 dark:text-gray-300">
            {t('salary_guide.form.job_title')} *
          </label>
          <InputField
            type="text"
            id="jobTitle"
            label=""
            className={jobTitle === '' ? '' : '!bg-gray-100 !text-gray-500'}
            value={jobTitle}
            onChange={(e) => setJobTitle(e)}
            // className="form-input"
            placeholder={t('salary_guide.form.job_title_placeholder')}
          // required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-300 dark:text-gray-300">
            {t('salary_guide.form.location')}
          </label>
          <InputField
            type="text"
            id="location"
            label=""
            className={location === '' ? '' : '!bg-gray-100 !text-gray-500'}
            value={location}
            onChange={(e) => setLocation(e)}
            // className="form-input"
            placeholder={t('salary_guide.form.location_placeholder')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-300 dark:text-gray-300">
            {t('salary_guide.form.experience')}
          </label>
          <SelectField
            id="experience"
            label=""
            className={experience === '' ? '!text-gray-700' : '!bg-gray-100 !text-gray-500'}
            value={experience}
            onChange={(e) => setExperience(e)}
            // className="form-input"
            options={[
              { value: '0-1', label: t('salary_guide.form.experience_0_1') },
              { value: '1-3', label: t('salary_guide.form.experience_1_3') },
              { value: '3-5', label: t('salary_guide.form.experience_3_5') },
              { value: '5-10', label: t('salary_guide.form.experience_5_10') },
              { value: '10+', label: t('salary_guide.form.experience_10_plus') },
            ]}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="submit"
          className="button-primary flex items-center"
          disabled={loading}
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? t('salary_guide.form.analyzing') : t('salary_guide.form.search_salary')}
        </Button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="px-4 py-2 text-gray-500 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          onClick={handleClear}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </form>
  );
};

export default SalaryForm;