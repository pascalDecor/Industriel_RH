"use client";

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, FileText, Mail, Send, User } from "lucide-react";

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
      application: 'bg-blue-500/10 text-blue-700',
      hire: 'bg-emerald-500/10 text-emerald-700',
      contact: 'bg-violet-500/10 text-violet-700',
      article: 'bg-orange-500/10 text-orange-700',
      newsletter: 'bg-pink-500/10 text-pink-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <User className="h-4 w-4" />;
      case 'hire':
        return <Briefcase className="h-4 w-4" />;
      case 'contact':
        return <Mail className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'newsletter':
        return <Send className="h-4 w-4" />;
      default:
        return null;
    }
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
      <Card className="p-6 shadow-none border-0">
        <h3 className="text-lg font-medium mb-4">Activité récente</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-muted mr-3" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="h-3 bg-muted rounded w-12" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-none border-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Activité récente</h3>
        <Link href="/activites" className="text-sm text-blue-600 hover:text-blue-800">
          Voir plus →
        </Link>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.slice(0, 5).map((activity) => (
            <Link key={activity.id} href={getActivityLink(activity)} className="block hover:bg-accent/40 rounded-lg p-2 -m-2 transition-colors">
              <div className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getTypeColor(activity.type)}`}>
                  <span className="text-sm">
                    {getTypeIcon(activity.type) ?? activity.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {activity.description}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground ml-2">
                  {activity.time}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-2" />
            <p className="text-sm">Aucune activité récente</p>
          </div>
        )}
      </div>
    </Card>
  );
}