import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/newsletters/specialities - Récupérer toutes les spécialités avec le nombre d'abonnés
export async function GET(request: NextRequest) {
  try {
    // TODO: Ajouter une vérification d'authentification si nécessaire

    // Récupérer toutes les spécialités
    const specialities = await prisma.specialite.findMany({
      select: {
        id: true,
        libelle: true,
        _count: {
          select: {
            newsletterSubscribers: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: { libelle: 'asc' }
    });

    // Transformer les données pour l'affichage
    const transformedSpecialities = specialities.map(speciality => ({
      id: speciality.id,
      libelle: speciality.libelle,
      subscriberCount: speciality._count.newsletterSubscribers
    }));

    return NextResponse.json({
      specialities: transformedSpecialities
    });

  } catch (error) {
    console.error('Erreur récupération spécialités:', error);
    return NextResponse.json({
      error: 'Erreur lors de la récupération des spécialités'
    }, { status: 500 });
  }
}