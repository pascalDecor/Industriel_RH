import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export async function GET() {
  try {
    // Récupérer toutes les traductions
    const translations = await prisma.translation.findMany({
      select: {
        key: true,
        fr: true,
        en: true,
        category: true
      },
      orderBy: {
        key: 'asc'
      }
    });

    // Transformer les données pour correspondre au format attendu par le LanguageContext
    const translationsMap = {
      fr: {} as Record<string, string>,
      en: {} as Record<string, string>
    };

    translations.forEach((translation) => {
      translationsMap.fr[translation.key] = translation.fr;
      translationsMap.en[translation.key] = translation.en;
    });

    return NextResponse.json({
      success: true,
      translations: translationsMap
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des traductions:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
