"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { 
  UserRole, 
  Permission, 
  ROLE_LABELS, 
  PERMISSION_LABELS,
  PERMISSION_CATEGORIES 
} from '@/types/auth';
import { ROLE_PERMISSIONS, MODULE_PERMISSIONS } from '@/lib/permissions/role-permissions';
import { getUserPermissions } from '@/lib/permissions/permission-helpers';
import {
  Shield,
  Check,
  X,
  Eye,
  EyeOff,
  Filter,
  Search,
  Info,
  Users,
  FileText,
  Settings,
  Database,
  DollarSign,
  UserCheck,
  Crown
} from 'lucide-react';

interface PermissionsMatrixProps {
  className?: string;
  compact?: boolean;
}

export default function PermissionsMatrix({ className, compact = false }: PermissionsMatrixProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyGranted, setShowOnlyGranted] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case PERMISSION_CATEGORIES.APPLICATIONS:
        return <UserCheck className="h-4 w-4 text-blue-500" />;
      case PERMISSION_CATEGORIES.HIRES:
        return <Users className="h-4 w-4 text-green-500" />;
      case PERMISSION_CATEGORIES.CONTACTS:
        return <FileText className="h-4 w-4 text-purple-500" />;
      case PERMISSION_CATEGORIES.CONTENT:
        return <FileText className="h-4 w-4 text-orange-500" />;
      case PERMISSION_CATEGORIES.USERS:
        return <Users className="h-4 w-4 text-red-500" />;
      case PERMISSION_CATEGORIES.SYSTEM:
        return <Settings className="h-4 w-4 text-gray-500" />;
      case PERMISSION_CATEGORIES.API:
        return <Database className="h-4 w-4 text-indigo-500" />;
      case PERMISSION_CATEGORIES.FINANCE:
        return <DollarSign className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case UserRole.HR_DIRECTOR:
        return <Shield className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPermissionCategory = (permission: Permission): string => {
    if (permission.startsWith('applications.')) return PERMISSION_CATEGORIES.APPLICATIONS;
    if (permission.startsWith('hires.')) return PERMISSION_CATEGORIES.HIRES;
    if (permission.startsWith('contacts.')) return PERMISSION_CATEGORIES.CONTACTS;
    if (permission.startsWith('articles.') || permission.startsWith('sectors.') || permission.startsWith('specialities.')) {
      return PERMISSION_CATEGORIES.CONTENT;
    }
    if (permission.startsWith('users.') || permission.startsWith('roles.')) return PERMISSION_CATEGORIES.USERS;
    if (permission.startsWith('system.') || permission.startsWith('reports.') || permission.startsWith('analytics.')) {
      return PERMISSION_CATEGORIES.SYSTEM;
    }
    if (permission.startsWith('api.') || permission.startsWith('dev.') || permission.startsWith('database.')) {
      return PERMISSION_CATEGORIES.API;
    }
    if (permission.startsWith('salary.') || permission.startsWith('budget.')) return PERMISSION_CATEGORIES.FINANCE;
    return 'Autre';
  };

  const filteredPermissions = Object.values(Permission).filter(permission => {
    const matchesSearch = PERMISSION_LABELS[permission].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || getPermissionCategory(permission) === selectedCategory;
    
    if (showOnlyGranted && selectedRole !== 'all') {
      const rolePermissions = getUserPermissions(selectedRole as UserRole);
      return matchesSearch && matchesCategory && rolePermissions.includes(permission);
    }
    
    return matchesSearch && matchesCategory;
  });

  const groupedPermissions = filteredPermissions.reduce((acc, permission) => {
    const category = getPermissionCategory(permission);
    if (!acc[category]) acc[category] = [];
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const hasPermission = (role: UserRole, permission: Permission): boolean => {
    const rolePermissions = getUserPermissions(role);
    return rolePermissions.includes(permission);
  };

  const rolesToShow = selectedRole === 'all' ? Object.values(UserRole) : [selectedRole as UserRole];

  const getRolePermissionCount = (role: UserRole): number => {
    return getUserPermissions(role).length;
  };

  return (
    <PermissionGuard 
      anyPermissions={[Permission.ROLES_MANAGE, Permission.SYSTEM_CONFIG]}
      showUnauthorized={true}
    >
      <div className={`space-y-6 ${className}`}>
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Matrice des permissions</h2>
            <p className="text-gray-600">
              Visualisez et comparez les permissions par rôle
            </p>
          </div>
        </div>

        {/* Filtres et contrôles */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une permission..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
              >
                <option value="all">Tous les rôles</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Toutes les catégories</option>
              {Object.values(PERMISSION_CATEGORIES).map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyGranted}
                onChange={(e) => setShowOnlyGranted(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={selectedRole === 'all'}
              />
              <span className="text-sm text-gray-600">Seulement accordées</span>
            </label>
          </div>
        </Card>

        {/* Statistiques des rôles */}
        {selectedRole === 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.values(UserRole).map(role => (
              <Card key={role} className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  {getRoleIcon(role)}
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {ROLE_LABELS[role]}
                  </span>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {getRolePermissionCount(role)}
                </div>
                <div className="text-xs text-gray-500">permissions</div>
              </Card>
            ))}
          </div>
        )}

        {/* Matrice des permissions */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    Permission
                  </th>
                  {rolesToShow.map(role => (
                    <th key={role} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      <div className="flex flex-col items-center gap-1">
                        {getRoleIcon(role)}
                        <span className="text-xs">{ROLE_LABELS[role].split(' ')[0]}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <React.Fragment key={category}>
                    {/* En-tête de catégorie */}
                    <tr className="bg-gray-25">
                      <td colSpan={rolesToShow.length + 1} className="px-4 py-2 sticky left-0 bg-gray-25 z-10">
                        <div className="flex items-center gap-2 font-medium text-gray-700">
                          {getCategoryIcon(category)}
                          <span>{category}</span>
                          <span className="text-xs text-gray-500">({permissions.length})</span>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Permissions de la catégorie */}
                    {permissions.map(permission => (
                      <tr key={permission} className="hover:bg-gray-50">
                        <td className="px-4 py-3 sticky left-0 bg-white hover:bg-gray-50 z-10">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {PERMISSION_LABELS[permission]}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {permission}
                            </span>
                          </div>
                        </td>
                        {rolesToShow.map(role => (
                          <td key={`${role}-${permission}`} className="px-3 py-3 text-center">
                            {hasPermission(role, permission) ? (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-green-600" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                                  <X className="h-4 w-4 text-red-600" />
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Légende */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Légende</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Permission accordée</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <span>Permission refusée</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-blue-700">
                Les permissions sont héritées selon la hiérarchie des rôles. 
                Un utilisateur avec un rôle supérieur peut avoir des permissions supplémentaires non listées.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PermissionGuard>
  );
}