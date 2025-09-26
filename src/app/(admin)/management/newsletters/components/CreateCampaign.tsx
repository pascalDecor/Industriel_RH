"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiMail, FiEdit3, FiEye, FiSend, FiClock, FiUsers, FiX, FiPlus } from "react-icons/fi";
import Button from "@/components/ui/button";
import FloatingLabelInput from "@/components/ui/input";
import { Campaign } from "@/models/campaign";
import AudienceSelector from "./AudienceSelector";
import CampaignPreview from "./CampaignPreview";
import CampaignScheduler from "./CampaignScheduler";
import EditorJSComponent from "@/components/ui/editorJS";

interface CreateCampaignProps {
    onClose: () => void;
    onSave: (campaign: Campaign) => void;
    initialCampaign?: Campaign;
}

export default function CreateCampaign({ onClose, onSave, initialCampaign }: CreateCampaignProps) {
    const [step, setStep] = useState<'details' | 'content' | 'audience' | 'preview' | 'schedule'>('details');
    const [campaign, setCampaign] = useState<Campaign>(() => {
        return initialCampaign || new Campaign({
            id: '',
            title: '',
            subject: '',
            content: '',
            status: 'draft',
            createdBy: '', // TODO: Get from auth context
            testEmails: []
        });
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Gestion du mount côté client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Gestion de la touche Escape pour fermer le modal et prévention du défilement
    useEffect(() => {
        if (!mounted) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Prévenir le défilement du body quand le modal est ouvert
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose, mounted]);

    const validateStep = (currentStep: string): boolean => {
        const newErrors: Record<string, string> = {};

        switch (currentStep) {
            case 'details':
                if (!campaign.title.trim()) {
                    newErrors.title = 'Le titre est requis';
                }
                if (!campaign.subject.trim()) {
                    newErrors.subject = 'L\'objet est requis';
                }
                break;
            case 'content':
                if (!campaign.content || !campaign.content.trim()) {
                    newErrors.content = 'Le contenu est requis';
                }
                break;
            case 'audience':
                if (!campaign.audience || !campaign.audience.type) {
                    newErrors.audience = 'Une audience doit être sélectionnée';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep(step)) return;

        const steps = ['details', 'content', 'audience', 'preview', 'schedule'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex < steps.length - 1) {
            setStep(steps[currentIndex + 1] as any);
        }
    };

    const handlePrevious = () => {
        const steps = ['details', 'content', 'audience', 'preview', 'schedule'];
        const currentIndex = steps.indexOf(step);
        if (currentIndex > 0) {
            setStep(steps[currentIndex - 1] as any);
        }
    };

    const handleSaveDraft = async () => {
        try {
            const campaignData = {
                title: campaign.title,
                subject: campaign.subject,
                content: campaign.content,
                templateId: campaign.templateId,
                audience: campaign.audience,
                testEmails: campaign.testEmails
            };

            if (initialCampaign) {
                // Mise à jour
                const response = await fetch(`/api/newsletters/campaigns/${campaign.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData)
                });

                if (!response.ok) throw new Error('Erreur lors de la mise à jour');
                const result = await response.json();
                onSave(Campaign.fromJSON(result.campaign));
            } else {
                // Création
                const response = await fetch('/api/newsletters/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData)
                });

                if (!response.ok) throw new Error('Erreur lors de la création');
                const result = await response.json();
                onSave(Campaign.fromJSON(result.campaign));
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('Erreur lors de la sauvegarde de la campagne');
        }
    };

    const handleSendNow = async () => {
        if (validateStep('schedule')) {
            try {
                // Sauvegarder d'abord la campagne si elle n'a pas d'ID
                let campaignId = campaign.id;
                if (!campaignId) {
                    const campaignData = {
                        title: campaign.title,
                        subject: campaign.subject,
                        content: campaign.content,
                        templateId: campaign.templateId,
                        audience: campaign.audience,
                        testEmails: campaign.testEmails
                    };

                    const saveResponse = await fetch('/api/newsletters/campaigns', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(campaignData)
                    });

                    if (!saveResponse.ok) throw new Error('Erreur lors de la sauvegarde');
                    const saveResult = await saveResponse.json();
                    campaignId = saveResult.campaign.id;

                    // Mettre à jour la campagne avec le nouvel ID
                    setCampaign(Campaign.fromJSON(saveResult.campaign));
                }

                const response = await fetch('/api/newsletters/send-mail', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'send',
                        campaignId: campaignId
                    })
                });

                if (!response.ok) throw new Error('Erreur lors de l\'envoi');
                const result = await response.json();

                const sentCampaign = campaign.send();
                onSave(sentCampaign);
                alert(result.message);
            } catch (error) {
                console.error('Erreur envoi:', error);
                alert('Erreur lors de l\'envoi de la campagne');
            }
        }
    };

    const handleSchedule = async (scheduledAt: Date) => {
        try {
            // Sauvegarder d'abord la campagne si elle n'a pas d'ID
            let campaignId = campaign.id;
            if (!campaignId) {
                const campaignData = {
                    title: campaign.title,
                    subject: campaign.subject,
                    content: campaign.content,
                    templateId: campaign.templateId,
                    audience: campaign.audience,
                    testEmails: campaign.testEmails
                };

                const saveResponse = await fetch('/api/newsletters/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData)
                });

                if (!saveResponse.ok) throw new Error('Erreur lors de la sauvegarde');
                const saveResult = await saveResponse.json();
                campaignId = saveResult.campaign.id;

                // Mettre à jour la campagne avec le nouvel ID
                setCampaign(Campaign.fromJSON(saveResult.campaign));
            }

            const response = await fetch('/api/newsletters/send-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'schedule',
                    campaignId: campaignId,
                    scheduledAt: scheduledAt.toISOString()
                })
            });

            if (!response.ok) throw new Error('Erreur lors de la planification');
            const result = await response.json();

            const scheduledCampaign = campaign.schedule(scheduledAt);
            onSave(scheduledCampaign);
            alert(result.message);
        } catch (error) {
            console.error('Erreur planification:', error);
            alert('Erreur lors de la planification de la campagne');
        }
    };

    const handleAudienceChange = (audience: Campaign['audience']) => {
        const updatedCampaign = campaign.updateAudience(audience);
        setCampaign(updatedCampaign);
    };

    const handleSendTest = async (emails: string[]) => {
        try {
            // Sauvegarder d'abord la campagne si elle n'a pas d'ID valide
            let campaignId = campaign.id;
            if (!campaignId || campaignId === '') {
                const campaignData = {
                    title: campaign.title,
                    subject: campaign.subject,
                    content: campaign.content,
                    templateId: campaign.templateId,
                    audience: campaign.audience,
                    testEmails: campaign.testEmails
                };

                console.log('Sauvegarde de la campagne avant test...', campaignData);

                const saveResponse = await fetch('/api/newsletters/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(campaignData)
                });

                if (!saveResponse.ok) {
                    const errorText = await saveResponse.text();
                    console.error('Erreur sauvegarde:', errorText);
                    throw new Error('Erreur lors de la sauvegarde de la campagne');
                }

                const saveResult = await saveResponse.json();
                campaignId = saveResult.campaign.id;

                if (!campaignId) {
                    throw new Error('ID de campagne non reçu après sauvegarde');
                }

                // Mettre à jour la campagne avec le nouvel ID
                setCampaign(Campaign.fromJSON(saveResult.campaign));
                console.log('Campagne sauvegardée avec ID:', campaignId);
            }

            const requestBody = {
                type: 'test',
                campaignId: campaignId,
                testEmails: emails
            };

            console.log('Envoi du test:', requestBody);

            const response = await fetch('/api/newsletters/send-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erreur API:', errorData);
                throw new Error(errorData.error || 'Erreur lors de l\'envoi du test');
            }

            const result = await response.json();
            console.log('Test envoyé:', result.message);
            return result;
        } catch (error) {
            console.error('Erreur envoi test:', error);
            alert(error instanceof Error ? error.message : 'Erreur lors de l\'envoi du test');
            throw error;
        }
    };

    const renderStepIndicator = () => {
        const steps = [
            { key: 'details', label: 'Détails', icon: FiEdit3 },
            { key: 'content', label: 'Contenu', icon: FiMail },
            { key: 'audience', label: 'Audience', icon: FiUsers },
            { key: 'preview', label: 'Aperçu', icon: FiEye },
            { key: 'schedule', label: 'Envoi', icon: FiSend }
        ];

        return (
            <div className="flex items-center justify-center mb-8">
                {steps.map((stepInfo, index) => {
                    const isActive = stepInfo.key === step;
                    const isCompleted = steps.findIndex(s => s.key === step) > index;
                    const Icon = stepInfo.icon;

                    return (
                        <div key={stepInfo.key} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                                isActive
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : isCompleted
                                    ? 'bg-green-600 border-green-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={`ml-2 text-sm font-medium ${
                                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                            }`}>
                                {stepInfo.label}
                            </span>
                            {index < steps.length - 1 && (
                                <div className={`w-12 h-0.5 mx-4 ${
                                    isCompleted ? 'bg-green-600' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>

                <div className="space-y-4">
                    <div>
                        <FloatingLabelInput
                            label="Titre de la campagne"
                            name="title"
                            placeholder="Ex: Newsletter mensuelle - Mars 2024"
                            value={campaign.title}
                            onChange={(e) => setCampaign(campaign.updateTitle(e.target.value))}
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <FloatingLabelInput
                            label="Objet de l'email"
                            name="subject"
                            placeholder="Ex: Découvrez nos dernières offres d'emploi"
                            value={campaign.subject}
                            onChange={(e) => setCampaign(campaign.updateSubject(e.target.value))}
                            className={errors.subject ? 'border-red-500' : ''}
                        />
                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                        <p className="text-gray-500 text-sm mt-1">
                            Cet objet apparaîtra dans la boîte de réception de vos abonnés
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContentStep = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenu de la campagne</h3>

                {/* Template selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choisir un template
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { id: 'basic', name: 'Template basique', preview: '📄' },
                            { id: 'newsletter', name: 'Newsletter', preview: '📰' },
                            { id: 'announcement', name: 'Annonce', preview: '📢' }
                        ].map((template) => (
                            <div
                                key={template.id}
                                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                                    campaign.templateId === template.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setCampaign(new Campaign({
                                    ...campaign.toJSON(),
                                    templateId: template.id
                                }))}
                            >
                                <div className="text-center">
                                    <div className="text-3xl mb-2">{template.preview}</div>
                                    <div className="text-sm font-medium text-gray-700">{template.name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenu de l'email
                    </label>
                    <div className={`border rounded-lg ${errors.content ? 'border-red-500' : 'border-gray-300'}`}>
                        <EditorJSComponent
                            placeholder="Rédigez le contenu de votre campagne ici..."
                            initialData={campaign.content ? JSON.parse(campaign.content || '{}') : undefined}
                            onChange={(data) => {
                                // Convertir les données EditorJS en texte pour l'email
                                const textContent = data.blocks?.map((block: any) => {
                                    switch (block.type) {
                                        case 'paragraph':
                                            return block.data.text || '';
                                        case 'header':
                                            return block.data.text || '';
                                        case 'list':
                                            return block.data.items?.join('\n') || '';
                                        default:
                                            return block.data.text || '';
                                    }
                                }).join('\n\n') || '';

                                // Sauvegarder les données JSON pour l'éditeur et le texte pour l'email
                                setCampaign(campaign.updateContent(JSON.stringify(data)));
                            }}
                            className="min-h-64"
                        />
                    </div>
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* Test emails */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emails de test
                    </label>
                    <div className="space-y-2">
                        {campaign.testEmails.map((email, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />
                                <Button
                                    onClick={() => setCampaign(campaign.removeTestEmail(email))}
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
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const email = (e.target as HTMLInputElement).value;
                                        if (email && email.includes('@')) {
                                            setCampaign(campaign.addTestEmail(email));
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    const input = document.querySelector('input[placeholder="Ajouter un email de test"]') as HTMLInputElement;
                                    const email = input?.value;
                                    if (email && email.includes('@')) {
                                        setCampaign(campaign.addTestEmail(email));
                                        input.value = '';
                                    }
                                }}
                                className="bg-blue-500 hover:bg-blue-600 px-3 py-2"
                            >
                                <FiPlus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!mounted) {
        return null;
    }

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4 overflow-y-auto"
            style={{ zIndex: 99999 }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-gray-50 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col my-4 sm:my-8 relative shadow-2xl mx-auto">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {initialCampaign ? 'Modifier la campagne' : 'Créer une campagne'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {campaign.title || 'Nouvelle campagne'}
                        </p>
                    </div>
                    <Button
                        onClick={onClose}
                        className="bg-gray-100 hover:bg-gray-200 !text-gray-700 px-3 py-2"
                    >
                        <FiX className="w-5 h-5" />
                    </Button>
                </div>

                {/* Step indicator */}
                <div className="bg-white px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    {renderStepIndicator()}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 min-h-0">
                    {step === 'details' && renderDetailsStep()}
                    {step === 'content' && renderContentStep()}
                    {step === 'audience' && (
                        <AudienceSelector
                            campaign={campaign}
                            onAudienceChange={handleAudienceChange}
                            onError={(error) => setErrors({ audience: error })}
                        />
                    )}
                    {step === 'preview' && (
                        <CampaignPreview
                            campaign={campaign}
                            onSendTest={handleSendTest}
                            onBack={handlePrevious}
                        />
                    )}
                    {step === 'schedule' && (
                        <CampaignScheduler
                            campaign={campaign}
                            onSendNow={handleSendNow}
                            onSchedule={handleSchedule}
                            onBack={handlePrevious}
                        />
                    )}
                </div>

                {/* Footer - Show for all steps */}
                <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                        {(['details', 'content', 'audience', 'preview'].includes(step)) && (
                            <Button
                                onClick={handleSaveDraft}
                                className="bg-gray-500 hover:bg-gray-600 text-white"
                            >
                                Sauvegarder le brouillon
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {step !== 'details' && (
                            <Button
                                onClick={handlePrevious}
                                className="bg-gray-100 hover:bg-gray-200 !text-gray-700"
                            >
                                Précédent
                            </Button>
                        )}
                        {(['details', 'content', 'audience', 'preview'].includes(step)) && (
                            <Button
                                onClick={handleNext}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Suivant
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}