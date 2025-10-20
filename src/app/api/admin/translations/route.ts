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

    // Vérifier les permissions (tous les admins peuvent voir les traductions)
    if (!hasPermission(user, Permission.USERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Récupérer le filtre par catégorie depuis les query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Construire la requête Prisma
    const whereClause = category ? { category } : {};

    // Récupérer toutes les traductions
    const translations = await prisma.translation.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      translations,
      total: translations.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des traductions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Vérifier les permissions (seuls les admins peuvent créer des traductions)
    if (!hasPermission(user, Permission.USERS_CREATE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { key, category, fr, en, description } = await request.json();

    // Validation des données
    if (!key || !fr || !en) {
      return NextResponse.json(
        { error: 'Données manquantes (key, fr, en requis)' },
        { status: 400 }
      );
    }

    // Vérifier si la clé existe déjà
    const existingTranslation = await prisma.translation.findUnique({
      where: { key }
    });

    if (existingTranslation) {
      return NextResponse.json(
        { error: 'Une traduction avec cette clé existe déjà' },
        { status: 409 }
      );
    }

    // Créer la traduction
    const newTranslation = await prisma.translation.create({
      data: {
        key,
        category,
        fr,
        en,
        description
      }
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        type: 'translation',
        action: 'create',
        entityType: 'translation',
        entityId: newTranslation.id,
        description: `Création de la traduction "${newTranslation.key}"`,
        metadata: {
          key: newTranslation.key,
          category: newTranslation.category,
          fr: newTranslation.fr,
          en: newTranslation.en
        },
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      }
    });

    return NextResponse.json({
      success: true,
      translation: newTranslation
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la traduction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    // Vérifier les permissions (seuls les admins peuvent modifier des traductions)
    if (!hasPermission(user, Permission.USERS_UPDATE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { id, key, category, fr, en, description } = await request.json();

    // Validation des données
    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    // Vérifier si la traduction existe
    const existingTranslation = await prisma.translation.findUnique({
      where: { id }
    });

    if (!existingTranslation) {
      return NextResponse.json(
        { error: 'Traduction non trouvée' },
        { status: 404 }
      );
    }

    // Si la clé est modifiée, vérifier qu'elle n'existe pas déjà
    if (key && key !== existingTranslation.key) {
      const conflictingTranslation = await prisma.translation.findUnique({
        where: { key }
      });

      if (conflictingTranslation) {
        return NextResponse.json(
          { error: 'Une traduction avec cette clé existe déjà' },
          { status: 409 }
        );
      }
    }

    // Mettre à jour la traduction
    const updatedTranslation = await prisma.translation.update({
      where: { id },
      data: {
        ...(key && { key }),
        ...(category !== undefined && { category }),
        ...(fr && { fr }),
        ...(en && { en }),
        ...(description !== undefined && { description })
      }
    });

    // Logger l'activité
    await prisma.activityLog.create({
      data: {
        type: 'translation',
        action: 'update',
        entityType: 'translation',
        entityId: id,
        description: `Modification de la traduction "${updatedTranslation.key}"`,
        metadata: {
          key: updatedTranslation.key,
          category: updatedTranslation.category,
          oldValues: {
            fr: existingTranslation.fr,
            en: existingTranslation.en
          },
          newValues: {
            fr: updatedTranslation.fr,
            en: updatedTranslation.en
          }
        },
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      }
    });

    return NextResponse.json({
      success: true,
      translation: updatedTranslation
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la traduction:', error);
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

    // Vérifier les permissions (seuls les admins peuvent supprimer des traductions)
    if (!hasPermission(user, Permission.USERS_DELETE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }

    // Vérifier si la traduction existe
    const existingTranslation = await prisma.translation.findUnique({
      where: { id }
    });

    if (!existingTranslation) {
      return NextResponse.json(
        { error: 'Traduction non trouvée' },
        { status: 404 }
      );
    }

    // Logger l'activité avant suppression
    await prisma.activityLog.create({
      data: {
        type: 'translation',
        action: 'delete',
        entityType: 'translation',
        entityId: id,
        description: `Suppression de la traduction "${existingTranslation.key}"`,
        metadata: {
          key: existingTranslation.key,
          category: existingTranslation.category,
          fr: existingTranslation.fr,
          en: existingTranslation.en
        },
        userId: user.id,
        userEmail: user.email,
        userName: user.name
      }
    });

    // Supprimer la traduction
    await prisma.translation.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Traduction supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la traduction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
