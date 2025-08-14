"use client";

import { useState, useEffect } from "react";
import { Article } from "@/models/article";
import LazyImage from "@/components/ui/LazyImage";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import { formatDateFr } from "@/lib/formatDate";
import { useDateLanguage } from "@/hooks/useDateLanguage";

interface DynamicArticlesGridProps {
  category?: string;
  sectorId?: string | null;
  limit?: number;
  showFeaturedBlocks?: boolean;
}

interface ArticleData {
  id: string;
  titre: string;
  image: string;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  contenu?: any; // Contenu EditorJS
  tags: Array<{ id: string; libelle: string }>;
  specialites: Array<{ id: string; libelle: string }>;
  author?: { id: string; name: string };
}

export default function DynamicArticlesGrid({
  category = "all",
  sectorId = null,
  limit = 12,
  showFeaturedBlocks = true
}: DynamicArticlesGridProps) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t, language } = useTranslation();

  // Synchronise automatiquement la langue pour le formatage des dates
  useDateLanguage();

  useEffect(() => {
    fetchArticles();
  }, [category, sectorId, limit]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/articles?limit=${limit}&sortBy=createdAt&sortOrder=desc&includeContent=true&published=true`;

      // Si une catégorie spécifique est demandée, on peut filtrer par spécialité
      if (category !== "all" && category) {
        url += `&specialityname=${category}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      setError('Impossible de charger les articles');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (articleId: string) => {
    router.push(`/discover-insights/article/${articleId}`);
  };

  const getArticleDescription = (article: ArticleData): string => {
    // Extraction de la description depuis le contenu EditorJS si disponible
    if (article.contenu) {
      try {
        const content = Array.isArray(article.contenu) ? article.contenu[0] : article.contenu;
        if (content && content.blocks && Array.isArray(content.blocks)) {
          // Chercher le premier paragraphe ou bloc avec du texte
          const textBlock = content.blocks.find((block: any) =>
            block.type === 'paragraph' && block.data && block.data.text
          );

          if (textBlock) {
            // Supprimer les balises HTML et limiter à 120 caractères
            const cleanText = textBlock.data.text.replace(/<[^>]*>/g, '').trim();
            return cleanText.length > 120 ? cleanText.substring(0, 120) + '...' : cleanText;
          }
        }
      } catch (error) {
        console.warn('Erreur lors de l\'extraction de la description:', error);
      }
    }

    // Fallback si pas de contenu
    return `Découvrez cet article publié le ${new Date(article.createdAt).toLocaleDateString('fr-FR')} - ${article.views} vues`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mb-10 mx-auto grid grid-cols-12 gap-4">
        {Array.from({ length: limit }).map((_, index) => (
          <div key={index} className="col-span-3">
            <div className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mb-10 mx-auto text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          variant="primary"
          size="md"
          onClick={fetchArticles}
          className="!rounded-full mx-auto"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  // Créer une version du contenu avec les blocs spéciaux insérés
  const renderContent = () => {
    const content: React.ReactElement[] = [];

    articles.forEach((article, index) => {
      // Insérer le bloc Featured après le 1er article
      if (showFeaturedBlocks && index === 1) {
        content.push(
          <div key={`featured-${index}`} className="masonry-item">
            <div className="bg-blue-900 text-white rounded-lg p-6 shadow-lg">
              <p className="text-sm font-regular font-bold mb-3">
                {t('find_jobs.featured')}
              </p>
              <p className="text-sm font-regular">
                {t('find_jobs.what_jobs_demand')}
              </p>
            </div>
          </div>
        );
      }

      // Insérer le bloc Tag Results après le 3ème article
      if (showFeaturedBlocks && index === 3) {
        content.push(
          <div key={`tag-results-${index}`} className="masonry-item">
            <div className="bg-black text-white rounded-lg p-6 shadow-lg">
              <p className="text-sm font-regular font-bold mb-3">
                {t('find_jobs.tag_results')}
              </p>
              <p className="text-sm font-regular mb-4">
                {t('find_jobs.landing_job')}
              </p>
              <p className="text-sm font-regular">
                {t('find_jobs.posts_count', { count: articles.length.toString() })}
              </p>
            </div>
          </div>
        );
      }

      // Ajouter l'article normal
      content.push(
        <div key={article.id} className="masonry-item">
          <div
            className="bg-white rounded-lg p-0 shadow-2xl overflow-hidden cursor-pointer article-card h-auto"
            onClick={() => handleArticleClick(article.id)}
          >
            <LazyImage
              src={article.image || '/images/default-article.jpg'}
              alt={article.titre}
              width={300}
              height={200}
              className="w-full"
            />
            <div className="p-5">
              <p className="text-sm font-regular text-blue-900 font-bold mb-5 line-clamp-2">
                {article.titre}
              </p>
              <p className="text-sm font-regular text-gray-500 line-clamp-3">
                {getArticleDescription(article)}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {article.specialites.slice(0, 2).map((spec) => (
                  <span
                    key={spec.id}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {spec.libelle}
                  </span>
                ))}
              </div>
              {/* <p className="text-xs text-gray-400 mt-2">
                {article.views} {language === 'fr' ? 'vues' : 'views'} • {formatDateFr(article.createdAt)}
              </p> */}
            </div>
          </div>
        </div>
      );
    });

    return content;
  };

  return (
    <div className="w-full max-w-7xl mb-10 mx-auto px-4">
      <div className="masonry-container">
        {renderContent()}
      </div>

      {/* Bouton pour voir plus d'articles */}
      <div className="flex justify-center items-center mt-10">
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/discover-insights")}
          className="!rounded-full text-sm mx-auto w-fit whitespace-nowrap"
        >
          {t('find_jobs.subscribe_updates')}
        </Button>
      </div>
    </div>
  );
}