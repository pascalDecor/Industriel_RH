import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';

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

    // Vérifier les permissions
    if (!hasPermission(user, Permission.USERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const onlyActive = searchParams.get('onlyActive') === 'true';

    // Construire la requête
    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (onlyActive) whereClause.isActive = true;

    const mediaAssets = await prisma.mediaAsset.findMany({
      where: whereClause,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ],
      select: {
        id: true,
        key: true,
        category: true,
        publicUrl: true,
        fileName: true,
        altText_fr: true,
        altText_en: true,
        width: true,
        height: true,
        fileSize: true,
        mimeType: true,
        priority: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      media: mediaAssets,
      total: mediaAssets.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des médias:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
