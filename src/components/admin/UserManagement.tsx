"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole, Permission, ROLE_LABELS, UserWithRole } from '@/types/auth';
import { getAssignableRoles } from '@/lib/permissions/permission-helpers';
import {
  Users,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Shield,
  Eye,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddUserModal from './AddUserModal';
import UserProfile from './UserProfile';
import EditUserModal from './EditUserModal';

interface UserManagementProps {
  className?: string;
}

export default function UserManagement({ className }: UserManagementProps) {
  const { user: currentUser, canManageUsers, hasPermission, userRole } = usePermissions();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        await loadUsers();
      }
    } catch (error) {
      console.error('Erreur lors de la modification du statut:', error);
    }
  };

  const assignableRoles = userRole ? getAssignableRoles(userRole) : [];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = showInactive || user.isActive;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case UserRole.HR_DIRECTOR:
        return <Shield className="h-4 w-4 text-purple-500" />;
      case UserRole.HR_MANAGER:
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case UserRole.HR_DIRECTOR:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case UserRole.HR_MANAGER:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case UserRole.RECRUITER_SENIOR:
        return 'bg-green-100 text-green-800 border-green-200';
      case UserRole.RECRUITER:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case UserRole.HR_ASSISTANT:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case UserRole.CONSULTANT:
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <PermissionGuard 
      anyPermissions={[Permission.USERS_READ, Permission.USERS_UPDATE]}
      showUnauthorized={true}
    >
      <div className={`space-y-3 ${className}`}>
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
            <p className="text-gray-600">
              Gérez les comptes utilisateurs et leurs permissions
            </p>
          </div>
          
          <PermissionGuard permissions={[Permission.USERS_CREATE]}>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </PermissionGuard>
        </div>

        {/* Filtres */}
        <Card className="p-4 shadow-none border-none">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
              >
                <option value="all">Tous les rôles</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Inclure inactifs</span>
            </label>
          </div>
        </Card>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="p-4 shadow-none border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-4 shadow-none border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.isActive).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4 shadow-none border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactifs</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => !u.isActive).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </Card>
          
          <Card className="p-4 shadow-none border-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administrateurs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {users.filter(u => 
                    u.role === UserRole.SUPER_ADMIN || 
                    u.role === UserRole.HR_DIRECTOR
                  ).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Liste des utilisateurs */}
        <Card className="shadow-none border-none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Chargement des utilisateurs...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(user.role)}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                            {ROLE_LABELS[user.role]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString('fr-FR')
                          : 'Jamais connecté'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="flex items-center gap-2"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowUserProfile(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              Voir le profil
                            </DropdownMenuItem>
                            
                            <PermissionGuard permissions={[Permission.USERS_UPDATE]}>
                              <DropdownMenuItem 
                                className="flex items-center gap-2"
                                onClick={() => {
                                  setSelectedUserId(user.id);
                                  setShowEditModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                Modifier
                              </DropdownMenuItem>
                            </PermissionGuard>
                            
                            <PermissionGuard permissions={[Permission.ROLES_ASSIGN]}>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Changer le rôle
                              </DropdownMenuItem>
                            </PermissionGuard>
                            
                            <DropdownMenuSeparator />
                            
                            <PermissionGuard permissions={[Permission.USERS_UPDATE]}>
                              <DropdownMenuItem 
                                className="flex items-center gap-2"
                                onClick={() => toggleUserStatus(user.id, user.isActive)}
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="h-4 w-4" />
                                    Désactiver
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4" />
                                    Activer
                                  </>
                                )}
                              </DropdownMenuItem>
                            </PermissionGuard>
                            
                            <PermissionGuard permissions={[Permission.USERS_DELETE]}>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </PermissionGuard>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Modal d'ajout d'utilisateur */}
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onUserAdded={loadUsers}
        />

        {/* Modal de profil utilisateur */}
        {selectedUserId && (
          <UserProfile
            userId={selectedUserId}
            isOpen={showUserProfile}
            onClose={() => {
              setShowUserProfile(false);
              setSelectedUserId(null);
            }}
          />
        )}

        {/* Modal d'édition utilisateur */}
        {selectedUserId && (
          <EditUserModal
            userId={selectedUserId}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUserId(null);
            }}
            onUserUpdated={loadUsers}
          />
        )}
      </div>
    </PermissionGuard>
  );
}