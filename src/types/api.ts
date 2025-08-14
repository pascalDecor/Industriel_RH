// Types pour l'API Industrielle RH
// Généré automatiquement depuis la spécification OpenAPI

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}

// Enums
export enum ContactStatus {
  NOUVEAU = 'nouveau',
  EN_COURS = 'en_cours',
  TRAITE = 'traite',
  FERME = 'ferme'
}

export enum ContactPriority {
  BASSE = 'basse',
  MOYENNE = 'moyenne',
  HAUTE = 'haute',
  URGENTE = 'urgente'
}

export enum ApplicationState {
  NOUVEAU = 'nouveau',
  EN_COURS = 'en_cours',
  ACCEPTE = 'accepte',
  REFUSE = 'refuse'
}

export enum HireState {
  NOUVEAU = 'nouveau',
  EN_COURS = 'en_cours',
  TRAITE = 'traite',
  FERME = 'ferme'
}

// Interfaces de base
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Contact
export interface Contact extends BaseEntity {
  firstName: string;
  lastName: string;
  companyName?: string;
  jobTitle?: string;
  workEmail: string;
  workPhone: string;
  postalCode?: string;
  message: string;
  status: ContactStatus;
  priority: ContactPriority;
}

export interface ContactCreate {
  firstName: string;
  lastName: string;
  companyName?: string;
  jobTitle?: string;
  workEmail: string;
  workPhone: string;
  postalCode?: string;
  message: string;
  status?: ContactStatus;
  priority?: ContactPriority;
}

export interface ContactUpdate {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  jobTitle?: string;
  workEmail?: string;
  workPhone?: string;
  postalCode?: string;
  message?: string;
  status?: ContactStatus;
  priority?: ContactPriority;
}

// Référentiels
export interface Sector extends BaseEntity {
  libelle: string;
  description?: string;
  alternativeDescriptions?: string[];
  functions?: Function[];
  _count?: {
    functions: number;
  };
}

export interface Function extends BaseEntity {
  libelle: string;
  sectorId: string;
}

export interface City extends BaseEntity {
  libelle: string;
}

export interface Civility extends BaseEntity {
  libelle: string;
}

// Application
export interface Application extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adresse: string;
  year_of_experience: number;
  cv: string;
  coverLetter?: string;
  state: ApplicationState;
  sectorId: string;
  functionId: string;
  civilityId: string;
  cityId: string;
  sector?: Sector;
  function?: Function;
  civility?: Civility;
  city?: City;
}

export interface ApplicationCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adresse: string;
  year_of_experience: number;
  cv: string;
  coverLetter?: string;
  state?: ApplicationState;
  sectorId: string;
  functionId: string;
  civilityId: string;
  cityId: string;
}

// Hire
export interface Hire extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  number_of_positions: number;
  document_support?: string;
  details_of_positions: object[];
  company_name: string;
  company_website?: string;
  state: HireState;
  civilityId: string;
  civility?: Civility;
  sectors: Sector[];
}

export interface HireCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  number_of_positions: number;
  document_support?: string;
  details_of_positions: object;
  company_name: string;
  company_website?: string;
  state?: HireState;
  civilityId: string;
}

// Calculs salariaux
export interface SalaryCalculation extends BaseEntity {
  jobTitle: string;
  industry: string;
  location: string;
  experience: number;
  education?: string;
  skills: string[];
  company?: string;
  salaryRange: string;
  email?: string;
}

export interface SalaryCalculationCreate {
  jobTitle: string;
  industry: string;
  location: string;
  experience: number;
  education?: string;
  skills?: string[];
  company?: string;
  salaryRange: string;
  email?: string;
}

export interface SalaryCalculationResponse {
  success: boolean;
  message: string;
  data?: SalaryCalculation;
  errors?: object[];
}

// Calculs d'impôts
export interface TaxCalculation extends BaseEntity {
  // Définir selon les besoins spécifiques
}

export interface TaxCalculationCreate {
  annualSalary: number;
  province: string;
  deductions?: number;
}

// Calculs hypothécaires
export interface MortgageCalculationCreate {
  propertyValue: number;
  downPayment: number;
  interestRate: number;
  amortizationPeriod: number;
}

// Upload
export interface UploadResponse {
  url: string;
  filename: string;
}

// Paramètres de requête communs
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ContactQueryParams extends PaginationParams {
  status?: ContactStatus;
  priority?: ContactPriority;
}

export interface ApplicationQueryParams extends PaginationParams {
  sectorId?: string;
  functionId?: string;
  civilityId?: string;
  cityId?: string;
  state?: ApplicationState;
}

export interface HireQueryParams extends PaginationParams {
  civilityId?: string;
  state?: HireState;
  number_of_positions?: number;
}

export interface SalaryCalculationQueryParams extends PaginationParams {
  industry?: string;
  location?: string;
}