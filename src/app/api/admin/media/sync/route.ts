import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';
import prisma from '@/lib/connect_db';
import { getMediaKeysFromImagePathFinder } from '@/lib/extractMediaKeys';

/**
 * Synchronise les clés médias depuis imagePathFinder vers la base.
 * Crée les entrées MediaAsset manquantes (placeholder avec chemin statique, isActive = false).
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = authResult.user as UserWithRole;
    if (!hasPermission(user, Permission.USERS_CREATE)) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    let keys: string[];
    let pathByKey: Record<string, string>;
    try {
      const extracted = getMediaKeysFromImagePathFinder();
      keys = extracted.keys;
      pathByKey = extracted.pathByKey;
    } catch (e) {
      console.error('getMediaKeysFromImagePathFinder:', e);
      return NextResponse.json(
        {
          error:
            'Impossible de lire les clés médias (imagePathFinder). Vérifiez que le fichier utils/imagePathFinder.ts est valide.',
        },
        { status: 503 }
      );
    }

    let added = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const key of keys) {
      try {
        const existing = await prisma.mediaAsset.findUnique({ where: { key } });
        if (existing) {
          skipped++;
          continue;
        }

        const staticPath = pathByKey[key] ?? `/${key}`;
        const fileName = staticPath.split('/').pop() ?? `${key}.png`;

        await prisma.mediaAsset.create({
          data: {
            key,
            category: null,
            publicUrl: staticPath,
            fallbackPath: staticPath,
            fileName,
            altText_fr: null,
            altText_en: null,
            width: null,
            height: null,
            fileSize: null,
            mimeType: null,
            isActive: false,
            priority: 'normal',
            description: null,
            storagePath: null,
            uploadedBy: null,
          },
        });
        added++;
      } catch (err) {
        errors.push(`${key}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    }

    return NextResponse.json({
      success: true,
      added,
      skipped,
      total: keys.length,
      errors: errors.length ? errors : undefined,
    });
  } catch (error) {
    console.error('Erreur lors de la synchronisation des médias:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
