"use client";

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Permission, UserRole } from '@/types/auth';

interface PermissionGuardProps {
  children: React.ReactNode;
  // Permissions requises (toutes obligatoires)
  permissions?: Permission[];
  // Permissions alternatives (au moins une requise)
  anyPermissions?: Permission[];
  // Rôles autorisés
  roles?: UserRole[];
  // Niveau d'accès minimum requis
  minAccessLevel?: 'none' | 'read' | 'write' | 'admin' | 'super';
  // Composant à afficher si accès refusé
  fallback?: React.ReactNode;
  // Message d'erreur personnalisé
  unauthorizedMessage?: string;
  // Afficher un message d'erreur ou juste cacher
  showUnauthorized?: boolean;
}

/**
 * Composant guard pour protéger l'accès basé sur les permissions
 */
export function PermissionGuard({ 
  children, 
  permissions, 
  anyPermissions, 
  roles,
  minAccessLevel,
  fallback,
  unauthorizedMessage = "Vous n'avez pas les permissions nécessaires pour accéder à cette section.",
  showUnauthorized = false
}: PermissionGuardProps) {
  const { 
    user, 
    hasAllPermissions, 
    hasAnyPermission,
    userRole,
    accessLevel,
    isActive
  } = usePermissions();

  // Vérifier si l'utilisateur est actif
  if (!user || !isActive) {
    if (showUnauthorized) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Accès non autorisé</div>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette section.</p>
          </div>
        </div>
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Vérifier les permissions spécifiques (toutes requises)
  if (permissions && !hasAllPermissions(permissions)) {
    if (showUnauthorized) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Permissions insuffisantes</div>
            <p className="text-gray-600">{unauthorizedMessage}</p>
          </div>
        </div>
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Vérifier les permissions alternatives (au moins une requise)
   if (anyPermissions && !hasAnyPermission(anyPermissions)) {
    if (showUnauthorized) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Permissions insuffisantes</div>
            <p className="text-gray-600">{unauthorizedMessage}</p>
          </div>
        </div>
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Vérifier les rôles autorisés
  if (roles && userRole && !roles.includes(userRole)) {
    if (showUnauthorized) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Rôle insuffisant</div>
            <p className="text-gray-600">Votre rôle ne vous permet pas d'accéder à cette section.</p>
          </div>
        </div>
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Vérifier le niveau d'accès minimum
  if (minAccessLevel) {
    const levelOrder = ['none', 'read', 'write', 'admin', 'super'];
    const currentLevelIndex = levelOrder.indexOf(accessLevel);
    const requiredLevelIndex = levelOrder.indexOf(minAccessLevel);
    
    if (currentLevelIndex < requiredLevelIndex) {
      if (showUnauthorized) {
        return (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">Niveau d'accès insuffisant</div>
              <p className="text-gray-600">Cette section nécessite un niveau d'accès plus élevé.</p>
            </div>
          </div>
        );
      }
      return fallback ? <>{fallback}</> : null;
    }
  }

  // Toutes les vérifications sont passées, afficher le contenu
  return <>{children}</>;
}

/**
 * Hook pour utiliser le guard de permissions dans les composants
 */
export function usePermissionGuard() {
  const permissions = usePermissions();

  const checkAccess = (requirements: {
    permissions?: Permission[];
    anyPermissions?: Permission[];
    roles?: UserRole[];
    minAccessLevel?: 'none' | 'read' | 'write' | 'admin' | 'super';
  }) => {
    const { permissions: requiredPermissions, anyPermissions, roles, minAccessLevel } = requirements;

    // Vérifier si l'utilisateur est actif
    if (!permissions.user || !permissions.isActive) {
      return false;
    }

    // Vérifier les permissions spécifiques
    if (requiredPermissions && !permissions.hasAllPermissions(requiredPermissions)) {
      return false;
    }

    // Vérifier les permissions alternatives
    if (anyPermissions && !permissions.hasAnyPermission(anyPermissions)) {
      return false;
    }

    // Vérifier les rôles
    if (roles && permissions.userRole && !roles.includes(permissions.userRole)) {
      return false;
    }

    // Vérifier le niveau d'accès
    if (minAccessLevel) {
      const levelOrder = ['none', 'read', 'write', 'admin', 'super'];
      const currentLevelIndex = levelOrder.indexOf(permissions.accessLevel);
      const requiredLevelIndex = levelOrder.indexOf(minAccessLevel);
      
      if (currentLevelIndex < requiredLevelIndex) {
        return false;
      }
    }

    return true;
  };

  return {
    checkAccess,
    ...permissions
  };
}