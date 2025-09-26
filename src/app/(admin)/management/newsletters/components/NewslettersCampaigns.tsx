"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import { FiSend, FiMail, FiBarChart, FiEdit, FiEye, FiClock, FiTrash2 } from "react-icons/fi";
import { Campaign } from "@/models/campaign";
import CreateCampaign from "./CreateCampaign";
import { convertEditorJSToHTML } from "@/utils/editorjs-to-html";

export default function NewslettersCampaigns() {
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalSent: 0
    });

    // Charger les campagnes au démarrage
    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/newsletters/campaigns');

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des campagnes');
            }

            const data = await response.json();
            console.log('Campagnes reçues:', data);

            // Transformer les données en objets Campaign
            const campaignObjects = data.campaigns.map((campaignData: any) =>
                Campaign.fromJSON(campaignData)
            );

            setCampaigns(campaignObjects);
            calculateStats(campaignObjects);
        } catch (error) {
            console.error('Erreur chargement campagnes:', error);
            setError(error instanceof Error ? error.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (campaigns: Campaign[]) => {
        const sentCampaigns = campaigns.filter(c => c.status === 'sent');

        const totalSent = sentCampaigns.reduce((sum, campaign) => {
            return sum + (campaign.stats?.totalSent || 0);
        }, 0);

        setStats({
            totalSent
        });
    };

    const handleCreateCampaign = () => {
        setSelectedCampaign(undefined);
        setShowCreateCampaign(true);
    };

    const handleEditCampaign = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setShowCreateCampaign(true);
    };

    const handleSaveCampaign = (campaign: Campaign) => {
        // Recharger les campagnes pour avoir les données à jour depuis la base
        fetchCampaigns();
        setShowCreateCampaign(false);
        setSelectedCampaign(undefined);
    };

    const handleDeleteCampaign = async (campaign: Campaign) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer la campagne "${campaign.title}" ?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/newsletters/campaigns/${campaign.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            // Recharger les campagnes
            await fetchCampaigns();
            console.log('Campagne supprimée avec succès');
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('Erreur lors de la suppression de la campagne');
        }
    };

    const handlePreviewCampaign = (campaign: Campaign) => {
        // Ouvrir un modal de preview ou rediriger vers une page de preview
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        if (previewWindow) {
            previewWindow.document.write(`
                <html>
                    <head>
                        <title>Aperçu - ${campaign.title}</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .header { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px; }
                            .content { line-height: 1.6; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${campaign.title}</h1>
                            <p><strong>Objet:</strong> ${campaign.subject}</p>
                            <p><strong>Statut:</strong> ${getStatusLabel(campaign.status)}</p>
                        </div>
                        <div class="content">
                            ${convertEditorJSToHTML(campaign.content)}
                        </div>
                    </body>,
                </html>
            `);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'scheduled': return 'bg-orange-100 text-orange-800';
            case 'sending': return 'bg-blue-100 text-blue-800';
            case 'sent': return 'bg-green-100 text-green-800';
            case 'paused': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'draft': return 'Brouillon';
            case 'scheduled': return 'Planifiée';
            case 'sending': return 'En cours d\'envoi';
            case 'sent': return 'Envoyée';
            case 'paused': return 'En pause';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Campagnes de newsletter</h3>
                <Button
                    onClick={handleCreateCampaign}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <FiSend className="w-4 h-4 mr-2" />
                    Nouvelle campagne
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FiSend className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Campagnes envoyées</p>
                            <p className="text-2xl font-bold text-gray-900">{campaigns.filter(c => c.status === 'sent').length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FiMail className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-500">Total emails envoyés</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>


            {error ? (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6">
                        <div className="text-center py-12">
                            <div className="text-red-500 mb-4">⚠️</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                            <p className="text-gray-500 mb-6">{error}</p>
                            <Button
                                onClick={fetchCampaigns}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Réessayer
                            </Button>
                        </div>
                    </div>
                </div>
            ) : loading ? (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6">
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Chargement des campagnes...</p>
                        </div>
                    </div>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6">
                        <div className="text-center py-12">
                            <FiSend className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune campagne pour le moment</h3>
                            <p className="text-gray-500 mb-6">Créez votre première campagne de newsletter pour commencer à communiquer avec vos abonnés.</p>
                            <Button
                                onClick={handleCreateCampaign}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <FiSend className="w-4 h-4 mr-2" />
                                Créer une campagne
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Campagne
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Planifiée pour
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Audience
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statistiques
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {campaign.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {campaign.subject}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                                                {getStatusLabel(campaign.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {campaign.scheduledAt
                                                ? new Date(campaign.scheduledAt).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })
                                                : campaign.status === 'sent' && campaign.sentAt
                                                    ? `Envoyée le ${new Date(campaign.sentAt).toLocaleDateString('fr-FR')}`
                                                    : '-'
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {campaign.audience?.subscriberCount || 0} abonnés
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {campaign.stats ? (
                                                <div>
                                                    Envoyés: {campaign.stats.totalSent}
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                {/* Modifier - uniquement pour les brouillons */}
                                                {campaign.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleEditCampaign(campaign)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                                                        title="Modifier"
                                                    >
                                                        <FiEdit className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {/* Aperçu - toujours disponible */}
                                                <button
                                                    onClick={() => handlePreviewCampaign(campaign)}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors duration-150"
                                                    title="Aperçu"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>

                                                {/* Actions contextuelles selon le statut */}
                                                {campaign.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleDeleteCampaign(campaign)}
                                                        className="text-red-600 hover:text-red-900 transition-colors duration-150"
                                                        title="Supprimer"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {campaign.status === 'scheduled' && (
                                                    <button
                                                        className="text-orange-600 hover:text-orange-900 transition-colors duration-150"
                                                        title="Annuler la planification"
                                                        onClick={() => alert('Fonctionnalité à implémenter')}
                                                    >
                                                        <FiClock className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {/* Modal de création/modification de campagne */}
            {showCreateCampaign && (
                <CreateCampaign
                    initialCampaign={selectedCampaign}
                    onClose={() => {
                        setShowCreateCampaign(false);
                        setSelectedCampaign(undefined);
                    }}
                    onSave={handleSaveCampaign}
                />
            )}
        </div>
    );
}