import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/newsletters/audience-count - Compter l'audience pour tous les abonnés
export async function GET(request: NextRequest) {
  try {
    // TODO: Ajouter une vérification d'authentification si nécessaire

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'all') {
      const count = await prisma.newsletter.count({
        where: { status: 'active' }
      });

      return NextResponse.json({ count });
    }

    return NextResponse.json({ count: 0 });

  } catch (error) {
    console.error('Erreur comptage audience:', error);
    return NextResponse.json({
      error: 'Erreur lors du comptage de l\'audience'
    }, { status: 500 });
  }
}

// POST /api/newsletters/audience-count - Compter l'audience pour des spécialités spécifiques
export async function POST(request: NextRequest) {
  try {
    // TODO: Ajouter une vérification d'authentification si nécessaire

    const body = await request.json();
    const { type, specialityIds } = body;

    if (type === 'specialities' && specialityIds && Array.isArray(specialityIds)) {
      const count = await prisma.newsletter.count({
        where: {
          status: 'active',
          specialites: {
            some: {
              id: { in: specialityIds }
            }
          }
        }
      });

      return NextResponse.json({ count });
    }

    return NextResponse.json({ count: 0 });

  } catch (error) {
    console.error('Erreur comptage audience spécialités:', error);
    return NextResponse.json({
      error: 'Erreur lors du comptage de l\'audience'
    }, { status: 500 });
  }
}