import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';
import prisma from '@/lib/connect_db';
import { getDefaultTranslations } from '@/lib/extractTranslationsFromContext';

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

    let fr: Record<string, string>;
    let en: Record<string, string>;
    try {
      const defaults = getDefaultTranslations();
      fr = defaults.fr;
      en = defaults.en;
    } catch (e) {
      console.error('getDefaultTranslations:', e);
      return NextResponse.json(
        { error: 'Impossible de lire les traductions par défaut (fichier LanguageContext.tsx). En production, utilisez le script : npx tsx scripts/import-all-translations.ts' },
        { status: 503 }
      );
    }

    const keys = Object.keys(fr);

    let added = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const key of keys) {
      try {
        const existing = await prisma.translation.findUnique({ where: { key } });
        if (existing) {
          skipped++;
          continue;
        }

        const category = key.includes('.') ? key.split('.')[0] : null;
        await prisma.translation.create({
          data: {
            key,
            category,
            fr: fr[key] ?? '',
            en: en[key] ?? fr[key] ?? '',
            description: null,
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
    console.error('Erreur lors de la synchronisation des traductions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
