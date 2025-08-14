"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import RoleOverview from '@/components/admin/RoleOverview';
import PermissionsMatrix from '@/components/admin/PermissionsMatrix';
import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { Permission } from '@/types/auth';
import { 
  Users, 
  Shield, 
  Eye, 
  Settings 
} from 'lucide-react';

type ViewMode = 'overview' | 'matrix' | 'settings';

export default function RolesPage() {
  const [activeView, setActiveView] = useState<ViewMode>('overview');

  const views = [
    {
      id: 'overview' as ViewMode,
      name: 'Vue d\'ensemble',
      icon: Eye,
      description: 'Statistiques et répartition des rôles'
    },
    {
      id: 'matrix' as ViewMode,
      name: 'Matrice des permissions',
      icon: Shield,
      description: 'Visualiser les permissions par rôle'
    },
    {
      id: 'settings' as ViewMode,
      name: 'Configuration',
      icon: Settings,
      description: 'Gérer les paramètres des rôles'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <RoleOverview />;
      case 'matrix':
        return <PermissionsMatrix />;
      case 'settings':
        return (
          <Card className="p-8 text-center">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Configuration des rôles
            </h3>
            <p className="text-gray-600">
              Cette section sera bientôt disponible pour configurer les paramètres avancés des rôles.
            </p>
          </Card>
        );
      default:
        return <RoleOverview />;
    }
  };

  return (
    <PermissionGuard 
      anyPermissions={[Permission.USERS_READ, Permission.ROLES_MANAGE]}
      showUnauthorized={true}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des rôles</h1>
            <p className="text-gray-600">
              Administrez les rôles et permissions de votre organisation
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Administration</span>
          </div>
        </div>

        {/* Navigation des vues */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-2">
            {views.map((view) => {
              const Icon = view.icon;
              const isActive = activeView === view.id;
              
              return (
                <Button
                  key={view.id}
                  variant={isActive ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center gap-2 ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {view.name}
                </Button>
              );
            })}
          </div>
          
          {/* Description de la vue active */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {views.find(v => v.id === activeView)?.description}
            </p>
          </div>
        </Card>

        {/* Contenu de la vue */}
        <div className="min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </PermissionGuard>
  );
}