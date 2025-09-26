import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';
import prisma from '@/lib/connect_db';

export async function GET(request: NextRequest) {
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

    // Vérifier les permissions de lecture des newsletters
    if (!hasPermission(user, Permission.NEWSLETTERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Récupération des paramètres de requête
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('search') || '';
    const pageSize = 10;

    // Construction de la condition de recherche
    const searchCondition = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    // Comptage total avec condition de recherche
    const totalCount = await prisma.newsletter.count({
      where: searchCondition
    });

    // Récupération des données avec pagination
    const newsletters = await prisma.newsletter.findMany({
      where: searchCondition,
      include: {
        specialites: {
          select: {
            id: true,
            libelle: true,
            libelle_en: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(totalCount / pageSize);

    // Transformation des données pour correspondre au modèle frontend
    const transformedNewsletters = newsletters.map(newsletter => ({
      id: newsletter.id,
      createdAt: newsletter.createdAt.toISOString(),
      updatedAt: newsletter.updatedAt.toISOString(),
      firstName: newsletter.firstName,
      lastName: newsletter.lastName,
      email: newsletter.email,
      specialites: newsletter.specialites,
      subscribedAt: newsletter.subscribedAt?.toISOString(),
      status: newsletter.status,
      unsubscribedAt: newsletter.unsubscribedAt?.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: transformedNewsletters,
      meta: {
        page,
        pageSize,
        totalPages,
        total: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des newsletters:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

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

    // Suppression en lot
    const deleteResult = await prisma.newsletter.deleteMany({
      where: {
        email: {
          in: emails
        }
      }
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `${deleteResult.count} abonnement(s) supprimé(s) avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la suppression des newsletters:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}