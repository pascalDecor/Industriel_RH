"use client";

import {
  UserRole,
  Permission,
  ROLE_HIERARCHY,
  UserWithRole
} from "@/types/auth";
import { ROLE_PERMISSIONS, INHERITED_PERMISSIONS } from "./role-permissions";
import { get } from "http";

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export function hasPermission(
  user: UserWithRole | null,
  permission: Permission
): boolean {
  if (!user || !user.isActive) return false;

  const userPermissions = getUserPermissions(user.role);
  return userPermissions.includes(permission);
}

/**
 * Vérifie si un utilisateur a plusieurs permissions (toutes requises)
 */
export function hasAllPermissions(
  user: UserWithRole | null,
  permissions: Permission[]
): boolean {
  if (!user || !user.isActive) return false;

  return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Vérifie si un utilisateur a au moins une des permissions spécifiées
 */
export function hasAnyPermission(
  user: UserWithRole | null,
  permissions: Permission[]
): boolean {
  if (!user || !user.isActive) return false;
  return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Récupère toutes les permissions d'un rôle (incluant les héritées)
 */
export function getUserPermissions(role: UserRole): Permission[] {
  const basePermissions = ROLE_PERMISSIONS[role] || [];
  const inheritedPermissions = INHERITED_PERMISSIONS[role] || [];

  // Combine et déduplique les permissions
  return [...new Set([...basePermissions, ...inheritedPermissions])];
}

/**
 * Vérifie si un rôle est supérieur hiérarchiquement à un autre
 */
export function isRoleHigherThan(roleA: UserRole, roleB: UserRole): boolean {
  return ROLE_HIERARCHY[roleA] > ROLE_HIERARCHY[roleB];
}

/**
 * Vérifie si un rôle est supérieur ou égal hiérarchiquement à un autre
 */
export function isRoleHigherOrEqual(roleA: UserRole, roleB: UserRole): boolean {
  return ROLE_HIERARCHY[roleA] >= ROLE_HIERARCHY[roleB];
}

/**
 * Récupère les rôles qu'un utilisateur peut assigner (inférieurs dans la hiérarchie)
 */
export function getAssignableRoles(userRole: UserRole): UserRole[] {
  const userLevel = ROLE_HIERARCHY[userRole];

  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level < userLevel)
    .map(([role, _]) => role as UserRole);
}

/**
 * Vérifie l'accès admin général
 */
export function hasAdminAccess(user: UserWithRole | null): boolean {
  if (!user || !user.isActive) return false;

  // Tous les rôles sauf CONSULTANT ont accès admin
  return user.role !== UserRole.CONSULTANT;
}

/**
 * Vérifie l'accès interne (API docs, etc.)
 */
export function hasInternalAccess(user: UserWithRole | null): boolean {
  if (!user || !user.isActive) return false;

  // SUPER_ADMIN a toujours accès à la documentation API
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  return (
    hasPermission(user, Permission.API_ACCESS) ||
    isRoleHigherOrEqual(user.role, UserRole.HR_DIRECTOR)
  );
}

/**
 * Vérifie spécifiquement l'accès à la documentation Swagger
 * Accessible à tous les utilisateurs authentifiés et actifs
 */
export function hasSwaggerAccess(user: UserWithRole | null): boolean {
  if (!user || !user.isActive) return false;

  // Tous les utilisateurs authentifiés et actifs ont accès à la documentation
  return true;
}

/**
 * Vérifie si l'utilisateur peut gérer d'autres utilisateurs
 */
export function canManageUsers(user: UserWithRole | null): boolean {
  return (
    hasPermission(user, Permission.USERS_UPDATE) ||
    hasPermission(user, Permission.ROLES_ASSIGN)
  );
}

/**
 * Vérifie si l'utilisateur peut approuver des embauches
 */
export function canApproveHires(user: UserWithRole | null): boolean {
  return hasPermission(user, Permission.HIRES_APPROVE);
}

/**
 * Vérifie si l'utilisateur peut accéder aux rapports avancés
 */
export function canAccessAdvancedReports(user: UserWithRole | null): boolean {
  return hasPermission(user, Permission.REPORTS_ADVANCED);
}

/**
 * Vérifie si l'utilisateur peut exporter des données
 */
export function canExportData(
  user: UserWithRole | null,
  module: "applications" | "hires" | "contacts"
): boolean {
  const exportPermissions = {
    applications: Permission.APPLICATIONS_EXPORT,
    hires: Permission.HIRES_EXPORT,
    contacts: Permission.CONTACTS_EXPORT
  };

  return hasPermission(user, exportPermissions[module]);
}

/**
 * Vérifie l'accès en écriture pour un module
 */
export function hasWriteAccess(
  user: UserWithRole | null,
  module: "applications" | "hires" | "contacts" | "articles"
): boolean {
  const writePermissions = {
    applications: Permission.APPLICATIONS_UPDATE,
    hires: Permission.HIRES_UPDATE,
    contacts: Permission.CONTACTS_UPDATE,
    articles: Permission.ARTICLES_UPDATE
  };

  return hasPermission(user, writePermissions[module]);
}

/**
 * Filtre les actions disponibles selon les permissions
 */
export function getAvailableActions(
  user: UserWithRole | null,
  module: string
): string[] {
  if (!user) return [];

  const actions: string[] = [];

  switch (module) {
    case "applications":
      if (hasPermission(user, Permission.APPLICATIONS_READ))
        actions.push("read");
      if (hasPermission(user, Permission.APPLICATIONS_CREATE))
        actions.push("create");
      if (hasPermission(user, Permission.APPLICATIONS_UPDATE))
        actions.push("update");
      if (hasPermission(user, Permission.APPLICATIONS_DELETE))
        actions.push("delete");
      if (hasPermission(user, Permission.APPLICATIONS_ASSIGN))
        actions.push("assign");
      if (hasPermission(user, Permission.APPLICATIONS_EXPORT))
        actions.push("export");
      break;

    case "hires":
      if (hasPermission(user, Permission.HIRES_READ)) actions.push("read");
      if (hasPermission(user, Permission.HIRES_CREATE)) actions.push("create");
      if (hasPermission(user, Permission.HIRES_UPDATE)) actions.push("update");
      if (hasPermission(user, Permission.HIRES_APPROVE))
        actions.push("approve");
      if (hasPermission(user, Permission.HIRES_REJECT)) actions.push("reject");
      if (hasPermission(user, Permission.HIRES_EXPORT)) actions.push("export");
      break;

    case "contacts":
      if (hasPermission(user, Permission.CONTACTS_READ)) actions.push("read");
      if (hasPermission(user, Permission.CONTACTS_UPDATE))
        actions.push("update");
      if (hasPermission(user, Permission.CONTACTS_ASSIGN))
        actions.push("assign");
      if (hasPermission(user, Permission.CONTACTS_EXPORT))
        actions.push("export");
      if (hasPermission(user, Permission.CONTACTS_DELETE))
        actions.push("delete");
      break;
  }

  return actions;
}

/**
 * Calcule le niveau d'accès utilisateur pour l'interface
 */
export function getUserAccessLevel(
  user: UserWithRole | null
): "none" | "read" | "write" | "admin" | "super" {
  if (!user || !user.isActive) return "none";

  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return "super";
    case UserRole.HR_DIRECTOR:
    case UserRole.HR_MANAGER:
      return "admin";
    case UserRole.RECRUITER_SENIOR:
    case UserRole.RECRUITER:
      return "write";
    case UserRole.HR_ASSISTANT:
      return "write";
    case UserRole.CONSULTANT:
      return "read";
    default:
      return "none";
  }
}
