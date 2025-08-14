"use client";

import { useMultiRoleAuth } from './useMultiRoleAuth';
import { Permission, UserRole } from '@/types/auth';
import { getAvailableActions, canExportData, hasWriteAccess } from '@/lib/permissions/permission-helpers';
import { 
  hasPermissionMultiRole, 
  canAssignRole,
  getAssignableRolesMultiRole,
  getAllUserPermissions 
} from '@/lib/permissions/multi-role-helpers';

/**
 * Hook spécialisé pour la gestion des permissions avec système multi-rôles
 */
export function useMultiRolePermissions() {
  const { 
    user, 
    hasPermission, 
    hasAllPermissions, 
    hasAnyPermission,
    hasRole,
    hasAnyRole,
    hasAdminAccess,
    hasInternalAccess,
    canManageUsers,
    canApproveHires,
    primaryRole,
    activeRoles,
    highestRole,
    allPermissions,
    accessLevel,
    isActive,
    rolesSummary
  } = useMultiRoleAuth();

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
   * Récupère les actions disponibles pour un module (adapté multi-rôles)
   */
  const getModuleActions = (module: string) => {
    if (!user) return [];
    
    const actions: string[] = [];
    
    switch (module) {
      case 'applications':
        if (hasPermission(Permission.APPLICATIONS_READ)) actions.push('read');
        if (hasPermission(Permission.APPLICATIONS_CREATE)) actions.push('create');
        if (hasPermission(Permission.APPLICATIONS_UPDATE)) actions.push('update');
        if (hasPermission(Permission.APPLICATIONS_DELETE)) actions.push('delete');
        if (hasPermission(Permission.APPLICATIONS_ASSIGN)) actions.push('assign');
        if (hasPermission(Permission.APPLICATIONS_EXPORT)) actions.push('export');
        break;
        
      case 'hires':
        if (hasPermission(Permission.HIRES_READ)) actions.push('read');
        if (hasPermission(Permission.HIRES_CREATE)) actions.push('create');
        if (hasPermission(Permission.HIRES_UPDATE)) actions.push('update');
        if (hasPermission(Permission.HIRES_APPROVE)) actions.push('approve');
        if (hasPermission(Permission.HIRES_REJECT)) actions.push('reject');
        if (hasPermission(Permission.HIRES_EXPORT)) actions.push('export');
        break;
        
      case 'contacts':
        if (hasPermission(Permission.CONTACTS_READ)) actions.push('read');
        if (hasPermission(Permission.CONTACTS_UPDATE)) actions.push('update');
        if (hasPermission(Permission.CONTACTS_ASSIGN)) actions.push('assign');
        if (hasPermission(Permission.CONTACTS_EXPORT)) actions.push('export');
        if (hasPermission(Permission.CONTACTS_DELETE)) actions.push('delete');
        break;
        
      case 'roles':
        if (hasPermission(Permission.ROLES_ASSIGN)) actions.push('assign');
        if (hasPermission(Permission.ROLES_MANAGE)) actions.push('manage');
        break;
    }
    
    return actions;
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
    const exportPermissions = {
      applications: Permission.APPLICATIONS_EXPORT,
      hires: Permission.HIRES_EXPORT,
      contacts: Permission.CONTACTS_EXPORT
    };
    
    return hasPermission(exportPermissions[module]);
  };

  /**
   * Vérifie les permissions d'écriture pour un module
   */
  const canWrite = (module: 'applications' | 'hires' | 'contacts' | 'articles') => {
    const writePermissions = {
      applications: Permission.APPLICATIONS_UPDATE,
      hires: Permission.HIRES_UPDATE,
      contacts: Permission.CONTACTS_UPDATE,
      articles: Permission.ARTICLES_UPDATE
    };
    
    return hasPermission(writePermissions[module]);
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
      roles: [Permission.ROLES_ASSIGN, Permission.USERS_READ],
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
   * Vérifie si l'utilisateur peut assigner un rôle spécifique à quelqu'un
   */
  const canAssignSpecificRole = (roleToAssign: UserRole) => {
    return user ? canAssignRole(user, roleToAssign) : false;
  };

  /**
   * Récupère les rôles que l'utilisateur peut assigner
   */
  const getAssignableRoles = () => {
    return user ? getAssignableRolesMultiRole(user) : [];
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
      showRoleManagement: hasPermission(Permission.ROLES_ASSIGN),
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
      ]),
      showMultiRoleIndicators: activeRoles.length > 1,
      canSwitchPrimaryRole: activeRoles.length > 1 && hasPermission(Permission.ROLES_ASSIGN)
    };
  };

  /**
   * Récupère les informations détaillées des rôles pour l'affichage
   */
  const getDetailedRoleInfo = () => {
    if (!user || !rolesSummary) return null;

    return {
      ...rolesSummary,
      roleDetails: activeRoles.map(role => ({
        role,
        isPrimary: role === primaryRole,
        permissions: getAllUserPermissions(user).filter(p => 
          hasPermissionMultiRole({ ...user, userRoles: user.userRoles.filter(r => r.role === role) }, p)
        ).length
      })),
      canModifyRoles: hasPermission(Permission.ROLES_ASSIGN),
      assignableRoles: getAssignableRoles(),
      restrictions: getUIRestrictions()
    };
  };

  /**
   * Vérifie si l'utilisateur peut effectuer une action sur un autre utilisateur
   */
  const canActOnUser = (targetUserId: string, action: 'view' | 'edit' | 'delete' | 'assign_role') => {
    // Ne peut pas agir sur soi-même pour certaines actions
    if (user?.id === targetUserId && ['delete', 'assign_role'].includes(action)) {
      return false;
    }

    switch (action) {
      case 'view':
        return hasPermission(Permission.USERS_READ);
      case 'edit':
        return hasPermission(Permission.USERS_UPDATE);
      case 'delete':
        return hasPermission(Permission.USERS_DELETE);
      case 'assign_role':
        return hasPermission(Permission.ROLES_ASSIGN);
      default:
        return false;
    }
  };

  return {
    // États de base
    user,
    primaryRole,
    activeRoles,
    highestRole,
    allPermissions,
    accessLevel,
    isActive,
    rolesSummary,
    
    // Permissions générales
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    
    // Vérifications de rôles
    hasRole,
    hasAnyRole,
    
    // Accès spécialisés
    hasAdminAccess,
    hasInternalAccess,
    canManageUsers,
    canApproveHires,
    
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
    
    // Gestion des rôles
    canAssignSpecificRole,
    getAssignableRoles,
    canActOnUser,
    
    // Informations d'interface
    getUIRestrictions,
    getDetailedRoleInfo
  };
}