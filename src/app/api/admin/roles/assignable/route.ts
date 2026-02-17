import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission } from '@/types/server-auth';
import { UserRole } from '@/types/server-auth';
import prisma from '@/lib/connect_db';
import type { AuthApiUser } from '@/lib/auth-middleware';

/** GET - Liste des rôles que l'utilisateur connecté peut assigner (niveau < roleLevel) */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const currentUser = authResult.user as AuthApiUser;
    if (!hasPermission(currentUser, Permission.USERS_CREATE) && !hasPermission(currentUser, Permission.ROLES_ASSIGN)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const currentLevel = currentUser.roleLevel ?? 0;

    const roles = await prisma.role.findMany({
      where: { level: { lt: currentLevel } },
      orderBy: [{ level: 'desc' }, { code: 'asc' }],
      select: { id: true, code: true, label: true, level: true }
    });

    // Ne retourner que les rôles dont le code est dans l'enum (assignables à la création)
    const enumCodes = new Set(Object.values(UserRole));
    const assignable = roles.filter((r) => enumCodes.has(r.code as UserRole));

    return NextResponse.json({ roles: assignable });
  } catch (error) {
    console.error('Erreur GET /api/admin/roles/assignable:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
