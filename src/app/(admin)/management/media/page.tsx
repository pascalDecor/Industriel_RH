'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Image as ImageIcon, Upload, Search, X, ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/button';
import { imagePathFinder } from '@/utils/imagePathFinder';

interface MediaAsset {
  id: string;
  key: string;
  category: string | null;
  publicUrl: string;
  fileName: string;
  altText_fr: string | null;
  altText_en: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
  priority: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  keys: string[];
}

const IMAGE_GROUPS: ImageGroup[] = [
  {
    id: 'branding',
    name: 'Branding & Logos',
    icon: '🎨',
    color: 'blue',
    description: 'Logos et éléments de marque',
    keys: ['logo', 'logo_light', 'logo_only']
  },
  {
    id: 'banners',
    name: 'Bannières & Carrousel',
    icon: '🖼️',
    color: 'purple',
    description: 'Images du carrousel et bannières',
    keys: ['banner', 'banner_1', 'banner_2', 'banner_3', 'cardFond']
  },
  {
    id: 'navigation',
    name: 'Navigation',
    icon: '🧭',
    color: 'green',
    description: 'Images du menu de navigation',
    keys: ['find_jobs', 'hire_talent', 'consulting_solutions', 'discover_insights']
  },
  {
    id: 'home',
    name: 'Page Accueil',
    icon: '🏠',
    color: 'indigo',
    description: 'Images de la page d\'accueil',
    keys: [
      'we_source_the_talent',
      'describe_your_need',
      'continuous_support',
      'seamless_integration',
      'select_and_approve',
      'find_your_next_hire',
      'we_are_experts_in_employee_recognition',
      'shape_the_career_you_want',
      'add_specialized_talent_across_your_organization',
      'app_your_way_to_a_new_job'
    ]
  },
  {
    id: 'about',
    name: 'À propos',
    icon: 'ℹ️',
    color: 'teal',
    description: 'Images de la page à propos',
    keys: [
      'about_catalyst_of_prosperity',
      'reliability',
      'innovative_approach',
      'expertise',
      'technology',
      'valeur_diversity',
      'valeur_innovation',
      'valeur_integrity',
      'valeur_sustanability'
    ]
  },
  {
    id: 'team',
    name: 'Équipe',
    icon: '👥',
    color: 'pink',
    description: 'Photos des membres de l\'équipe',
    keys: [
      'Jerome_youmani_lankoande',
      'alice_morin',
      'eloise_emery',
      'komi_sodoke',
      'louis_caron',
      'paul_farcas',
      'jamel_hein'
    ]
  },
  {
    id: 'hire',
    name: 'Embaucher des talents',
    icon: '💼',
    color: 'orange',
    description: 'Images de la page embauche',
    keys: [
      'hire',
      'hire_talent_how_it_work',
      'recruitment_by_outsourcing',
      'international_recruitment',
      'hire_the_best_francophone_talent_worldwide',
      'your_partner_for_manufacturing_workforce_solutions',
      'leading_agency_for_manufacturing_workforce_solutions'
    ]
  },
  {
    id: 'jobs',
    name: 'Trouver un emploi',
    icon: '🔍',
    color: 'yellow',
    description: 'Images de la page recherche d\'emploi',
    keys: [
      'find_a_job_that_works_for_you',
      'explore_how_we_help_job_seekers',
      'preview_candidat',
      'how_it_work',
      'cv_builder',
      'landing_a_job',
      'own_the_future_of_your_work'
    ]
  },
  {
    id: 'insights',
    name: 'Ressources & Insights',
    icon: '📊',
    color: 'emerald',
    description: 'Guides salariaux et ressources',
    keys: [
      'salary_guide',
      'salary_guide_1',
      'salary_guide_five',
      'salary_guide_page',
      'salaryIQ',
      'be_salary_smart',
      'navigate_tech_skill',
      'what_jobs_are_in_demand',
      'What_jobs_are_in_demand',
      'what_jobs_are_in_demand_3',
      'robert_half_blog',
      'ir_blog',
      'trending_job_titles',
      'career_development',
      'build_employee_engagement'
    ]
  },
  {
    id: 'tools',
    name: 'Outils & Calculateurs',
    icon: '🧮',
    color: 'violet',
    description: 'Calculateurs et outils',
    keys: [
      'quebec_tax_calculator',
      'salaire_net',
      'morgage_calculator',
      'mortgage_calc',
      'valid_cnesst',
      'validCNESST'
    ]
  },
  {
    id: 'partners',
    name: 'Partenaires',
    icon: '🤝',
    color: 'cyan',
    description: 'Logos des partenaires',
    keys: [
      'partners_accreditation',
      'partners_desjardins',
      'partners_CRIC',
      'partners_cnesst',
      'partners_dusco',
      'partners_stride',
      'partners_pme_mtl'
    ]
  },
  {
    id: 'icons',
    name: 'Icônes',
    icon: '🎯',
    color: 'red',
    description: 'Icônes et petites images',
    keys: [
      'icons_location',
      'icons_horloge',
      'icons_envelop',
      'icons_phone',
      'check',
      'secure_the_right_fit_for_your_team',
      'find_top_talent_faster',
      'hire_with_precision_confidence',
      'welcome_and_integration',
      'legal_services',
      'international_recruitment_icon',
      'structured_approach',
      'access_to_diverse_talent',
      'fill_critical_skill_gaps',
      'boost_competitiveness',
      'streamlined_processes'
    ]
  },
  {
    id: 'contact',
    name: 'Contact',
    icon: '📧',
    color: 'gray',
    description: 'Images de la page contact',
    keys: [
      'contact_adresse',
      'contact_couriel',
      'contact_langue',
      'contact_telephone',
      'we_accept_recruitment'
    ]
  },
  {
    id: 'misc',
    name: 'Divers',
    icon: '📦',
    color: 'slate',
    description: 'Autres images',
    keys: [
      'apple',
      'google_play',
      'login',
      'avatar',
      'light',
      'bg',
      'bg_blue',
      'card_image_1',
      'card_image_2',
      'card_image_3',
      'card_image_4',
      'card_image_5',
      'card_image_6'
    ]
  }
];

