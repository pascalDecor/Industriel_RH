"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { UserWithRole, Permission, ROLE_LABELS, UserRole } from '@/types/auth';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Clock, 
  Edit, 
  Key, 
  RefreshCw,
  UserX,
  UserCheck,
  Trash2,
  History,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import RoleManager from './RoleManager';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

interface UserProfileProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface UserDetails extends UserWithRole {
  userRoles: Array<{
    id: string;
    role: UserRole;
    isPrimary: boolean;
    assignedAt: Date;
    isActive: boolean;
  }>;
  mustChangePassword: boolean;
  tempPasswordExpires: Date | null;
  loginHistory: Array<{
    id: string;
    loginAt: Date;
    ipAddress: string;
    userAgent: string;
  }>;
}

export default function UserProfile({ userId, isOpen, onClose }: UserProfileProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserDetails();
    }
  }, [isOpen, userId]);

  const loadUserDetails = async () => {
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
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, data?: any) => {
    setActionLoading(action);
    try {
      let endpoint = '';
      let method = 'POST';
      
      switch (action) {
        case 'reset-password':
          endpoint = `/api/admin/users/${userId}/reset-password`;
          break;
        case 'force-password-change':
          endpoint = `/api/admin/users/${userId}/force-password-change`;
          break;
        case 'toggle-status':
          endpoint = `/api/admin/users/${userId}/status`;
          method = 'PATCH';
          break;
        case 'delete':
          endpoint = `/api/admin/users/${userId}`;
          method = 'DELETE';
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined
      });

      if (response.ok) {
        if (action === 'delete') {
          setShowDeleteModal(false);
          onClose();
        } else {
          await loadUserDetails(); // Recharger les données
        }
      }
    } catch (error) {
      console.error(`Erreur lors de l'action ${action}:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case UserRole.HR_DIRECTOR:
        return <Shield className="h-4 w-4 text-purple-500" />;
      case UserRole.HR_MANAGER:
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement du profil...</p>
          </div>
        ) : user ? (
          <>
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      {user.mustChangePassword && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Doit changer le mot de passe
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="secondary" onClick={onClose}>
                  Fermer
                </Button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations générales */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations générales
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nom complet</label>
                      <p className="mt-1 text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Créé le</label>
                      <p className="mt-1 text-gray-900 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Dernière connexion</label>
                      <p className="mt-1 text-gray-900 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString('fr-FR')
                          : 'Jamais connecté'
                        }
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Rôles */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Rôles et permissions
                  </h3>
                  <div className="space-y-3">
                    {user.userRoles?.map((userRole) => (
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
                                <span className="text-xs text-blue-600 font-medium">Principal</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Assigné le {new Date(userRole.assignedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {userRole.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Historique des connexions */}
                {user.loginHistory && user.loginHistory.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Dernières connexions
                    </h3>
                    <div className="space-y-2">
                      {user.loginHistory.slice(0, 5).map((login) => (
                        <div key={login.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(login.loginAt).toLocaleString('fr-FR')}
                            </p>
                            <p className="text-xs text-gray-600">{login.ipAddress}</p>
                          </div>
                          <p className="text-xs text-gray-500 max-w-48 truncate">
                            {login.userAgent}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Actions
                  </h3>
                  <div className="space-y-2">
                    <PermissionGuard permissions={[Permission.USERS_UPDATE]}>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start"
                        onClick={() => setShowEditModal(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier le profil
                      </Button>
                    </PermissionGuard>

                    <PermissionGuard permissions={[Permission.ROLES_ASSIGN]}>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start"
                        onClick={() => setShowRoleManager(true)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Gérer les rôles
                      </Button>
                    </PermissionGuard>

                    <PermissionGuard permissions={[Permission.USERS_UPDATE]}>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start"
                        onClick={() => handleAction('reset-password')}
                        disabled={actionLoading === 'reset-password'}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        {actionLoading === 'reset-password' ? 'Envoi...' : 'Réinitialiser mot de passe'}
                      </Button>
                    </PermissionGuard>

                    <PermissionGuard permissions={[Permission.USERS_UPDATE]}>
                      <Button 
                        variant="secondary" 
                        className="w-full justify-start"
                        onClick={() => handleAction('force-password-change')}
                        disabled={actionLoading === 'force-password-change'}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Forcer changement mot de passe
                      </Button>
                    </PermissionGuard>

                    <PermissionGuard permissions={[Permission.USERS_UPDATE]}>
                      <Button 
                        variant="secondary" 
                        className={`w-full justify-start ${
                          user.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'
                        }`}
                        onClick={() => handleAction('toggle-status', { isActive: !user.isActive })}
                        disabled={actionLoading === 'toggle-status'}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activer
                          </>
                        )}
                      </Button>
                    </PermissionGuard>
                  </div>
                </Card>

                {/* Zone danger */}
                <PermissionGuard permissions={[Permission.USERS_DELETE]}>
                  <Card className="p-6 border-red-200">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Zone de danger
                    </h3>
                    <Button 
                      variant="secondary" 
                      className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setShowDeleteModal(true)}
                      disabled={actionLoading === 'delete'}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer l'utilisateur
                    </Button>
                  </Card>
                </PermissionGuard>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">Utilisateur non trouvé</p>
            <Button onClick={onClose} className="mt-4">Fermer</Button>
          </div>
        )}

        {/* Gestionnaire de rôles */}
        <RoleManager
          userId={userId}
          isOpen={showRoleManager}
          onClose={() => setShowRoleManager(false)}
          onRolesUpdated={loadUserDetails}
        />

        {/* Modal d'édition */}
        <EditUserModal
          userId={userId}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUserUpdated={loadUserDetails}
        />

        {/* Modal de suppression */}
        <DeleteUserModal
          user={user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ? ROLE_LABELS[user.role] : undefined
          } : null}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleAction('delete')}
          loading={actionLoading === 'delete'}
        />
      </div>
    </div>
  );
}