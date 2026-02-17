import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/hasPermission';
import { Permission, UserWithRoles } from '@/types/auth';
import prisma from '@/lib/connect_db';

// PATCH - Modifier une assignation de rôle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; roleId: string }> }
) {
  try {
    const { id, roleId } = await params;

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
    if (!hasPermission(currentUser, Permission.ROLES_ASSIGN)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    const { isPrimary, isActive, expiresAt } = updates;

    // Vérifier que l'assignation de rôle existe
    const roleAssignment = await prisma.userRoleAssignment.findUnique({
      where: { id: roleId },
      include: {
        user: true
      }
    });

    if (!roleAssignment || roleAssignment.userId !== id) {
      return NextResponse.json(
        { error: 'Assignation de rôle non trouvée' },
        { status: 404 }
      );
    }

    // Si on définit comme rôle principal, désactiver les autres rôles principaux
    if (isPrimary === true) {
      await prisma.userRoleAssignment.updateMany({
        where: {
          userId: id,
          isPrimary: true,
          isActive: true,
          id: { not: roleId }
        },
        data: {
          isPrimary: false
        }
      });
    }

    // Mettre à jour l'assignation de rôle
    const updatedRoleAssignment = await prisma.userRoleAssignment.update({
      where: { id: roleId },
      data: {
        ...(isPrimary !== undefined && { isPrimary }),
        ...(isActive !== undefined && { isActive }),
        ...(expiresAt !== undefined && { 
          expiresAt: expiresAt ? new Date(expiresAt) : null 
        })
      }
    });

    // Log de l'action
    console.log(`Role update: User ${currentUser.name} updated role assignment ${roleId} for user ${roleAssignment.user.name}`);

    return NextResponse.json({
      success: true,
      roleAssignment: updatedRoleAssignment,
      message: 'Assignation de rôle mise à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'assignation:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une assignation de rôle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; roleId: string }> }
) {
  try {
    const { id, roleId } = await params;

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
    if (!hasPermission(currentUser, Permission.ROLES_ASSIGN)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Vérifier que l'assignation de rôle existe
    const roleAssignment = await prisma.userRoleAssignment.findUnique({
      where: { id: roleId },
      include: {
        user: true
      }
    });

    if (!roleAssignment || roleAssignment.userId !== id) {
      return NextResponse.json(
        { error: 'Assignation de rôle non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier qu'on ne supprime pas le dernier rôle actif
    const activeRolesCount = await prisma.userRoleAssignment.count({
      where: {
        userId: id,
        isActive: true
      }
    });

    if (activeRolesCount <= 1 && roleAssignment.isActive) {
      return NextResponse.json(
        { error: 'Impossible de supprimer le dernier rôle actif de l\'utilisateur' },
        { status: 400 }
      );
    }

    // Si c'est le rôle principal qu'on supprime, en définir un autre comme principal
    if (roleAssignment.isPrimary && roleAssignment.isActive) {
      const nextRole = await prisma.userRoleAssignment.findFirst({
        where: {
          userId: id,
          isActive: true,
          id: { not: roleId }
        },
        orderBy: { assignedAt: 'asc' }
      });

      if (nextRole) {
        await prisma.userRoleAssignment.update({
          where: { id: nextRole.id },
          data: { isPrimary: true }
        });
      }
    }

    // Supprimer l'assignation de rôle (ou la désactiver selon la stratégie)
    await prisma.userRoleAssignment.delete({
      where: { id: roleId }
    });

    // Alternative: désactiver au lieu de supprimer (pour l'audit)
    // await prisma.userRoleAssignment.update({
    //   where: { id: roleId },
    //   data: { isActive: false }
    // });

    // Log de l'action
    console.log(`Role removal: User ${currentUser.name} removed role ${roleAssignment.role} from user ${roleAssignment.user.name}`);

    return NextResponse.json({
      success: true,
      message: 'Rôle supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du rôle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}