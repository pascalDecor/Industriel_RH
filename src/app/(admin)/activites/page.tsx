"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Filter, Search, Calendar } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  createdAt: Date;
  author: {
    name: string;
    type: string;
  };
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/activities');
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      application: 'bg-blue-100 text-blue-600',
      hire: 'bg-green-100 text-green-600',
      contact: 'bg-purple-100 text-purple-600',
      article: 'bg-orange-100 text-orange-600',
      newsletter: 'bg-pink-100 text-pink-600',
      translation: 'bg-yellow-100 text-yellow-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      application: 'Candidature',
      hire: 'Embauche',
      contact: 'Contact',
      article: 'Article',
      newsletter: 'Newsletter',
      translation: 'Traduction'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getActivityLink = (activity: Activity) => {
    const actualId = activity.id.split('-')[1];

    switch (activity.type) {
      case 'application':
        return `/candidatures`;
      case 'hire':
        return `/hires/${actualId}`;
      case 'contact':
        return `/contacts`;
      case 'article':
        return `/blog/articles/${actualId}`;
      case 'newsletter':
        return `/management/newsletters`;
      case 'translation':
        return `/management/translations`;
      default:
        return '#';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const activityDate = new Date(activity.createdAt);
      const now = new Date();

      switch (dateFilter) {
        case 'today':
          matchesDate = activityDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = activityDate >= monthAgo;
          break;
      }
    }

    return matchesFilter && matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Retour au dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Activités</h1>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="p-6 shadow-none border-none animate-pulse">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Retour au dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Activités</h1>
        <div className="text-sm text-gray-500">
          {filteredActivities.length} activité{filteredActivities.length > 1 ? 's' : ''} trouvée{filteredActivities.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtres */}
      <Card className="p-6 shadow-none border-none">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher dans les activités..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtre par type */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Tous les types</option>
              <option value="application">Candidatures</option>
              <option value="hire">Embauches</option>
              <option value="contact">Contacts</option>
              <option value="article">Articles</option>
              <option value="newsletter">Newsletter</option>
              <option value="translation">Traductions</option>
            </select>
          </div>

          {/* Filtre par date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des activités */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="p-6 shadow-none border-none hover:shadow-md transition-shadow">
              <Link href={getActivityLink(activity)} className="block">
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getTypeColor(activity.type)}`}>
                    <span className="text-lg">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(activity.type)}`}>
                        {getTypeLabel(activity.type)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {activity.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Par {activity.author.name} • {activity.time}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activity.author.type === 'admin' ? 'bg-red-100 text-red-600' :
                        activity.author.type === 'candidate' ? 'bg-blue-100 text-blue-600' :
                        activity.author.type === 'client' ? 'bg-green-100 text-green-600' :
                        activity.author.type === 'contact' ? 'bg-purple-100 text-purple-600' :
                        activity.author.type === 'subscriber' ? 'bg-pink-100 text-pink-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {activity.author.type === 'admin' ? 'Admin' :
                         activity.author.type === 'candidate' ? 'Candidat' :
                         activity.author.type === 'client' ? 'Client' :
                         activity.author.type === 'contact' ? 'Contact' :
                         activity.author.type === 'subscriber' ? 'Abonné' :
                         activity.author.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <ChevronLeft className="h-5 w-5 rotate-180" />
                  </div>
                </div>
              </Link>
            </Card>
          ))
        ) : (
          <Card className="p-12 shadow-none border-none text-center">
            <div className="text-gray-500">
              <span className="text-6xl block mb-4">📊</span>
              <h3 className="text-lg font-medium mb-2">Aucune activité trouvée</h3>
              <p className="text-sm">
                {searchTerm || filter !== 'all' || dateFilter !== 'all'
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucune activité récente à afficher"
                }
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Pagination (future amélioration) */}
      {filteredActivities.length > 50 && (
        <Card className="p-4 shadow-none border-none">
          <div className="text-center text-sm text-gray-500">
            Affichage des 50 activités les plus récentes
          </div>
        </Card>
      )}
    </div>
  );
}