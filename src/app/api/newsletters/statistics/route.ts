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

    // Vérifier les permissions de lecture des newsletters
    if (!hasPermission(user, Permission.NEWSLETTERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Statistiques principales
    const totalSubscribers = await prisma.newsletter.count();

    const activeSubscribers = await prisma.newsletter.count({
      where: { status: 'active' }
    });

    const unsubscribed = await prisma.newsletter.count({
      where: { status: 'unsubscribed' }
    });

    // Calcul du taux d'engagement (basé sur les abonnés actifs)
    const engagementRate = totalSubscribers > 0 ? (activeSubscribers / totalSubscribers) * 100 : 0;

    // Statistiques par spécialités - approche corrigée
    // D'abord, récupérer tous les abonnés actifs avec leurs spécialités
    const activeNewslettersWithSpecialites = await prisma.newsletter.findMany({
      where: { status: 'active' },
      include: {
        specialites: {
          select: {
            id: true,
            libelle: true
          }
        }
      }
    });

    // Compter toutes les relations spécialité-abonné
    const specialitiesCount = new Map<string, { name: string; count: number }>();
    let totalRelations = 0;

    activeNewslettersWithSpecialites.forEach(newsletter => {
      newsletter.specialites.forEach(specialite => {
        totalRelations++;
        const existing = specialitiesCount.get(specialite.id);
        if (existing) {
          existing.count++;
        } else {
          specialitiesCount.set(specialite.id, {
            name: specialite.libelle,
            count: 1
          });
        }
      });
    });

    // Convertir en array et calculer les pourcentages
    const specialitiesStats = Array.from(specialitiesCount.values())
      .map(stat => ({
        name: stat.name,
        count: stat.count,
        percentage: totalRelations > 0 ? (stat.count / totalRelations) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 spécialités

    // Évolution mensuelle des abonnements (12 derniers mois)
    const currentDate = new Date();
    const monthlyGrowth = [];

    for (let i = 11; i >= 0; i--) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

      const subscribersCount = await prisma.newsletter.count({
        where: {
          subscribedAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const monthName = startDate.toLocaleDateString('fr-FR', {
        month: 'short',
        year: '2-digit'
      });

      monthlyGrowth.push({
        month: monthName,
        subscribers: subscribersCount
      });
    }

    // Statistiques additionnelles
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newSubscribersThisMonth = await prisma.newsletter.count({
      where: {
        subscribedAt: {
          gte: lastMonth
        }
      }
    });

    const newSubscribersThisWeek = await prisma.newsletter.count({
      where: {
        subscribedAt: {
          gte: lastWeek
        }
      }
    });

    const unsubscribedThisMonth = await prisma.newsletter.count({
      where: {
        unsubscribedAt: {
          gte: lastMonth
        }
      }
    });

    // Calcul du taux de désabonnement
    const churnRate = totalSubscribers > 0 ? (unsubscribed / totalSubscribers) * 100 : 0;

    // Récupération des abonnements par jour pour les 30 derniers jours
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dailySubscriptions = await prisma.newsletter.groupBy({
      by: ['subscribedAt'],
      where: {
        subscribedAt: {
          gte: thirtyDaysAgo
        }
      },
      _count: {
        id: true
      }
    });

    // Moyenne des abonnements par jour
    const avgDailySubscriptions = dailySubscriptions.length > 0
      ? dailySubscriptions.reduce((sum, day) => sum + day._count.id, 0) / 30
      : 0;

    return NextResponse.json({
      success: true,
      totalSubscribers,
      activeSubscribers,
      unsubscribed,
      engagementRate: Math.round(engagementRate * 10) / 10, // Arrondir à 1 décimale
      specialitiesStats,
      monthlyGrowth,
      insights: {
        newSubscribersThisMonth,
        newSubscribersThisWeek,
        unsubscribedThisMonth,
        churnRate: Math.round(churnRate * 10) / 10,
        avgDailySubscriptions: Math.round(avgDailySubscriptions * 10) / 10,
        retentionRate: Math.round((100 - churnRate) * 10) / 10,
        growthRate: newSubscribersThisMonth > 0 && totalSubscribers > 0
          ? Math.round(((newSubscribersThisMonth / totalSubscribers) * 100) * 10) / 10
          : 0
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques newsletters:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}