"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import Button from "@/components/ui/button";
import FloatingLabelInput from "@/components/ui/input";
import { toast } from "react-hot-toast";
import {
  Home,
  Navigation,
  FileText,
  Layout,
  Calculator,
  Briefcase,
  AlertCircle,
  Globe,
  Users,
  Eye,
  List,
  Monitor,
  Search
} from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

interface Translation {
  id: string;
  key: string;
  category: string | null;
  fr: string;
  en: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GroupConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
  prefixes: string[];
}

const TRANSLATION_GROUPS: GroupConfig[] = [
  {
    id: 'nav-common',
    name: 'Navigation & Interface',
    icon: Navigation,
    color: 'blue',
    description: 'Menus, boutons communs, messages système',
    prefixes: ['nav.', 'common.', 'button.', 'notification.', 'language.']
  },
  {
    id: 'home',
    name: 'Page d\'accueil',
    icon: Home,
    color: 'green',
    description: 'Carrousel, sections principales, CTA',
    prefixes: ['home.', 'carousel.', 'specialized_talent.', 'success_stories.', 'partners.', 'mobile_app.']
  },
  {
    id: 'jobs',
    name: 'Trouver un emploi',
    icon: Briefcase,
    color: 'purple',
    description: 'Recherche d\'emploi, CV, candidatures',
    prefixes: ['find_jobs.', 'jobs.']
  },
  {
    id: 'hire',
    name: 'Embaucher des talents',
    icon: Users,
    color: 'orange',
    description: 'Recrutement, impartition, international',
    prefixes: ['hire_talent.']
  },
  {
    id: 'footer',
    name: 'Footer',
    icon: Layout,
    color: 'gray',
    description: 'Pied de page, liens, informations légales',
    prefixes: ['footer.']
  },
  {
    id: 'forms',
    name: 'Formulaires',
    icon: FileText,
    color: 'indigo',
    description: 'Champs, labels, validation',
    prefixes: ['form.']
  },
  {
    id: 'pages',
    name: 'Autres pages',
    icon: FileText,
    color: 'teal',
    description: 'À propos, Contact, Services',
    prefixes: ['about.', 'contact.', 'services.']
  },
  {
    id: 'tools',
    name: 'Calculateurs & Outils',
    icon: Calculator,
    color: 'yellow',
    description: 'Guide salarial, calculateurs, CNESST',
    prefixes: ['calculators.', 'salary.', 'tax.', 'mortgage.', 'cnesst.', 'salary_guide.', 'quebec_tax_calculator.', 'mortgage_calculator.', 'discover_insights.']
  },
  {
    id: 'content',
    name: 'Contenu & Secteurs',
    icon: Globe,
    color: 'pink',
    description: 'Secteurs, spécialités, témoignages',
    prefixes: ['sectors.', 'consulting.', 'international.', 'outsourcing.']
  },
  {
    id: 'other',
    name: 'Alerte & Légal',
    icon: AlertCircle,
    color: 'red',
    description: 'Alerte fraude, conditions, politique',
    prefixes: ['fraud_alert.', 'privacy_policy.', 'terms_of_use.']
  },
];

// Fonction pour générer un label lisible depuis une clé technique
const getReadableLabel = (key: string): string => {
  // Extraire la dernière partie après le dernier point
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];

  // Convertir snake_case et camelCase en texte lisible
  return lastPart
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
};

