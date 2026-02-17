import { UserRole, Permission } from '@/types/server-auth';

// Matrice complète des permissions par rôle (version serveur)
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Accès complet - toutes les permissions
    ...Object.values(Permission)
  ],

  [UserRole.HR_DIRECTOR]: [
    // Direction RH - Vue stratégique et approbations
    Permission.APPLICATIONS_READ,
    Permission.APPLICATIONS_EXPORT,
    Permission.APPLICATIONS_ASSIGN,
    
    Permission.HIRES_READ,
    Permission.HIRES_APPROVE,
    Permission.HIRES_REJECT,
    Permission.HIRES_EXPORT,
    
    Permission.CONTACTS_READ,
    Permission.CONTACTS_EXPORT,
    Permission.CONTACTS_ASSIGN,
    
    Permission.ARTICLES_READ,
    Permission.ARTICLES_PUBLISH,
    Permission.SECTORS_MANAGE,
    Permission.SPECIALITIES_MANAGE,
    
    Permission.USERS_READ,
    Permission.ROLES_ASSIGN,
    
    Permission.REPORTS_ADVANCED,
    Permission.ANALYTICS_READ,
    Permission.BUDGET_READ,
    Permission.BUDGET_MANAGE,
    
    Permission.SALARY_CALCULATIONS
  ],

  [UserRole.IT_ENGINEER]: [
    // Ingénieur IT - Accès API, documentation, support technique
    Permission.API_ACCESS,
    Permission.ARTICLES_READ,
    Permission.USERS_READ,
    Permission.REPORTS_BASIC,
    Permission.ANALYTICS_READ
  ],

  [UserRole.HR_MANAGER]: [
    // Management RH - Gestion équipes et supervision
    Permission.APPLICATIONS_CREATE,
    Permission.APPLICATIONS_READ,
    Permission.APPLICATIONS_UPDATE,
    Permission.APPLICATIONS_ASSIGN,
    Permission.APPLICATIONS_EXPORT,
    
    Permission.HIRES_CREATE,
    Permission.HIRES_READ,
    Permission.HIRES_UPDATE,
    Permission.HIRES_EXPORT,
    
    Permission.CONTACTS_READ,
    Permission.CONTACTS_UPDATE,
    Permission.CONTACTS_ASSIGN,
    Permission.CONTACTS_EXPORT,
    
    Permission.ARTICLES_CREATE,
    Permission.ARTICLES_READ,
    Permission.ARTICLES_UPDATE,
    Permission.ARTICLES_PUBLISH,
    Permission.SECTORS_MANAGE,
    Permission.SPECIALITIES_MANAGE,
    
    Permission.USERS_READ,
    Permission.USERS_UPDATE,
    
    Permission.REPORTS_ADVANCED,
    Permission.ANALYTICS_READ,
    Permission.SALARY_CALCULATIONS,
    Permission.BUDGET_READ
  ],

  [UserRole.RECRUITER_SENIOR]: [
    // Recrutement senior - Mentorat et validation
    Permission.APPLICATIONS_CREATE,
    Permission.APPLICATIONS_READ,
    Permission.APPLICATIONS_UPDATE,
    Permission.APPLICATIONS_DELETE,
    Permission.APPLICATIONS_ASSIGN,
    Permission.APPLICATIONS_EXPORT,
    
    Permission.HIRES_CREATE,
    Permission.HIRES_READ,
    Permission.HIRES_UPDATE,
    
    Permission.CONTACTS_READ,
    Permission.CONTACTS_UPDATE,
    Permission.CONTACTS_ASSIGN,
    
    Permission.ARTICLES_CREATE,
    Permission.ARTICLES_READ,
    Permission.ARTICLES_UPDATE,
    
    Permission.USERS_READ,
    
    Permission.REPORTS_BASIC,
    Permission.ANALYTICS_READ
  ],

  [UserRole.RECRUITER]: [
    // Recrutement standard
    Permission.APPLICATIONS_CREATE,
    Permission.APPLICATIONS_READ,
    Permission.APPLICATIONS_UPDATE,
    
    Permission.HIRES_CREATE,
    Permission.HIRES_READ,
    Permission.HIRES_UPDATE,
    
    Permission.CONTACTS_READ,
    Permission.CONTACTS_UPDATE,
    
    Permission.ARTICLES_READ,
    
    Permission.REPORTS_BASIC
  ],

  [UserRole.HR_ASSISTANT]: [
    // Support administratif
    Permission.APPLICATIONS_CREATE,
    Permission.APPLICATIONS_READ,
    Permission.APPLICATIONS_UPDATE,
    
    Permission.HIRES_READ,
    Permission.HIRES_UPDATE,
    
    Permission.CONTACTS_READ,
    Permission.CONTACTS_UPDATE,
    
    Permission.ARTICLES_READ
  ],

  [UserRole.CONSULTANT]: [
    // Accès lecture seule limité
    Permission.APPLICATIONS_READ,
    Permission.HIRES_READ,
    Permission.CONTACTS_READ,
    Permission.ARTICLES_READ,
    Permission.REPORTS_BASIC
  ]
};

// Permissions spéciales héritées automatiquement selon la hiérarchie
export const INHERITED_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    Permission.API_ACCESS,
    Permission.DEV_TOOLS,
    Permission.DATABASE_ACCESS,
    Permission.SYSTEM_CONFIG,
    Permission.SYSTEM_LOGS
  ],
  
  [UserRole.HR_DIRECTOR]: [
    Permission.API_ACCESS // Pour accès documentation
  ],
  
  [UserRole.HR_MANAGER]: [],
  [UserRole.IT_ENGINEER]: [
    Permission.API_ACCESS
  ],
  [UserRole.RECRUITER_SENIOR]: [],
  [UserRole.RECRUITER]: [],
  [UserRole.HR_ASSISTANT]: [],
  [UserRole.CONSULTANT]: []
};