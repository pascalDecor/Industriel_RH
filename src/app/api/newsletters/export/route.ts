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

    // Vérifier les permissions d'export des newsletters
    if (!hasPermission(user, Permission.NEWSLETTERS_EXPORT)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Récupérer tous les abonnés avec leurs spécialités
    const newsletters = await prisma.newsletter.findMany({
      include: {
        specialites: {
          select: {
            libelle: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Créer le contenu CSV
    const csvHeaders = [
      'Prénom',
      'Nom',
      'Email',
      'Statut',
      'Date d\'abonnement',
      'Date de désabonnement',
      'Centres d\'intérêt'
    ];

    const csvRows = newsletters.map(newsletter => {
      const specialites = newsletter.specialites.map(s => s.libelle).join('; ');
      const subscribedAt = newsletter.subscribedAt
        ? newsletter.subscribedAt.toLocaleDateString('fr-FR')
        : '';
      const unsubscribedAt = newsletter.unsubscribedAt
        ? newsletter.unsubscribedAt.toLocaleDateString('fr-FR')
        : '';

      return [
        newsletter.firstName,
        newsletter.lastName,
        newsletter.email,
        newsletter.status === 'active' ? 'Actif' : 'Désabonné',
        subscribedAt,
        unsubscribedAt,
        specialites
      ];
    });

    // Assembler le CSV
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row =>
        row.map(cell =>
          // Échapper les guillemets et entourer de guillemets si nécessaire
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
            ? `"${cell.replace(/"/g, '""')}"`
            : cell
        ).join(',')
      )
    ].join('\n');

    // Ajouter le BOM UTF-8 pour une meilleure compatibilité avec Excel
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    // Créer la réponse avec les en-têtes appropriés
    const response = new NextResponse(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="newsletters_export_${new Date().toISOString().split('T')[0]}.csv"`,
        'Cache-Control': 'no-cache'
      }
    });

    return response;

  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}