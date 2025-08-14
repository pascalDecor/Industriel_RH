import { Card } from "@/components/ui/card";
import { formatDateFr } from "@/lib/formatDate";
import { Article } from "@/models/article";
import EditorContent from "@/components/ui/editorContent";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EditIcon, ToggleLeftIcon, ToggleRightIcon, PencilIcon } from "lucide-react";
import Button from "@/components/ui/button";
import { HttpService } from "@/utils/http.services";

export default function ItemArticles({ article, onChange, className = "col-span-3 md:col-span-2 lg:col-span-1" }: { article: Article, onChange: (state: any) => void, className?: string }) {
    const [imageError, setImageError] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const hasImage = article.image && article.image.trim() !== '' && !imageError;

    const handleTogglePublished = async (e: React.MouseEvent) => {
        e.preventDefault(); // Empêcher la navigation
        e.stopPropagation();
        
        setIsUpdating(true);
        try {
            await HttpService.update({
                url: `/articles/${article.id}`,
                data: { published: !article.published }
            });
            onChange(true); // Rafraîchir la liste
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            alert('Erreur lors de la mise à jour du statut');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Link href={`/blog/articles/${article.id}`}>
            <Card key={article.id} className={clsx("group relative p-3 h-full lg:p-5 shadow-none hover:shadow-xl cursor-pointer border-none mb-5 transition-all duration-200", className)}>
                {/* Actions rapides */}
                <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
                    <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        article.published 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                    )}>
                        {article.published ? 'Publié' : 'Brouillon'}
                    </span>
                </div>

                {/* Actions au survol */}
                <div className="absolute top-6 left-6 z-10 flex flex-row space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        // size="sm"
                        variant="light"
                        onClick={handleTogglePublished}
                        disabled={isUpdating}
                        className="p-1 h-8 bg-white/90 hover:bg-white"
                    >
                        {article.published ? 
                            <div className="flex items-center justify-center">
                              <ToggleRightIcon className="w-5 h-5" />
                              <span className="text-xs text-gray-600">Désactiver</span>
                            </div> : 
                            <div className="flex items-center justify-center space-x-1">
                              <ToggleLeftIcon className="w-5 h-5" />
                                <span className="text-xs text-gray-600">Publier</span>
                            </div>
                        }
                    </Button>
                    <Link href={`/blog/articles/${article.id}/edit`} onClick={(e) => e.stopPropagation()}>
                        <Button
                            // size="md"
                            title="Modifier l'article"
                            variant="success"
                            className="p-1 h-8"
                        >
                            <PencilIcon className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>

                <div className="relative w-full h-60 rounded-lg overflow-hidden">
                    {hasImage ? (
                        <>
                            <Image 
                                loading="lazy" 
                                src={article.image} 
                                width={100} 
                                height={100} 
                                className="rounded-lg w-full h-full blur-[1.5px] absolute left-0 top-0" 
                                alt={article.titre || "Article image"}
                                onError={() => setImageError(true)}
                            />
                            <img 
                                loading="lazy" 
                                src={article.image} 
                                // height={100} 
                                // width={100}  
                                className="mx-auto w-auto h-full blur-[0px]" 
                                alt={article.titre || "Article image"}
                                onError={() => setImageError(true)}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-400">
                                <svg className="mx-auto h-16 w-16 mb-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                </svg>
                                <p className="text-sm font-medium">Aucune image</p>
                            </div>
                        </div>
                    )}
                </div>
                <h3 className="font-bold my-0 hover:text-blue-600 transition-colors">{article.titre}</h3>
            <p className="text-slate-700 text-sm -mt-3 line-clamp-3 my-2">
                {article.specialites.map((specialite) => (
                    <span key={specialite.id} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-xl mx-0.5">
                        {specialite.libelle}
                    </span>
                ))}
            </p>
            <p className="text-slate-700 text-sm -mt-5 line-clamp-3">
                <EditorContent content={article.contenu} />
            </p>
            <p className="text-slate-700 text-sm -mt-3 line-clamp-3 mb-10 ">
                {article.tags.map((tag) => (
                    <span key={tag.id} className="px-2 text-blue-800">
                        #{tag.libelle}
                    </span>
                ))}
            </p>
                <div className="flex justify-between items-center w-full pl-10 float-end absolute lg:bottom-5 lg:right-5 bottom-3 right-3">
                    <div className="flex items-center text-slate-700 mt-0 font-semibold">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        <span>{article.views} vues</span>
                    </div>
                    <p className="text-slate-700 mt-0 text-sm">
                        Publié le {formatDateFr(article.createdAt)}
                    </p>
                </div>
            </Card>
        </Link>
    )
}