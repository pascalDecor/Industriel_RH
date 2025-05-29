import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SalaryForm from './SalaryForm';
import SalaryResults from './SalaryResults';
import { SearchIcon } from 'lucide-react';
import { useSalaryData } from './hooks/useSalaryData';
import { SalaryData } from './types';

const SalaryGuide: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    jobTitle: '',
    location: '',
    experience: '',
  });
  
  const { data, loading, error, fetchSalaryData } = useSalaryData();
  
  const handleSearch = async (jobTitle: string, location: string, experience: string) => {
    setSearchParams({ jobTitle, location, experience });
    await fetchSalaryData(jobTitle, location, experience);
  };
  
  return (
    <div className="max-w-4xl mx-auto ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card glass mb-8 bg-blue-950 rounded-2xl p-5"
      >
        <SalaryForm onSearch={handleSearch} loading={loading} />
      </motion.div>
      
      {loading && (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-error-50 border border-error-200 text-error-800 rounded-lg p-4 my-6"
        >
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please try again with a different search query.</p>
        </motion.div>
      )}
      
      {!loading && data && Object.keys(data).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card glass mb-8 bg-blue-950 rounded-2xl p-5"
        >
          <SalaryResults data={data} searchParams={searchParams} />
        </motion.div>
      )}
      
      {!loading && !data && !error && (
        <div className="text-center my-12 text-gray-500 dark:text-gray-400">
          <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl">Enter your job details to get started</p>
          <p className="mt-2">We'll analyze thousands of data points to provide you with accurate salary insights.</p>
        </div>
      )}
    </div>
  );
};

export default SalaryGuide;