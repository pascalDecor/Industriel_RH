import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission, isRoleHigherThan, getAssignableRoles } from '@/lib/permissions/server-permissions';
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

    // Vérifier les permissions d'assignation de rôles
    if (!hasPermission(currentUser, Permission.ROLES_ASSIGN)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour assigner des rôles' },
        { status: 403 }
      );
    }

    const { role } = await request.json();

    // Validation du rôle
    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide' },
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

    // Empêcher l'auto-modification de rôle pour certains cas
    if (currentUser.id === id && role !== targetUser.role) {
      // Super admin peut modifier son propre rôle, mais pas les autres
      if (currentUser.role !== UserRole.SUPER_ADMIN) {
        return NextResponse.json(
          { error: 'Vous ne pouvez pas modifier votre propre rôle' },
          { status: 400 }
        );
      }
    }

    // Vérifier si l'utilisateur actuel peut assigner ce rôle
    const assignableRoles = getAssignableRoles(currentUser.role);
    
    // Cas particulier : si c'est le même rôle, autoriser (pour réactivation par exemple)
    if (role !== targetUser.role && !assignableRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas assigner ce rôle' },
        { status: 403 }
      );
    }

    // Cas particulier : empêcher de créer plusieurs super admins sans autorisation spéciale
    if (role === UserRole.SUPER_ADMIN && currentUser.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Seul un super administrateur peut créer d\'autres super administrateurs' },
        { status: 403 }
      );
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { 
        role: role as UserRole,
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

    // Log de l'action (optionnel, pour audit)
    console.log(`Role change: User ${currentUser.name} (${currentUser.email}) assigned role ${role} to user ${updatedUser.name} (${updatedUser.email})`);

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
      message: `Rôle mis à jour avec succès vers ${role}`
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}