"use client";

// Énumération des rôles hiérarchiques
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

// Énumération des permissions granulaires
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

// Interface pour une assignation de rôle
export interface UserRoleAssignment {
  id: string;
  userId: string;
  role: UserRole;
  isPrimary: boolean;
  assignedAt: Date;
  assignedBy?: string;
  isActive: boolean;
  expiresAt?: Date;
}

// Interface pour les données utilisateur avec multi-rôles
export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  userRoles: UserRoleAssignment[];
  permissions?: Permission[];
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface pour compatibilité avec le système legacy (à supprimer progressivement)
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

// Interface pour les propriétés utilisateur étendues
export interface ExtendedUserProps {
  id: string;
  name: string;
  email: string;
  userRoles: UserRoleAssignment[];
  isActive: boolean;
  avatarUrl?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
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

// Labels français pour les rôles
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Administrateur',
  [UserRole.HR_DIRECTOR]: 'Directeur RH',
  [UserRole.HR_MANAGER]: 'Manager RH',
  [UserRole.IT_ENGINEER]: 'Ingénieur IT',
  [UserRole.RECRUITER_SENIOR]: 'Recruteur Senior',
  [UserRole.RECRUITER]: 'Recruteur',
  [UserRole.HR_ASSISTANT]: 'Assistant RH',
  [UserRole.CONSULTANT]: 'Consultant'
};

// Labels français pour les permissions
export const PERMISSION_LABELS: Record<Permission, string> = {
  // Candidatures
  [Permission.APPLICATIONS_CREATE]: 'Créer des candidatures',
  [Permission.APPLICATIONS_READ]: 'Consulter les candidatures',
  [Permission.APPLICATIONS_UPDATE]: 'Modifier les candidatures',
  [Permission.APPLICATIONS_DELETE]: 'Supprimer les candidatures',
  [Permission.APPLICATIONS_ASSIGN]: 'Assigner un recruteur',
  [Permission.APPLICATIONS_EXPORT]: 'Exporter les candidatures',

  // Embauches
  [Permission.HIRES_CREATE]: 'Créer des demandes d\'embauche',
  [Permission.HIRES_READ]: 'Consulter les embauches',
  [Permission.HIRES_UPDATE]: 'Modifier les embauches',
  [Permission.HIRES_APPROVE]: 'Approuver les embauches',
  [Permission.HIRES_REJECT]: 'Rejeter les embauches',
  [Permission.HIRES_EXPORT]: 'Exporter les embauches',

  // Contacts
  [Permission.CONTACTS_READ]: 'Consulter les contacts',
  [Permission.CONTACTS_UPDATE]: 'Modifier les contacts',
  [Permission.CONTACTS_ASSIGN]: 'Assigner les contacts',
  [Permission.CONTACTS_EXPORT]: 'Exporter les contacts',
  [Permission.CONTACTS_DELETE]: 'Supprimer les contacts',

  // Newsletters
  [Permission.NEWSLETTERS_CREATE]: 'Créer des newsletters',
  [Permission.NEWSLETTERS_READ]: 'Consulter les newsletters',
  [Permission.NEWSLETTERS_UPDATE]: 'Modifier les newsletters',
  [Permission.NEWSLETTERS_DELETE]: 'Supprimer les newsletters',
  [Permission.NEWSLETTERS_EXPORT]: 'Exporter les newsletters',
  [Permission.NEWSLETTERS_SEND]: 'Envoyer les newsletters',

  // Articles
  [Permission.ARTICLES_CREATE]: 'Créer des articles',
  [Permission.ARTICLES_READ]: 'Consulter les articles',
  [Permission.ARTICLES_UPDATE]: 'Modifier les articles',
  [Permission.ARTICLES_DELETE]: 'Supprimer les articles',
  [Permission.ARTICLES_PUBLISH]: 'Publier les articles',
  [Permission.SECTORS_MANAGE]: 'Gérer les secteurs',
  [Permission.SPECIALITIES_MANAGE]: 'Gérer les spécialités',

  // Utilisateurs
  [Permission.USERS_CREATE]: 'Créer des utilisateurs',
  [Permission.USERS_READ]: 'Consulter les utilisateurs',
  [Permission.USERS_UPDATE]: 'Modifier les utilisateurs',
  [Permission.USERS_DELETE]: 'Supprimer les utilisateurs',
  [Permission.ROLES_ASSIGN]: 'Assigner des rôles',
  [Permission.ROLES_MANAGE]: 'Gérer les rôles',

  // Système
  [Permission.SYSTEM_CONFIG]: 'Configuration système',
  [Permission.SYSTEM_LOGS]: 'Consulter les logs',
  [Permission.REPORTS_BASIC]: 'Rapports de base',
  [Permission.REPORTS_ADVANCED]: 'Rapports avancés',
  [Permission.ANALYTICS_READ]: 'Consulter les analytics',

  // API
  [Permission.API_ACCESS]: 'Accès API',
  [Permission.DEV_TOOLS]: 'Outils de développement',
  [Permission.DATABASE_ACCESS]: 'Accès base de données',

  // Financier
  [Permission.SALARY_CALCULATIONS]: 'Calculs salariaux',
  [Permission.BUDGET_READ]: 'Consulter le budget',
  [Permission.BUDGET_MANAGE]: 'Gérer le budget'
};

// Catégories de permissions pour l'organisation
export const PERMISSION_CATEGORIES = {
  APPLICATIONS: 'Candidatures',
  HIRES: 'Embauches', 
  CONTACTS: 'Contacts',
  CONTENT: 'Contenu',
  USERS: 'Utilisateurs',
  SYSTEM: 'Système',
  API: 'API & Développement',
  FINANCE: 'Finance'
} as const;

export type PermissionCategory = typeof PERMISSION_CATEGORIES[keyof typeof PERMISSION_CATEGORIES];