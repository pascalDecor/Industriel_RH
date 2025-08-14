import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermissionMultiRole } from '@/lib/permissions/multi-role-helpers';
import { Permission, UserWithRoles, UserRole } from '@/types/auth';
import prisma from '@/lib/connect_db';

// PATCH - Changer le rôle principal d'un utilisateur
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

    const currentUser = authResult.user as unknown as UserWithRoles;

    // Vérifier les permissions d'assignation de rôles
    if (!hasPermissionMultiRole(currentUser, Permission.ROLES_ASSIGN)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json(
        { error: 'ID de rôle manquant' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'assignation de rôle existe et appartient à l'utilisateur
    const roleAssignment = await prisma.userRoleAssignment.findUnique({
      where: { 
        id: roleId,
        userId: id,
        isActive: true
      }
    });

    if (!roleAssignment) {
      return NextResponse.json(
        { error: 'Assignation de rôle non trouvée ou inactive' },
        { status: 404 }
      );
    }

    // Désactiver l'ancien rôle principal
    await prisma.userRoleAssignment.updateMany({
      where: {
        userId: id,
        isPrimary: true,
        isActive: true
      },
      data: {
        isPrimary: false
      }
    });

    // Définir le nouveau rôle principal
    const updatedRoleAssignment = await prisma.userRoleAssignment.update({
      where: { id: roleId },
      data: {
        isPrimary: true
      }
    });

    // Log de l'action
    console.log(`Primary role change: User ${currentUser.name} set ${updatedRoleAssignment.role} as primary role for user ${targetUser.name}`);

    return NextResponse.json({
      success: true,
      roleAssignment: updatedRoleAssignment,
      message: `Rôle principal changé vers ${updatedRoleAssignment.role}`
    });

  } catch (error) {
    console.error('Erreur lors du changement de rôle principal:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}