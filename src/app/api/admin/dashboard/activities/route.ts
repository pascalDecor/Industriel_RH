import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export async function GET() {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      recentApplications,
      recentHires,
      recentContacts,
      recentArticles,
      recentNewsletterSubscriptions
    ] = await Promise.all([
      // Applications récentes
      prisma.application.findMany({
        where: { createdAt: { gte: last24Hours } },
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
        take: 5
      }),

      // Demandes d'embauche récentes
      prisma.hire.findMany({
        where: { createdAt: { gte: last24Hours } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company_name: true,
          createdAt: true,
          number_of_positions: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Contacts récents
      prisma.contact.findMany({
        where: { createdAt: { gte: last24Hours } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          companyName: true,
          message: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Articles récemment publiés
      prisma.article.findMany({
        where: {
          published: true,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        },
        select: {
          id: true,
          titre: true,
          views: true,
          createdAt: true,
          author: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),

      // Nouvelles inscriptions newsletter
      prisma.newsletter.findMany({
        where: {
          subscribedAt: { gte: last24Hours },
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
        take: 5
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
        createdAt: app.createdAt
      })),
      ...recentHires.map(hire => ({
        id: `hire-${hire.id}`,
        type: 'hire',
        icon: '🏢',
        title: 'Demande d\'embauche',
        description: `${hire.company_name} recherche ${hire.number_of_positions} poste(s)`,
        time: formatTimeAgo(hire.createdAt),
        createdAt: hire.createdAt
      })),
      ...recentContacts.map(contact => ({
        id: `contact-${contact.id}`,
        type: 'contact',
        icon: '✉️',
        title: 'Nouveau contact',
        description: `${contact.firstName} ${contact.lastName} - ${contact.companyName || 'Contact'}`,
        time: formatTimeAgo(contact.createdAt),
        createdAt: contact.createdAt
      })),
      ...recentArticles.map(article => ({
        id: `article-${article.id}`,
        type: 'article',
        icon: '📝',
        title: 'Article publié',
        description: `${article.titre} (${article.views} vues)`,
        time: formatTimeAgo(article.createdAt),
        createdAt: article.createdAt
      })),
      ...recentNewsletterSubscriptions.map(sub => ({
        id: `newsletter-${sub.id}`,
        type: 'newsletter',
        icon: '📧',
        title: 'Inscription newsletter',
        description: `${sub.firstName} ${sub.lastName}`,
        time: formatTimeAgo(sub.subscribedAt || new Date()),
        createdAt: sub.subscribedAt
      }))
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