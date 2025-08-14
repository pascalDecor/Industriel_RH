"use client";

import { useState, useEffect } from 'react';
import { UserWithRoles, UserRole, UserRoleAssignment } from '@/types/auth';
import { 
  hasPermissionMultiRole, 
  hasAllPermissionsMultiRole, 
  hasAnyPermissionMultiRole, 
  hasAdminAccessMultiRole, 
  hasInternalAccessMultiRole,
  canManageUsersMultiRole,
  canApproveHiresMultiRole,
  getUserAccessLevelMultiRole,
  getPrimaryRole,
  getActiveRoles,
  getHighestRole,
  getAllUserPermissions,
  hasRole,
  hasAnyRole,
  getUserRolesSummary
} from '@/lib/permissions/multi-role-helpers';
import type { Permission } from '@/types/auth';

export interface MultiRoleAuthState {
  user: UserWithRoles | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

export function useMultiRoleAuth() {
  const [authState, setAuthState] = useState<MultiRoleAuthState>({
    user: null,
    loading: true,
    error: null,
    authenticated: false,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (isMounted) {
          if (data.session && data.session.user) {
            // Transformer les données pour le système multi-rôles
            const user: UserWithRoles = {
              id: data.session.user.id,
              name: data.session.user.name,
              email: data.session.user.email,
              userRoles: data.session.user.userRoles || [],
              isActive: data.session.user.isActive ?? true,
              avatarUrl: data.session.user.avatarUrl,
              lastLogin: data.session.user.lastLogin ? new Date(data.session.user.lastLogin) : undefined,
              createdAt: new Date(data.session.user.createdAt),
              updatedAt: new Date(data.session.user.updatedAt)
            };
            
            setAuthState({
              user,
              loading: false,
              error: null,
              authenticated: true,
            });
          } else {
            setAuthState({
              user: null,
              loading: false,
              error: null,
              authenticated: false,
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        if (isMounted) {
          setAuthState({
            user: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur de connexion',
            authenticated: false,
          });
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      setAuthState({
        user: null,
        loading: false,
        error: null,
        authenticated: false,
      });
      
      // Rediriger vers la page de connexion
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Fonctions pour vérifier les permissions
  const userHasPermission = (permission: Permission) => {
    return hasPermissionMultiRole(authState.user, permission);
  };

  const userHasAllPermissions = (permissions: Permission[]) => {
    return hasAllPermissionsMultiRole(authState.user, permissions);
  };

  const userHasAnyPermission = (permissions: Permission[]) => {
    return hasAnyPermissionMultiRole(authState.user, permissions);
  };

  // Fonctions pour vérifier les rôles
  const userHasRole = (role: UserRole) => {
    return authState.user ? hasRole(authState.user, role) : false;
  };

  const userHasAnyRole = (roles: UserRole[]) => {
    return authState.user ? hasAnyRole(authState.user, roles) : false;
  };

  // Fonctions pour récupérer les informations des rôles
  const getUserPrimaryRole = () => {
    return authState.user ? getPrimaryRole(authState.user) : null;
  };

  const getUserActiveRoles = () => {
    return authState.user ? getActiveRoles(authState.user) : [];
  };

  const getUserHighestRole = () => {
    return authState.user ? getHighestRole(authState.user) : null;
  };

  const getUserPermissions = () => {
    return authState.user ? getAllUserPermissions(authState.user) : [];
  };

  const getUserSummary = () => {
    return authState.user ? getUserRolesSummary(authState.user) : null;
  };

  // Actions sur les rôles
  const addRole = async (role: UserRole, isPrimary: boolean = false, expiresAt?: Date) => {
    if (!authState.user) return false;

    try {
      const response = await fetch(`/api/admin/users/${authState.user.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role, isPrimary, expiresAt })
      });

      if (response.ok) {
        // Recharger les données utilisateur
        window.location.reload();
        return true;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rôle:', error);
    }
    return false;
  };

  const removeRole = async (roleAssignmentId: string) => {
    if (!authState.user) return false;

    try {
      const response = await fetch(`/api/admin/users/${authState.user.id}/roles/${roleAssignmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        // Recharger les données utilisateur
        window.location.reload();
        return true;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du rôle:', error);
    }
    return false;
  };

  const updateRole = async (roleAssignmentId: string, updates: Partial<UserRoleAssignment>) => {
    if (!authState.user) return false;

    try {
      const response = await fetch(`/api/admin/users/${authState.user.id}/roles/${roleAssignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        // Recharger les données utilisateur
        window.location.reload();
        return true;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
    }
    return false;
  };

  return {
    // États de base
    ...authState,
    
    // Permissions spécifiques
    hasPermission: userHasPermission,
    hasAllPermissions: userHasAllPermissions,
    hasAnyPermission: userHasAnyPermission,
    
    // Vérifications de rôles
    hasRole: userHasRole,
    hasAnyRole: userHasAnyRole,
    
    // Accès spécialisés
    hasAdminAccess: hasAdminAccessMultiRole(authState.user),
    hasInternalAccess: hasInternalAccessMultiRole(authState.user),
    canManageUsers: canManageUsersMultiRole(authState.user),
    canApproveHires: canApproveHiresMultiRole(authState.user),
    
    // Informations des rôles
    primaryRole: getUserPrimaryRole(),
    activeRoles: getUserActiveRoles(),
    highestRole: getUserHighestRole(),
    allPermissions: getUserPermissions(),
    accessLevel: getUserAccessLevelMultiRole(authState.user),
    isActive: authState.user?.isActive ?? false,
    rolesSummary: getUserSummary(),
    
    // Actions
    logout,
    addRole,
    removeRole,
    updateRole,
    refresh: () => {
      setAuthState(prev => ({ ...prev, loading: true }));
      window.location.reload();
    }
  };
}