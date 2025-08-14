"use client";

import { useAuth } from './useAuth';
import { Permission, UserRole } from '@/types/auth';
import { getAvailableActions, canExportData, hasWriteAccess } from '@/lib/permissions/permission-helpers';

/**
 * Hook spécialisé pour la gestion des permissions
 * Fournit des méthodes utilitaires pour vérifier les permissions dans les composants
 */
export function usePermissions() {
  const { 
    user, 
    hasPermission, 
    hasAllPermissions, 
    hasAnyPermission,
    hasAdminAccess,
    hasInternalAccess,
    canManageUsers,
    canApproveHires,
    canAccessAdvancedReports,
    userRole,
    accessLevel,
    isActive
  } = useAuth();

  /**
   * Vérifie les permissions pour un module spécifique
   */
  const checkModuleAccess = (module: 'applications' | 'hires' | 'contacts' | 'articles' | 'users' | 'system') => {
    const modulePermissions = {
      applications: [Permission.APPLICATIONS_READ],
      hires: [Permission.HIRES_READ],
      contacts: [Permission.CONTACTS_READ],
      articles: [Permission.ARTICLES_READ],
      users: [Permission.USERS_READ],
      system: [Permission.SYSTEM_CONFIG]
    };

    return hasAnyPermission(modulePermissions[module]);
  };

  /**
   * Récupère les actions disponibles pour un module
   */
  const getModuleActions = (module: string) => {
    return getAvailableActions(user, module);
  };

  /**
   * Vérifie si l'utilisateur peut effectuer une action spécifique
   */
  const canPerformAction = (action: string, module: string) => {
    const availableActions = getModuleActions(module);
    return availableActions.includes(action);
  };

  /**
   * Vérifie les permissions d'export pour un module
   */
  const canExport = (module: 'applications' | 'hires' | 'contacts') => {
    return canExportData(user, module);
  };

  /**
   * Vérifie les permissions d'écriture pour un module
   */
  const canWrite = (module: 'applications' | 'hires' | 'contacts' | 'articles') => {
    return hasWriteAccess(user, module);
  };

  /**
   * Vérifie si l'utilisateur peut voir une section de l'admin
   */
  const canAccessAdminSection = (section: string) => {
    const sectionRequirements = {
      dashboard: [Permission.APPLICATIONS_READ, Permission.HIRES_READ, Permission.CONTACTS_READ],
      applications: [Permission.APPLICATIONS_READ],
      hires: [Permission.HIRES_READ],
      contacts: [Permission.CONTACTS_READ],
      articles: [Permission.ARTICLES_READ],
      sectors: [Permission.SECTORS_MANAGE],
      users: [Permission.USERS_READ],
      analytics: [Permission.ANALYTICS_READ],
      reports: [Permission.REPORTS_BASIC],
      settings: [Permission.SYSTEM_CONFIG],
      development: [Permission.API_ACCESS]
    };

    const required = sectionRequirements[section as keyof typeof sectionRequirements];
    return required ? hasAnyPermission(required) : false;
  };

  /**
   * Vérifie si l'utilisateur peut assigner des tâches/candidatures
   */
  const canAssign = (type: 'applications' | 'contacts') => {
    const assignPermissions = {
      applications: Permission.APPLICATIONS_ASSIGN,
      contacts: Permission.CONTACTS_ASSIGN
    };

    return hasPermission(assignPermissions[type]);
  };

  /**
   * Vérifie si l'utilisateur peut publier du contenu
   */
  const canPublish = () => {
    return hasPermission(Permission.ARTICLES_PUBLISH);
  };

  /**
   * Vérifie si l'utilisateur peut gérer les secteurs/spécialités
   */
  const canManageContent = () => {
    return hasAnyPermission([Permission.SECTORS_MANAGE, Permission.SPECIALITIES_MANAGE]);
  };

  /**
   * Vérifie si l'utilisateur peut voir les données financières
   */
  const canAccessFinancials = () => {
    return hasAnyPermission([Permission.SALARY_CALCULATIONS, Permission.BUDGET_READ]);
  };

  /**
   * Détermine le niveau de restriction pour l'interface
   */
  const getUIRestrictions = () => {
    return {
      showAdvancedFeatures: accessLevel === 'admin' || accessLevel === 'super',
      showFinancialData: canAccessFinancials(),
      showSystemSettings: hasPermission(Permission.SYSTEM_CONFIG),
      showUserManagement: canManageUsers,
      showDevelopmentTools: hasInternalAccess,
      showExportButtons: hasAnyPermission([
        Permission.APPLICATIONS_EXPORT,
        Permission.HIRES_EXPORT,
        Permission.CONTACTS_EXPORT
      ]),
      showApprovalButtons: canApproveHires,
      showAssignmentControls: hasAnyPermission([
        Permission.APPLICATIONS_ASSIGN,
        Permission.CONTACTS_ASSIGN
      ])
    };
  };

  /**
   * Récupère les informations de rôle formatées pour l'affichage
   */
  const getRoleInfo = () => {
    if (!user) return null;

    return {
      role: userRole,
      level: accessLevel,
      isActive,
      canEscalate: userRole !== UserRole.SUPER_ADMIN,
      restrictions: getUIRestrictions()
    };
  };

  return {
    // États de base
    user,
    userRole,
    accessLevel,
    isActive,
    
    // Permissions générales
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    
    // Accès spécialisés
    hasAdminAccess,
    hasInternalAccess,
    canManageUsers,
    canApproveHires,
    canAccessAdvancedReports,
    
    // Permissions par module
    checkModuleAccess,
    getModuleActions,
    canPerformAction,
    canExport,
    canWrite,
    canAccessAdminSection,
    
    // Actions spécifiques
    canAssign,
    canPublish,
    canManageContent,
    canAccessFinancials,
    
    // Informations d'interface
    getUIRestrictions,
    getRoleInfo
  };
}