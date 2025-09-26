import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';
import prisma from '@/lib/connect_db';

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const user = authResult.user as UserWithRole;

    // Vérifier les permissions de suppression des newsletters
    if (!hasPermission(user, Permission.NEWSLETTERS_DELETE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { emails } = body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Liste d\'emails requise' },
        { status: 400 }
      );
    }

    // Validation des emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Emails invalides: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    // Vérifier que les emails existent
    const existingNewsletters = await prisma.newsletter.findMany({
      where: {
        email: {
          in: emails
        }
      },
      select: {
        email: true
      }
    });

    const existingEmails = existingNewsletters.map(n => n.email);
    const notFoundEmails = emails.filter(email => !existingEmails.includes(email));

    // Suppression des abonnements existants
    const deleteResult = await prisma.newsletter.deleteMany({
      where: {
        email: {
          in: existingEmails
        }
      }
    });

    // Construire la réponse avec les détails
    const response = {
      success: true,
      deletedCount: deleteResult.count,
      totalRequested: emails.length,
      deletedEmails: existingEmails,
      notFoundEmails: notFoundEmails,
      message: `${deleteResult.count} abonnement(s) supprimé(s) avec succès`
    };

    if (notFoundEmails.length > 0) {
      response.message += `. ${notFoundEmails.length} email(s) non trouvé(s): ${notFoundEmails.join(', ')}`;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur lors de la suppression en lot des newsletters:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}