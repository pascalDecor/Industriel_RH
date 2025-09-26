"use client";

import { useState, useEffect } from 'react';
import { UserWithRole, UserRole } from '@/types/auth';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasAdminAccess,
  hasInternalAccess as checkInternalAccess,
  hasSwaggerAccess as checkSwaggerAccess,
  canManageUsers,
  canApproveHires,
  canAccessAdvancedReports,
  getUserAccessLevel
} from '@/lib/permissions/permission-helpers';
import type { Permission } from '@/types/auth';

export interface AuthState {
  user: UserWithRole | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
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

        console.log('Session data received:', data);
        
        if (isMounted) {
          if (data.session && data.session.user) {
            const user: UserWithRole = {
              id: data.session.user.id,
              name: data.session.user.name,
              email: data.session.user.email,
              role: data.session.user.role || UserRole.CONSULTANT,
              isActive: data.session.user.isActive ?? true,
              avatarUrl: data.session.user.avatarUrl,
              lastLogin: data.session.user.lastLogin ? new Date(data.session.user.lastLogin) : undefined,
              createdAt: new Date(data.session.user.createdAt),
              updatedAt: new Date(data.session.user.updatedAt)
            };

            console.log('Authenticated user session:', data.session.user);
            
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

  // Fonction pour vérifier une permission
  const userHasPermission = (permission: Permission) => {
    return hasPermission(authState.user, permission);
  };

  // Fonction pour vérifier plusieurs permissions (toutes requises)
  const userHasAllPermissions = (permissions: Permission[]) => {
    return hasAllPermissions(authState.user, permissions);
  };

  // Fonction pour vérifier plusieurs permissions (au moins une)
  const userHasAnyPermission = (permissions: Permission[]) => {
    return hasAnyPermission(authState.user, permissions);
  };

  return {
    ...authState,
    // Permissions spécifiques
    hasPermission: userHasPermission,
    hasAllPermissions: userHasAllPermissions,
    hasAnyPermission: userHasAnyPermission,
    // Accès spécialisés
    hasAdminAccess: hasAdminAccess(authState.user),
    hasInternalAccess: checkInternalAccess(authState.user),
    hasSwaggerAccess: checkSwaggerAccess(authState.user),
    canManageUsers: canManageUsers(authState.user),
    canApproveHires: canApproveHires(authState.user),
    canAccessAdvancedReports: canAccessAdvancedReports(authState.user),
    // Informations utilisateur
    userRole: authState.user?.role,
    accessLevel: getUserAccessLevel(authState.user),
    isActive: authState.user?.isActive ?? false,
    // Actions
    logout,
    refresh: () => {
      setAuthState(prev => ({ ...prev, loading: true }));
      window.location.reload();
    }
  };
}