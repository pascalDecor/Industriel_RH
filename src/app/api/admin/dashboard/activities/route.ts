import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export async function GET() {
  try {
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      recentApplications,
      recentHires,
      recentContacts,
      recentArticles,
      recentNewsletterSubscriptions,
      recentActivityLogs
    ] = await Promise.all([
      // Applications récentes
      prisma.application.findMany({
        where: { createdAt: { gte: last30Days } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          sector: {
            select: { libelle: true }
          },
          function: {
            select: { libelle: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // Demandes d'embauche récentes
      prisma.hire.findMany({
        where: { createdAt: { gte: last30Days } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company_name: true,
          createdAt: true,
          number_of_positions: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // Contacts récents
      prisma.contact.findMany({
        where: { createdAt: { gte: last30Days } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          message: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // Articles récemment publiés
      prisma.article.findMany({
        where: {
          published: true,
          createdAt: { gte: last30Days }
        },
        select: {
          id: true,
          titre: true,
          views: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),

      // Nouvelles inscriptions newsletter
      prisma.newsletter.findMany({
        where: {
          subscribedAt: { gte: last30Days },
          status: 'active'
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          subscribedAt: true
        },
        orderBy: { subscribedAt: 'desc' },
        take: 20
      }),

      // Logs d'activité récents (traductions, etc.)
      prisma.activityLog.findMany({
        where: { createdAt: { gte: last30Days } },
        select: {
          id: true,
          type: true,
          action: true,
          entityType: true,
          entityId: true,
          description: true,
          metadata: true,
          createdAt: true,
          userName: true,
          userEmail: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    ]);

    const formatTimeAgo = (date: Date) => {
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 60) {
        return `${diffInMinutes} min`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}h`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days}j`;
      }
    };

    const activities = [
      ...recentApplications.map(app => ({
        id: `app-${app.id}`,
        type: 'application',
        icon: '👤',
        title: 'Nouvelle candidature',
        description: `${app.firstName} ${app.lastName} - ${app.function?.libelle || 'Non spécifié'}`,
        time: formatTimeAgo(app.createdAt),
        createdAt: app.createdAt,
        author: {
          name: `${app.firstName} ${app.lastName}`,
          type: 'candidate'
        }
      })),
      ...recentHires.map(hire => ({
        id: `hire-${hire.id}`,
        type: 'hire',
        icon: '🏢',
        title: "Demande d'embauche",
        description: `${hire.company_name} recherche ${hire.number_of_positions} poste(s)`,
        time: formatTimeAgo(hire.createdAt),
        createdAt: hire.createdAt,
        author: {
          name: `${hire.firstName} ${hire.lastName}`,
          type: 'client'
        }
      })),
      ...recentContacts.map(contact => ({
        id: `contact-${contact.id}`,
        type: 'contact',
        icon: '✉️',
        title: 'Nouveau contact',
        description: `${contact.firstName} ${contact.lastName} - ${contact.companyName || 'Contact'}`,
        time: formatTimeAgo(contact.createdAt),
        createdAt: contact.createdAt,
        author: {
          name: `${contact.firstName} ${contact.lastName}`,
          type: 'contact'
        }
      })),
      ...recentArticles.map(article => ({
        id: `article-${article.id}`,
        type: 'article',
        icon: '📝',
        title: 'Article publié',
        description: `${article.titre} (${article.views} vues)`,
        time: formatTimeAgo(article.createdAt),
        createdAt: article.createdAt,
        author: {
          name: article.author?.name || 'Auteur inconnu',
          type: 'admin'
        }
      })),
      ...recentNewsletterSubscriptions.map(sub => ({
        id: `newsletter-${sub.id}`,
        type: 'newsletter',
        icon: '📧',
        title: 'Inscription newsletter',
        description: `${sub.firstName} ${sub.lastName}`,
        time: formatTimeAgo(sub.subscribedAt || new Date()),
        createdAt: sub.subscribedAt || new Date(),
        author: {
          name: `${sub.firstName} ${sub.lastName}`,
          type: 'subscriber'
        }
      })),
      ...recentActivityLogs.map(log => {
        // Déterminer l'icône et le titre en fonction du type et de l'action
        let icon = '📝';
        let title = log.description;

        if (log.type === 'translation') {
          if (log.action === 'create') {
            icon = '✨';
            title = 'Nouvelle traduction';
          } else if (log.action === 'update') {
            icon = '✏️';
            title = 'Modification traduction';
          } else if (log.action === 'delete') {
            icon = '🗑️';
            title = 'Suppression traduction';
          }
        }

        return {
          id: `activitylog-${log.id}`,
          type: log.type,
          icon,
          title,
          description: log.description,
          time: formatTimeAgo(log.createdAt),
          createdAt: log.createdAt,
          author: {
            name: log.userName,
            type: 'admin'
          }
        };
      })
    ];

    // Trier par date de création et prendre les 10 plus récents
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return NextResponse.json(sortedActivities);
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des activités' },
      { status: 500 }
    );
  }
}