"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { useMultiRolePermissions } from '@/hooks/useMultiRolePermissions';
import { 
  UserRole, 
  Permission, 
  ROLE_LABELS, 
  UserWithRoles,
  UserRoleAssignment 
} from '@/types/auth';
import {
  Shield,
  Plus,
  Trash2,
  Star,
  Clock,
  AlertTriangle,
  Check,
  X,
  Calendar,
  User,
  Crown
} from 'lucide-react';

interface MultiRoleManagerProps {
  userId: string;
  onRoleChange?: () => void;
  className?: string;
}

export default function MultiRoleManager({ 
  userId, 
  onRoleChange, 
  className 
}: MultiRoleManagerProps) {
  const { canAssignSpecificRole, getAssignableRoles, hasPermission } = useMultiRolePermissions();
  const [userRoles, setUserRoles] = useState<UserRoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRole, setShowAddRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [expirationDate, setExpirationDate] = useState('');
  const [makePrimary, setMakePrimary] = useState(false);

  useEffect(() => {
    loadUserRoles();
  }, [userId]);

  const loadUserRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserRoles(data.userRoles || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRole = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          role: selectedRole,
          isPrimary: makePrimary,
          expiresAt: expirationDate || null
        })
      });

      if (response.ok) {
        await loadUserRoles();
        setShowAddRole(false);
        setSelectedRole('');
        setExpirationDate('');
        setMakePrimary(false);
        onRoleChange?.();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rôle:', error);
    }
  };

  const removeRole = async (roleAssignmentId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles/${roleAssignmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await loadUserRoles();
        onRoleChange?.();
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du rôle:', error);
    }
  };

  const setPrimaryRole = async (roleAssignmentId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles/primary`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ roleId: roleAssignmentId })
      });

      if (response.ok) {
        await loadUserRoles();
        onRoleChange?.();
      }
    } catch (error) {
      console.error('Erreur lors du changement de rôle principal:', error);
    }
  };

  const toggleRoleStatus = async (roleAssignmentId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/roles/${roleAssignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        await loadUserRoles();
        onRoleChange?.();
      }
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case UserRole.HR_DIRECTOR:
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: UserRole, isPrimary: boolean = false) => {
    const baseColors = {
      [UserRole.SUPER_ADMIN]: 'border-yellow-200 bg-yellow-50',
      [UserRole.HR_DIRECTOR]: 'border-purple-200 bg-purple-50',
      [UserRole.HR_MANAGER]: 'border-blue-200 bg-blue-50',
      [UserRole.RECRUITER_SENIOR]: 'border-green-200 bg-green-50',
      [UserRole.RECRUITER]: 'border-orange-200 bg-orange-50',
      [UserRole.HR_ASSISTANT]: 'border-gray-200 bg-gray-50',
      [UserRole.CONSULTANT]: 'border-slate-200 bg-slate-50'
    };

    return isPrimary 
      ? `${baseColors[role]} ring-2 ring-blue-300`
      : baseColors[role];
  };

  const isExpired = (expiresAt: Date | null | undefined) => {
    return expiresAt && new Date(expiresAt) <= new Date();
  };

  const assignableRoles = getAssignableRoles();
  const availableRoles = assignableRoles.filter(role => 
    !userRoles.some(ur => ur.role === role && ur.isActive)
  );

  return (
    <PermissionGuard 
      permissions={[Permission.ROLES_ASSIGN]}
      showUnauthorized={true}
    >
      <div className={`space-y-4 ${className}`}>
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Gestion des rôles multiples
            </h3>
            <p className="text-sm text-gray-600">
              Gérez les différents rôles assignés à cet utilisateur
            </p>
          </div>
          
          {availableRoles.length > 0 && (
            <Button
              onClick={() => setShowAddRole(true)}
              className="flex items-center gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Ajouter un rôle
            </Button>
          )}
        </div>

        {/* Liste des rôles */}
        <div className="space-y-3">
          {loading ? (
            <Card className="p-4 text-center text-gray-500">
              Chargement des rôles...
            </Card>
          ) : userRoles.length === 0 ? (
            <Card className="p-4 text-center text-gray-500">
              Aucun rôle assigné
            </Card>
          ) : (
            userRoles.map((roleAssignment) => {
              const expired = isExpired(roleAssignment.expiresAt);
              
              return (
                <Card 
                  key={roleAssignment.id} 
                  className={`p-4 ${getRoleColor(roleAssignment.role, roleAssignment.isPrimary)} ${
                    !roleAssignment.isActive || expired ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(roleAssignment.role)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">
                            {ROLE_LABELS[roleAssignment.role]}
                          </h4>
                          
                          {roleAssignment.isPrimary && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              <Star className="h-3 w-3" />
                              Principal
                            </div>
                          )}
                          
                          {!roleAssignment.isActive && (
                            <div className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Inactif
                            </div>
                          )}
                          
                          {expired && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                              <Clock className="h-3 w-3" />
                              Expiré
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>
                            Assigné le {new Date(roleAssignment.assignedAt).toLocaleDateString('fr-FR')}
                          </span>
                          
                          {roleAssignment.expiresAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expire le {new Date(roleAssignment.expiresAt).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!roleAssignment.isPrimary && roleAssignment.isActive && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPrimaryRole(roleAssignment.id)}
                          className="text-xs"
                        >
                          Définir principal
                        </Button>
                      )}
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleRoleStatus(roleAssignment.id, roleAssignment.isActive)}
                        className={`text-xs ${
                          roleAssignment.isActive 
                            ? 'text-orange-600 hover:text-orange-700' 
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        {roleAssignment.isActive ? 'Désactiver' : 'Activer'}
                      </Button>
                      
                      {userRoles.filter(r => r.isActive).length > 1 && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => removeRole(roleAssignment.id)}
                          className="text-red-600 hover:text-red-700 text-xs"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Modal d'ajout de rôle */}
        {showAddRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Plus className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-semibold">Ajouter un rôle</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un rôle
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choisir un rôle...</option>
                    {availableRoles.map(role => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="makePrimary"
                    checked={makePrimary}
                    onChange={(e) => setMakePrimary(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="makePrimary" className="text-sm text-gray-700">
                    Définir comme rôle principal
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'expiration (optionnel)
                  </label>
                  <input
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-6">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setShowAddRole(false);
                    setSelectedRole('');
                    setExpirationDate('');
                    setMakePrimary(false);
                  }}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={addRole}
                  disabled={!selectedRole}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Informations d'aide */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">À propos des rôles multiples</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Un utilisateur peut avoir plusieurs rôles actifs simultanément</li>
                <li>• Un seul rôle peut être défini comme "principal" à la fois</li>
                <li>• Les permissions sont cumulatives : l'utilisateur obtient toutes les permissions de ses rôles actifs</li>
                <li>• Les rôles peuvent avoir une date d'expiration automatique</li>
                <li>• Un utilisateur doit toujours avoir au moins un rôle actif</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </PermissionGuard>
  );
}