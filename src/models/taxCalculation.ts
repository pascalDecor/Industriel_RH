export class TaxCalculation {
  id: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  province: string = '';
  annualSalary: number = 0;
  filingStatus: string = '';
  deductions: string[] = [];
  dependents: number = 0;
  federalTax: number = 0;
  provincialTax: number = 0;
  totalTax: number = 0;
  netSalary: number = 0;
  email?: string;

  static fromJSON(json: unknown): TaxCalculation {
    const calculation = new TaxCalculation();
    const data = json as Record<string, unknown>;
    
    calculation.id = data.id as string || '';
    calculation.createdAt = data.createdAt ? new Date(data.createdAt as string) : new Date();
    calculation.updatedAt = data.updatedAt ? new Date(data.updatedAt as string) : new Date();
    calculation.province = data.province as string || '';
    calculation.annualSalary = data.annualSalary as number || 0;
    calculation.filingStatus = data.filingStatus as string || '';
    calculation.deductions = data.deductions as string[] || [];
    calculation.dependents = data.dependents as number || 0;
    calculation.federalTax = data.federalTax as number || 0;
    calculation.provincialTax = data.provincialTax as number || 0;
    calculation.totalTax = data.totalTax as number || 0;
    calculation.netSalary = data.netSalary as number || 0;
    calculation.email = data.email as string;
    
    return calculation;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      province: this.province,
      annualSalary: this.annualSalary,
      filingStatus: this.filingStatus,
      deductions: this.deductions,
      dependents: this.dependents,
      federalTax: this.federalTax,
      provincialTax: this.provincialTax,
      totalTax: this.totalTax,
      netSalary: this.netSalary,
      email: this.email
    };
  }
}