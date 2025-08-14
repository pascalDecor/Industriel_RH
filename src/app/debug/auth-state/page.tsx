"use client";

import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types/auth';

export default function DebugAuthState() {
  const authData = useAuth();

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Debug Auth State</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Auth State:</h2>
        <pre className="text-sm">
          {JSON.stringify({
            authenticated: authData.authenticated,
            loading: authData.loading,
            error: authData.error,
            user: authData.user ? {
              id: authData.user.id,
              email: authData.user.email,
              name: authData.user.name,
              role: authData.user.role,
              isActive: authData.user.isActive
            } : null,
            userRole: authData.userRole,
            accessLevel: authData.accessLevel,
            isActive: authData.isActive
          }, null, 2)}
        </pre>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <h2 className="font-bold mb-2">Permission Tests:</h2>
        <p>hasPermission(USERS_READ): {authData.hasPermission(Permission.USERS_READ).toString()}</p>
        <p>hasPermission(USERS_UPDATE): {authData.hasPermission(Permission.USERS_UPDATE).toString()}</p>
        <p>hasAllPermissions([USERS_READ]): {authData.hasAllPermissions([Permission.USERS_READ]).toString()}</p>
        <p>hasAnyPermission([USERS_READ, USERS_UPDATE]): {authData.hasAnyPermission([Permission.USERS_READ, Permission.USERS_UPDATE]).toString()}</p>
        <p>canManageUsers: {authData.canManageUsers.toString()}</p>
        <p>hasAdminAccess: {authData.hasAdminAccess.toString()}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded">
        <h2 className="font-bold mb-2">Actions:</h2>
        <button 
          onClick={() => authData.refresh()}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Refresh Auth
        </button>
        <button 
          onClick={() => authData.logout()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}