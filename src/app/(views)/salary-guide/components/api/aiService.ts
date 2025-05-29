import { SalaryData } from '../types';

/**
 * In a real implementation, this would connect to an actual AI API.
 * For demonstration purposes, we're simulating AI responses.
 * 
 * To implement with a real AI API:
 * 1. Register for a free API key (OpenAI, HuggingFace, etc.)
 * 2. Update this service to make actual API calls
 * 3. Parse the responses and return structured data
 */

export async function getSalaryPrediction(
  jobTitle: string,
  location: string,
  experience: string
): Promise<SalaryData> {
  // This would be replaced with an actual API call
  // const response = await fetch('https://api.example.com/ai/salary-prediction', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${API_KEY}`
  //   },
  //   body: JSON.stringify({ jobTitle, location, experience })
  // });
  
  // if (!response.ok) {
  //   throw new Error('Failed to fetch salary prediction');
  // }
  
  // return await response.json();
  
  // For this demo, we'll simulate an API response with our mock function
  return simulateAIPrediction(jobTitle, location, experience);
}

// This simulation function would be replaced with real API calls
function simulateAIPrediction(
  jobTitle: string,
  location: string,
  experience: string
): SalaryData {
  // Base salary calculations based on job title
  let baseSalary = 70000; // Default base
  
  const techJobs = ['developer', 'engineer', 'programmer', 'software', 'data scientist', 'analyst'];
  const financeJobs = ['accountant', 'financial', 'finance', 'banker', 'investment'];
  const medicalJobs = ['doctor', 'nurse', 'physician', 'surgeon', 'medical'];
  const creativeProfessions = ['designer', 'artist', 'writer', 'editor', 'producer', 'director'];
  
  const jobTitleLower = jobTitle.toLowerCase();
  
  if (techJobs.some(job => jobTitleLower.includes(job))) {
    baseSalary = 95000;
  } else if (financeJobs.some(job => jobTitleLower.includes(job))) {
    baseSalary = 85000;
  } else if (medicalJobs.some(job => jobTitleLower.includes(job))) {
    baseSalary = 120000;
  } else if (creativeProfessions.some(job => jobTitleLower.includes(job))) {
    baseSalary = 65000;
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
  const lowCostCities = ['nashville', 'phoenix', 'buffalo', 'cleveland', 'detroit'];
  
  if (highCostCities.some(city => locationLower.includes(city))) {
    locationMultiplier = 1.3;
  } else if (mediumCostCities.some(city => locationLower.includes(city))) {
    locationMultiplier = 1.1;
  } else if (lowCostCities.some(city => locationLower.includes(city))) {
    locationMultiplier = 0.9;
  }
  
  // Calculate final salary
  const medianSalary = Math.round(baseSalary * experienceMultiplier * locationMultiplier);
  
  // Generate percentiles with some randomness to make it feel more realistic
  const randomFactor = Math.random() * 0.1 + 0.95; // Random factor between 0.95 and 1.05
  const percentile25 = Math.round(medianSalary * 0.85 * randomFactor);
  const percentile75 = Math.round(medianSalary * 1.2 * randomFactor);
  
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