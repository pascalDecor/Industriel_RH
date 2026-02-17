import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission } from '@/types/server-auth';
import prisma from '@/lib/connect_db';

type Params = { params: Promise<{ roleId: string }> };

/** PATCH - Mettre à jour les permissions d'un rôle (remplace la liste) */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { roleId } = await params;
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

    const body = await request.json();
    const { permissionIds } = body as { permissionIds?: string[] };

    if (!Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: 'permissionIds doit être un tableau' },
        { status: 400 }
      );
    }

    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });
    if (!role) {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }

    const validIds = await prisma.permission.findMany({
      where: { id: { in: permissionIds } },
      select: { id: true }
    });
    const validIdSet = new Set(validIds.map((p) => p.id));
    const toSet = permissionIds.filter((id) => validIdSet.has(id));

    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      ...(toSet.length > 0
        ? [
            prisma.rolePermission.createMany({
              data: toSet.map((permissionId) => ({ roleId, permissionId }))
            })
          ]
        : [])
    ]);

    const updated = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: { select: { id: true, code: true, label: true, category: true } }
          }
        }
      }
    });

    return NextResponse.json({
      role: updated
        ? {
            id: updated.id,
            code: updated.code,
            label: updated.label,
            permissions: updated.rolePermissions.map((rp) => ({
              id: rp.permission.id,
              code: rp.permission.code,
              label: rp.permission.label,
              category: rp.permission.category
            }))
          }
        : null
    });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }
    console.error('Erreur PATCH /api/admin/roles/[roleId]/permissions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
