import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole } from '@/types/server-auth';
import prisma from '@/lib/prisma';

// GET /api/newsletters/campaigns - Récupérer toutes les campagnes
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

    // Vérifier les permissions de lecture des campagnes
    if (!hasPermission(user, Permission.NEWSLETTERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Récupérer les campagnes avec pagination
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.campaign.count({ where })
    ]);

    // Transformer les données pour l'affichage
    const transformedCampaigns = campaigns.map(campaign => ({
      id: campaign.id,
      title: campaign.title,
      subject: campaign.subject,
      status: campaign.status,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      scheduledAt: campaign.scheduledAt,
      sentAt: campaign.sentAt,
      createdBy: campaign.createdBy,
      audienceType: campaign.audienceType,
      stats: campaign.stats ? JSON.parse(campaign.stats) : null,
      subscriberCount: campaign.subscriberCount || 0
    }));

    return NextResponse.json({
      campaigns: transformedCampaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération campagnes:', error);
    return NextResponse.json({
      error: 'Erreur lors de la récupération des campagnes'
    }, { status: 500 });
  }
}

// POST /api/newsletters/campaigns - Créer une nouvelle campagne
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

    // Vérifier les permissions de création des campagnes
    if (!hasPermission(user, Permission.NEWSLETTERS_CREATE)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      subject,
      content,
      templateId,
      audience,
      testEmails
    } = body;

    // Validation des champs requis
    if (!title || !subject || !content) {
      return NextResponse.json({
        error: 'Titre, objet et contenu sont requis'
      }, { status: 400 });
    }

    // Calculer le nombre d'abonnés selon l'audience
    let subscriberCount = 0;
    if (audience?.type === 'all') {
      subscriberCount = await prisma.newsletter.count({
        where: { status: 'active' }
      });
    } else if (audience?.type === 'specialities' && audience.specialityIds) {
      subscriberCount = await prisma.newsletter.count({
        where: {
          status: 'active',
          specialites: {
            some: {
              id: { in: audience.specialityIds }
            }
          }
        }
      });
    }

    console.log('Sauvegarde campagne avec audience:', audience);
    console.log('User ID:', user.id);

    // Vérifier que l'utilisateur existe
    if (!user.id) {
      return NextResponse.json({
        error: 'Utilisateur non identifié'
      }, { status: 401 });
    }

    // Créer la campagne
    const campaign = await prisma.campaign.create({
      data: {
        title,
        subject,
        content,
        templateId,
        status: 'draft',
        createdById: user.id,
        audienceType: audience?.type || 'all',
        audienceSpecialityIds: audience?.specialityIds ? JSON.stringify(audience.specialityIds) : null,
        subscriberCount,
        testEmails: testEmails ? JSON.stringify(testEmails) : null
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content,
        templateId: campaign.templateId,
        status: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        createdBy: campaign.createdBy,
        audience: {
          type: campaign.audienceType,
          specialityIds: campaign.audienceSpecialityIds ? JSON.parse(campaign.audienceSpecialityIds) : undefined,
          subscriberCount: campaign.subscriberCount
        },
        testEmails: campaign.testEmails ? JSON.parse(campaign.testEmails) : []
      }
    });

  } catch (error) {
    console.error('Erreur création campagne:', error);
    return NextResponse.json({
      error: 'Erreur lors de la création de la campagne'
    }, { status: 500 });
  }
}