// Fonction pour obtenir le contexte d'utilisation
const getContext = (key: string): string => {
  const contextMap: Record<string, string> = {
    // Footer
    'footer.': 'Pied de page du site',

    // Navigation
    'nav.home': 'Menu principal - Lien Accueil',
    'nav.about': 'Menu principal - Lien À propos',
    'nav.services': 'Menu principal - Lien Services',
    'nav.contact': 'Menu principal - Lien Contact',
    'nav.hire_talent': 'Menu principal - Bouton principal',
    'nav.find_jobs': 'Menu principal - Bouton principal',
    'nav.': 'Barre de navigation',

    // Common
    'common.loading': 'Message de chargement',
    'common.error': 'Message d\'erreur',
    'common.success': 'Message de succès',
    'common.': 'Messages système',

    // Boutons
    'button.': 'Boutons d\'action',

    // Formulaires
    'form.name': 'Champ de formulaire - Nom',
    'form.email': 'Champ de formulaire - Email',
    'form.phone': 'Champ de formulaire - Téléphone',
    'form.': 'Formulaires de contact/candidature',

    // Home
    'home.hero.': 'Bannière principale page d\'accueil',
    'home.cards.': 'Section cartes page d\'accueil',
    'home.': 'Page d\'accueil',

    // Carousel
    'carousel.': 'Carrousel de la page d\'accueil',

    // Jobs
    'find_jobs.': 'Page "Trouver un emploi"',
    'jobs.': 'Section emplois',

    // Hire
    'hire_talent.': 'Page "Embaucher des talents"',

    // About
    'about.': 'Page "À propos"',

    // Contact
    'contact.': 'Page "Contact"',

    // Calculators
    'calculators.': 'Section calculateurs',
    'salary_guide.': 'Page Guide Salarial',
    'quebec_tax_calculator.': 'Page Calculateur d\'impôt',
    'mortgage_calculator.': 'Page Calculateur hypothécaire',

    // Legal
    'privacy_policy.': 'Page Politique de confidentialité',
    'terms_of_use.': 'Page Conditions d\'utilisation',
    'fraud_alert.': 'Page Alerte à la fraude',
  };

  // Chercher la correspondance la plus spécifique
  const matches = Object.entries(contextMap)
    .filter(([prefix]) => key.startsWith(prefix))
    .sort((a, b) => b[0].length - a[0].length);

  return matches[0]?.[1] || 'Site web';
};