export default function MediaManagementPage() {
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<{ key: string; media: MediaAsset | null } | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/media');
      const data = await response.json();

      if (data.success) {
        setMediaAssets(data.media || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des médias:', error);
      toast.error('Erreur lors du chargement des médias');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (key: string) => {
    const media = mediaAssets.find(m => m.key === key);
    setEditingImage({ key, media: media || null });
  };

  const handleFileUpload = async (file: File, key: string, altTextFr?: string, altTextEn?: string) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploadingKey(key);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('altText_fr', altTextFr || key);
      formData.append('altText_en', altTextEn || key);

      const currentGroup = IMAGE_GROUPS.find(g => g.keys.includes(key));
      if (currentGroup) {
        formData.append('category', currentGroup.name);
      }

      const response = await fetch(`/api/media/${key}`, {
        method: 'PUT',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Image mise à jour avec succès');
        await fetchMedia();
        setEditingImage(null);
      } else {
        toast.error('❌ Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('❌ Erreur lors de l\'upload');
    } finally {
      setUploadingKey(null);
    }
  };

  const getImageForKey = (key: string): { src: string; isCustom: boolean } => {
    const media = mediaAssets.find(m => m.key === key && m.isActive);
    if (media) {
      return { src: media.publicUrl, isCustom: true };
    }

    const staticImage = imagePathFinder[key as keyof typeof imagePathFinder];
    if (staticImage) {
      // Les images importées via Next.js ont une propriété src
      if (typeof staticImage === 'object' && 'src' in staticImage) {
        return { src: staticImage.src as string, isCustom: false };
      }
      // Si c'est une string directe
      if (typeof staticImage === 'string') {
        return { src: staticImage, isCustom: false };
      }
    }

    return { src: '', isCustom: false };
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
      cyan: { bg: 'bg-cyan-50', hover: 'hover:bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
      emerald: { bg: 'bg-emerald-50', hover: 'hover:bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
      violet: { bg: 'bg-violet-50', hover: 'hover:bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
      slate: { bg: 'bg-slate-50', hover: 'hover:bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    };
    return colors[color] || colors.blue;
  };

  const selectedGroupData = IMAGE_GROUPS.find(g => g.id === selectedGroup);
  const filteredKeys = selectedGroupData?.keys.filter(key =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des médias du site
            </h1>
            <p className="text-gray-600 mt-2">
              {selectedGroup
                ? `Édition : ${selectedGroupData?.name}`
                : 'Sélectionnez une catégorie à gérer'}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {Object.keys(imagePathFinder).length} images disponibles
          </div>
        </div>

        {!selectedGroup ? (
          /* Grille des catégories */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {IMAGE_GROUPS.map((group) => {
              const colorClasses = getColorClasses(group.color);

              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`${colorClasses.bg} ${colorClasses.hover} ${colorClasses.border} border-2 rounded-lg p-6 text-left transition-all transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{group.icon}</div>
                    <span className={`${colorClasses.text} text-sm font-semibold px-3 py-1 bg-white rounded-full`}>
                      {group.keys.length} images
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
          /* Vue des images du groupe */
          <div>
            <div className="mb-6 flex items-center gap-4">
              <Button
                variant="dark"
                onClick={() => {
                  setSelectedGroup(null);
                  setSearchTerm('');
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour aux catégories
              </Button>

              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher dans cette catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredKeys.map(key => {
                const { src, isCustom } = getImageForKey(key);
                const media = mediaAssets.find(m => m.key === key);

                return (
                  <div
                    key={key}
                    onClick={() => handleImageClick(key)}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
                  >
                    {/* Image preview */}
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                      {src ? (
                        <>
                          <img
                            src={src}
                            alt={key}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                          {isCustom && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Personnalisée
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                              ✏️ Modifier
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 p-4">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Image non disponible</p>
                          <p className="text-xs mt-1">Cliquez pour uploader</p>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="font-mono text-sm text-blue-600 mb-2 truncate font-semibold">
                        {key}
                      </div>

                      {media && (
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="truncate">{media.fileName}</div>
                          <div className="flex justify-between">
                            <span>{formatFileSize(media.fileSize)}</span>
                            {media.width && media.height && (
                              <span>{media.width}×{media.height}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {!media && (
                        <div className="text-xs text-gray-400 italic">
                          Image statique par défaut
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredKeys.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Aucune image trouvée dans cette catégorie
              </div>
            )}
          </div>
        )}

        {/* Modal d'édition */}
        {editingImage && (
          <EditImageModal
            imageKey={editingImage.key}
            currentMedia={editingImage.media}
            currentSrc={getImageForKey(editingImage.key).src}
            onClose={() => setEditingImage(null)}
            onUpload={handleFileUpload}
            isUploading={uploadingKey === editingImage.key}
          />
        )}
      </div>
    </div>
  );
}

interface EditImageModalProps {
  imageKey: string;
  currentMedia: MediaAsset | null;
  currentSrc: string;
  onClose: () => void;
  onUpload: (file: File, key: string, altTextFr: string, altTextEn: string) => Promise<void>;
  isUploading: boolean;
}

function EditImageModal({
  imageKey,
  currentMedia,
  currentSrc,
  onClose,
  onUpload,
  isUploading
}: EditImageModalProps) {
  const [altTextFr, setAltTextFr] = useState(currentMedia?.altText_fr || '');
  const [altTextEn, setAltTextEn] = useState(currentMedia?.altText_en || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    await onUpload(selectedFile, imageKey, altTextFr, altTextEn);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 border-b pb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Modifier l'image
              </h3>
              <code className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                {imageKey}
              </code>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isUploading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Preview actuelle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image actuelle
            </label>
            <div className="relative h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              {currentSrc ? (
                <img
                  src={currentSrc}
                  alt={imageKey}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center text-gray-400 p-4">
                  <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune image actuelle</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload nouvelle image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nouvelle image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner une image'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF jusqu'à 5MB
                </span>
              </label>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aperçu de la nouvelle image
                </label>
                <div className="relative h-64 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Textes alternatifs */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🇫🇷 Texte alternatif (français)
              </label>
              <input
                type="text"
                value={altTextFr}
                onChange={(e) => setAltTextFr(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Description de l'image en français"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🇬🇧 Texte alternatif (anglais)
              </label>
              <input
                type="text"
                value={altTextEn}
                onChange={(e) => setAltTextEn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Image description in English"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Upload en cours...
                </>
              ) : (
                '💾 Sauvegarder'
              )}
            </Button>
            <Button
              variant="dark"
              onClick={onClose}
              disabled={isUploading}
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
