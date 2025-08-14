"use client";

import { UserWithRoles, UserRoleAssignment, UserRole, Permission } from '@/types/auth';
import { ROLE_PERMISSIONS, INHERITED_PERMISSIONS } from './role-permissions';
import { ROLE_HIERARCHY } from '@/types/auth';

/**
 * Récupère le rôle principal d'un utilisateur
 */
export function getPrimaryRole(user: UserWithRoles): UserRole | null {
  const primaryRole = user.userRoles.find(r => r.isPrimary && r.isActive);
  return primaryRole ? primaryRole.role : null;
}

/**
 * Récupère tous les rôles actifs d'un utilisateur
 */
export function getActiveRoles(user: UserWithRoles): UserRole[] {
  return user.userRoles
    .filter(r => r.isActive && (!r.expiresAt || r.expiresAt > new Date()))
    .map(r => r.role);
}

/**
 * Récupère le rôle le plus élevé dans la hiérarchie
 */
export function getHighestRole(user: UserWithRoles): UserRole | null {
  const activeRoles = getActiveRoles(user);
  if (activeRoles.length === 0) return null;

  return activeRoles.reduce((highest, current) => {
    return ROLE_HIERARCHY[current] > ROLE_HIERARCHY[highest] ? current : highest;
  });
}

/**
 * Récupère toutes les permissions cumulées d'un utilisateur
 */
export function getAllUserPermissions(user: UserWithRoles): Permission[] {
  const activeRoles = getActiveRoles(user);
  const allPermissions = new Set<Permission>();

  // Ajouter les permissions de chaque rôle actif
  activeRoles.forEach(role => {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    const inheritedPermissions = INHERITED_PERMISSIONS[role] || [];
    
    [...rolePermissions, ...inheritedPermissions].forEach(permission => {
      allPermissions.add(permission);
    });
  });

  return Array.from(allPermissions);
}

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export function hasPermissionMultiRole(user: UserWithRoles | null, permission: Permission): boolean {
  if (!user || !user.isActive) return false;
  
  const userPermissions = getAllUserPermissions(user);
  return userPermissions.includes(permission);
}

/**
 * Vérifie si un utilisateur a toutes les permissions spécifiées
 */
export function hasAllPermissionsMultiRole(user: UserWithRoles | null, permissions: Permission[]): boolean {
  if (!user || !user.isActive) return false;
  
  return permissions.every(permission => hasPermissionMultiRole(user, permission));
}

/**
 * Vérifie si un utilisateur a au moins une des permissions spécifiées
 */
export function hasAnyPermissionMultiRole(user: UserWithRoles | null, permissions: Permission[]): boolean {
  if (!user || !user.isActive) return false;
  
  return permissions.some(permission => hasPermissionMultiRole(user, permission));
}

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export function hasRole(user: UserWithRoles, role: UserRole): boolean {
  return getActiveRoles(user).includes(role);
}

/**
 * Vérifie si un utilisateur a au moins un des rôles spécifiés
 */
export function hasAnyRole(user: UserWithRoles, roles: UserRole[]): boolean {
  const userRoles = getActiveRoles(user);
  return roles.some(role => userRoles.includes(role));
}

/**
 * Vérifie l'accès admin avec le système multi-rôles
 */
export function hasAdminAccessMultiRole(user: UserWithRoles | null): boolean {
  if (!user || !user.isActive) return false;
  
  const activeRoles = getActiveRoles(user);
  
  // Tous les rôles sauf CONSULTANT ont un accès admin
  return activeRoles.some(role => role !== UserRole.CONSULTANT);
}

/**
 * Vérifie l'accès interne avec le système multi-rôles
 */
export function hasInternalAccessMultiRole(user: UserWithRoles | null): boolean {
  if (!user || !user.isActive) return false;
  
  return hasPermissionMultiRole(user, Permission.API_ACCESS) || 
         hasAnyRole(user, [UserRole.SUPER_ADMIN, UserRole.HR_DIRECTOR]);
}

/**
 * Vérifie si l'utilisateur peut gérer d'autres utilisateurs
 */
export function canManageUsersMultiRole(user: UserWithRoles | null): boolean {
  return hasPermissionMultiRole(user, Permission.USERS_UPDATE) || 
         hasPermissionMultiRole(user, Permission.ROLES_ASSIGN);
}

