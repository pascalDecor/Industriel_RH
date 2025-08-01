import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAuth } from '@/lib/auth-middleware';
import { hasPermission } from '@/lib/permissions/server-permissions';
import { Permission, UserWithRole, UserRole } from '@/types/server-auth';

const prisma = new PrismaClient();

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

    // Vérifier les permissions de lecture des utilisateurs
    if (!hasPermission(user, Permission.USERS_READ)) {
      return NextResponse.json(
        { error: 'Permissions insuffisantes' },
        { status: 403 }
      );
    }

    // Récupérer les statistiques globales
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });
    const inactiveUsers = await prisma.user.count({
      where: { isActive: false }
    });

    // Récupérer les statistiques par rôle
    const roleStatsQuery = await prisma.user.groupBy({
      by: ['role', 'isActive'],
      _count: {
        id: true
      }
    });

    // Transformer les données pour avoir une structure plus utilisable
    const roleStatsMap = new Map();

    // Initialiser tous les rôles avec des valeurs par défaut
    Object.values(UserRole).forEach(role => {
      roleStatsMap.set(role, {
        role,
        count: 0,
        activeCount: 0,
        inactiveCount: 0,
        percentage: 0
      });
    });

    // Remplir avec les données réelles
    roleStatsQuery.forEach(stat => {
      const role = stat.role as UserRole;
      const existing = roleStatsMap.get(role);
      
      if (existing) {
        existing.count += stat._count.id;
        if (stat.isActive) {
          existing.activeCount += stat._count.id;
        } else {
          existing.inactiveCount += stat._count.id;
        }
      }
    });

    // Calculer les pourcentages
    roleStatsMap.forEach(stat => {
      stat.percentage = totalUsers > 0 ? (stat.count / totalUsers) * 100 : 0;
    });

    const roleStats = Array.from(roleStatsMap.values())
      .filter(stat => stat.count > 0); // Ne retourner que les rôles avec des utilisateurs

    // Statistiques additionnelles
    const recentLoginCount = await prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 derniers jours
        }
      }
    });

    const neverLoggedInCount = await prisma.user.count({
      where: {
        lastLogin: null
      }
    });

    // Statistiques par période de création
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonth
        }
      }
    });

    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastWeek
        }
      }
    });

    return NextResponse.json({
      success: true,
      totalUsers,
      activeUsers,
      inactiveUsers,
      roleStats,
      insights: {
        recentLoginCount,
        neverLoggedInCount,
        newUsersThisMonth,
        newUsersThisWeek,
        activityRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}