export default function TranslationsPage() {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [showTechnicalKeys, setShowTechnicalKeys] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'preview'>('preview'); // Default to preview mode
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>('fr');
  const [globalSearchMode, setGlobalSearchMode] = useState(false);

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/translations');
      const data = await response.json();

      if (data.success) {
        setTranslations(data.translations || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des traductions');
    } finally {
      setLoading(false);
    }
  };

  const updateTranslation = async (translation: Translation) => {
    try {
      setSaving(translation.id);

      const response = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: translation.id,
          key: translation.key,
          category: translation.category,
          fr: translation.fr,
          en: translation.en,
          description: translation.description
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTranslations(prev => prev.map(t =>
          t.id === translation.id ? data.translation : t
        ));
        setEditingTranslation(null);
        toast.success('✅ Traduction mise à jour');
      } else {
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(null);
    }
  };

  // Handler for updating from preview components
  const handlePreviewUpdate = (id: string, fr: string, en: string) => {
    setTranslations(prev => prev.map(t =>
      t.id === id ? { ...t, fr, en } : t
    ));
  };

  const getTranslationsByGroup = (group: GroupConfig) => {
    return translations.filter(t =>
      group.prefixes.some(prefix => t.key.startsWith(prefix))
    );
  };

  const getGroupCount = (group: GroupConfig) => {
    return getTranslationsByGroup(group).length;
  };

  // Fonction pour obtenir le groupe d'une traduction
  const getTranslationGroup = (translation: Translation): GroupConfig | null => {
    return TRANSLATION_GROUPS.find(group =>
      group.prefixes.some(prefix => translation.key.startsWith(prefix))
    ) || null;
  };

  const filteredTranslations = globalSearchMode && searchTerm
    ? translations.filter(t =>
        t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getReadableLabel(t.key).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedGroup
    ? getTranslationsByGroup(TRANSLATION_GROUPS.find(g => g.id === selectedGroup)!).filter(t =>
        t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getReadableLabel(t.key).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; hover: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', hover: 'hover:bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', hover: 'hover:bg-green-100', text: 'text-green-700', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', hover: 'hover:bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
      orange: { bg: 'bg-orange-50', hover: 'hover:bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
      gray: { bg: 'bg-gray-50', hover: 'hover:bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
      indigo: { bg: 'bg-indigo-50', hover: 'hover:bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-50', hover: 'hover:bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
      yellow: { bg: 'bg-yellow-50', hover: 'hover:bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
      pink: { bg: 'bg-pink-50', hover: 'hover:bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
      red: { bg: 'bg-red-50', hover: 'hover:bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    };
    return colors[color] || colors.blue;
  };

  // Check if preview is available for a group
  const hasPreview = (groupId: string) => {
    return ['nav-common', 'footer'].includes(groupId);
  };

  // Render the appropriate preview component
  const renderPreview = () => {
    if (!selectedGroup) return null;

    const groupTranslations = filteredTranslations;

    switch (selectedGroup) {
      case 'nav-common':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Mode édition visuelle</strong> : Cliquez sur les textes pour les modifier directement depuis le composant.
              </p>
            </div>
            <div className="relative">
              <Navbar
                isTranslateMode={true}
                translations={groupTranslations}
                onUpdate={handlePreviewUpdate}
              />
              {/* Spacer to show the navbar properly */}
              <div className="h-32"></div>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Mode édition visuelle</strong> : Cliquez sur les textes pour les modifier directement depuis le composant.
              </p>
            </div>
            <Footer
              isTranslateMode={true}
              translations={groupTranslations}
              onUpdate={handlePreviewUpdate}
            />
          </div>
        );
      default:
        return (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <p className="text-blue-800">
              <strong>ℹ️ Aperçu non disponible</strong> : La prévisualisation visuelle n'est pas encore disponible pour cette section. Utilisez la vue liste pour modifier les traductions.
            </p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des traductions du site
            </h1>
            <p className="text-gray-600 mt-2">
              {globalSearchMode
                ? 'Recherche globale - Recherchez dans toutes les traductions'
                : selectedGroup
                ? `Édition : ${TRANSLATION_GROUPS.find(g => g.id === selectedGroup)?.name}`
                : 'Sélectionnez une section à éditer'}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Total: {translations.length} traductions
          </div>
        </div>

        {!selectedGroup && !globalSearchMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte de recherche globale */}
            <button
              onClick={() => {
                setGlobalSearchMode(true);
                setViewMode('list');
              }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-2 border-transparent rounded-lg p-6 text-left transition-all transform hover:scale-105 hover:shadow-xl text-white"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Search size={24} className="text-white" />
                </div>
                <span className="text-sm font-semibold px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  {translations.length} textes
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">
                Recherche globale
              </h3>
              <p className="text-white/90 text-sm">
                Rechercher dans toutes les traductions du site, tous secteurs confondus
              </p>
            </button>

            {TRANSLATION_GROUPS.map((group) => {
              const Icon = group.icon;
              const count = getGroupCount(group);
              const colorClasses = getColorClasses(group.color);

              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`${colorClasses.bg} ${colorClasses.hover} ${colorClasses.border} border-2 rounded-lg p-6 text-left transition-all transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${colorClasses.text} p-3 rounded-lg bg-white`}>
                      <Icon size={24} />
                    </div>
                    <span className={`${colorClasses.text} text-sm font-semibold px-3 py-1 bg-white rounded-full`}>
                      {count} textes
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${colorClasses.text} mb-2`}>
                    {group.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {group.description}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center gap-4 flex-wrap">
              <Button
                variant="dark"
                onClick={() => {
                  setSelectedGroup(null);
                  setGlobalSearchMode(false);
                  setSearchTerm("");
                  setEditingTranslation(null);
                  setViewMode('preview');
                }}
              >
                ← Retour aux sections
              </Button>

              <div className="flex-1 min-w-[200px]">
                <FloatingLabelInput
                  label={globalSearchMode ? "Recherche globale" : "Rechercher dans cette section"}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={globalSearchMode ? "Rechercher dans toutes les traductions..." : "Rechercher par texte ou emplacement..."}
                />
              </div>

              {/* View mode toggle */}
              {!globalSearchMode && selectedGroup && hasPreview(selectedGroup) && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Vue prévisualisation"
                  >
                    <Monitor size={16} />
                    Aperçu
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Vue liste"
                  >
                    <List size={16} />
                    Liste
                  </button>
                </div>
              )}

              {/* Language toggle for preview mode */}
              {!globalSearchMode && viewMode === 'preview' && selectedGroup && hasPreview(selectedGroup) && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentLanguage('fr')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentLanguage === 'fr'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🇫🇷 Français
                  </button>
                  <button
                    onClick={() => setCurrentLanguage('en')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentLanguage === 'en'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}

              {/* Technical keys toggle (only for list view) */}
              {viewMode === 'list' && (
                <button
                  onClick={() => setShowTechnicalKeys(!showTechnicalKeys)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  title={showTechnicalKeys ? "Masquer les clés techniques" : "Afficher les clés techniques"}
                >
                  <Eye size={16} />
                  {showTechnicalKeys ? 'Mode simple' : 'Mode technique'}
                </button>
              )}
            </div>

            {viewMode === 'list' && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                {globalSearchMode ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {filteredTranslations.length > 0 ? (
                        <>
                          <strong>{filteredTranslations.length}</strong> résultat{filteredTranslations.length > 1 ? 's' : ''} trouvé{filteredTranslations.length > 1 ? 's' : ''}
                          {searchTerm && <> pour "<strong>{searchTerm}</strong>"</>}
                        </>
                      ) : searchTerm ? (
                        <>Aucun résultat pour "<strong>{searchTerm}</strong>"</>
                      ) : (
                        <>Saisissez un terme de recherche pour commencer</>
                      )}
                    </p>
                    {!searchTerm && (
                      <p className="text-xs text-gray-500">
                        💡 La recherche porte sur les clés, les textes français et anglais
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {filteredTranslations.length} texte{filteredTranslations.length > 1 ? 's' : ''} dans cette section
                  </p>
                )}
              </div>
            )}

            {/* Preview mode */}
            {viewMode === 'preview' && selectedGroup && hasPreview(selectedGroup) ? (
              <div>
                {renderPreview()}
              </div>
            ) : viewMode === 'preview' && selectedGroup && !hasPreview(selectedGroup) ? (
              <div>
                {renderPreview()}
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={() => setViewMode('list')}
                    className="w-full"
                  >
                    Passer à la vue liste
                  </Button>
                </div>
              </div>
            ) : (
              /* Liste des traductions */
              <div className="space-y-4">
                {filteredTranslations.map((translation) => {
                  const translationGroup = getTranslationGroup(translation);
                  const groupColorClasses = translationGroup ? getColorClasses(translationGroup.color) : null;

                  return (
                <div
                  key={translation.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {/* En-tête avec label et contexte */}
                    <div className="flex items-start justify-between border-b pb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {getReadableLabel(translation.key)}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                          {globalSearchMode && translationGroup && groupColorClasses && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${groupColorClasses.bg} ${groupColorClasses.text} border ${groupColorClasses.border}`}>
                              📂 {translationGroup.name}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getContext(translation.key)}
                          </span>
                          {showTechnicalKeys && (
                            <code className="text-xs text-gray-400 font-mono">
                              {translation.key}
                            </code>
                          )}
                        </p>
                      </div>
                      <div>
                        {editingTranslation?.id === translation.id ? (
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => updateTranslation(editingTranslation)}
                              disabled={saving === translation.id}
                            >
                              {saving === translation.id ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
                            </Button>
                            <Button
                              variant="dark"
                              size="sm"
                              onClick={() => setEditingTranslation(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="dark"
                            size="sm"
                            onClick={() => setEditingTranslation(translation)}
                          >
                            ✏️ Modifier
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Contenu FR/EN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Français */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🇫🇷 Français
                        </label>
                        {editingTranslation?.id === translation.id ? (
                          <textarea
                            value={editingTranslation.fr}
                            onChange={(e) => setEditingTranslation({
                              ...editingTranslation,
                              fr: e.target.value
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                            rows={4}
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 min-h-[100px]">
                            {translation.fr}
                          </div>
                        )}
                      </div>

                      {/* Anglais */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🇬🇧 English
                        </label>
                        {editingTranslation?.id === translation.id ? (
                          <textarea
                            value={editingTranslation.en}
                            onChange={(e) => setEditingTranslation({
                              ...editingTranslation,
                              en: e.target.value
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                            rows={4}
                          />
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 min-h-[100px]">
                            {translation.en}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
                })}

                {filteredTranslations.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    {globalSearchMode ? (
                      searchTerm ? (
                        <div>
                          <p className="text-lg mb-2"> Aucun résultat trouvé</p>
                          <p className="text-sm">Essayez avec d'autres mots-clés</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg mb-2"> Recherche globale</p>
                          <p className="text-sm">Saisissez un terme pour rechercher dans toutes les traductions</p>
                        </div>
                      )
                    ) : (
                      'Aucun texte trouvé dans cette section'
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
