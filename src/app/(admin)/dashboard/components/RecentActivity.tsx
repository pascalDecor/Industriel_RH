"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Activity {
  id: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  createdAt: Date;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

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
      newsletter: 'bg-pink-100 text-pink-600'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getActivityLink = (activity: Activity) => {
    const actualId = activity.id.split('-')[1]; // Remove prefix like "app-", "hire-", etc.

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
      default:
        return '#';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 shadow-none border-none">
        <h3 className="text-lg font-medium mb-4">Activité récente</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-3" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-12" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-none border-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Activité récente</h3>
        <span className="text-sm text-gray-500">Dernières 24h</span>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <Link key={activity.id} href={getActivityLink(activity)} className="block hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
              <div className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getTypeColor(activity.type)}`}>
                  <span className="text-sm">{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {activity.description}
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-2">
                  {activity.time}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📊</span>
            <p className="text-sm">Aucune activité récente</p>
          </div>
        )}
      </div>
    </Card>
  );
}