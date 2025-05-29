export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export interface Province {
  code: string;
  name: string;
}

export interface TaxResults {
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
  deductions: Deduction[];
}

export interface ContributionLimits {
  rrsp: number;
  tfsa: number;
}

export interface Bonus {
  id: string;
  type: 'percentage' | 'hourly' | 'travel';
  amount: number;
  hours?: number;
  kilometers?: number;
}

export interface Deduction {
  id: string;
  name: string;
  type: 'percentage' | 'amount';
  amount: number;
  description?: string;
}