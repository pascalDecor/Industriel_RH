import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission, isRoleHigherThan, getAssignableRoles } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole, UserRole } from '@/types/server-auth';
import prisma from '@/lib/connect_db';

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
        isActive: true,
        userRoles: {
          where: { isActive: true },
          select: {
            role: true,
            isPrimary: true
          }
        }
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher l'auto-modification de rôle pour certains cas
    const targetUserCurrentRoles = targetUser.userRoles.map(ur => ur.role);
    if (currentUser.id === id && !targetUserCurrentRoles.includes(role)) {
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
    if (!targetUserCurrentRoles.includes(role) && !assignableRoles.includes(role)) {
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

    // Créer ou mettre à jour l'assignation de rôle
    await prisma.userRoleAssignment.upsert({
      where: {
        userId_role: {
          userId: id,
          role: role as UserRole
        }
      },
      update: {
        isActive: true,
        assignedBy: currentUser.id,
        assignedAt: new Date()
      },
      create: {
        userId: id,
        role: role as UserRole,
        isActive: true,
        isPrimary: targetUser.userRoles.length === 0, // Premier rôle = principal
        assignedBy: currentUser.id
      }
    });

    // Récupérer l'utilisateur mis à jour avec ses rôles
    const updatedUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        lastLogin: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          where: { isActive: true },
          select: {
            role: true,
            isPrimary: true,
            assignedAt: true
          }
        }
      }
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération de l\'utilisateur mis à jour' },
        { status: 500 }
      );
    }

    // Log de l'action (optionnel, pour audit)
    console.log(`Role change: User ${currentUser.name} (${currentUser.email}) assigned role ${role} to user ${updatedUser.name} (${updatedUser.email})`);

    const primaryRole = updatedUser.userRoles.find(ur => ur.isPrimary) || updatedUser.userRoles[0];
    
    const transformedUser: UserWithRole = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: primaryRole?.role as UserRole,
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin || undefined,
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