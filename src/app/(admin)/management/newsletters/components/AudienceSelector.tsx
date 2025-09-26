"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiCheck, FiSearch } from "react-icons/fi";
import { Campaign } from "@/models/campaign";

interface AudienceSelectorProps {
    campaign: Campaign;
    onAudienceChange: (audience: Campaign['audience']) => void;
    onError?: (error: string) => void;
}

interface Speciality {
    id: string;
    libelle: string;
    subscriberCount: number;
}

export default function AudienceSelector({ campaign, onAudienceChange, onError }: AudienceSelectorProps) {
    const [audienceType, setAudienceType] = useState<'all' | 'specialities' | 'custom'>(
        campaign.audience?.type || 'all'
    );
    const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(
        campaign.audience?.specialityIds || []
    );
    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Estimations d'audience
    const [estimatedCount, setEstimatedCount] = useState(0);

    useEffect(() => {
        fetchSpecialities();
    }, []);

    useEffect(() => {
        calculateEstimatedCount();
    }, [audienceType, selectedSpecialities, specialities]);

    useEffect(() => {
        // Notifier le parent du changement d'audience
        const audience = {
            type: audienceType,
            specialityIds: audienceType === 'specialities' ? selectedSpecialities : undefined,
            subscriberCount: estimatedCount
        };
        onAudienceChange(audience);
    }, [audienceType, selectedSpecialities, estimatedCount, onAudienceChange]);

    const fetchSpecialities = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/newsletters/specialities');
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des spécialités');
            }
            const data = await response.json();
            setSpecialities(data.specialities || []);
        } catch (error: any) {
            console.error('Erreur:', error);
            onError?.(error.message || 'Erreur lors du chargement des spécialités');
        } finally {
            setLoading(false);
        }
    };

    const calculateEstimatedCount = async () => {
        try {
            if (audienceType === 'all') {
                const response = await fetch('/api/newsletters/audience-count?type=all');
                const data = await response.json();
                setEstimatedCount(data.count || 0);
            } else if (audienceType === 'specialities' && selectedSpecialities.length > 0) {
                const response = await fetch('/api/newsletters/audience-count', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'specialities',
                        specialityIds: selectedSpecialities
                    })
                });
                const data = await response.json();
                setEstimatedCount(data.count || 0);
            } else {
                setEstimatedCount(0);
            }
        } catch (error) {
            console.error('Erreur calcul audience:', error);
            setEstimatedCount(0);
        }
    };

    const handleSpecialityToggle = (specialityId: string) => {
        setSelectedSpecialities(prev => {
            if (prev.includes(specialityId)) {
                return prev.filter(id => id !== specialityId);
            } else {
                return [...prev, specialityId];
            }
        });
    };

    const filteredSpecialities = specialities.filter(spec =>
        spec.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sélectionner l'audience</h3>

                {/* Type d'audience */}
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                            <input
                                type="radio"
                                name="audienceType"
                                value="all"
                                checked={audienceType === 'all'}
                                onChange={(e) => setAudienceType(e.target.value as any)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Tous les abonnés actifs
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Envoyer à tous les abonnés de la newsletter
                                        </div>
                                    </div>
                                    <FiUsers className="w-5 h-5 text-blue-500" />
                                </div>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                            <input
                                type="radio"
                                name="audienceType"
                                value="specialities"
                                checked={audienceType === 'specialities'}
                                onChange={(e) => setAudienceType(e.target.value as any)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Par centres d'intérêt
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Cibler les abonnés selon leurs spécialités
                                        </div>
                                    </div>
                                    <FiCheck className="w-5 h-5 text-green-500" />
                                </div>
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 opacity-50">
                            <input
                                type="radio"
                                name="audienceType"
                                value="custom"
                                disabled
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">
                                            Sélection personnalisée
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Choisir manuellement les destinataires (bientôt disponible)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Sélection de spécialités */}
                {audienceType === 'specialities' && (
                    <div className="space-y-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Rechercher une spécialité..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">
                                    Chargement des spécialités...
                                </div>
                            ) : filteredSpecialities.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    {searchTerm ? 'Aucune spécialité trouvée' : 'Aucune spécialité disponible'}
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {filteredSpecialities.map((speciality) => (
                                        <label
                                            key={speciality.id}
                                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedSpecialities.includes(speciality.id)}
                                                onChange={() => handleSpecialityToggle(speciality.id)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div className="ml-3 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {speciality.libelle}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {speciality.subscriberCount} abonnés
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedSpecialities.length > 0 && (
                            <div className="bg-blue-50 p-3 rounded-md">
                                <div className="text-sm text-blue-800">
                                    {selectedSpecialities.length} spécialité(s) sélectionnée(s)
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Estimation de l'audience */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-green-800">
                                Audience estimée
                            </div>
                            <div className="text-xs text-green-600">
                                Nombre de destinataires qui recevront cette campagne
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-green-800">
                            {estimatedCount.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}