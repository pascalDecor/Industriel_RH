import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission } from '@/types/server-auth';
import prisma from '@/lib/connect_db';

/** GET - Liste toutes les permissions (pour la configuration des rôles) */
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    const user = authResult.user as { permissions?: string[]; isActive?: boolean };
    if (!hasPermission(user, Permission.ROLES_MANAGE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes (roles.manage requis)' },
        { status: 403 }
      );
    }

    const permissions = await prisma.permission.findMany({
      orderBy: [{ category: 'asc' }, { code: 'asc' }]
    });

    const byCategory = permissions.reduce<Record<string, { id: string; code: string; label: string; category: string | null }[]>>(
      (acc, p) => {
        const cat = p.category ?? 'AUTRE';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({
          id: p.id,
          code: p.code,
          label: p.label,
          category: p.category
        });
        return acc;
      },
      {}
    );

    return NextResponse.json({
      permissions,
      byCategory: Object.fromEntries(
        Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))
      )
    });
  } catch (error) {
    console.error('Erreur GET /api/admin/permissions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
