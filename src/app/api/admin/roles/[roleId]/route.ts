import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission } from '@/types/server-auth';
import prisma from '@/lib/connect_db';

type Params = { params: Promise<{ roleId: string }> };

/** GET - Détail d'un rôle avec ses permissions */
export async function GET(request: NextRequest, { params }: Params) {
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

    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: { select: { id: true, code: true, label: true, category: true } }
          }
        },
        userAssignments: {
          where: { isActive: true },
          select: { id: true }
        }
      }
    });

    if (!role) {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      role: {
        id: role.id,
        code: role.code,
        label: role.label,
        description: role.description,
        level: role.level,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.rolePermissions.map((rp) => ({
          id: rp.permission.id,
          code: rp.permission.code,
          label: rp.permission.label,
          category: rp.permission.category
        })),
        userCount: role.userAssignments.length
      }
    });
  } catch (error) {
    console.error('Erreur GET /api/admin/roles/[roleId]:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/** PATCH - Mettre à jour un rôle (label, description, level) */
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
    const { label, description, level } = body as {
      label?: string;
      description?: string;
      level?: number;
    };

    const updateData: { label?: string; description?: string | null; level?: number } = {};
    if (label !== undefined) {
      if (typeof label !== 'string' || !label.trim()) {
        return NextResponse.json(
          { error: 'Le libellé doit être une chaîne non vide' },
          { status: 400 }
        );
      }
      updateData.label = label.trim();
    }
    if (description !== undefined) {
      updateData.description = typeof description === 'string' ? (description.trim() || null) : null;
    }
    if (level !== undefined) {
      const levelNum = Number(level);
      if (Number.isNaN(levelNum) || levelNum < 0) {
        return NextResponse.json(
          { error: 'Le niveau doit être un nombre >= 0' },
          { status: 400 }
        );
      }
      updateData.level = levelNum;
    }

    const role = await prisma.role.update({
      where: { id: roleId },
      data: updateData,
      include: {
        rolePermissions: {
          include: {
            permission: { select: { id: true, code: true, label: true, category: true } }
          }
        },
        userAssignments: {
          where: { isActive: true },
          select: { id: true }
        }
      }
    });

    return NextResponse.json({
      role: {
        id: role.id,
        code: role.code,
        label: role.label,
        description: role.description,
        level: role.level,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: role.rolePermissions.map((rp) => ({
          id: rp.permission.id,
          code: rp.permission.code,
          label: rp.permission.label,
          category: rp.permission.category
        })),
        userCount: role.userAssignments.length
      }
    });
  } catch (error: unknown) {
    const e = error as { code?: string };
    if (e?.code === 'P2025') {
      return NextResponse.json({ error: 'Rôle non trouvé' }, { status: 404 });
    }
    console.error('Erreur PATCH /api/admin/roles/[roleId]:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
