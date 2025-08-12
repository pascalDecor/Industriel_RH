import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole, UserRole } from '@/types/server-auth';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const currentUser = authResult.user as UserWithRole;

    // Vérifier les permissions de modification des utilisateurs
    if (!hasPermission(currentUser, Permission.USERS_UPDATE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { isActive } = await request.json();

    // Validation du statut
    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur cible existe
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher l'auto-désactivation
    if (currentUser.id === id && !isActive) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas désactiver votre propre compte' },
        { status: 400 }
      );
    }

    // Vérifications spéciales pour les super admins
    if (targetUser.role === UserRole.SUPER_ADMIN && !isActive) {
      // Compter le nombre de super admins actifs
      const activeSuperAdmins = await prisma.user.count({
        where: {
          role: UserRole.SUPER_ADMIN,
          isActive: true,
          id: { not: id } // Exclure l'utilisateur qu'on veut désactiver
        }
      });

      // Empêcher la désactivation du dernier super admin
      if (activeSuperAdmins === 0) {
        return NextResponse.json(
          { error: 'Impossible de désactiver le dernier super administrateur' },
          { status: 400 }
        );
      }

      // Seul un autre super admin peut désactiver un super admin
      if (currentUser.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.json(
          { error: 'Seul un super administrateur peut désactiver un autre super administrateur' },
          { status: 403 }
        );
      }
    }

    // Mettre à jour le statut
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        isActive,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Log de l'action
    console.log(`Status change: User ${currentUser.name} (${currentUser.email}) ${isActive ? 'activated' : 'deactivated'} user ${updatedUser.name} (${updatedUser.email})`);

    const transformedUser: UserWithRole = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role as UserRole,
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin,
      avatarUrl: updatedUser.avatarUrl || undefined,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return NextResponse.json({
      success: true,
      user: transformedUser,
      message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}