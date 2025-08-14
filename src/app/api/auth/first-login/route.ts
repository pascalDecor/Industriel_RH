import { NextRequest, NextResponse } from 'next/server';
import { isFirstLoginTokenExpired } from '@/lib/password-utils';
import { validatePasswordStrength } from '@/lib/password-validation';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '@/lib/jwt';
import { serialize } from 'cookie';
import prisma from '@/lib/connect_db';

export async function POST(request: NextRequest) {
  try {
    const { token, tempPassword, newPassword } = await request.json();

    // Validation des données
    if (!token || !tempPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Valider la force du nouveau mot de passe
    const passwordStrength = validatePasswordStrength(newPassword);
    if (!passwordStrength.isValid) {
      return NextResponse.json(
        { 
          error: 'Le mot de passe ne respecte pas les critères de sécurité',
          feedback: passwordStrength.feedback
        },
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
        password: true,
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
        { error: 'Token invalide ou utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le token a expiré
    if (await isFirstLoginTokenExpired(user.firstLoginTokenExpires)) {
      return NextResponse.json(
        { error: 'Token expiré. Contactez votre administrateur.' },
        { status: 410 }
      );
    }

    // Vérifier si le mot de passe temporaire a expiré
    if (user.tempPasswordExpires && new Date() > user.tempPasswordExpires) {
      return NextResponse.json(
        { error: 'Mot de passe temporaire expiré. Contactez votre administrateur.' },
        { status: 410 }
      );
    }

    // Vérifier le mot de passe temporaire
    const isValidTempPassword = await bcrypt.compare(tempPassword, user.password);
    if (!isValidTempPassword) {
      return NextResponse.json(
        { error: 'Mot de passe temporaire incorrect' },
        { status: 401 }
      );
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit être différent du mot de passe temporaire' },
        { status: 400 }
      );
    }

    // Hasher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        mustChangePassword: false,
        tempPasswordExpires: null,
        firstLoginToken: null,
        firstLoginTokenExpires: null,
        lastLogin: new Date()
      }
    });

    // Récupérer le rôle pour le JWT
    const primaryRole = user.userRoles[0];
    if (!primaryRole) {
      return NextResponse.json(
        { error: 'Aucun rôle assigné à l\'utilisateur' },
        { status: 403 }
      );
    }

    // Créer un token JWT pour la session
    const jwtToken = await generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: primaryRole.role
    });

    // Log de sécurité
    console.log(`✅ Première connexion réussie pour ${user.email} (${user.name})`);

    // Créer la réponse avec le cookie de session
    const response = NextResponse.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: primaryRole.role
      }
    });

    // Définir le cookie de session
    response.headers.append(
      'Set-Cookie',
      serialize('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 2 * 60 * 60 // 2 heures (même durée que le JWT)
      })
    );

    return response;

  } catch (error) {
    console.error('Erreur lors de la première connexion:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}