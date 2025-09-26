"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LazyImage from "@/components/ui/LazyImage";
import Button from "@/components/ui/button";
import EditorContent from "@/components/ui/editorContent";
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
  contenu?: any;
  contenu_en?: any;
  tags: Array<{ id: string; libelle: string; libelle_en?: string }>;
  specialites: Array<{ id: string; libelle: string; libelle_en?: string }>;
  author?: { id: string; name: string };
}


export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useTranslation();
  const { translateArticleTitle, translateArticleContent, translateSpecialty, translateTag } = useDynamicTranslation();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  useDateLanguage();

  useEffect(() => {
    if (params?.id) {
      fetchArticle(params.id as string);
    }
  }, [params?.id]);

  // Fonctions de partage social
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article ? translateArticleTitle(article) : '';
  const shareDescription = article?.tags.map(tag => translateTag(tag)).join(', ') || '';


  const handleShare = {
    facebook: () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    },

    linkedin: () => {
      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    },

    twitter: () => {
      const text = `${shareTitle} - ${shareDescription}`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(url, '_blank', 'width=600,height=400');
    },

    whatsapp: () => {
      const text = `${shareTitle}\n\n${shareUrl}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    },

    email: () => {
      const subject = `Article intéressant: ${shareTitle}`;
      const body = `Je pensais que cet article pourrait vous intéresser:\n\n${shareTitle}\n\n${shareUrl}`;
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = url;
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);

      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    }
  };

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles/${id}?includeContent=true`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Article non trouvé");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setArticle(data);

      // Récupérer les articles similaires après avoir chargé l'article principal
      if (data) {
        fetchRelatedArticles(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      setError("Erreur lors du chargement de l'article");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (currentArticle: ArticleData) => {
    try {
      setLoadingRelated(true);

      // Construire la requête pour les articles similaires basée sur les tags et spécialités
      const tagIds = currentArticle.tags.map(tag => tag.id).join(',');
      const specialiteIds = currentArticle.specialites.map(spec => spec.id).join(',');

      let queryParams = new URLSearchParams({
        published: 'true',
        limit: '4',
        exclude: currentArticle.id
      });

      if (tagIds) {
        queryParams.append('tags', tagIds);
      }
      if (specialiteIds) {
        queryParams.append('specialites', specialiteIds);
      }

      const response = await fetch(`/api/articles?${queryParams.toString()}`);

      if (response.ok) {
        const data = await response.json();
        setRelatedArticles(data.data || []);
      } else {
        // En cas d'erreur, récupérer les articles les plus récents
        const fallbackResponse = await fetch('/api/articles?published=true&limit=4&sortBy=createdAt&sortOrder=desc');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const filteredArticles = (fallbackData.data || []).filter((art: ArticleData) => art.id !== currentArticle.id);
          setRelatedArticles(filteredArticles.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des articles similaires:', error);
      // Essayer de récupérer quelques articles récents en fallback
      try {
        const fallbackResponse = await fetch('/api/articles?published=true&limit=4&sortBy=createdAt&sortOrder=desc');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const filteredArticles = (fallbackData.data || []).filter((art: ArticleData) => art.id !== currentArticle.id);
          setRelatedArticles(filteredArticles.slice(0, 3));
        }
      } catch (fallbackError) {
        console.error('Erreur lors du fallback des articles similaires:', fallbackError);
      }
    } finally {
      setLoadingRelated(false);
    }
  };


  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <Button
            variant="primary"
            onClick={() => router.push('/discover-insights')}
            className="rounded-full"
          >
            Retour aux articles
          </Button>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Article non trouvé</h1>
          <Button
            variant="primary"
            onClick={() => router.push('/discover-insights')}
            className="rounded-full"
          >
            Retour aux articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-10 py-8 pt-20">
        {/* En-tête de l'article */}
        <header className="mb-8">

          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
            {translateArticleTitle(article)}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span>{t('common.published_on')} {formatDate(article.createdAt)}</span>
            {article.updatedAt !== article.createdAt && (
              <span>• {t('common.updated_on')} {formatDate(article.updatedAt)}</span>
            )}
            <span>• {article.views} {t('common.views')}</span>
            {article.author && (
              <span className="uppercase text-blue-700 font-bold">• {t('common.by_author')}  {article.author.name}</span>
            )}
          </div>

          {/* Tags et spécialités */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {language === 'en' ? tag.libelle_en : tag.libelle}
              </span>
            ))}
            {article.specialites.map((specialite) => (
              <span
                key={specialite.id}
                className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
              >
                {language === 'en' ? specialite.libelle_en : specialite.libelle}
              </span>
            ))}
          </div>
        </header>

        {/* Boutons de partage */}
        <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{t('common.share')}:</span>
            <div className="flex items-center space-x-3">
              {/* Facebook */}
              <button
                onClick={handleShare.facebook}
                className="flex items-center justify-center w-8 h-8 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-full transition-colors"
                title={t('common.share_facebook')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* LinkedIn */}
              <button
                onClick={handleShare.linkedin}
                className="flex items-center justify-center w-8 h-8 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full transition-colors"
                title={t('common.share_linkedin')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>

              {/* Twitter/X */}
              <button
                onClick={handleShare.twitter}
                className="flex items-center justify-center w-8 h-8 bg-black hover:bg-gray-800 text-white rounded-full transition-colors"
                title={t('common.share_twitter')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleShare.whatsapp}
                className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full transition-colors"
                title={t('common.share_whatsapp')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.473 3.488" />
                </svg>
              </button>

              {/* Email */}
              <button
                onClick={handleShare.email}
                className="flex items-center justify-center w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
                title={t('common.share_email')}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Copier le lien */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm transition-all duration-200 rounded-md ${linkCopied
              ? 'text-green-700 bg-green-50 border border-green-300'
              : 'text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400'
              }`}
            title={linkCopied ? t('common.link_copied') : t('common.copy_link')}
          >
            {linkCopied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('common.link_copied')}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{t('common.copy')}</span>
              </>
            )}
          </button>
        </div>

        {/* Image principale */}
        {article.image && (
          <div className="mb-8">
            <LazyImage
              src={article.image}
              alt={translateArticleTitle(article)}
              width={800}
              height={400}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-10">
          {/* Contenu de l'article */}
          <article className="col-span-3 mb-8">
            <EditorContent content={translateArticleContent(article)} />
          </article>

          <div className="col-span-1 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-3">
                {t('common.similar_articles')}
              </h3>

              {loadingRelated ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : relatedArticles.length > 0 ? (
                <div className="space-y-6 mb-5">
                  {relatedArticles.slice(0, 3).map((relatedArticle) => (
                    <article
                      key={relatedArticle.id}
                      className="group cursor-pointer"
                      onClick={() => router.push(`/discover-insights/article/${relatedArticle.id}`)}
                    >
                      <div className="flex space-x-3 ">
                        <div className="flex-shrink-0">
                          <LazyImage
                            src={relatedArticle.image || '/images/default-article.jpg'}
                            alt={translateArticleTitle(relatedArticle)}
                            width={80}
                            height={60}
                            className="w-20 h-15 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-blue-700 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                            {translateArticleTitle(relatedArticle)}
                          </h4>
                          <div className="flex items-center text-[9px] text-gray-500 space-x-2">
                            <span>{relatedArticle.views} {t('common.views')}</span>
                            <span>•</span>
                            <span>{formatDate(relatedArticle.createdAt)}</span>
                          </div>
                          {/* {relatedArticle.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {relatedArticle.tags.slice(0, 2).map((tag) => (
                                <span 
                                  key={tag.id}
                                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                                >
                                  {translateTag(tag)}
                                </span>
                              ))}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">{t('common.no_similar_articles')}</p>
                </div>
              )}

              <div className="mt-10 pt-4 border-t border-gray-200">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => router.push('/discover-insights')}
                  className="w-full text-sm"
                >
                  {t('common.view_all_articles')}
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Actions en fin d'article */}
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">{t('common.did_you_like_article')}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              onClick={() => router.push('/discover-insights')}
              className="rounded-full"
            >
              {t('common.discover_more_articles')}
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/contact')}
              className="rounded-full"
            >
              {t('common.contact_us')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}