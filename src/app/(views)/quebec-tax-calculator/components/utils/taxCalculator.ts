import { TaxBracket, TaxResults } from '../types';
import { federalBrackets, provincialBrackets, cppEiRates } from '../data/taxData';

/**
 * Calculate taxes based on province, tax year, and income
 */
export function calculateTaxes(province: string, year: string, income: number): TaxResults {
  // Get the appropriate tax brackets for the selected year
  const federalTaxBrackets = federalBrackets[year] || federalBrackets['2023'];
  const provincialTaxBrackets = (provincialBrackets[year] && provincialBrackets[year][province]) || 
                               (provincialBrackets['2023'] && provincialBrackets['2023'][province]);
  
  // Calculate federal tax
  const federalTax = calculateTaxForBrackets(income, federalTaxBrackets);
  
  // Calculate provincial tax
  const provincialTax = calculateTaxForBrackets(income, provincialTaxBrackets);
  
  // Calculate CPP and EI
  const { cpp, ei } = calculateCppAndEi(income, year);
  
  // Calculate total tax and net income
  const totalTax = federalTax + provincialTax;
  const totalDeductions = totalTax + cpp + ei;
  const netIncome = income - totalDeductions;
  
  // Calculate tax rates
  const effectiveTaxRate = totalTax / income;
  const federalTaxRate = federalTax / income;
  const provincialTaxRate = provincialTax / income;
  
  return {
    netIncome,
    totalTax,
    federalTax,
    provincialTax,
    cpp,
    ei,
    effectiveTaxRate,
    federalTaxRate,
    provincialTaxRate
  };
}

/**
 * Calculate tax for a specific set of tax brackets
 */
function calculateTaxForBrackets(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  
  for (let i = 0; i < brackets.length; i++) {
    const { min, max, rate } = brackets[i];
    
    if (income > min) {
      // For the last bracket or if income is less than the max of this bracket
      const taxableInThisBracket = Math.min(income, max) - min;
      tax += taxableInThisBracket * rate;
    }
    
    // If income is less than the max of this bracket, we're done
    if (income <= max) {
      break;
    }
  }
  
  return Math.round(tax);
}

/**
 * Calculate CPP and EI contributions
 */
function calculateCppAndEi(income: number, year: string): { cpp: number; ei: number } {
  const rates = cppEiRates[year] || cppEiRates['2023'];
  
  // Calculate CPP contribution (with basic exemption of $3,500)
  const cppContribution = Math.min(
    (income - 3500) * rates.cppRate,
    rates.cppMax
  );
  
  // Calculate EI premium
  const eiPremium = Math.min(
    income * rates.eiRate,
    rates.eiMax
  );
  
  return {
    cpp: Math.max(0, Math.round(cppContribution)),
    ei: Math.round(eiPremium)
  };
}