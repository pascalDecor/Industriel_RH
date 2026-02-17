import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission } from '@/types/server-auth';
import prisma from '@/lib/connect_db';

/** GET - Liste tous les rôles avec leurs permissions (pour la configuration) */
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

    const roles = await prisma.role.findMany({
      orderBy: [{ level: 'desc' }, { code: 'asc' }],
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

    const payload = roles.map((r) => ({
      id: r.id,
      code: r.code,
      label: r.label,
      description: r.description,
      level: r.level,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      permissions: r.rolePermissions.map((rp) => ({
        id: rp.permission.id,
        code: rp.permission.code,
        label: rp.permission.label,
        category: rp.permission.category
      })),
      userCount: r.userAssignments.length
    }));

    return NextResponse.json({ roles: payload });
  } catch (error) {
    console.error('Erreur GET /api/admin/roles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

/** POST - Créer un nouveau rôle */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { code, label, description, level } = body as {
      code?: string;
      label?: string;
      description?: string;
      level?: number;
    };

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { error: 'Le code du rôle est requis' },
        { status: 400 }
      );
    }
    const codeNorm = code.trim().toUpperCase().replace(/\s+/g, '_');
    if (!codeNorm) {
      return NextResponse.json(
        { error: 'Code invalide' },
        { status: 400 }
      );
    }
    if (!label || typeof label !== 'string' || !label.trim()) {
      return NextResponse.json(
        { error: 'Le libellé du rôle est requis' },
        { status: 400 }
      );
    }
    const levelNum = level != null ? Number(level) : 0;
    if (Number.isNaN(levelNum) || levelNum < 0) {
      return NextResponse.json(
        { error: 'Le niveau doit être un nombre >= 0' },
        { status: 400 }
      );
    }

    const existing = await prisma.role.findUnique({
      where: { code: codeNorm }
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Un rôle avec ce code existe déjà' },
        { status: 409 }
      );
    }

    const role = await prisma.role.create({
      data: {
        code: codeNorm,
        label: label.trim(),
        description: typeof description === 'string' ? description.trim() || null : null,
        level: levelNum
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
        permissions: [],
        userCount: 0
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur POST /api/admin/roles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
