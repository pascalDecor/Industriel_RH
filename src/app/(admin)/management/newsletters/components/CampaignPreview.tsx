"use client";

import { useState } from "react";
import { FiMail, FiSend, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/button";
import { Campaign } from "@/models/campaign";
import { convertEditorJSToHTML } from "@/utils/editorjs-to-html";

interface CampaignPreviewProps {
    campaign: Campaign;
    onSendTest?: (emails: string[]) => void;
    onBack?: () => void;
}

export default function CampaignPreview({ campaign, onSendTest, onBack }: CampaignPreviewProps) {
    const [testEmails, setTestEmails] = useState<string[]>(campaign.testEmails || []);
    const [newTestEmail, setNewTestEmail] = useState('');
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [testSentSuccess, setTestSentSuccess] = useState(false);

    const handleAddTestEmail = () => {
        if (newTestEmail && newTestEmail.includes('@') && !testEmails.includes(newTestEmail)) {
            setTestEmails(prev => [...prev, newTestEmail]);
            setNewTestEmail('');
        }
    };

    const handleRemoveTestEmail = (email: string) => {
        setTestEmails(prev => prev.filter(e => e !== email));
    };

    const handleSendTest = async () => {
        if (testEmails.length === 0) return;

        setIsSendingTest(true);
        try {
            await onSendTest?.(testEmails);
            setTestSentSuccess(true);
            setTimeout(() => setTestSentSuccess(false), 3000);
        } catch (error) {
            console.error('Erreur envoi test:', error);
        } finally {
            setIsSendingTest(false);
        }
    };

    const renderEmailPreview = () => {
        const templateStyles = {
            basic: {
                backgroundColor: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                padding: '40px 20px',
                maxWidth: '600px',
                margin: '0 auto'
            },
            newsletter: {
                backgroundColor: '#f8f9fa',
                fontFamily: 'Georgia, serif',
                padding: '30px 20px',
                maxWidth: '600px',
                margin: '0 auto',
                borderLeft: '4px solid #007bff'
            },
            announcement: {
                backgroundColor: '#fff3cd',
                fontFamily: 'Arial, sans-serif',
                padding: '30px 20px',
                maxWidth: '600px',
                margin: '0 auto',
                border: '2px solid #ffc107',
                borderRadius: '8px'
            }
        };

        const selectedStyle = templateStyles[campaign.templateId as keyof typeof templateStyles] || templateStyles.basic;

        return (
            <div className="bg-gray-100 p-6 rounded-lg">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
                    {/* Email header simulation */}
                    <div className="bg-gray-800 text-white p-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FiMail className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-medium">INDUSTRIEL RH</div>
                                    <div className="text-gray-300 text-xs">newsletter@industriel-rh.com</div>
                                </div>
                            </div>
                            <div className="text-gray-300 text-xs">
                                {new Date().toLocaleDateString('fr-FR')}
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="font-semibold text-lg">{campaign.subject}</div>
                        </div>
                    </div>

                    {/* Email content */}
                    <div style={selectedStyle}>
                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: convertEditorJSToHTML(campaign.content || 'Aucun contenu défini.')
                            }}
                        />

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
                            <p>Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
                            <p>
                                <a href="#" className="text-blue-500 underline">Se désabonner</a> |{' '}
                                <a href="#" className="text-blue-500 underline">Mettre à jour ses préférences</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Aperçu de l'email */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu de la campagne</h3>
                {renderEmailPreview()}
            </div>

            {/* Résumé de la campagne */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la campagne</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Titre :</span>
                            <p className="text-sm text-gray-900">{campaign.title}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Objet :</span>
                            <p className="text-sm text-gray-900">{campaign.subject}</p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Template :</span>
                            <p className="text-sm text-gray-900 capitalize">
                                {campaign.templateId || 'Template basique'}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm font-medium text-gray-500">Audience :</span>
                            <p className="text-sm text-gray-900">
                                {campaign.audience?.type === 'all'
                                    ? 'Tous les abonnés'
                                    : campaign.audience?.type === 'specialities'
                                    ? `${campaign.audience?.specialityIds?.length || 0} spécialité(s) sélectionnée(s)`
                                    : 'Non définie'
                                }
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Destinataires estimés :</span>
                            <p className="text-sm text-gray-900 font-semibold">
                                {campaign.audience?.subscriberCount?.toLocaleString() || 0} abonnés
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-gray-500">Statut :</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {campaign.status === 'draft' ? 'Brouillon' : campaign.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Envoi de test */}
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Envoi de test</h3>

                {testSentSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm text-green-700">
                            Email de test envoyé avec succès !
                        </span>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Emails de test
                        </label>
                        <div className="space-y-2">
                            {testEmails.map((email, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                    <Button
                                        onClick={() => handleRemoveTestEmail(email)}
                                        className="bg-red-500 hover:bg-red-600 px-3 py-2"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <div className="flex items-center gap-2">
                                <input
                                    type="email"
                                    placeholder="Ajouter un email de test"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                    value={newTestEmail}
                                    onChange={(e) => setNewTestEmail(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddTestEmail();
                                        }
                                    }}
                                />
                                <Button
                                    onClick={handleAddTestEmail}
                                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2"
                                    disabled={!newTestEmail || !newTestEmail.includes('@')}
                                >
                                    Ajouter
                                </Button>
                            </div>
                        </div>
                    </div>

                    {testEmails.length > 0 && (
                        <Button
                            onClick={handleSendTest}
                            disabled={isSendingTest}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            <FiSend className="w-4 h-4 mr-2" />
                            {isSendingTest ? 'Envoi en cours...' : `Envoyer le test (${testEmails.length})`}
                        </Button>
                    )}
                </div>

                {testEmails.length === 0 && (
                    <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-md">
                        <FiAlertCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm">
                            Ajoutez au moins un email pour tester votre campagne avant l'envoi final.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}