/**
 * Vérifie si l'utilisateur peut approuver des embauches
 */
export function canApproveHiresMultiRole(user: UserWithRoles | null): boolean {
  return hasPermissionMultiRole(user, Permission.HIRES_APPROVE);
}

/**
 * Calcule le niveau d'accès utilisateur avec multi-rôles
 */
export function getUserAccessLevelMultiRole(user: UserWithRoles | null): 'none' | 'read' | 'write' | 'admin' | 'super' {
  if (!user || !user.isActive) return 'none';
  
  const highestRole = getHighestRole(user);
  if (!highestRole) return 'none';
  
  switch (highestRole) {
    case UserRole.SUPER_ADMIN:
      return 'super';
    case UserRole.HR_DIRECTOR:
    case UserRole.HR_MANAGER:
      return 'admin';
    case UserRole.RECRUITER_SENIOR:
    case UserRole.RECRUITER:
    case UserRole.HR_ASSISTANT:
      return 'write';
    case UserRole.CONSULTANT:
      return 'read';
    default:
      return 'none';
  }
}

/**
 * Récupère les rôles qu'un utilisateur peut assigner (basé sur son rôle le plus élevé)
 */
export function getAssignableRolesMultiRole(user: UserWithRoles): UserRole[] {
  const highestRole = getHighestRole(user);
  if (!highestRole) return [];
  
  const userLevel = ROLE_HIERARCHY[highestRole];
  
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level < userLevel)
    .map(([role, _]) => role as UserRole);
}

/**
 * Vérifie si un utilisateur peut assigner un rôle spécifique
 */
export function canAssignRole(user: UserWithRoles, roleToAssign: UserRole): boolean {
  const assignableRoles = getAssignableRolesMultiRole(user);
  return assignableRoles.includes(roleToAssign);
}

/**
 * Convertit un UserWithRoles vers UserWithRole (pour compatibilité legacy)
 */
export function convertToLegacyUser(user: UserWithRoles): import('@/types/auth').UserWithRole {
  const primaryRole = getPrimaryRole(user) || UserRole.CONSULTANT;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: primaryRole,
    permissions: getAllUserPermissions(user),
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

/**
 * Valide les assignations de rôles d'un utilisateur
 */
export function validateUserRoles(userRoles: UserRoleAssignment[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Vérifier qu'il y a au moins un rôle
  if (userRoles.length === 0) {
    errors.push('Un utilisateur doit avoir au moins un rôle');
  }
  
  // Vérifier qu'il y a exactement un rôle principal
  const primaryRoles = userRoles.filter(r => r.isPrimary && r.isActive);
  if (primaryRoles.length === 0) {
    errors.push('Un utilisateur doit avoir exactement un rôle principal');
  } else if (primaryRoles.length > 1) {
    errors.push('Un utilisateur ne peut avoir qu\'un seul rôle principal');
  }
  
  // Vérifier l'unicité des rôles
  const activeRoles = userRoles.filter(r => r.isActive).map(r => r.role);
  const uniqueRoles = new Set(activeRoles);
  if (activeRoles.length !== uniqueRoles.size) {
    errors.push('Un utilisateur ne peut pas avoir le même rôle plusieurs fois');
  }
  
  // Vérifier les dates d'expiration
  const now = new Date();
  userRoles.forEach(roleAssignment => {
    if (roleAssignment.expiresAt && roleAssignment.expiresAt <= now && roleAssignment.isActive) {
      errors.push(`Le rôle ${roleAssignment.role} a expiré`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Récupère les informations détaillées des rôles d'un utilisateur
 */
export function getUserRolesSummary(user: UserWithRoles) {
  const activeRoles = getActiveRoles(user);
  const primaryRole = getPrimaryRole(user);
  const highestRole = getHighestRole(user);
  const totalPermissions = getAllUserPermissions(user).length;
  
  return {
    totalRoles: activeRoles.length,
    activeRoles,
    primaryRole,
    highestRole,
    totalPermissions,
    accessLevel: getUserAccessLevelMultiRole(user),
    canManageUsers: canManageUsersMultiRole(user),
    hasAdminAccess: hasAdminAccessMultiRole(user),
    hasInternalAccess: hasInternalAccessMultiRole(user)
  };
}