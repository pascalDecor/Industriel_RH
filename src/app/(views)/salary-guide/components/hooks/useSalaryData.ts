import { useState } from 'react';
import { SalaryData } from '../types';

export const useSalaryData = () => {
  const [data, setData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalaryData = async (jobTitle: string, location: string, experience: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an actual API call
      // For this demo, we're simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock API response with AI-generated salary data
      const mockResponse = generateMockSalaryData(jobTitle, location, experience);
      setData(mockResponse);
    } catch (err) {
      setError('Failed to fetch salary data. Please try again.');
      console.error('Error fetching salary data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error, fetchSalaryData };
};

// This is a mock function to simulate AI-generated salary data
// In a real application, this would be replaced with an actual API call
function generateMockSalaryData(jobTitle: string, location: string, experience: string): SalaryData {
  // Base salary calculations based on job title
  let baseSalary = 70000; // Default base
  
  const techJobs = ['developer', 'engineer', 'programmer', 'software', 'data scientist', 'analyst'];
  const financeJobs = ['accountant', 'financial', 'finance', 'banker', 'investment'];
  const medicalJobs = ['doctor', 'nurse', 'physician', 'surgeon', 'medical'];
  
  const jobTitleLower = jobTitle.toLowerCase();
  
  if (techJobs.some(job => jobTitleLower.includes(job))) {
    baseSalary = 95000;
  } else if (financeJobs.some(job => jobTitleLower.includes(job))) {
    baseSalary = 85000;
  } else if (medicalJobs.some(job => jobTitleLower.includes(job))) {
    baseSalary = 120000;
  }
  
  // Adjust for experience
  let experienceMultiplier = 1.0;
  switch (experience) {
    case '0-1':
      experienceMultiplier = 0.7;
      break;
    case '1-3':
      experienceMultiplier = 0.85;
      break;
    case '3-5':
      experienceMultiplier = 1.0;
      break;
    case '5-10':
      experienceMultiplier = 1.3;
      break;
    case '10+':
      experienceMultiplier = 1.6;
      break;
    default:
      experienceMultiplier = 1.0;
  }
  
  // Adjust for location
  let locationMultiplier = 1.0;
  const locationLower = location.toLowerCase();
  
  const highCostCities = ['san francisco', 'new york', 'seattle', 'boston', 'los angeles'];
  const mediumCostCities = ['chicago', 'austin', 'dallas', 'denver', 'portland'];
  
  if (highCostCities.some(city => locationLower.includes(city))) {
    locationMultiplier = 1.3;
  } else if (mediumCostCities.some(city => locationLower.includes(city))) {
    locationMultiplier = 1.1;
  }
  
  // Calculate final salary
  const medianSalary = Math.round(baseSalary * experienceMultiplier * locationMultiplier);
  
  // Generate percentiles
  const percentile25 = Math.round(medianSalary * 0.85);
  const percentile75 = Math.round(medianSalary * 1.2);
  
  // Calculate range with some variation
  const min = Math.round(percentile25 * 0.9);
  const max = Math.round(percentile75 * 1.15);
  
  return {
    percentile25,
    percentile50: medianSalary,
    percentile75,
    min,
    max
  };
}