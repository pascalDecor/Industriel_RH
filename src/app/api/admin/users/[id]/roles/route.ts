import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermissionMultiRole, canAssignRole } from '@/lib/permissions/multi-role-helpers';
import { Permission, UserWithRoles, UserRole } from '@/types/server-auth';

const prisma = new PrismaClient();

// GET - Récupérer les rôles d'un utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const currentUser = authResult.user as UserWithRoles;

    // Vérifier les permissions de lecture des utilisateurs
    if (!hasPermissionMultiRole(currentUser, Permission.USERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Récupérer les rôles de l'utilisateur
    const userRoles = await prisma.userRoleAssignment.findMany({
      where: { 
        userId: id,
        isActive: true
      },
      orderBy: [
        { isPrimary: 'desc' },
        { assignedAt: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      userRoles
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un rôle à un utilisateur
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const currentUser = authResult.user as UserWithRoles;

    // Vérifier les permissions d'assignation de rôles
    if (!hasPermissionMultiRole(currentUser, Permission.ROLES_ASSIGN)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes pour assigner des rôles' },
        { status: 403 }
      );
    }

    const { role, isPrimary = false, expiresAt } = await request.json();

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
      include: {
        userRoles: {
          where: { isActive: true }
        }
      }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur peut assigner ce rôle
    if (!canAssignRole(currentUser, role)) {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas assigner ce rôle' },
        { status: 403 }
      );
    }

    // Vérifier si l'utilisateur a déjà ce rôle
    const existingRole = await prisma.userRoleAssignment.findUnique({
      where: {
        userId_role: {
          userId: id,
          role: role
        }
      }
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'L\'utilisateur a déjà ce rôle' },
        { status: 409 }
      );
    }

    // Si on assigne un rôle principal, désactiver l'ancien rôle principal
    if (isPrimary) {
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
    }

    // Créer la nouvelle assignation de rôle
    const newRoleAssignment = await prisma.userRoleAssignment.create({
      data: {
        userId: id,
        role: role as UserRole,
        isPrimary,
        assignedBy: currentUser.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    // Log de l'action
    console.log(`Role assignment: User ${currentUser.name} assigned role ${role} to user ${targetUser.name}`);

    return NextResponse.json({
      success: true,
      roleAssignment: newRoleAssignment,
      message: `Rôle ${role} assigné avec succès`
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de l\'assignation du rôle:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}