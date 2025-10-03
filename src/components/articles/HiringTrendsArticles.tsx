"use client";

import { useState, useEffect } from "react";
import LazyImage from "@/components/ui/LazyImage";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import { useDateLanguage } from "@/hooks/useDateLanguage";
import { useDynamicTranslation } from "@/hooks/useDynamicTranslation";

interface ArticleData {
  id: string;
  titre: string;
  titre_en?: string;
  image: string;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  contenu?: any; // Contenu EditorJS
  contenu_en?: any;
  tags: Array<{ id: string; libelle: string; libelle_en?: string }>;
  specialites: Array<{ id: string; libelle: string; libelle_en?: string }>;
  author?: { id: string; name: string };
}

interface HiringTrendsArticlesProps {
  limit?: number;
}

export default function HiringTrendsArticles({ limit = 4 }: HiringTrendsArticlesProps) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t, language } = useTranslation();
  const { translateArticleTitle, translateSpecialty, translateTag } = useDynamicTranslation();

  // Synchronise automatiquement la langue pour le formatage des dates
  useDateLanguage();

  useEffect(() => {
    fetchArticles();
  }, [limit]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      // Récupérer les articles les plus vus ou les plus récents pour les tendances
      const url = `/api/articles?published=true&limit=${limit}&sortBy=views&sortOrder=desc&includeContent=true`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(data.data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles trending:', error);
      // En cas d'erreur, utiliser des articles par défaut
      setArticles([]);
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
            // Supprimer les balises HTML et limiter à 100 caractères
            const cleanText = textBlock.data.text.replace(/<[^>]*>/g, '').trim();
            return cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
          }
        }
      } catch (error) {
        console.warn('Erreur lors de l\'extraction de la description:', error);
      }
    }
    
    // Fallback avec les tags si pas de contenu
    const tags = article.tags.slice(0, 2).map(tag => translateTag(tag)).join(', ');
    return `${tags} • ${article.views} ${t('common.views')}`;
  };

  const staticArticles = [
    {
      title: t('consulting.hiring_trends.be_salary_smart'),
      description: t('consulting.hiring_trends.be_salary_smart_desc'),
      image: '/images/be_salary_smart.jpg'
    },
    {
      title: t('consulting.hiring_trends.career_development'),
      description: t('consulting.hiring_trends.career_development_desc'),
      image: '/images/career_development.jpg'
    },
    {
      title: t('find_jobs.what_jobs_demand'),
      description: t('consulting.hiring_trends.what_jobs_demand_desc'),
      image: '/images/What_jobs_are_in_demand.jpg'
    },
    {
      title: t('find_jobs.landing_job'),
      description: t('consulting.hiring_trends.landing_job_desc'),
      image: '/images/landing_a_job.jpg'
    }
  ];

  if (loading) {
    return (
      <div className="max-w-5xl mb-10 mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-left">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
          </div>
        ))}
      </div>
    );
  }

  // Utiliser les articles dynamiques s'ils sont disponibles, sinon utiliser les statiques
  const displayArticles = articles.length >= 4 ? articles.slice(0, 4) : articles;

  return (
    <div className="max-w-5xl mb-10 mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-left">
      {displayArticles.map((item, index) => {
        // Si c'est un article dynamique de l'API
        if ('id' in item) {
          const article = item as ArticleData;
          return (
            <div key={article.id}>
              <div
                className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full cursor-pointer article-card"
                onClick={() => handleArticleClick(article.id)}
              >
                <LazyImage
                  src={article.image || '/images/default-article.jpg'}
                  alt={translateArticleTitle(article)}
                  width={300}
                  height={180}
                  className="w-full object-cover"
                />
                <div className="p-4 sm:p-5">
                  <p className="text-sm font-regular text-blue-900 font-bold mb-3 sm:mb-5 line-clamp-2">
                    {translateArticleTitle(article)}
                  </p>
                  <p className="text-sm font-regular text-gray-500 line-clamp-3">
                    {getArticleDescription(article)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-1 py-1  text-blue-800 text-xs rounded-full"
                      >
                        #{translateTag(tag)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {article.specialites.slice(0, 2).map((specialite) => (
                      <span
                        key={specialite.id}
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                      >
                        {translateTag(specialite)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        } else {
          // Article statique de fallback
          const staticArticle = item as { title: string; description: string; image: string };
          return (
            <div key={index}>
              <div className="bg-white rounded-lg p-0 shadow-xl overflow-hidden mb-4 h-full">
                <LazyImage
                  src={staticArticle.image}
                  alt={staticArticle.title}
                  width={300}
                  height={180}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4 sm:p-5">
                  <p className="text-sm font-regular text-blue-900 font-bold mb-3 sm:mb-5">
                    {staticArticle.title}
                  </p>
                  <p className="text-sm font-regular text-gray-500">
                    {staticArticle.description}
                  </p>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}