"use client";

import { useState, useEffect } from "react";
import { FiMail, FiUser, FiBarChart, FiSend } from "react-icons/fi";
import NewslettersList from "./components/NewslettersList";
import NewslettersStatistics from "./components/NewslettersStatistics";
import NewslettersCampaigns from "./components/NewslettersCampaigns";

export default function Newsletters() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'lists' | 'statistics' | 'campaigns'>('lists');

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <>
            <style jsx>{`
                @keyframes slideInFromBottom {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shimmer {
                    0% { background-position: -200px 0; }
                    100% { background-position: calc(200px + 100%) 0; }
                }

                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200px 100%;
                    animation: shimmer 2s infinite;
                }
            `}</style>
            <div className={`space-y-4 transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>

                <div className={`space-y-6 transition-all duration-500 delay-200 ease-out transform ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                }`}>
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            <FiMail className="inline mr-2" />
                            Newsletters
                        </h2>
                        <p className="text-slate-700 text-sm animate-pulse">Gestion des abonnements à la newsletter</p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border p-1">
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setActiveTab('lists')}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'lists'
                                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FiUser className="w-4 h-4 mr-2" />
                                Liste des abonnés
                            </button>
                            <button
                                onClick={() => setActiveTab('statistics')}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'statistics'
                                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FiBarChart className="w-4 h-4 mr-2" />
                                Statistiques
                            </button>
                            <button
                                onClick={() => setActiveTab('campaigns')}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activeTab === 'campaigns'
                                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <FiSend className="w-4 h-4 mr-2" />
                                Campagnes
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'lists' && <NewslettersList isVisible={isVisible} />}
                    {activeTab === 'statistics' && <NewslettersStatistics />}
                    {activeTab === 'campaigns' && <NewslettersCampaigns />}
                </div>
            </div>
        </>
    )
}