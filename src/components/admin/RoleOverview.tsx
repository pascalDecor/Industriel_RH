"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { 
  UserRole, 
  Permission, 
  ROLE_LABELS, 
  ROLE_HIERARCHY,
  UserWithRole 
} from '@/types/auth';
import { getUserPermissions } from '@/lib/permissions/permission-helpers';
import { ROLE_PERMISSIONS } from '@/lib/permissions/role-permissions';
import {
  Shield,
  Users,
  Crown,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface RoleOverviewProps {
  className?: string;
}

interface RoleStats {
  role: UserRole;
  count: number;
  activeCount: number;
  inactiveCount: number;
  percentage: number;
}

export default function RoleOverview({ className }: RoleOverviewProps) {
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoleStats();
  }, []);

  const loadRoleStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users/stats', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setRoleStats(data.roleStats || []);
        setTotalUsers(data.totalUsers || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case UserRole.HR_DIRECTOR:
        return <Shield className="h-6 w-6 text-purple-500" />;
      case UserRole.HR_MANAGER:
        return <UserCheck className="h-6 w-6 text-blue-500" />;
      case UserRole.RECRUITER_SENIOR:
        return <Users className="h-6 w-6 text-green-500" />;
      case UserRole.RECRUITER:
        return <Users className="h-6 w-6 text-orange-500" />;
      case UserRole.HR_ASSISTANT:
        return <Users className="h-6 w-6 text-gray-500" />;
      case UserRole.CONSULTANT:
        return <Users className="h-6 w-6 text-slate-500" />;
      default:
        return <Users className="h-6 w-6 text-gray-500" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'border-yellow-200 bg-yellow-50';
      case UserRole.HR_DIRECTOR:
        return 'border-purple-200 bg-purple-50';
      case UserRole.HR_MANAGER:
        return 'border-blue-200 bg-blue-50';
      case UserRole.RECRUITER_SENIOR:
        return 'border-green-200 bg-green-50';
      case UserRole.RECRUITER:
        return 'border-orange-200 bg-orange-50';
      case UserRole.HR_ASSISTANT:
        return 'border-gray-200 bg-gray-50';
      case UserRole.CONSULTANT:
        return 'border-slate-200 bg-slate-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPermissionCount = (role: UserRole): number => {
    return getUserPermissions(role).length;
  };

  const getRoleLevel = (role: UserRole): number => {
    return ROLE_HIERARCHY[role];
  };

  const mostPrivilegedRole = roleStats.reduce((prev, current) => 
    getRoleLevel(prev.role) > getRoleLevel(current.role) ? prev : current
  , roleStats[0]);

  const leastPrivilegedRole = roleStats.reduce((prev, current) => 
    getRoleLevel(prev.role) < getRoleLevel(current.role) ? prev : current
  , roleStats[0]);

  const totalActiveUsers = roleStats.reduce((sum, stat) => sum + stat.activeCount, 0);
  const totalInactiveUsers = roleStats.reduce((sum, stat) => sum + stat.inactiveCount, 0);

  return (
    <PermissionGuard 
      anyPermissions={[Permission.USERS_READ, Permission.ROLES_MANAGE]}
      showUnauthorized={true}
    >
      <div className={`space-y-6 ${className}`}>
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble des rôles</h2>
            <p className="text-gray-600">
              Statistiques et répartition des rôles dans l'organisation
            </p>
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-green-600">{totalActiveUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs inactifs</p>
                <p className="text-2xl font-bold text-red-600">{totalInactiveUsers}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rôles différents</p>
                <p className="text-2xl font-bold text-purple-600">
                  {roleStats.filter(stat => stat.count > 0).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Répartition par rôle */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste détaillée des rôles */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition par rôle
            </h3>
            
            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-500 text-center py-8">Chargement...</p>
              ) : (
                roleStats
                  .sort((a, b) => getRoleLevel(b.role) - getRoleLevel(a.role))
                  .map((stat) => (
                    <div
                      key={stat.role}
                      className={`border rounded-lg p-4 ${getRoleColor(stat.role)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getRoleIcon(stat.role)}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {ROLE_LABELS[stat.role]}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Niveau {getRoleLevel(stat.role)} • {getPermissionCount(stat.role)} permissions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {stat.count}
                          </p>
                          <p className="text-sm text-gray-600">
                            {stat.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      
                      {/* Détail actifs/inactifs */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-green-600">
                            {stat.activeCount} actifs
                          </span>
                          {stat.inactiveCount > 0 && (
                            <span className="text-red-600">
                              {stat.inactiveCount} inactifs
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>

          {/* Insights et analyses */}
          <div className="space-y-4">
            {/* Rôle le plus privilégié */}
            {mostPrivilegedRole && (
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium text-gray-900">Rôle le plus privilégié</h4>
                </div>
                <div className="flex items-center gap-3">
                  {getRoleIcon(mostPrivilegedRole.role)}
                  <div>
                    <p className="font-medium">{ROLE_LABELS[mostPrivilegedRole.role]}</p>
                    <p className="text-sm text-gray-600">
                      {mostPrivilegedRole.count} utilisateur(s) • {getPermissionCount(mostPrivilegedRole.role)} permissions
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Rôle le moins privilégié */}
            {leastPrivilegedRole && (
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                  <h4 className="font-medium text-gray-900">Rôle le moins privilégié</h4>
                </div>
                <div className="flex items-center gap-3">
                  {getRoleIcon(leastPrivilegedRole.role)}
                  <div>
                    <p className="font-medium">{ROLE_LABELS[leastPrivilegedRole.role]}</p>
                    <p className="text-sm text-gray-600">
                      {leastPrivilegedRole.count} utilisateur(s) • {getPermissionCount(leastPrivilegedRole.role)} permissions
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Activité */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium text-gray-900">Activité</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taux d'activité</span>
                  <span className="font-medium">
                    {totalUsers > 0 ? ((totalActiveUsers / totalUsers) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ 
                      width: `${totalUsers > 0 ? (totalActiveUsers / totalUsers) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Répartition hiérarchique */}
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <h4 className="font-medium text-gray-900">Répartition hiérarchique</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Direction</span>
                  <span className="font-medium">
                    {roleStats
                      .filter(stat => 
                        stat.role === UserRole.SUPER_ADMIN || 
                        stat.role === UserRole.HR_DIRECTOR
                      )
                      .reduce((sum, stat) => sum + stat.count, 0)
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Management</span>
                  <span className="font-medium">
                    {roleStats
                      .filter(stat => 
                        stat.role === UserRole.HR_MANAGER ||
                        stat.role === UserRole.RECRUITER_SENIOR
                      )
                      .reduce((sum, stat) => sum + stat.count, 0)
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opérationnel</span>
                  <span className="font-medium">
                    {roleStats
                      .filter(stat => 
                        stat.role === UserRole.RECRUITER ||
                        stat.role === UserRole.HR_ASSISTANT
                      )
                      .reduce((sum, stat) => sum + stat.count, 0)
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation</span>
                  <span className="font-medium">
                    {roleStats
                      .filter(stat => stat.role === UserRole.CONSULTANT)
                      .reduce((sum, stat) => sum + stat.count, 0)
                    }
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}