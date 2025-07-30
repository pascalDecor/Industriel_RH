
"use client";

import { addArticle } from '@/app/actions/articles';
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
import { useBlogData, createTag } from '@/hooks/useBlogData';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react'
import { Specialite } from '@/models/specialite';

export default function AddArticle() {
    const [state, action, pending] = useActionState(addArticle, undefined);
    const router = useRouter();

    const [article, setArticle] = useState(Article.fromJSON({} as any));
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [creatingTag, setCreatingTag] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const { specialites, tags, isLoading: loading, error, mutateTags } = useBlogData();

    useEffect(() => {
        console.log(state);
        if (state === true) {
            router.push('/blog/articles');
        }
    }, [state, router]);

    // Fonction pour créer un nouveau tag
    const createNewTag = async (libelle: string): Promise<Tag | null> => {
        try {
            setCreatingTag(true);
            const newTag = await createTag(libelle);
            // Revalider explicitement les tags SWR
            await mutateTags();
            return newTag;
        } catch (error) {
            console.error('Erreur lors de la création du tag:', error);
        } finally {
            setCreatingTag(false);
        }
        return null;
    };



    const handleUpload = async (e: File) => {
        if (e) {

            if (inputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(e);
                inputRef.current.files = dt.files;
            }
        }
    };

    return (
        <Card className='text-gray-800 shadow-none border-none p-10'>
            <h2 className="text-4xl font-bold text mb-3 text-gray-800 text-left">
                {"Ajouter un article"}
            </h2>

            <form action={action} encType="multipart/form-data" className='w-full grid grid-cols-2 gap-5'>
                <div className='col-span-1'>
                    <div className="border border-gray-300 p-7 rounded-2xl text-center bg-gradient-to-t from-gray-300 to-gray-200 h-full w-full">
                        <p className="text-sm font-regular text-gray-500 my-3 ml-2">
                            Sélectionner une image
                        </p>
                        <input type="file" hidden name="image" accept="image/*" ref={inputRef} onChange={(e) => handleUpload(e.target.files![0])} />
                        <FileUpload showPreview={false} className='w-full'
                            label='Ajouter une image'

                            accept={{ 'image': ["image/*"] }}
                            onFileSelect={(file) => {
                                handleUpload(file as File);
                                const imageUrl = URL.createObjectURL(file!);
                                setSelectedImage(imageUrl);
                                setArticle(
                                    Article.fromJSON({ ...article.toJSON(), image: imageUrl })
                                );
                                console.log("selectedImage", imageUrl);
                            }} />
                        {
                            selectedImage && selectedImage.trim() !== '' && (
                                <Image loading="lazy"
                                    src={selectedImage}
                                    alt={article.titre || "Image sélectionnée"}
                                    width={100}
                                    height={100}
                                    className="w-full mt-5 rounded-lg"
                                />
                            )
                        }

                        <InputError messages={state?.errors?.image} inputName="image" />

                    </div>
                </div>
                <div>
                    <div className='mb-5'>
                        <label htmlFor="titre" className='mb-2 block text-sm text-gray-500'>titre</label>
                        <FloatingLabelInput
                            error={state?.errors && state?.errors.titre && state.errors.titre.join(', ')}
                            label='titre' name="titre" type="text" placeholder="titre"
                            value={article.titre} onChange={(e) => setArticle(article.update({ 
                                titre: e.target.value,
                                image: selectedImage || article.image
                            }))} />
                        <InputError messages={state?.errors?.titre} inputName="titre" />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="contenu" className='mb-2 block text-sm text-gray-500'>contenu</label>
                        <input type="text" hidden value={JSON.stringify(article.contenu)} name="contenu" onChange={(e) => {
                            setArticle(article.update({ contenu: [article.contenu] }))
                        }} />
                        <EditorJSComponent onChange={(e) => { 
                            setArticle(article.update({ 
                                contenu: [e],
                                // Préserver l'image si elle existe
                                image: selectedImage || article.image
                            }))
                        }} />
                        <InputError messages={state?.errors?.contenu} inputName="contenu" />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="specialties" className='mb-2 block text-sm text-gray-500'>Spécialités</label>
                        <input type="text" hidden value={article.specialites.map((s) => s.id).join(',')} name="specialites" />
                        {loading ? (
                            <LoadingSpinner color="#0F766E" />
                        ) : (
                            <MultiSelect
                                placeholder='Sélectionner les spécialités'
                                items={specialites.map((s) => ({ value: s.id, label: s.libelle }))}
                                onChange={(e) => setArticle(article.update({ 
                                    specialites: e.map((item) => 
                                        specialites.find(s => s.id === item.value)?.toJSON() || 
                                        Specialite.fromJSON({ id: item.value, libelle: item.label }).toJSON()
                                    ),
                                    image: selectedImage || article.image
                                }))}
                            />
                        )}
                        <InputError messages={state?.errors?.specialties} inputName="specialties" />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="tags" className='mb-2 block text-sm text-gray-500'>Tags</label>
                        <input type="text" hidden value={article.tags.map((s) => s.id).join(',')} name="tags" />
                        {loading ? (
                            <LoadingSpinner color="#0F766E" />
                        ) : (
                            <MultiSelect
                                enableCreate={true}
                                placeholder={creatingTag ? 'Création du tag en cours...' : 'Sélectionner les tags'}
                                items={tags.map((t) => ({ value: t.id, label: t.libelle }))}
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
                                    const processedTags = selectedItems.map((item) => {
                                        const existingTag = tags.find(t => t.id === item.value);
                                        if (existingTag) {
                                            return existingTag;
                                        }
                                        return Tag.fromJSON({ id: item.value, libelle: item.label });
                                    });
                                    
                                    setArticle(article.update({ 
                                        tags: processedTags.filter(Boolean),
                                        image: selectedImage || article.image
                                    }));
                                }}
                            />
                        )}
                        <InputError messages={state?.errors?.tags} inputName="tags" />
                    </div>
                    <Button className='px-8 w-full' isLoading={pending} disabled={pending} type="submit">Ajouter</Button>
                </div>
            </form>
        </Card>
    )
}