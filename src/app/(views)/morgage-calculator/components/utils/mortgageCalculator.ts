interface MortgageResult {
  biWeekly: number;
  monthly: number;
  annual: number;
}

export const calculateMortgage = (
  purchasePrice: number,
  downPayment: number,
  interestRate: number,
  amortizationYears: number,
  paymentFrequency: string
): MortgageResult => {
  // Calculate principal loan amount
  const principal = purchasePrice - downPayment;
  
  // Convert annual interest rate to monthly
  const monthlyInterestRate = interestRate / 100 / 12;
  
  // Calculate total number of monthly payments
  const totalPayments = amortizationYears * 12;
  
  // Calculate monthly payment using the mortgage formula
  // M = P[r(1+r)^n]/[(1+r)^n-1]
  let monthlyPayment = 0;
  
  if (monthlyInterestRate === 0) {
    // If interest rate is 0, simple division
    monthlyPayment = principal / totalPayments;
  } else {
    // Standard formula
    monthlyPayment = principal * 
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
  }
  
  // Calculate other frequencies
  const biWeeklyPayment = (monthlyPayment * 12) / 26;
  const annualPayment = monthlyPayment * 12;
  
  // Return rounded payments
  return {
    biWeekly: Math.round(biWeeklyPayment),
    monthly: Math.round(monthlyPayment),
    annual: Math.round(annualPayment)
  };
};