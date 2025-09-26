
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import ApiDocsCard from "../components/ApiDocsCard";
import StatsCard from "./components/StatsCard";
import RecentActivity from "./components/RecentActivity";
import MainChart from "./components/MainChart";

interface DashboardStats {
  overview: {
    applications: {
      total: number;
      recent: number;
      last7Days: number;
      growth: number;
    };
    hires: {
      total: number;
      recent: number;
      last7Days: number;
      growth: number;
    };
    contacts: {
      total: number;
      recent: number;
      last7Days: number;
      growth: number;
    };
    articles: {
      total: number;
      recent: number;
      totalViews: number;
      growth: number;
    };
    newsletter: {
      total: number;
    };
  };
  charts: {
    applications: Array<{ name: string; candidatures: number }>;
    hires: Array<{ name: string; embauches: number }>;
  };
  sectors: Array<{
    libelle: string;
    _count: { applications: number; hires: number };
  }>;
  topFunctions: Array<{
    libelle: string;
    _count: { applications: number };
  }>;
  conversionRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 shadow-none border-none animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Erreur lors du chargement des statistiques</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Candidatures"
          value={stats.overview.applications.total}
          change={stats.overview.applications.growth}
          changeText="ce mois"
          icon="👤"
          color="#3b82f6"
          href="/candidatures"
        />
        <StatsCard
          title="Demandes d'embauche"
          value={stats.overview.hires.total}
          change={stats.overview.hires.growth}
          changeText="ce mois"
          icon="🏢"
          color="#10b981"
          href="/hires"
        />
        <StatsCard
          title="Contacts"
          value={stats.overview.contacts.total}
          change={stats.overview.contacts.growth}
          changeText="ce mois"
          icon="✉️"
          color="#f59e0b"
          href="/contacts"
        />
        <StatsCard
          title="Articles publiés"
          value={stats.overview.articles.total}
          change={stats.overview.articles.growth}
          changeText="ce mois"
          icon="📝"
          color="#8b5cf6"
          href="/blog/articles"
        />
      </div>

      {/* Métriques secondaires */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/candidatures">
          <Card className="p-6 shadow-none border-none hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.overview.applications.last7Days}
              </div>
              <div className="text-sm text-gray-600">Candidatures (7j)</div>
            </div>
          </Card>
        </Link>
        <Card className="p-6 shadow-none border-none">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.conversionRate}%
            </div>
            <div className="text-sm text-gray-600">Taux de conversion</div>
          </div>
        </Card>
        <Link href="/blog/articles">
          <Card className="p-6 shadow-none border-none hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.overview.articles.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Vues articles</div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Graphiques principaux */}
      <MainChart
        applicationsData={stats.charts.applications}
        hiresData={stats.charts.hires}
        sectorsData={stats.sectors}
        conversionRate={stats.conversionRate}
      />

      {/* Section inférieure */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* API Documentation */}
        <div className="lg:col-span-2">
          <ApiDocsCard />
        </div>

        {/* Activité récente */}
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Top fonctions les plus demandées */}
      <Card className="p-6 shadow-none border-none">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Fonctions les plus demandées</h3>
          <Link href="/management/secteurs" className="text-sm text-blue-600 hover:text-blue-800">
            Voir tout →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {stats.topFunctions.map((func, index) => (
            <Link key={func.libelle} href="/candidatures" className="block">
              <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-2xl font-bold text-blue-600">
                  {func._count.applications}
                </div>
                <div className="text-sm text-gray-600 truncate" title={func.libelle}>
                  {func.libelle}
                </div>
                <div className="text-xs text-gray-500">candidatures</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Link href="/management/newsletters">
        <Card className="p-6 shadow-none border-none bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Newsletter</h3>
              <div className="text-3xl font-bold text-blue-600">
                {stats.overview.newsletter.total}
              </div>
              <div className="text-sm text-gray-600">abonnés actifs</div>
            </div>
            <div className="text-6xl">📧</div>
          </div>
        </Card>
      </Link>
    </div>
  );
}