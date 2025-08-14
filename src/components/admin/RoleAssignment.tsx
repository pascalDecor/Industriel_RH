"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';
import { 
  UserRole, 
  Permission, 
  ROLE_LABELS, 
  ROLE_HIERARCHY, 
  UserWithRole 
} from '@/types/auth';
import { getAssignableRoles, isRoleHigherThan } from '@/lib/permissions/permission-helpers';
import { ROLE_PERMISSIONS } from '@/lib/permissions/role-permissions';
import {
  Shield,
  Users,
  AlertTriangle,
  Check,
  X,
  ArrowRight,
  Crown,
  UserCheck,
  Info
} from 'lucide-react';

interface RoleAssignmentProps {
  userId?: string;
  currentRole?: UserRole;
  onRoleChange?: (newRole: UserRole) => void;
  className?: string;
}

export default function RoleAssignment({ 
  userId, 
  currentRole, 
  onRoleChange, 
  className 
}: RoleAssignmentProps) {
  const { user: currentUser, userRole: currentUserRole, hasPermission } = usePermissions();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(currentRole || null);
  const [targetUser, setTargetUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (userId) {
      loadTargetUser();
    }
  }, [userId]);

  const loadTargetUser = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        setTargetUser(userData.user);
        setSelectedRole(userData.user.role);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    }
  };

  const assignableRoles = currentUserRole ? getAssignableRoles(currentUserRole) : [];
  
  // Inclure le rôle actuel dans les options même s'il n'est pas assignable
  const availableRoles = currentRole && !assignableRoles.includes(currentRole) 
    ? [...assignableRoles, currentRole] 
    : assignableRoles;

  const handleRoleChange = async () => {
    if (!selectedRole || !userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: selectedRole })
      });

      if (response.ok) {
        onRoleChange?.(selectedRole);
        setShowConfirmation(false);
        if (targetUser) {
          setTargetUser({ ...targetUser, role: selectedRole });
        }
      } else {
        const error = await response.json();
        console.error('Erreur lors de l\'assignation du rôle:', error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation du rôle:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case UserRole.HR_DIRECTOR:
        return <Shield className="h-5 w-5 text-purple-500" />;
      case UserRole.HR_MANAGER:
        return <UserCheck className="h-5 w-5 text-blue-500" />;
      default:
        return <Users className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      case UserRole.HR_DIRECTOR:
        return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
      case UserRole.HR_MANAGER:
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
      case UserRole.RECRUITER_SENIOR:
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case UserRole.RECRUITER:
        return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
      case UserRole.HR_ASSISTANT:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
      case UserRole.CONSULTANT:
        return 'border-slate-200 bg-slate-50 hover:bg-slate-100';
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  const getRolePermissionCount = (role: UserRole): number => {
    return ROLE_PERMISSIONS[role]?.length || 0;
  };

  const isRoleUpgrade = (fromRole: UserRole, toRole: UserRole): boolean => {
    return ROLE_HIERARCHY[toRole] > ROLE_HIERARCHY[fromRole];
  };

  const canAssignRole = (role: UserRole): boolean => {
    if (!currentUserRole) return false;
    
    // Super admin peut tout assigner
    if (currentUserRole === UserRole.SUPER_ADMIN) return true;
    
    // Ne peut pas assigner un rôle supérieur ou égal au sien
    return isRoleHigherThan(currentUserRole, role);
  };

  return (
    <PermissionGuard 
      permissions={[Permission.ROLES_ASSIGN]}
      showUnauthorized={true}
    >
      <div className={`space-y-6 ${className}`}>
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Assignation de rôle
            </h3>
            {targetUser && (
              <p className="text-sm text-gray-600">
                pour <span className="font-medium">{targetUser.name}</span> ({targetUser.email})
              </p>
            )}
          </div>
        </div>

        {/* Rôle actuel */}
        {currentRole && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRoleIcon(currentRole)}
                <div>
                  <h4 className="font-medium text-gray-900">Rôle actuel</h4>
                  <p className="text-sm text-gray-600">{ROLE_LABELS[currentRole]}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {getRolePermissionCount(currentRole)} permissions
                </p>
                <p className="text-xs text-gray-400">
                  Niveau {ROLE_HIERARCHY[currentRole]}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Sélection du nouveau rôle */}
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Sélectionner un nouveau rôle</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(UserRole).map((role) => {
              const isCurrentRole = role === currentRole;
              const isSelected = role === selectedRole;
              const canAssign = canAssignRole(role);
              const isAvailable = availableRoles.includes(role) || isCurrentRole;
              
              return (
                <div
                  key={role}
                  className={`
                    relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                    ${isSelected ? 'border-blue-500 bg-blue-50' : getRoleColor(role)}
                    ${!canAssign || !isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isCurrentRole ? 'ring-2 ring-gray-300' : ''}
                  `}
                  onClick={() => {
                    if (canAssign && isAvailable) {
                      setSelectedRole(role);
                    }
                  }}
                >
                  {isCurrentRole && (
                    <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      Actuel
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3">
                    {getRoleIcon(role)}
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {ROLE_LABELS[role]}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {getRolePermissionCount(role)} permissions • Niveau {ROLE_HIERARCHY[role]}
                      </p>
                      
                      {currentRole && role !== currentRole && (
                        <div className="mt-2 flex items-center gap-1 text-xs">
                          {isRoleUpgrade(currentRole, role) ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3" />
                              Promotion
                            </span>
                          ) : (
                            <span className="text-orange-600 flex items-center gap-1">
                              <ArrowRight className="h-3 w-3 transform rotate-180" />
                              Rétrogradation
                            </span>
                          )}
                        </div>
                      )}
                      
                      {!canAssign && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                          <X className="h-3 w-3" />
                          Non assignable
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Aperçu des changements */}
        {selectedRole && selectedRole !== currentRole && (
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Aperçu des changements</h4>
                <div className="mt-2 space-y-1 text-sm text-blue-800">
                  <p>
                    <span className="font-medium">Ancien rôle:</span> {currentRole ? ROLE_LABELS[currentRole] : 'Aucun'}
                  </p>
                  <p>
                    <span className="font-medium">Nouveau rôle:</span> {ROLE_LABELS[selectedRole]}
                  </p>
                  <p>
                    <span className="font-medium">Changement de permissions:</span>{' '}
                    {currentRole ? (
                      <>
                        {getRolePermissionCount(currentRole)} → {getRolePermissionCount(selectedRole)}{' '}
                        ({getRolePermissionCount(selectedRole) - getRolePermissionCount(currentRole) > 0 ? '+' : ''}
                        {getRolePermissionCount(selectedRole) - getRolePermissionCount(currentRole)})
                      </>
                    ) : (
                      `${getRolePermissionCount(selectedRole)} permissions accordées`
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button 
            variant="secondary" 
            onClick={() => setSelectedRole(currentRole || null)}
            disabled={loading}
          >
            Annuler
          </Button>
          
          <Button
            onClick={() => setShowConfirmation(true)}
            disabled={!selectedRole || selectedRole === currentRole || loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              'Attribution en cours...'
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Assigner le rôle
              </>
            )}
          </Button>
        </div>

        {/* Modal de confirmation */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                <h3 className="text-lg font-semibold">Confirmer l'assignation</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir assigner le rôle{' '}
                <span className="font-medium">{selectedRole ? ROLE_LABELS[selectedRole] : ''}</span>{' '}
                {targetUser ? `à ${targetUser.name}` : 'à cet utilisateur'} ?
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowConfirmation(false)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleRoleChange}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? 'Attribution...' : 'Confirmer'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}