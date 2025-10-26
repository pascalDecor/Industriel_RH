import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export async function GET(request: NextRequest) {
  try {
    // Récupération des paramètres de requête
    const url = new URL(request.url);
    const type = url.searchParams.get('type'); // FEATURED, TAG_RESULTS, PROMOTION, CUSTOM
    const position = url.searchParams.get('position'); // Position spécifique

    // Construction de la condition de recherche
    const whereCondition: any = {
      isActive: true
    };

    if (type) {
      whereCondition.type = type;
    }

    if (position) {
      whereCondition.position = parseInt(position);
    }

    // Récupération des featured blocks actifs
    const featuredBlocks = await prisma.featuredBlock.findMany({
      where: whereCondition,
      orderBy: [
        { priority: 'desc' },  // Trier par priorité (plus élevé en premier)
        { position: 'asc' }    // Puis par position
      ]
    });

    // Transformation des données
    const transformedBlocks = featuredBlocks.map(block => ({
      id: block.id,
      createdAt: block.createdAt.toISOString(),
      updatedAt: block.updatedAt.toISOString(),
      titre: block.titre,
      titre_en: block.titre_en,
      description: block.description,
      description_en: block.description_en,
      type: block.type,
      position: block.position,
      bgColor: block.bgColor,
      textColor: block.textColor,
      linkUrl: block.linkUrl,
      linkText: block.linkText,
      linkText_en: block.linkText_en,
      isActive: block.isActive,
      priority: block.priority
    }));

    return NextResponse.json({
      success: true,
      data: transformedBlocks,
      count: transformedBlocks.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des featured blocks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des featured blocks',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
