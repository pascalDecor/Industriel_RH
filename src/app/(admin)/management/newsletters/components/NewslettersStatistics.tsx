"use client";

import { useState, useEffect } from "react";
import { FiUser, FiMail, FiCalendar, FiBarChart } from "react-icons/fi";
import { LoadingSpinner } from "@/lib/load.helper";

interface NewsletterStats {
    success: boolean;
    totalSubscribers: number;
    activeSubscribers: number;
    unsubscribed: number;
    engagementRate: number;
    specialitiesStats: Array<{
        name: string;
        count: number;
        percentage: number;
    }>;
    monthlyGrowth: Array<{
        month: string;
        subscribers: number;
    }>;
    insights?: {
        newSubscribersThisMonth: number;
        newSubscribersThisWeek: number;
        unsubscribedThisMonth: number;
        churnRate: number;
        avgDailySubscriptions: number;
        retentionRate: number;
        growthRate: number;
    };
}

export default function NewslettersStatistics() {
    const [stats, setStats] = useState<NewsletterStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/newsletters/statistics');

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || 'Erreur inconnue');
                }

                setStats(data);
            } catch (err: any) {
                setError(err.message || 'Erreur lors du chargement des statistiques');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <LoadingSpinner color="#3B82F6" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center bg-red-50 rounded-lg p-8 border border-red-200">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                    Erreur de chargement
                </h3>
                <p className="text-red-500 text-sm mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-500">Aucune donnée disponible</p>
            </div>
        );
    }

    const engagementColor = stats.engagementRate >= 80 ? 'text-green-600' :
                            stats.engagementRate >= 60 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiUser className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total abonnés</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.totalSubscribers.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiMail className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Abonnés actifs</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.activeSubscribers.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600">
                                {((stats.activeSubscribers / stats.totalSubscribers) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <FiCalendar className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Désabonnements</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.unsubscribed.toLocaleString()}
                            </p>
                            <p className="text-xs text-red-600">
                                {((stats.unsubscribed / stats.totalSubscribers) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border transform hover:scale-105 transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <FiBarChart className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Taux d'engagement</p>
                            <p className={`text-2xl font-bold ${engagementColor}`}>
                                {stats.engagementRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des abonnements</h3>
                    {stats.monthlyGrowth && stats.monthlyGrowth.length > 0 ? (
                        <div className="h-64">
                            <div className="relative h-full">
                                {stats.monthlyGrowth.map((month, index) => (
                                    <div
                                        key={month.month}
                                        className="absolute bottom-0 bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-600"
                                        style={{
                                            left: `${(index / stats.monthlyGrowth.length) * 100}%`,
                                            width: `${80 / stats.monthlyGrowth.length}%`,
                                            height: `${(month.subscribers / Math.max(...stats.monthlyGrowth.map(m => m.subscribers))) * 100}%`,
                                            animationDelay: `${index * 100}ms`
                                        }}
                                        title={`${month.month}: ${month.subscribers} abonnés`}
                                    >
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
                                            {month.subscribers}
                                        </div>
                                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                                            {month.month}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <FiBarChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Aucune donnée d'évolution disponible</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par centres d'intérêt {stats.specialitiesStats && stats.specialitiesStats.length > 0 && <span className=" text-green-500">({stats.specialitiesStats.length})</span>}</h3>
                    {stats.specialitiesStats && stats.specialitiesStats.length > 0 ? (
                        <div className="h-64 space-y-3 overflow-y-auto">
                            {stats.specialitiesStats.map((speciality, index) => (
                                <div key={speciality.name} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700 truncate">
                                                {speciality.name}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                {speciality.count} ({speciality.percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${speciality.percentage}%`,
                                                    animationDelay: `${index * 150}ms`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <FiBarChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>Aucune donnée de spécialités disponible</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Graphique de tendances récentes */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances récentes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            +{stats.insights?.newSubscribersThisMonth || 0}
                        </div>
                        <div className="text-sm text-green-700">Nouveaux abonnés ce mois</div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.insights?.retentionRate?.toFixed(1) || 0}%
                        </div>
                        <div className="text-sm text-blue-700">Taux de rétention</div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {stats.specialitiesStats?.length || 0}
                        </div>
                        <div className="text-sm text-purple-700">Centres d'intérêt représentés</div>
                    </div>
                </div>

                {/* Métriques supplémentaires */}
                {stats.insights && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-600">
                                +{stats.insights.newSubscribersThisWeek}
                            </div>
                            <div className="text-xs text-gray-500">Cette semaine</div>
                        </div>

                        <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-lg font-bold text-red-600">
                                {stats.insights.churnRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-red-500">Taux de churn</div>
                        </div>

                        <div className="text-center p-3 bg-indigo-50 rounded-lg">
                            <div className="text-lg font-bold text-indigo-600">
                                {stats.insights.avgDailySubscriptions.toFixed(1)}
                            </div>
                            <div className="text-xs text-indigo-500">Moy. quotidienne</div>
                        </div>

                        <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <div className="text-lg font-bold text-emerald-600">
                                {stats.insights.growthRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-emerald-500">Croissance mensuelle</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}