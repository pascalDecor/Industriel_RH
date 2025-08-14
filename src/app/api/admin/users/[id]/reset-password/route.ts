import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole, UserRole } from '@/types/server-auth';
import { 
  generateSecurePassword, 
  generateFirstLoginToken, 
  getTempPasswordExpiration, 
  getFirstLoginTokenExpiration 
} from '@/lib/password-utils';
import { sendWelcomeEmail } from '@/lib/email-service';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/connect_db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: userId } = await params;

    // Récupérer l'utilisateur avec ses rôles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        userRoles: {
          where: { isActive: true, isPrimary: true },
          select: { role: true }
        }
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
        { error: 'Impossible de réinitialiser le mot de passe d\'un utilisateur inactif' },
        { status: 400 }
      );
    }

    // Générer un nouveau mot de passe temporaire et token
    const tempPassword = await generateSecurePassword();
    const firstLoginToken = await generateFirstLoginToken();
    const tempPasswordExpires = await getTempPasswordExpiration();
    const firstLoginTokenExpires = await getFirstLoginTokenExpiration();

    // Hasher le nouveau mot de passe temporaire
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: true,
        tempPasswordExpires,
        firstLoginToken,
        firstLoginTokenExpires
      }
    });

    // Envoyer l'email avec les nouveaux identifiants
    const primaryRole = user.userRoles[0]?.role as UserRole || UserRole.CONSULTANT;
    const emailSent = await sendWelcomeEmail({
      name: user.name,
      email: user.email,
      role: primaryRole,
      tempPassword,
      firstLoginToken
    });

    // Log de sécurité
    console.log(`🔑 Mot de passe réinitialisé pour ${user.name} (${user.email}) par ${currentUser.name} (${currentUser.email})`);

    return NextResponse.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      emailSent
    });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}