export class MortgageCalculation {
  id: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  propertyValue: number = 0;
  downPayment: number = 0;
  interestRate: number = 0;
  loanTerm: number = 0;
  monthlyPayment: number = 0;
  totalInterest: number = 0;
  totalPayment: number = 0;
  propertyTax: number = 0;
  insurance: number = 0;
  email?: string;

  static fromJSON(json: unknown): MortgageCalculation {
    const calculation = new MortgageCalculation();
    const data = json as Record<string, unknown>;
    
    calculation.id = data.id as string || '';
    calculation.createdAt = data.createdAt ? new Date(data.createdAt as string) : new Date();
    calculation.updatedAt = data.updatedAt ? new Date(data.updatedAt as string) : new Date();
    calculation.propertyValue = data.propertyValue as number || 0;
    calculation.downPayment = data.downPayment as number || 0;
    calculation.interestRate = data.interestRate as number || 0;
    calculation.loanTerm = data.loanTerm as number || 0;
    calculation.monthlyPayment = data.monthlyPayment as number || 0;
    calculation.totalInterest = data.totalInterest as number || 0;
    calculation.totalPayment = data.totalPayment as number || 0;
    calculation.propertyTax = data.propertyTax as number || 0;
    calculation.insurance = data.insurance as number || 0;
    calculation.email = data.email as string;
    
    return calculation;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      propertyValue: this.propertyValue,
      downPayment: this.downPayment,
      interestRate: this.interestRate,
      loanTerm: this.loanTerm,
      monthlyPayment: this.monthlyPayment,
      totalInterest: this.totalInterest,
      totalPayment: this.totalPayment,
      propertyTax: this.propertyTax,
      insurance: this.insurance,
      email: this.email
    };
  }
}