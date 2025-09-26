"use client";

import { useState } from "react";
import { FiClock, FiSend, FiCalendar, FiCheck, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/button";
import { Campaign } from "@/models/campaign";

interface CampaignSchedulerProps {
    campaign: Campaign;
    onSendNow?: () => void;
    onSchedule?: (scheduledAt: Date) => void;
    onBack?: () => void;
}

export default function CampaignScheduler({ campaign, onSendNow, onSchedule, onBack }: CampaignSchedulerProps) {
    const [sendOption, setSendOption] = useState<'now' | 'scheduled'>('now');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Calculer les dates/heures minimales
    const now = new Date();
    const minDate = now.toISOString().split('T')[0];
    const minTime = sendOption === 'scheduled' && scheduledDate === minDate
        ? now.toTimeString().slice(0, 5)
        : '00:00';

    const handleSendNow = async () => {
        setIsProcessing(true);
        try {
            await onSendNow?.();
        } catch (error) {
            console.error('Erreur envoi:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSchedule = async () => {
        if (!scheduledDate || !scheduledTime) return;

        const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

        // Vérifier que la date est dans le futur
        if (scheduledDateTime <= now) {
            alert('La date et l\'heure de planification doivent être dans le futur.');
            return;
        }

        setIsProcessing(true);
        try {
            await onSchedule?.(scheduledDateTime);
        } catch (error) {
            console.error('Erreur planification:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const getScheduledDateTime = () => {
        if (!scheduledDate || !scheduledTime) return null;
        return new Date(`${scheduledDate}T${scheduledTime}`);
    };

    const isScheduleValid = () => {
        const dateTime = getScheduledDateTime();
        return dateTime && dateTime > now;
    };

    const formatDateTime = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Récapitulatif final */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start">
                    <FiCheck className="w-6 h-6 text-blue-600 mt-1 mr-3" />
                    <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                            Votre campagne est prête à être envoyée !
                        </h3>
                        <div className="text-blue-800 space-y-1">
                            <p><strong>Titre :</strong> {campaign.title}</p>
                            <p><strong>Objet :</strong> {campaign.subject}</p>
                            <p><strong>Destinataires :</strong> {campaign.audience?.subscriberCount?.toLocaleString() || 0} abonnés</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Options d'envoi */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Options d'envoi</h3>

                <div className="space-y-4">
                    {/* Envoi immédiat */}
                    <div className="border rounded-lg p-4">
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="radio"
                                name="sendOption"
                                value="now"
                                checked={sendOption === 'now'}
                                onChange={(e) => setSendOption(e.target.value as 'now' | 'scheduled')}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
                            />
                            <div className="ml-3 flex-1">
                                <div className="flex items-center">
                                    <FiSend className="w-5 h-5 text-green-600 mr-2" />
                                    <span className="text-base font-medium text-gray-900">
                                        Envoyer maintenant
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    La campagne sera envoyée immédiatement à tous les destinataires.
                                </p>
                                {sendOption === 'now' && (
                                    <div className="mt-3 p-3 bg-green-50 rounded-md">
                                        <div className="flex items-center text-green-800">
                                            <FiSend className="w-4 h-4 mr-2" />
                                            <span className="text-sm font-medium">
                                                Envoi prévu dans les prochaines minutes
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>

                    {/* Envoi planifié */}
                    <div className="border rounded-lg p-4">
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="radio"
                                name="sendOption"
                                value="scheduled"
                                checked={sendOption === 'scheduled'}
                                onChange={(e) => setSendOption(e.target.value as 'now' | 'scheduled')}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
                            />
                            <div className="ml-3 flex-1">
                                <div className="flex items-center">
                                    <FiClock className="w-5 h-5 text-orange-600 mr-2" />
                                    <span className="text-base font-medium text-gray-900">
                                        Planifier l'envoi
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    Choisissez une date et une heure pour l'envoi automatique.
                                </p>

                                {sendOption === 'scheduled' && (
                                    <div className="mt-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    <FiCalendar className="inline w-4 h-4 mr-1" />
                                                    Date
                                                </label>
                                                <input
                                                    type="date"
                                                    min={minDate}
                                                    value={scheduledDate}
                                                    onChange={(e) => setScheduledDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    <FiClock className="inline w-4 h-4 mr-1" />
                                                    Heure
                                                </label>
                                                <input
                                                    type="time"
                                                    min={minTime}
                                                    value={scheduledTime}
                                                    onChange={(e) => setScheduledTime(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {scheduledDate && scheduledTime && (
                                            <div className={`p-3 rounded-md ${
                                                isScheduleValid()
                                                    ? 'bg-orange-50 border border-orange-200'
                                                    : 'bg-red-50 border border-red-200'
                                            }`}>
                                                <div className={`flex items-center ${
                                                    isScheduleValid() ? 'text-orange-800' : 'text-red-800'
                                                }`}>
                                                    {isScheduleValid() ? (
                                                        <>
                                                            <FiClock className="w-4 h-4 mr-2" />
                                                            <span className="text-sm font-medium">
                                                                Envoi planifié pour le {formatDateTime(getScheduledDateTime()!)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiAlertCircle className="w-4 h-4 mr-2" />
                                                            <span className="text-sm font-medium">
                                                                La date et l'heure doivent être dans le futur
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Suggestions de créneaux */}
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <div className="text-sm text-gray-700 mb-2">
                                                <strong>Créneaux recommandés :</strong>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                <div>• Mardi-Jeudi : 10h-11h</div>
                                                <div>• Taux d'ouverture optimal</div>
                                                <div>• Éviter le lundi matin</div>
                                                <div>• Éviter le vendredi après-midi</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {sendOption === 'now'
                            ? 'La campagne sera envoyée immédiatement après confirmation.'
                            : scheduledDate && scheduledTime && isScheduleValid()
                            ? `La campagne sera envoyée automatiquement le ${formatDateTime(getScheduledDateTime()!)}.`
                            : 'Veuillez configurer la planification.'
                        }
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <Button
                        onClick={onBack}
                        className="bg-gray-100 hover:bg-gray-200 !text-gray-700"
                        disabled={isProcessing}
                    >
                        Retour à l'aperçu
                    </Button>

                    <div className="flex items-center gap-3">
                        {sendOption === 'now' ? (
                            <Button
                                onClick={handleSendNow}
                                disabled={isProcessing}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                            >
                                <FiSend className="w-4 h-4 mr-2" />
                                {isProcessing ? 'Envoi en cours...' : 'Envoyer maintenant'}
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSchedule}
                                disabled={isProcessing || !isScheduleValid()}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiClock className="w-4 h-4 mr-2" />
                                {isProcessing ? 'Planification...' : 'Planifier l\'envoi'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}