export class JobSearch {
  id: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  jobTitle: string = '';
  location: string = '';
  email?: string;
  phone?: string;
  experience?: string;
  keywords: string[] = [];
  salary?: string;
  jobType?: string;

  static fromJSON(json: unknown): JobSearch {
    const jobSearch = new JobSearch();
    const data = json as Record<string, unknown>;
    
    jobSearch.id = data.id as string || '';
    jobSearch.createdAt = data.createdAt ? new Date(data.createdAt as string) : new Date();
    jobSearch.updatedAt = data.updatedAt ? new Date(data.updatedAt as string) : new Date();
    jobSearch.jobTitle = data.jobTitle as string || '';
    jobSearch.location = data.location as string || '';
    jobSearch.email = data.email as string;
    jobSearch.phone = data.phone as string;
    jobSearch.experience = data.experience as string;
    jobSearch.keywords = data.keywords as string[] || [];
    jobSearch.salary = data.salary as string;
    jobSearch.jobType = data.jobType as string;
    
    return jobSearch;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      jobTitle: this.jobTitle,
      location: this.location,
      email: this.email,
      phone: this.phone,
      experience: this.experience,
      keywords: this.keywords,
      salary: this.salary,
      jobType: this.jobType
    };
  }
}