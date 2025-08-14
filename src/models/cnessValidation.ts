export class CNESSTValidation {
  id: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  companyName: string = '';
  employeeNumber: string = '';
  incidentDate: Date = new Date();
  incidentType: string = '';
  description: string = '';
  severity: string = '';
  bodyPart: string = '';
  workLocation: string = '';
  validationStatus: string = '';
  claimNumber?: string;
  contactEmail?: string;

  static fromJSON(json: unknown): CNESSTValidation {
    const data = json as Record<string, unknown>;
    const validation = new CNESSTValidation();
    
    validation.id = data.id as string || '';
    validation.createdAt = data.createdAt ? new Date(data.createdAt as string) : new Date();
    validation.updatedAt = data.updatedAt ? new Date(data.updatedAt as string) : new Date();
    validation.companyName = data.companyName as string || '';
    validation.employeeNumber = data.employeeNumber as string || '';
    validation.incidentDate = data.incidentDate ? new Date(data.incidentDate as string) : new Date();
    validation.incidentType = data.incidentType as string || '';
    validation.description = data.description as string || '';
    validation.severity = data.severity as string || '';
    validation.bodyPart = data.bodyPart as string || '';
    validation.workLocation = data.workLocation as string || '';
    validation.validationStatus = data.validationStatus as string || '';
    validation.claimNumber = data.claimNumber as string | undefined;
    validation.contactEmail = data.contactEmail as string | undefined;
    
    return validation;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      companyName: this.companyName,
      employeeNumber: this.employeeNumber,
      incidentDate: this.incidentDate,
      incidentType: this.incidentType,
      description: this.description,
      severity: this.severity,
      bodyPart: this.bodyPart,
      workLocation: this.workLocation,
      validationStatus: this.validationStatus,
      claimNumber: this.claimNumber,
      contactEmail: this.contactEmail
    };
  }

}