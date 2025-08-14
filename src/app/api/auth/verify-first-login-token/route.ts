import { NextRequest, NextResponse } from 'next/server';
import { isFirstLoginTokenExpired } from '@/lib/password-utils';
import { ROLE_LABELS } from '@/types/auth';
import prisma from '@/lib/connect_db';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token manquant' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur avec ce token
    const user = await prisma.user.findFirst({
      where: {
        firstLoginToken: token,
        isActive: true,
        mustChangePassword: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        firstLoginTokenExpires: true,
        tempPasswordExpires: true,
        userRoles: {
          where: {
            isActive: true,
            isPrimary: true
          },
          select: {
            role: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Token invalide' },
        { status: 404 }
      );
    }

    // Vérifier si le token a expiré
    if (await isFirstLoginTokenExpired(user.firstLoginTokenExpires)) {
      return NextResponse.json(
        { valid: false, error: 'Token expiré' },
        { status: 410 }
      );
    }

    // Vérifier si le mot de passe temporaire a expiré
    if (user.tempPasswordExpires && new Date() > user.tempPasswordExpires) {
      return NextResponse.json(
        { 
          valid: false, 
          error: 'Mot de passe temporaire expiré. Contactez votre administrateur.' 
        },
        { status: 410 }
      );
    }

    // Récupérer le rôle primaire
    const primaryRole = user.userRoles[0];
    const roleLabel = primaryRole ? ROLE_LABELS[primaryRole.role as keyof typeof ROLE_LABELS] : 'Utilisateur';

    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleLabel
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du token de première connexion:', error);
    return NextResponse.json(
      { valid: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}