// Énumération des rôles hiérarchiques (version serveur)
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HR_DIRECTOR = 'HR_DIRECTOR', 
  HR_MANAGER = 'HR_MANAGER',
  IT_ENGINEER = 'IT_ENGINEER',
  RECRUITER_SENIOR = 'RECRUITER_SENIOR',
  RECRUITER = 'RECRUITER',
  HR_ASSISTANT = 'HR_ASSISTANT',
  CONSULTANT = 'CONSULTANT'
}

// Énumération des permissions granulaires (version serveur)
export enum Permission {
  // Candidatures
  APPLICATIONS_CREATE = 'applications.create',
  APPLICATIONS_READ = 'applications.read',
  APPLICATIONS_UPDATE = 'applications.update',
  APPLICATIONS_DELETE = 'applications.delete',
  APPLICATIONS_ASSIGN = 'applications.assign',
  APPLICATIONS_EXPORT = 'applications.export',

  // Embauches
  HIRES_CREATE = 'hires.create',
  HIRES_READ = 'hires.read',
  HIRES_UPDATE = 'hires.update',
  HIRES_APPROVE = 'hires.approve',
  HIRES_REJECT = 'hires.reject',
  HIRES_EXPORT = 'hires.export',

  // Contacts/Prospects
  CONTACTS_READ = 'contacts.read',
  CONTACTS_UPDATE = 'contacts.update',
  CONTACTS_ASSIGN = 'contacts.assign',
  CONTACTS_EXPORT = 'contacts.export',
  CONTACTS_DELETE = 'contacts.delete',

  // Gestion contenus
  ARTICLES_CREATE = 'articles.create',
  ARTICLES_READ = 'articles.read',
  ARTICLES_UPDATE = 'articles.update',
  ARTICLES_DELETE = 'articles.delete',
  ARTICLES_PUBLISH = 'articles.publish',
  SECTORS_MANAGE = 'sectors.manage',
  SPECIALITIES_MANAGE = 'specialities.manage',

  // Newsletters
  NEWSLETTERS_CREATE = 'newsletters.create',
  NEWSLETTERS_READ = 'newsletters.read',
  NEWSLETTERS_UPDATE = 'newsletters.update',
  NEWSLETTERS_DELETE = 'newsletters.delete',
  NEWSLETTERS_EXPORT = 'newsletters.export',
  NEWSLETTERS_SEND = 'newsletters.send',

  // Utilisateurs et rôles
  USERS_CREATE = 'users.create',
  USERS_READ = 'users.read',
  USERS_UPDATE = 'users.update',
  USERS_DELETE = 'users.delete',
  ROLES_ASSIGN = 'roles.assign',
  ROLES_MANAGE = 'roles.manage',

  // Administration système
  SYSTEM_CONFIG = 'system.config',
  SYSTEM_LOGS = 'system.logs',
  REPORTS_BASIC = 'reports.basic',
  REPORTS_ADVANCED = 'reports.advanced',
  ANALYTICS_READ = 'analytics.read',

  // API et développement
  API_ACCESS = 'api.access',
  DEV_TOOLS = 'dev.tools',
  DATABASE_ACCESS = 'database.access',

  // Financier
  SALARY_CALCULATIONS = 'salary.calculations',
  BUDGET_READ = 'budget.read',
  BUDGET_MANAGE = 'budget.manage'
}

// Interface pour compatibilité avec le système legacy (version serveur)
export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: Permission[];
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Hiérarchie des rôles (pour les permissions héritées)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 7,
  [UserRole.HR_DIRECTOR]: 6,
  [UserRole.HR_MANAGER]: 5,
  [UserRole.IT_ENGINEER]: 4,
  [UserRole.RECRUITER_SENIOR]: 4,
  [UserRole.RECRUITER]: 3,
  [UserRole.HR_ASSISTANT]: 2,
  [UserRole.CONSULTANT]: 1
};