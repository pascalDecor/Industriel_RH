export class SalaryCalculation {
  id: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  jobTitle: string = '';
  industry: string = '';
  location: string = '';
  experience: number = 0;
  education?: string;
  skills: string[] = [];
  company?: string;
  salaryRange: string = '';
  email?: string;

  static fromJSON(json: unknown): SalaryCalculation {
    const calculation = new SalaryCalculation();
    const data = json as Record<string, unknown>;
    
    calculation.id = data.id as string || '';
    calculation.createdAt = data.createdAt ? new Date(data.createdAt as string) : new Date();
    calculation.updatedAt = data.updatedAt ? new Date(data.updatedAt as string) : new Date();
    calculation.jobTitle = data.jobTitle as string || '';
    calculation.industry = data.industry as string || '';
    calculation.location = data.location as string || '';
    calculation.experience = data.experience as number || 0;
    calculation.education = data.education as string;
    calculation.skills = data.skills as string[] || [];
    calculation.company = data.company as string;
    calculation.salaryRange = data.salaryRange as string || '';
    calculation.email = data.email as string;
    
    return calculation;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      jobTitle: this.jobTitle,
      industry: this.industry,
      location: this.location,
      experience: this.experience,
      education: this.education,
      skills: this.skills,
      company: this.company,
      salaryRange: this.salaryRange,
      email: this.email
    };
  }
}