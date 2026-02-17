/**
 * Vérification des permissions (source de vérité = base de données).
 * L'utilisateur passé par verifyAuth contient permissions: string[] (codes chargés depuis Role/Permission).
 */

export interface UserWithPermissions {
  permissions?: string[];
  isActive?: boolean;
}

export function hasPermission(user: UserWithPermissions | null, permissionCode: string): boolean {
  if (!user || !user.isActive) return false;
  const perms = user.permissions;
  if (!Array.isArray(perms)) return false;
  return perms.includes(permissionCode);
}

export function hasAnyPermission(user: UserWithPermissions | null, permissionCodes: string[]): boolean {
  if (!user || !user.isActive) return false;
  const perms = user.permissions;
  if (!Array.isArray(perms)) return false;
  return permissionCodes.some((code) => perms.includes(code));
}
