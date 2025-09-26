import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendMail } from '@/lib/mail';

// POST /api/newsletters/send-mail - Envoyer un email de test ou une campagne
export async function POST(request: NextRequest) {
  try {
    // TODO: Ajouter une vérification d'authentification si nécessaire

    const body = await request.json();
    console.log('Requête send-mail reçue:', body);

    const { type, campaignId, testEmails, scheduledAt } = body;

    // Validation des paramètres
    if (!type) {
      console.error('Type manquant dans la requête');
      return NextResponse.json({
        error: 'Type d\'envoi requis'
      }, { status: 400 });
    }

    if (!campaignId) {
      console.error('Campaign ID manquant dans la requête');
      return NextResponse.json({
        error: 'ID de campagne requis'
      }, { status: 400 });
    }

    // Récupérer la campagne
    console.log('Recherche de la campagne avec ID:', campaignId);
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        createdBy: true
      }
    });

    if (!campaign) {
      console.error('Campagne non trouvée pour l\'ID:', campaignId);
      return NextResponse.json({
        error: 'Campagne non trouvée'
      }, { status: 404 });
    }

    console.log('Campagne trouvée:', { id: campaign.id, title: campaign.title });

    if (type === 'test') {
      // Envoi de test
      if (!testEmails || !Array.isArray(testEmails) || testEmails.length === 0) {
        return NextResponse.json({
          error: 'Emails de test requis'
        }, { status: 400 });
      }

      // Préparer le contenu de l'email de test
      const testContent = `
        <div style="border: 3px solid #ff6b35; padding: 20px; margin: 20px 0; background-color: #fff3e0; border-radius: 8px;">
          <h2 style="color: #ff6b35; margin: 0 0 10px 0;">⚠️ EMAIL DE TEST</h2>
          <p style="margin: 0; font-weight: bold;">Ceci est un email de test pour la campagne: ${campaign.title}</p>
        </div>
        ${campaign.content}
      `;

      // Envoyer à tous les emails de test en une seule fois avec template
      const success = await sendMail(
        testEmails,
        `[TEST] ${campaign.subject}`,
        '',
        testContent,
        {
          templateId: campaign.templateId || 'basic',
          title: campaign.title,
          content: campaign.content
        }
      );

      return NextResponse.json({
        success: true,
        message: `Email de test envoyé à ${testEmails.length} destinataire(s)`
      });

    } else if (type === 'send') {
      // Envoi immédiat de la campagne

      // Mettre à jour le statut de la campagne
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'sending',
          sentAt: new Date(),
        }
      });

      // Récupérer les destinataires selon l'audience
      let recipients: string[] = [];

      // Reconstruire l'objet audience depuis les champs de la base
      const audience = {
        type: campaign.audienceType,
        specialityIds: campaign.audienceSpecialityIds ? JSON.parse(campaign.audienceSpecialityIds) : undefined
      };

      console.log('Configuration audience:', audience);

      if (!audience.type) {
        console.error('Configuration d\'audience manquante');
        return NextResponse.json({
          error: 'Configuration d\'audience requise'
        }, { status: 400 });
      }

      if (audience.type === 'all') {
        // Tous les abonnés actifs
        console.log('Récupération de tous les abonnés actifs');
        const subscribers = await prisma.newsletter.findMany({
          where: { status: 'active' },
          select: { email: true }
        });
        recipients = subscribers.map(s => s.email);
        console.log(`${recipients.length} abonnés trouvés`);

      } else if (audience.type === 'specialities' && audience.specialityIds) {
        // Abonnés par spécialités
        console.log('Récupération des abonnés par spécialités:', audience.specialityIds);
        const subscribers = await prisma.newsletter.findMany({
          where: {
            status: 'active',
            specialites: {
              some: {
                id: { in: audience.specialityIds }
              }
            }
          },
          select: { email: true }
        });
        recipients = subscribers.map(s => s.email);
        console.log(`${recipients.length} abonnés trouvés pour les spécialités`);

      }

      if (recipients.length === 0) {
        return NextResponse.json({
          error: 'Aucun destinataire trouvé'
        }, { status: 400 });
      }

      // Envoyer par petits lots avec envoi individuel
      const batchSize = 10; // Petits lots pour un meilleur contrôle
      let sentCount = 0;
      let errorCount = 0;

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);

        try {
          console.log(`📧 Traitement du lot ${Math.floor(i/batchSize) + 1}/${Math.ceil(recipients.length/batchSize)} (${batch.length} destinataires)`);

          // La fonction sendMail va maintenant envoyer individuellement à chaque destinataire du lot
          const success = await sendMail(
            batch,
            campaign.subject,
            '',
            campaign.content,
            {
              templateId: campaign.templateId || 'basic',
              title: campaign.title,
              content: campaign.content
            }
          );

          if (success) {
            // Le nombre exact sera géré par la fonction sendMail
            console.log(`✅ Lot ${Math.floor(i/batchSize) + 1} traité - emails envoyés individuellement`);
            sentCount += batch.length; // Optimiste, mais sera ajusté si nécessaire
          } else {
            console.log(`❌ Échec du lot ${Math.floor(i/batchSize) + 1}`);
            errorCount += batch.length;
          }
        } catch (error) {
          console.error('Erreur traitement lot:', error);
          errorCount += batch.length;
        }

        // Pause entre les lots pour éviter la surcharge
        if (i + batchSize < recipients.length) {
          console.log('⏱️ Pause de 10 secondes entre les lots...');
          await new Promise(resolve => setTimeout(resolve, 10000)); // 10 secondes
        }
      }

      // Mettre à jour les statistiques de la campagne
      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'sent',
          stats: JSON.stringify({
            totalSent: sentCount,
            delivered: sentCount,
            opened: 0,
            clicked: 0,
            bounced: errorCount,
            unsubscribed: 0,
            openRate: 0,
            clickRate: 0,
            bounceRate: errorCount > 0 ? (errorCount / (sentCount + errorCount)) * 100 : 0
          })
        }
      });

      return NextResponse.json({
        success: true,
        message: `Campagne envoyée à ${sentCount} destinataire(s)`,
        stats: {
          sent: sentCount,
          errors: errorCount
        }
      });

    } else if (type === 'schedule') {
      // Planification d'envoi
      if (!scheduledAt) {
        return NextResponse.json({
          error: 'Date de planification requise'
        }, { status: 400 });
      }

      const scheduledDate = new Date(scheduledAt);
      if (scheduledDate <= new Date()) {
        return NextResponse.json({
          error: 'La date de planification doit être dans le futur'
        }, { status: 400 });
      }

      await prisma.campaign.update({
        where: { id: campaignId },
        data: {
          status: 'scheduled',
          scheduledAt: scheduledDate,
        }
      });

      return NextResponse.json({
        success: true,
        message: `Campagne planifiée pour le ${scheduledDate.toLocaleString('fr-FR')}`
      });

    } else {
      return NextResponse.json({
        error: 'Type d\'envoi non valide'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Erreur envoi email:', error);
    return NextResponse.json({
      error: 'Erreur interne du serveur'
    }, { status: 500 });
  }
}