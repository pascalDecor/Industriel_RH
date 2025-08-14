"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { UserWithRole, Permission, ROLE_LABELS, UserRole } from '@/types/auth';
import { 
  Shield, 
  Plus, 
  X, 
  Crown,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';

interface RoleManagerProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onRolesUpdated?: () => void;
}

interface UserRoleAssignment {
  id: string;
  role: UserRole;
  isPrimary: boolean;
  assignedAt: Date;
  isActive: boolean;
  assignedByName?: string;
}

interface UserDetails {
  id: string;
  name: string;
  email: string;
  userRoles: UserRoleAssignment[];
}

export default function RoleManager({ userId, isOpen, onClose, onRolesUpdated }: RoleManagerProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CONSULTANT);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserRoles();
    }
  }, [isOpen, userId]);

  const loadUserRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async () => {
    if (!selectedRole) return;
    
    setActionLoading('assign');
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: selectedRole })
      });

      if (response.ok) {
        await loadUserRoles();
        onRolesUpdated?.();
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation du rôle:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const removeRole = async (roleAssignmentId: string) => {
    setActionLoading(`remove-${roleAssignmentId}`);
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles/${roleAssignmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await loadUserRoles();
        onRolesUpdated?.();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du rôle:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const setPrimaryRole = async (roleAssignmentId: string) => {
    setActionLoading(`primary-${roleAssignmentId}`);
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles/primary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleAssignmentId })
      });

      if (response.ok) {
        await loadUserRoles();
        onRolesUpdated?.();
      }
    } catch (error) {
      console.error('Erreur lors de la définition du rôle principal:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case UserRole.HR_DIRECTOR:
        return <Shield className="h-4 w-4 text-purple-500" />;
      case UserRole.HR_MANAGER:
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole, isPrimary: boolean) => {
    let baseColor = '';
    switch (role) {
      case UserRole.SUPER_ADMIN:
        baseColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        break;
      case UserRole.HR_DIRECTOR:
        baseColor = 'bg-purple-100 text-purple-800 border-purple-200';
        break;
      case UserRole.HR_MANAGER:
        baseColor = 'bg-blue-100 text-blue-800 border-blue-200';
        break;
      case UserRole.RECRUITER_SENIOR:
        baseColor = 'bg-green-100 text-green-800 border-green-200';
        break;
      case UserRole.RECRUITER:
        baseColor = 'bg-orange-100 text-orange-800 border-orange-200';
        break;
      case UserRole.HR_ASSISTANT:
        baseColor = 'bg-gray-100 text-gray-800 border-gray-200';
        break;
      case UserRole.CONSULTANT:
        baseColor = 'bg-slate-100 text-slate-800 border-slate-200';
        break;
      default:
        baseColor = 'bg-gray-100 text-gray-800 border-gray-200';
    }
    
    return isPrimary ? baseColor + ' ring-2 ring-blue-300' : baseColor;
  };

  const getAvailableRoles = () => {
    const assignedRoles = user?.userRoles?.filter(ur => ur.isActive).map(ur => ur.role) || [];
    return Object.values(UserRole).filter(role => !assignedRoles.includes(role));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement des rôles...</p>
          </div>
        ) : user ? (
          <>
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-purple-600" />
                    Gestion des rôles
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {user.name} ({user.email})
                  </p>
                </div>
                <Button variant="secondary" onClick={onClose}>
                  Fermer
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Rôles actuels */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Rôles assignés
                </h3>
                
                {user.userRoles && user.userRoles.length > 0 ? (
                  <div className="space-y-3">
                    {user.userRoles
                      .filter(ur => ur.isActive)
                      .map((userRole) => (
                        <div 
                          key={userRole.id} 
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {getRoleIcon(userRole.role)}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(userRole.role, userRole.isPrimary)}`}>
                                  {ROLE_LABELS[userRole.role]}
                                </span>
                                {userRole.isPrimary && (
                                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                                    Principal
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Assigné le {new Date(userRole.assignedAt).toLocaleDateString('fr-FR')}
                                {userRole.assignedByName && ` par ${userRole.assignedByName}`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!userRole.isPrimary && user.userRoles.length > 1 && (
                              <PermissionGuard permissions={[Permission.ROLES_ASSIGN]}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setPrimaryRole(userRole.id)}
                                  disabled={actionLoading === `primary-${userRole.id}`}
                                >
                                  {actionLoading === `primary-${userRole.id}` ? 'Définition...' : 'Définir comme principal'}
                                </Button>
                              </PermissionGuard>
                            )}
                            
                            {user.userRoles.filter(ur => ur.isActive).length > 1 && (
                              <PermissionGuard permissions={[Permission.ROLES_ASSIGN]}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => removeRole(userRole.id)}
                                  disabled={actionLoading === `remove-${userRole.id}`}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </PermissionGuard>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <XCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucun rôle assigné</p>
                  </div>
                )}
              </Card>

              {/* Assigner un nouveau rôle */}
              <PermissionGuard permissions={[Permission.ROLES_ASSIGN]}>
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-blue-500" />
                    Assigner un nouveau rôle
                  </h3>
                  
                  {getAvailableRoles().length > 0 ? (
                    <div className="flex gap-3">
                      <select
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      >
                        {getAvailableRoles().map(role => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                      
                      <Button 
                        onClick={assignRole}
                        disabled={actionLoading === 'assign'}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {actionLoading === 'assign' ? 'Attribution...' : 'Assigner'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>Tous les rôles disponibles sont déjà assignés</p>
                    </div>
                  )}
                </Card>
              </PermissionGuard>

              {/* Avertissements */}
              <Card className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important :</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Chaque utilisateur doit avoir au moins un rôle actif</li>
                      <li>Le rôle principal détermine les permissions par défaut</li>
                      <li>Les modifications prennent effet à la prochaine connexion</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">Utilisateur non trouvé</p>
            <Button onClick={onClose} className="mt-4">Fermer</Button>
          </div>
        )}
      </div>
    </div>
  );
}