import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const userId = params.id;

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Impossible de forcer le changement de mot de passe d\'un utilisateur inactif' },
        { status: 400 }
      );
    }

    // Forcer le changement de mot de passe à la prochaine connexion
    await prisma.user.update({
      where: { id: userId },
      data: {
        mustChangePassword: true
      }
    });

    // Log de sécurité
    console.log(`🔒 Changement de mot de passe forcé pour ${user.name} (${user.email}) par ${currentUser.name} (${currentUser.email})`);

    return NextResponse.json({
      success: true,
      message: 'L\'utilisateur devra changer son mot de passe à sa prochaine connexion'
    });

  } catch (error) {
    console.error('Erreur lors du forçage du changement de mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}