import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/newsletters/campaigns/[id] - Récupérer une campagne spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Ajouter une vérification d'authentification si nécessaire

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
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

    if (!campaign) {
      return NextResponse.json({
        error: 'Campagne non trouvée'
      }, { status: 404 });
    }

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        title: campaign.title,
        subject: campaign.subject,
        content: campaign.content,
        templateId: campaign.templateId,
        status: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        scheduledAt: campaign.scheduledAt,
        sentAt: campaign.sentAt,
        createdBy: campaign.createdBy,
        audience: {
          type: campaign.audienceType,
          specialityIds: campaign.audienceSpecialityIds ? JSON.parse(campaign.audienceSpecialityIds) : null,
          subscriberCount: campaign.subscriberCount
        },
        stats: campaign.stats ? JSON.parse(campaign.stats) : null,
        testEmails: campaign.testEmails ? JSON.parse(campaign.testEmails) : []
      }
    });

  } catch (error) {
    console.error('Erreur récupération campagne:', error);
    return NextResponse.json({
      error: 'Erreur lors de la récupération de la campagne'
    }, { status: 500 });
  }
}

// PUT /api/newsletters/campaigns/[id] - Mettre à jour une campagne
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Ajouter une vérification d'authentification si nécessaire

    const { id } = await params;
    const body = await request.json();

    // Vérifier que la campagne existe
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id }
    });

    if (!existingCampaign) {
      return NextResponse.json({
        error: 'Campagne non trouvée'
      }, { status: 404 });
    }

    // Vérifier que la campagne peut être modifiée
    if (!['draft', 'scheduled'].includes(existingCampaign.status)) {
      return NextResponse.json({
        error: 'Cette campagne ne peut plus être modifiée'
      }, { status: 400 });
    }

    const {
      title,
      subject,
      content,
      templateId,
      audience,
      testEmails
    } = body;

    // Calculer le nouveau nombre d'abonnés si l'audience a changé
    let subscriberCount = existingCampaign.subscriberCount;
    if (audience) {
      if (audience.type === 'all') {
        subscriberCount = await prisma.newsletterSubscriber.count({
          where: { isActive: true }
        });
      } else if (audience.type === 'specialities' && audience.specialityIds) {
        subscriberCount = await prisma.newsletterSubscriber.count({
          where: {
            isActive: true,
            specialityId: { in: audience.specialityIds }
          }
        });
      }
    }

    // Mettre à jour la campagne
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(subject && { subject }),
        ...(content && { content }),
        ...(templateId && { templateId }),
        ...(audience && {
          audienceType: audience.type,
          audienceSpecialityIds: audience.specialityIds ? JSON.stringify(audience.specialityIds) : null,
          subscriberCount
        }),
        ...(testEmails && { testEmails: JSON.stringify(testEmails) }),
        updatedAt: new Date()
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
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        subject: updatedCampaign.subject,
        content: updatedCampaign.content,
        templateId: updatedCampaign.templateId,
        status: updatedCampaign.status,
        createdAt: updatedCampaign.createdAt,
        updatedAt: updatedCampaign.updatedAt,
        scheduledAt: updatedCampaign.scheduledAt,
        sentAt: updatedCampaign.sentAt,
        createdBy: updatedCampaign.createdBy,
        audience: {
          type: updatedCampaign.audienceType,
          specialityIds: updatedCampaign.audienceSpecialityIds ? JSON.parse(updatedCampaign.audienceSpecialityIds) : null,
          subscriberCount: updatedCampaign.subscriberCount
        },
        stats: updatedCampaign.stats ? JSON.parse(updatedCampaign.stats) : null,
        testEmails: updatedCampaign.testEmails ? JSON.parse(updatedCampaign.testEmails) : []
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour campagne:', error);
    return NextResponse.json({
      error: 'Erreur lors de la mise à jour de la campagne'
    }, { status: 500 });
  }
}

// DELETE /api/newsletters/campaigns/[id] - Supprimer une campagne
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // TODO: Ajouter une vérification d'authentification si nécessaire

    const { id } = await params;

    // Vérifier que la campagne existe
    const campaign = await prisma.campaign.findUnique({
      where: { id }
    });

    if (!campaign) {
      return NextResponse.json({
        error: 'Campagne non trouvée'
      }, { status: 404 });
    }

    // Vérifier que la campagne peut être supprimée (seulement les brouillons)
    if (campaign.status !== 'draft') {
      return NextResponse.json({
        error: 'Seules les campagnes en brouillon peuvent être supprimées'
      }, { status: 400 });
    }

    // Supprimer la campagne
    await prisma.campaign.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Campagne supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression campagne:', error);
    return NextResponse.json({
      error: 'Erreur lors de la suppression de la campagne'
    }, { status: 500 });
  }
}