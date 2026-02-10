
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import ApiDocsCard from "../components/ApiDocsCard";
import StatsCard from "./components/StatsCard";
import RecentActivity from "./components/RecentActivity";
import MainChart from "./components/MainChart";
import Button from "@/components/ui/button";
import {
  BarChart3,
  Briefcase,
  FileText,
  Mail,
  Newspaper,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async (opts?: { silent?: boolean }) => {
    try {
      if (opts?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await fetch('/api/admin/dashboard/stats');
      if (!response.ok) throw new Error("HTTP_ERROR");
      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      setError("Impossible de charger les statistiques. Réessayez dans un instant.");
    } finally {
      if (opts?.silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Vue d’ensemble des candidatures, embauches, contacts et contenus.
              </p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse shadow-none border-0">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Vue d’ensemble des candidatures, embauches, contacts et contenus.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => fetchStats()}
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error ?? "Erreur lors du chargement des statistiques"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Vue d’ensemble des candidatures, embauches, contacts et contenus.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              {lastUpdated ? (
                <>Actualisé le {lastUpdated.toLocaleString("fr-FR")}</>
              ) : (
                <>Actualisé aujourd’hui</>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => fetchStats({ silent: true })}
              isLoading={refreshing}
              disabled={refreshing}
            >
              <RefreshCw className={["h-4 w-4", refreshing ? "animate-spin" : ""].join(" ")} />
              Rafraîchir
            </Button>
          </div>
        </div>
        {error && (
          <div className="rounded-lg border bg-background px-4 py-3 text-sm text-muted-foreground">
            {error}
          </div>
        )}
      </div>

      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Candidatures"
          value={stats.overview.applications.total}
          change={stats.overview.applications.growth}
          changeText="ce mois"
          icon={<Users className="h-5 w-5" />}
          color="#3b82f6"
          href="/candidatures"
        />
        <StatsCard
          title="Demandes d'embauche"
          value={stats.overview.hires.total}
          change={stats.overview.hires.growth}
          changeText="ce mois"
          icon={<Briefcase className="h-5 w-5" />}
          color="#10b981"
          href="/hires"
        />
        <StatsCard
          title="Contacts"
          value={stats.overview.contacts.total}
          change={stats.overview.contacts.growth}
          changeText="ce mois"
          icon={<Mail className="h-5 w-5" />}
          color="#f59e0b"
          href="/contacts"
        />
        <StatsCard
          title="Articles publiés"
          value={stats.overview.articles.total}
          change={stats.overview.articles.growth}
          changeText="ce mois"
          icon={<FileText className="h-5 w-5" />}
          color="#8b5cf6"
          href="/blog/articles"
        />
      </div>

      {/* Métriques secondaires */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/candidatures">
          <Card className="p-6 hover:bg-accent/40 transition-colors cursor-pointer shadow-none border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.overview.applications.last7Days}
              </div>
              <div className="text-sm text-muted-foreground">Candidatures (7j)</div>
            </div>
          </Card>
        </Link>
        <Card className="p-6 shadow-none border-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.conversionRate}%
            </div>
            <div className="text-sm text-muted-foreground">Taux de conversion</div>
          </div>
        </Card>
        <Link href="/blog/articles">
          <Card className="p-6 hover:bg-accent/40 transition-colors cursor-pointer shadow-none border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.overview.articles.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Vues articles</div>
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
      <Card className="p-6 shadow-none border-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Fonctions les plus demandées</h3>
          <Link href="/management/secteurs" className="text-sm text-blue-600 hover:text-blue-800">
            Voir tout →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {stats.topFunctions.map((func) => (
            <Link key={func.libelle} href="/candidatures" className="block">
              <div className="text-center p-4 bg-muted/40 rounded-lg hover:bg-muted transition-colors cursor-pointer border">
                <div className="text-2xl font-bold text-blue-600">
                  {func._count.applications}
                </div>
                <div className="text-sm text-muted-foreground truncate" title={func.libelle}>
                  {func.libelle}
                </div>
                <div className="text-xs text-muted-foreground">candidatures</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Link href="/management/newsletters">
        <Card className="p-6 shadow-none border-0 bg-linear-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium mb-2">Newsletter</h3>
              <div className="text-3xl font-bold text-blue-600">
                {stats.overview.newsletter.total}
              </div>
              <div className="text-sm text-muted-foreground">abonnés actifs</div>
            </div>
            <div className="flex items-center gap-3">
              <Newspaper className="h-10 w-10 text-blue-600" />
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}