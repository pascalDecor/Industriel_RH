import { NextResponse } from 'next/server';
import prisma from '@/lib/connect_db';

export async function GET() {
  try {
    // Période pour les comparaisons (30 derniers jours)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    console.log('Fetching basic counts...');

    // Statistiques de base - une par une pour identifier les erreurs
    const totalApplications = await prisma.application.count().catch(() => 0);
    console.log('Applications count:', totalApplications);

    const totalHires = await prisma.hire.count().catch(() => 0);
    console.log('Hires count:', totalHires);

    const totalContacts = await prisma.contact.count().catch(() => 0);
    console.log('Contacts count:', totalContacts);

    const totalArticles = await prisma.article.count({
      where: { published: true }
    }).catch(() => 0);
    console.log('Articles count:', totalArticles);

    const totalNewsletterSubscribers = await prisma.newsletter.count({
      where: { status: 'active' }
    }).catch(() => 0);
    console.log('Newsletter count:', totalNewsletterSubscribers);

    // Données récentes
    const recentApplications = await prisma.application.count({
      where: { createdAt: { gte: lastMonth } }
    }).catch(() => 0);

    const recentHires = await prisma.hire.count({
      where: { createdAt: { gte: lastMonth } }
    }).catch(() => 0);

    const recentContacts = await prisma.contact.count({
      where: { createdAt: { gte: lastMonth } }
    }).catch(() => 0);

    const recentArticles = await prisma.article.count({
      where: {
        published: true,
        createdAt: { gte: lastMonth }
      }
    }).catch(() => 0);

    // 7 derniers jours
    const applicationsLast7Days = await prisma.application.count({
      where: { createdAt: { gte: last7Days } }
    }).catch(() => 0);

    const hiresLast7Days = await prisma.hire.count({
      where: { createdAt: { gte: last7Days } }
    }).catch(() => 0);

    const contactsLast7Days = await prisma.contact.count({
      where: { createdAt: { gte: last7Days } }
    }).catch(() => 0);

    // Données mensuelles simplifiées
    const monthlyApplications = await prisma.application.findMany({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
        }
      },
      select: {
        createdAt: true
      }
    }).catch(() => []);

    const monthlyHires = await prisma.hire.findMany({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
        }
      },
      select: {
        createdAt: true
      }
    }).catch(() => []);

    // Secteurs avec statistiques réelles
    const sectorsStats = await prisma.sector.findMany({
      include: {
        _count: {
          select: {
            candidats: true,
            hires: true
          }
        }
      },
      take: 10
    }).catch(() => []);

    // Fonctions avec statistiques réelles
    const topFunctions = await prisma.function.findMany({
      include: {
        _count: {
          select: {
            candidats: true
          }
        }
      },
      take: 10
    }).catch(() => []);

    // Total des vues d'articles
    const articlesViews = await prisma.article.aggregate({
      _sum: {
        views: true
      },
      where: {
        published: true
      }
    }).catch(() => ({ _sum: { views: 0 } }));

    console.log('All data fetched successfully');

    // Calcul des pourcentages de croissance
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Traitement des données mensuelles
    const processMonthlyData = (records: Array<{ createdAt: Date }>, label: string) => {
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const monthlyCount: Record<string, number> = {};

      // Initialiser avec 0 pour les 6 derniers mois
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        monthlyCount[key] = 0;
      }

      // Compter les occurrences par mois
      records.forEach(record => {
        const date = new Date(record.createdAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (monthlyCount[key] !== undefined) {
          monthlyCount[key]++;
        }
      });

      // Convertir en format pour les graphiques
      const result = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        result.push({
          name: months[date.getMonth()],
          [label]: monthlyCount[key] || 0
        });
      }

      return result;
    };

    // Trier et mapper les données pour l'interface
    const processedSectors = sectorsStats
      .sort((a, b) => (b._count?.candidats || 0) - (a._count?.candidats || 0))
      .slice(0, 5)
      .map(sector => ({
        ...sector,
        _count: {
          applications: sector._count?.candidats || 0,
          hires: sector._count?.hires || 0
        }
      }));

    const processedFunctions = topFunctions
      .sort((a, b) => (b._count?.candidats || 0) - (a._count?.candidats || 0))
      .slice(0, 5)
      .map(func => ({
        ...func,
        _count: {
          applications: func._count?.candidats || 0
        }
      }));

    const response = {
      overview: {
        applications: {
          total: totalApplications,
          recent: recentApplications,
          last7Days: applicationsLast7Days,
          growth: calculateGrowth(recentApplications, totalApplications - recentApplications)
        },
        hires: {
          total: totalHires,
          recent: recentHires,
          last7Days: hiresLast7Days,
          growth: calculateGrowth(recentHires, totalHires - recentHires)
        },
        contacts: {
          total: totalContacts,
          recent: recentContacts,
          last7Days: contactsLast7Days,
          growth: calculateGrowth(recentContacts, totalContacts - recentContacts)
        },
        articles: {
          total: totalArticles,
          recent: recentArticles,
          totalViews: articlesViews._sum.views || 0,
          growth: calculateGrowth(recentArticles, totalArticles - recentArticles)
        },
        newsletter: {
          total: totalNewsletterSubscribers
        }
      },
      charts: {
        applications: processMonthlyData(monthlyApplications, 'candidatures'),
        hires: processMonthlyData(monthlyHires, 'embauches')
      },
      sectors: processedSectors,
      topFunctions: processedFunctions,
      conversionRate: totalApplications > 0 ? Math.round((totalHires / totalApplications) * 100) : 0
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}