"use client";

import { PermissionGuard } from '@/components/ui/PermissionGuard';
import { Permission } from '@/types/auth';
import { usePermissions } from '@/hooks/usePermissions';

export default function DebugPermissionGuard() {
  const { 
    user, 
    hasAllPermissions, 
    hasAnyPermission,
    userRole,
    isActive
  } = usePermissions();

  const testPermissions = [Permission.USERS_READ, Permission.USERS_UPDATE];
  const testAnyPermissions = [Permission.USERS_READ, Permission.USERS_UPDATE];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug PermissionGuard</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">User State:</h2>
        <p>User: {user ? user.email : 'null'}</p>
        <p>Role: {userRole}</p>
        <p>Is Active: {isActive?.toString()}</p>
        <p>Has USERS_READ: {hasAllPermissions([Permission.USERS_READ]).toString()}</p>
        <p>Has all test permissions: {hasAllPermissions(testPermissions).toString()}</p>
        <p>Has any test permissions: {hasAnyPermission(testAnyPermissions).toString()}</p>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold">Test PermissionGuard avec anyPermissions:</h2>
        <PermissionGuard 
          anyPermissions={[Permission.USERS_READ, Permission.USERS_UPDATE]}
          showUnauthorized={true}
        >
          <div className="bg-green-100 p-4 rounded">
            ✅ Accès autorisé avec anyPermissions (USERS_READ OU USERS_UPDATE)
          </div>
        </PermissionGuard>

        <h2 className="font-bold">Test PermissionGuard avec permissions (toutes requises):</h2>
        <PermissionGuard 
          permissions={[Permission.USERS_READ]}
          showUnauthorized={true}
        >
          <div className="bg-green-100 p-4 rounded">
            ✅ Accès autorisé avec permissions (USERS_READ requis)
          </div>
        </PermissionGuard>
      </div>
    </div>
  );
}