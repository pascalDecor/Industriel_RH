"use client";

import { LoadingSpinner } from "@/lib/load.helper";
import { Article } from "@/models/article";
import { HttpService } from "@/utils/http.services";
import Button from "@/components/ui/button";
import { AsyncBuilder } from "@/components/ui/asyncBuilder";
import { formatDateFr } from "@/lib/formatDate";
import EditorContent from "@/components/ui/editorContent";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, EditIcon, TrashIcon, EyeIcon, Edit2Icon } from "lucide-react";
import clsx from "clsx";
import EditSpecialities from "./edit/editSpecialities";
import EditTags from "./edit/editTags";
import EditTitle from "./edit/editTitle";
import EditImage from "./edit/editImage";

interface ArticleDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
    const [articleId, setArticleId] = useState<string>('');
    const [refreshCount, setRefreshCount] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [publishing, setSaving] = useState(false);
    const [isEnglishView, setIsEnglishView] = useState(false);


    // Résoudre les paramètres au chargement
    useEffect(() => {
        params.then(({ id }) => {
            setArticleId(id);
        });
    }, [params]);

    const handleDelete = async (articleId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            return;
        }
        setIsDeleting(true);
        try {
            await HttpService.delete({
                url: `/articles/${articleId}`,
            });
            // Redirection après suppression
            window.location.href = '/blog/articles';
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            alert('Erreur lors de la suppression de l\'article');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleTogglePublished = async (article: Article) => {
        if (!confirm(`Êtes-vous sûr de vouloir ${article.published ? "dépublier" : "publier"} cet article ?`)) {
            return;
        }
        setSaving(true);
        try {
            await HttpService.update({
                url: `/articles/${article.id}`,
                data: {
                    published: !article.published
                }
            });
            setSaving(false);
            setRefreshCount(c => c + 1);
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };






    return (
        <div className="space-y-6">
            {/* Header avec navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/blog/articles" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Retour aux articles
                    </Link>
                </div>
            </div>

            {articleId && (
                <AsyncBuilder
                    promise={async () => {
                        return HttpService.show<Article>({
                            url: `/articles/${articleId}`,
                            fromJson: (json: any) => Article.fromJSON(json)
                        });
                    }}
                    loadingComponent={<LoadingSpinner color="#0F766E" />}
                    callDataListen={refreshCount}
                    hasData={(data) => {
                        const article = data.data ?? Article.fromJSON({} as any);
                        
                        // Fonctions pour gérer l'affichage selon la langue
                        const getDisplayTitle = () => {
                            if (isEnglishView) {
                                return article.titre_en || article.titre;
                            }
                            return article.titre;
                        };

                        const getDisplayContent = () => {
                            if (isEnglishView) {
                                return article.contenu_en || article.contenu || [];
                            }
                            return article.contenu || [];
                        };

                        const hasEnglishContent = article.titre_en || article.contenu_en;
                        
                        return (
                            <div className="bg-white rounded-lg shadow-sm">
                                {/* Header de l'article */}
                                <div className="p-6 border-b border-gray-200">
                                    {/* Sélecteur de langue */}
                                    {hasEnglishContent && (
                                        <div className="flex items-center justify-end mb-4">
                                            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-2">
                                                <span className="text-sm text-gray-600">Version:</span>
                                                <button
                                                    onClick={() => setIsEnglishView(false)}
                                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                        !isEnglishView
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                                >
                                                    Français
                                                </button>
                                                <button
                                                    onClick={() => setIsEnglishView(true)}
                                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                        isEnglishView
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-600 hover:text-gray-800'
                                                    }`}
                                                >
                                                    English
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className={clsx(
                                                "px-3 py-1 rounded-full text-sm font-medium",
                                                article.published
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            )}>
                                                {article.published ? 'Publié' : 'Brouillon'}
                                            </span>
                                            <div className="flex items-center text-gray-600">
                                                <EyeIcon className="w-4 h-4 mr-1" />
                                                <span>{article.views} vues</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant={article.published ? "warning" : "dark"}
                                                onClick={() => handleTogglePublished(article)}
                                                className="px-4 py-2"
                                                disabled={publishing}
                                                isLoading={publishing}
                                            >
                                                {article.published ? 'Dépublier' : 'Publier'}
                                            </Button>
                                            <Link href={`/blog/articles/${article.id}/edit`}>
                                                <Button variant="success" className="px-4 py-2">
                                                    <EditIcon className="w-4 h-4 mr-2" />
                                                    Modifier
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(article.id)}
                                                disabled={isDeleting}
                                                isLoading={isDeleting}
                                                className="px-4 py-2"
                                            >
                                                <TrashIcon className="w-4 h-4 mr-2" />
                                                {isDeleting ? 'Suppression...' : 'Supprimer'}
                                            </Button>
                                        </div>
                                    </div>


                                </div>

                                <div className="w-full flex items-start border-b border-gray-200">
                                    {/* Image de l'article */}
                                    {article.image && article.image.trim() !== '' && !imageError ? (
                                        <div className="p-6">
                                            <div className="relative group w-full max-w-2xl mx-auto">
                                                <Image
                                                    src={article.image}
                                                    alt={article.titre || "Image de l'article"}
                                                    width={800}
                                                    height={400}
                                                    className="rounded-lg w-full h-auto shadow-md"
                                                    onError={() => setImageError(true)} />
                                                <EditImage article={article} onChange={setRefreshCount} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-6 w-2/5 h-100 relative group">
                                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                                <div className="text-center text-gray-400">
                                                    <svg className="mx-auto h-16 w-16 mb-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                    </svg>
                                                    <p className="text-sm font-medium">Aucune image</p>
                                                </div>
                                            </div>
                                            <EditImage article={article} onChange={setRefreshCount} />
                                        </div>
                                    )}

                                    {/* Spécialités et Tags */}
                                    <div className="p-6">
                                        <div className="flex items-center group mb-4">
                                            <h1 className="text-3xl font-bold text-gray-900 mr-3">{getDisplayTitle()}</h1>
                                            <EditTitle article={article} onChange={setRefreshCount} />
                                        </div>

                                        <div className="mb-6 flex items-center space-x-6 text-sm text-gray-600">
                                            {article.author && (
                                                <div>
                                                    <span className="font-medium">Auteur:</span> {article.author.name}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-medium">Créé le:</span> {formatDateFr(article.createdAt)}
                                            </div>
                                            {article.updatedAt !== article.createdAt && (
                                                <div>
                                                    <span className="font-medium">Modifié le:</span> {formatDateFr(article.updatedAt)}
                                                </div>
                                            )}
                                        </div>
                                        {article.specialites && article.specialites.length > 0 && (
                                            <div className="mb-4 group">
                                                <div className="flex items-center mb-2">
                                                    <h3 className="text-sm font-medium text-gray-700 mr-2">Spécialités:</h3>
                                                    <EditSpecialities article={article} onChange={setRefreshCount} />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {article.specialites.filter(s => s.id).map((specialite) => (
                                                        <span
                                                            key={`specialite-${specialite.id}`}
                                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                                        >
                                                            {specialite.libelle}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {article.tags && article.tags.length > 0 && (
                                            <div className="group">
                                                <div className="flex items-center mb-2">
                                                    <h3 className="text-sm font-medium text-gray-700 mr-2">Tags:</h3>
                                                    <EditTags article={article} onChange={setRefreshCount} />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {article.tags.filter(t => t.id).map((tag) => (
                                                        <span
                                                            key={`tag-${tag.id}`}
                                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                                                        >
                                                            #{tag.libelle}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Contenu de l'article */}
                                <div className="p-6">
                                    <div className="prose prose-lg max-w-none">
                                        <EditorContent content={getDisplayContent()} />
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                    errorComponent={(error) => (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="text-center">
                                <div className="text-red-600 text-xl mb-2">Erreur</div>
                                <p className="text-gray-600 mb-4">
                                    {error.message || 'Impossible de charger l\'article'}
                                </p>
                                <Link href="/blog/articles" className="mx-auto">
                                    <Button variant="dark">
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Retour aux articles
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    );
}