"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import Button from "@/components/ui/button";
import FloatingLabelInput from "@/components/ui/input";
import FloatingLabelSelect from "@/components/ui/select";
import { FiArrowLeft, FiSave, FiEye } from "react-icons/fi";

interface Tag {
  id: string;
  libelle: string;
}

interface Specialite {
  id: string;
  libelle: string;
}

interface Article {
  id: string;
  titre: string;
  contenu: any;
  image: string;
  published: boolean;
  tags: Tag[];
  specialites: Specialite[];
  author?: {
    id: string;
    name: string;
  };
}

export default function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableSpecialites, setAvailableSpecialites] = useState<Specialite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);

  // Form states
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [image, setImage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSpecialites, setSelectedSpecialites] = useState<string[]>([]);

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setArticleId(resolvedParams.id);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
      fetchTags();
      fetchSpecialites();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    if (!articleId) return;
    try {
      const response = await fetch(`/api/articles/${articleId}`);
      if (!response.ok) {
        throw new Error("Article not found");
      }
      const articleData = await response.json();
      setArticle(articleData);
      
      // Populate form
      setTitre(articleData.titre);
      setImage(articleData.image || "");
      setSelectedTags(articleData.tags.map((tag: Tag) => tag.id));
      setSelectedSpecialites(articleData.specialites.map((spec: Specialite) => spec.id));
      
      // Handle content (EditorJS format)
      if (articleData.contenu && Array.isArray(articleData.contenu) && articleData.contenu.length > 0) {
        const content = articleData.contenu[0];
        if (content.blocks && Array.isArray(content.blocks)) {
          const textContent = content.blocks
            .filter((block: any) => block.type === 'paragraph' && block.data?.text)
            .map((block: any) => block.data.text.replace(/<[^>]*>/g, ''))
            .join('\n\n');
          setContenu(textContent);
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      setError("Impossible de charger l'article");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();
      setAvailableTags(data.data || data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchSpecialites = async () => {
    try {
      const response = await fetch("/api/specialites");
      const data = await response.json();
      setAvailableSpecialites(data.data || data);
    } catch (error) {
      console.error("Error fetching specialites:", error);
    }
  };

  const handleSave = async (shouldPublish: boolean = false) => {
    if (!titre.trim()) {
      setError("Le titre est requis");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Convert simple text content to EditorJS format
      const editorJSContent = {
        time: Date.now(),
        blocks: contenu.split('\n\n').filter(p => p.trim()).map(paragraph => ({
          id: Math.random().toString(36).substr(2, 9),
          type: 'paragraph',
          data: {
            text: paragraph.trim()
          }
        })),
        version: "2.28.2"
      };

      const updateData = {
        titre: titre.trim(),
        contenu: [editorJSContent],
        image: image || null,
        published: shouldPublish,
        tags: selectedTags,
        specialites: selectedSpecialites
      };

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      const updatedArticle = await response.json();
      setArticle(updatedArticle);
      
      // Show success message
      alert(shouldPublish ? "Article publié avec succès !" : "Article sauvegardé avec succès !");
      
    } catch (error) {
      console.error("Error saving article:", error);
      setError("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleTagChange = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSpecialiteChange = (specId: string) => {
    setSelectedSpecialites(prev => 
      prev.includes(specId) 
        ? prev.filter(id => id !== specId)
        : [...prev, specId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.back()}
            className="!rounded-full"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.back()}
              className="!rounded-full flex items-center gap-2"
            >
              <FiArrowLeft />
              Retour
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Modifier l'article
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="!rounded-full flex items-center gap-2"
            >
              <FiSave />
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="!rounded-full flex items-center gap-2"
            >
              <FiEye />
              {saving ? "Publication..." : "Publier"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <FloatingLabelInput
                type="text"
                label="Titre de l'article"
                placeholder="Titre de l'article"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
            </div>

            {/* Image */}
            <div>
              <FloatingLabelInput
                type="url"
                label="URL de l'image (optionnel)"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu de l'article
              </label>
              <textarea
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                rows={12}
                className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Écrivez le contenu de votre article ici..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableTags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{tag.libelle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Specialites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Spécialités
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSpecialites.map((spec) => (
                  <label key={spec.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSpecialites.includes(spec.id)}
                      onChange={() => handleSpecialiteChange(spec.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{spec.libelle}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status */}
            {article && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    Status: <strong className={article.published ? "text-green-600" : "text-yellow-600"}>
                      {article.published ? "Publié" : "Brouillon"}
                    </strong>
                  </span>
                  {article.author && (
                    <span>
                      Auteur: <strong>{article.author.name}</strong>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}