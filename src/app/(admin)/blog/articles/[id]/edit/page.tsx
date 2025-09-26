"use client";

import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditorJSComponent from '@/components/ui/editorJS';
import FloatingLabelInput from '@/components/ui/input';
import InputError from '@/components/ui/inputError';
import FileUpload from '@/components/ui/inputFile';
import MultiSelect from '@/components/ui/multiSelect';
import { LoadingSpinner } from '@/lib/load.helper';
import { Article } from '@/models/article';
import { Tag } from '@/models/tag';
import { Specialite } from '@/models/specialite';
import { useBlogData, createTag } from '@/hooks/useBlogData';
import { HttpService } from "@/utils/http.services";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, SaveIcon } from "lucide-react";
import { se } from 'date-fns/locale';

interface ArticleEditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ArticleEditPage({ params }: ArticleEditPageProps) {
    const router = useRouter();
    const [articleId, setArticleId] = useState<string>('');
    const [article, setArticle] = useState<Article | null>(null);
    const [originalArticle, setOriginalArticle] = useState<Article | null>(null);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [creatingTag, setCreatingTag] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEnglishEnabled, setIsEnglishEnabled] = useState(false);

    const { specialites, tags, isLoading: dataLoading, error: dataError, mutateTags } = useBlogData();

    // Résoudre les paramètres au chargement
    useEffect(() => {
        params.then(({ id }) => {
            setArticleId(id);
        });
    }, [params]);

    // Charger l'article existant
    useEffect(() => {
        if (articleId) {
            loadArticle();
        }
    }, [articleId]);

    const loadArticle = async () => {
        try {
            setLoading(true);
            const response = await HttpService.show<Article>({
                url: `/articles/${articleId}`,
                fromJson: (json: any) => Article.fromJSON(json)
            });

            console.log('Article:', response);

            setArticle(response.data ?? Article.fromJSON({} as any));
            setOriginalArticle(response.data ?? Article.fromJSON({} as any));
            setSelectedImage(response.data?.image || '');
        } catch (error) {
            console.error('Erreur lors du chargement de l\'article:', error);
            setErrors({ general: 'Impossible de charger l\'article' });
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour créer un nouveau tag
    const createNewTag = async (libelle: string): Promise<Tag | null> => {
        try {
            setCreatingTag(true);
            const newTag = await createTag(libelle);
            await mutateTags();
            return newTag;
        } catch (error) {
            console.error('Erreur lors de la création du tag:', error);
        } finally {
            setCreatingTag(false);
        }
        return null;
    };



    const handleSave = async () => {
        if (!article) return;

        // Validation basique
        const newErrors: any = {};
        if (!article.titre?.trim()) {
            newErrors.titre = ['Le titre est requis'];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setSaving(true);
            setErrors({});

            await HttpService.update({
                url: `/articles/${articleId}`,
                data: {
                    titre: article.titre,
                    titre_en: article.titre_en,
                    contenu: [article.contenu],
                    contenu_en: [article.contenu_en],
                    published: article.published,
                    specialites: article.specialites.map(s => s.id),
                    tags: article.tags.map(t => t.id)
                }
            });
            router.push(`/blog/articles/${articleId}`);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setErrors({ general: 'Erreur lors de la sauvegarde de l\'article' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner color="#0F766E" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="text-center">
                <p className="text-red-600 mb-4">Impossible de charger l'article</p>
                <Link href="/blog/articles">
                    <Button variant="dark">
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Retour aux articles
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header avec navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href={`/blog/articles/${articleId}`} className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Retour aux détails
                    </Link>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving || !article?.titre?.trim()}
                    isLoading={saving}
                    className="px-6 py-2"
                >
                    <SaveIcon className="w-4 h-4 mr-2" />
                    {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
            </div>

            {/* Erreurs générales */}
            {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {errors.general}
                </div>
            )}

            <Card className='text-gray-800 shadow-none border-none p-10'>
                <h2 className="text-4xl  mb-3 text-gray-800 text-left">
                    <span className='font-bold'>Modifier l'article </span> {article.titre}
                </h2>

                <div className='w-full grid grid-cols-2 gap-5'>


                    {/* Section Formulaire */}
                    <div className='col-span-2'>
                        {/* Titre */}
                        <div className='mb-5'>
                            <label htmlFor="titre" className='mb-2 block text-sm text-gray-500'>Titre</label>
                            <FloatingLabelInput
                                error={errors?.titre && errors.titre.join(', ')}
                                label='titre'
                                name="titre"
                                type="text"
                                placeholder="Titre de l'article"
                                value={article?.titre || ''}
                                onChange={(e) => {
                                    if (article) {
                                        setArticle(Article.fromJSON({
                                            ...article.toJSON(),
                                            titre: e.target.value,
                                            image: selectedImage || article.image
                                        }));
                                    }
                                }}
                            />
                            <InputError messages={errors?.titre} inputName="titre" />
                        </div>
                        {/* Titre en anglais */}
                        <div className='mb-5'>
                            <label htmlFor="titre" className='mb-2 block text-sm text-gray-500'>Titre (en anglais)</label>
                            <FloatingLabelInput
                                error={errors?.titre && errors.titre.join(', ')}
                                label='titre (en anglais)'
                                name="titre_en"
                                type="text"
                                placeholder="Titre de l'article (en anglais)"
                                value={article?.titre_en || ''}
                                onChange={(e) => {
                                    if (article) {
                                        setArticle(Article.fromJSON({
                                            ...article.toJSON(),
                                            titre_en: e.target.value,
                                        }));
                                    }
                                }}
                            />
                            <InputError messages={errors?.titre} inputName="titre_en" />
                        </div>

                        {/* Contenu */}
                        <div className='mb-5'>
                            <div className='flex justify-between items-center mb-2'>
                                <label htmlFor={isEnglishEnabled ? 'contenu_en' : 'contenu'} className='mb-2 block text-sm text-gray-500'>Contenu {isEnglishEnabled ? 'en anglais' : 'en français'}</label>

                                {/* Statut de publication */}
                                <div className='mb-5'>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={isEnglishEnabled}
                                            onChange={(e) => {
                                                setIsEnglishEnabled(e.target.checked);
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">Contenu en anglais</span>
                                    </label>
                                </div>
                            </div>
                            {isEnglishEnabled ? <EditorJSComponent
                                className="h-110"
                                key={1}
                                initialData={article?.contenu_en}
                                onChange={(data) => {
                                    if (article) {
                                        setArticle(Article.fromJSON({
                                            ...article.toJSON(),
                                            contenu_en: [data],
                                        }));
                                    }
                                }}
                            /> : <EditorJSComponent
                                className="h-110"
                                key={2}
                                initialData={article?.contenu}
                                onChange={(data) => {
                                    if (article) {
                                        setArticle(Article.fromJSON({
                                            ...article.toJSON(),
                                            contenu: [data],
                                        }));
                                    }
                                }}
                            />}
                            {isEnglishEnabled ? <InputError messages={errors?.contenu_en} inputName="contenu_en" /> : <InputError messages={errors?.contenu} inputName="contenu" />}
                        </div>


                        {/* Spécialités */}
                        <div className='mb-5'>
                            <label htmlFor="specialties" className='mb-2 block text-sm text-gray-500'>Spécialités</label>
                            {dataLoading ? (
                                <LoadingSpinner color="#0F766E" />
                            ) : (
                                <MultiSelect
                                    placeholder='Sélectionner les spécialités'
                                    items={specialites?.filter(s => s.id && s.libelle).map((s) => ({ value: s.id, label: s.libelle }))}
                                    defaultValue={article?.specialites?.filter(s => s.id && s.libelle).map(s => ({ value: s.id, label: s.libelle })) || []}
                                    onChange={(selectedItems) => {
                                        if (article) {
                                            const processedSpecialites = selectedItems.map((item) => {
                                                const existingSpec = specialites.find(s => s.id === item.value);
                                                return (existingSpec || Specialite.fromJSON({ id: item.value, libelle: item.label })).toJSON();
                                            });

                                            setArticle(Article.fromJSON({
                                                ...article.toJSON(),
                                                specialites: processedSpecialites?.filter(Boolean),
                                                image: selectedImage || article.image
                                            }));


                                        }
                                    }}
                                />
                            )}
                            <InputError messages={errors?.specialities} inputName="specialities" />
                        </div>

                        {/* Tags */}
                        <div className='mb-5'>
                            <label htmlFor="tags" className='mb-2 block text-sm text-gray-500'>Tags</label>
                            {dataLoading ? (
                                <LoadingSpinner color="#0F766E" />
                            ) : (
                                <MultiSelect
                                    enableCreate={true}
                                    placeholder={creatingTag ? 'Création du tag en cours...' : 'Sélectionner les tags'}
                                    items={tags?.filter(t => t.id && t.libelle).map((t) => ({ value: t.id, label: t.libelle }))}
                                    defaultValue={article?.tags?.filter(t => t.id && t.libelle).map(t => ({ value: t.id, label: t.libelle })) || []}
                                    onCreateOption={async (inputValue: string) => {
                                        try {
                                            const newTag = await createNewTag(inputValue);
                                            if (newTag) {
                                                return { value: newTag.id, label: newTag.libelle };
                                            }
                                        } catch (error) {
                                            console.error('Erreur création tag:', error);
                                        }
                                        return null;
                                    }}
                                    onChange={(selectedItems) => {
                                        if (article) {
                                            const processedTags = selectedItems.map((item) => {
                                                const existingTag = tags.find(t => t.id === item.value);
                                                return existingTag ? existingTag.toJSON() : { id: item.value, libelle: item.label };
                                            });

                                            setArticle(Article.fromJSON({
                                                ...article.toJSON(),
                                                tags: processedTags?.filter(Boolean),
                                                image: selectedImage || article.image
                                            }));
                                        }
                                    }}
                                />
                            )}
                            <InputError messages={errors?.tags} inputName="tags" />
                        </div>

                        {/* Statut de publication */}
                        <div className='mb-5'>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={article?.published || false}
                                    onChange={(e) => {
                                        if (article) {
                                            setArticle(Article.fromJSON({
                                                ...article.toJSON(),
                                                published: e.target.checked,
                                                image: selectedImage || article.image
                                            }));
                                        }
                                    }}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-700">Publier l'article</span>
                            </label>
                        </div>

                        <Button
                            className='px-8 w-full'
                            isLoading={saving}
                            disabled={saving || !article?.titre?.trim()}
                            onClick={handleSave}
                        >
                            Sauvegarder les modifications
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}