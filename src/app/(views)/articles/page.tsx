"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import Button from "@/components/ui/button";
import LazyImage from "@/components/ui/LazyImage";
import { FiMoreVertical, FiEdit, FiEye, FiTrash2, FiPlus } from "react-icons/fi";
import { formatDateFr } from "@/lib/formatDate";

interface ArticleData {
  id: string;
  titre: string;
  image: string;
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  contenu?: any;
  tags: Array<{ id: string; libelle: string }>;
  specialites: Array<{ id: string; libelle: string }>;
  author?: { id: string; name: string };
}

export default function ArticlesList() {
  const router = useRouter();
  const { t } = useTranslation();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/articles?page=${page}&limit=20&sortBy=createdAt&sortOrder=desc&includeContent=true`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (page === 1) {
        setArticles(data.data || []);
      } else {
        setArticles(prev => [...prev, ...(data.data || [])]);
      }
      
      setHasMore(data.meta?.hasNextPage || false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Impossible de charger les articles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (articleId: string) => {
    router.push(`/articles/edit/${articleId}`);
    setOpenMenuId(null);
  };

  const handleView = (articleId: string) => {
    router.push(`/discover-insights/article/${articleId}`);
    setOpenMenuId(null);
  };

  const handleDelete = async (articleId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la suppression');
        }

        setArticles(prev => prev.filter(article => article.id !== articleId));
        alert('Article supprimé avec succès');
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Erreur lors de la suppression de l\'article');
      }
    }
    setOpenMenuId(null);
  };

  const togglePublished = async (articleId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      const updatedArticle = await response.json();
      setArticles(prev => 
        prev.map(article => 
          article.id === articleId ? { ...article, published: updatedArticle.published } : article
        )
      );
      
      alert(`Article ${!currentStatus ? 'publié' : 'dépublié'} avec succès`);
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Erreur lors de la mise à jour de l\'article');
    }
    setOpenMenuId(null);
  };

  const getArticleDescription = (article: ArticleData): string => {
    if (article.contenu) {
      try {
        const content = Array.isArray(article.contenu) ? article.contenu[0] : article.contenu;
        if (content && content.blocks && Array.isArray(content.blocks)) {
          const textBlock = content.blocks.find((block: any) =>
            block.type === 'paragraph' && block.data && block.data.text
          );

          if (textBlock) {
            const cleanText = textBlock.data.text.replace(/<[^>]*>/g, '').trim();
            return cleanText.length > 120 ? cleanText.substring(0, 120) + '...' : cleanText;
          }
        }
      } catch (error) {
        console.warn('Erreur lors de l\'extraction de la description:', error);
      }
    }

    return `Découvrez cet article publié le ${new Date(article.createdAt).toLocaleDateString('fr-FR')} - ${article.views} vues`;
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-gray-200 animate-pulse h-48"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
                  <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 animate-pulse h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button
            variant="primary"
            size="md"
            onClick={() => fetchArticles()}
            className="!rounded-full"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Gestion des articles</h1>
            <p className="text-gray-600 mt-2">
              {articles.length} article{articles.length > 1 ? 's' : ''} trouvé{articles.length > 1 ? 's' : ''}
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => router.push('/articles/create')}
            className="!rounded-full flex items-center gap-2"
          >
            <FiPlus />
            Nouvel article
          </Button>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative">
                <LazyImage
                  src={article.image || '/images/default-article.jpg'}
                  alt={article.titre}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    article.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>

                {/* Menu Three Dots */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === article.id ? null : article.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <FiMoreVertical className="w-4 h-4 text-gray-600" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === article.id && (
                      <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border z-10 min-w-[160px]">
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
                        >
                          <FiEdit className="w-4 h-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleView(article.id)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiEye className="w-4 h-4" />
                          Voir
                        </button>
                        <button
                          onClick={() => togglePublished(article.id, article.published)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiEye className="w-4 h-4" />
                          {article.published ? 'Dépublier' : 'Publier'}
                        </button>
                        <hr />
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.titre}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {getArticleDescription(article)}
                </p>

                {/* Tags & Specialites */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.specialites.slice(0, 2).map((spec) => (
                    <span
                      key={spec.id}
                      className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                    >
                      {spec.libelle}
                    </span>
                  ))}
                  {article.tags.slice(0, 1).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag.libelle}
                    </span>
                  ))}
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.views} vues</span>
                  <span>{formatDateFr(article.createdAt)}</span>
                </div>
                
                {article.author && (
                  <div className="mt-2 text-xs text-gray-500">
                    Par {article.author.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setPage(prev => prev + 1)}
              disabled={loading}
              className="!rounded-full"
            >
              {loading ? 'Chargement...' : 'Charger plus'}
            </Button>
          </div>
        )}

        {/* Click outside to close menu */}
        {openMenuId && (
          <div 
            className="fixed inset-0 z-0" 
            onClick={() => setOpenMenuId(null)}
          />
        )}
      </div>
    </div>
  );
}