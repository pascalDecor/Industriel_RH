
"use client";

import { addArticle } from '@/app/actions/articles';
import { AsyncBuilder } from '@/components/ui/asyncBuilder';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import EditorJSComponent from '@/components/ui/editorJS';
import FloatingLabelInput from '@/components/ui/input';
import InputError from '@/components/ui/inputError';
import FileUpload from '@/components/ui/inputFile';
import MultiSelect from '@/components/ui/multiSelect';
import { LoadingSpinner } from '@/lib/load.helper';
import { Article } from '@/models/article';
import { Specialite } from '@/models/specialite';
import { Tag } from '@/models/tag';
import { HttpService } from '@/utils/http.services';
import Image from "next/image";
import { redirect } from 'next/navigation';

import { useActionState, useEffect, useRef, useState } from 'react'

export default function AddArticle() {
    let [state, action, pending] = useActionState(addArticle, undefined);

    const [article, setArticle] = useState(Article.fromJSON({} as any));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        console.log(state);
        if (state === true) {
            redirect('/blog/articles');
        }
    }, [state, action, pending]);


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
                                setArticle(
                                    Article.fromJSON({ ...article.toJSON(), image: URL.createObjectURL(file!) })
                                );
                                console.log("article.image", article.image);
                            }} />
                        {
                            article.image.length > 0 &&
                            <Image src={article.image} alt={article.titre} width={100} height={100} className="w-full mt-5 rounded-lg" />
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
                            value={article.titre} onChange={(e) => setArticle(article.update({ titre: e.target.value }))} />
                        <InputError messages={state?.errors?.titre} inputName="titre" />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="contenu" className='mb-2 block text-sm text-gray-500'>contenu</label>
                        <input type="text" hidden value={JSON.stringify(article.contenu)} name="contenu" onChange={(e) => {
                            setArticle(article.update({ contenu: [article.contenu] }))
                        }} />
                        <EditorJSComponent onChange={(e) => { setArticle(article.update({ contenu: [e] })) }} />
                        <InputError messages={state?.errors?.contenu} inputName="contenu" />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="specialties" className='mb-2 block text-sm text-gray-500'>Spécialités</label>
                        <input type="text" hidden value={article.specialites.map((s) => s.id).join(',')} name="specialites"
                            onChange={(e) => setArticle(article.update({ specialites: article.specialites }))} />
                        <AsyncBuilder
                            promise={async () => { return HttpService.index<Specialite>({ url: '/specialites?limit=50', fromJson: (json: any) => Specialite.fromJSON(json), }) }}
                            loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                            hasData={(data) => <MultiSelect
                                placeholder='Sélectionner les spécialités'
                                items={data.data.map((s) => ({ value: s.id, label: s.libelle }))}
                                onChange={(e) => setArticle(article.update({ specialites: e.map((e) => Specialite.fromJSON({ id: e.value, libelle: e.label }).toJSON()) }))
                                }
                            />
                            }
                        />
                        <InputError messages={state?.errors?.specialties} inputName="specialties" />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor="tags" className='mb-2 block text-sm text-gray-500'>Tags</label>
                        <input type="text" hidden value={article.tags.map((s) => s.id).join(',')} name="tags"
                            onChange={(e) => setArticle(article.update({ tags: article.tags }))} />
                        <AsyncBuilder
                            promise={async () => { return HttpService.index<Tag>({ url: '/tags', fromJson: (json: any) => Tag.fromJSON(json), }) }}
                            loadingComponent={<LoadingSpinner color="#0F766E"></LoadingSpinner>}
                            hasData={(data) => <MultiSelect
                                enableCreate={true}
                                placeholder='Sélectionner les tags'
                                items={data.data.map((s) => ({ value: s.id, label: s.libelle }))}
                                onChange={(e) => setArticle(article.update({ tags: e.map((e) => Tag.fromJSON({ id: e.value, libelle: e.label })) }))}
                            />
                            }
                        />
                        <InputError messages={state?.errors?.tags} inputName="tags" />
                    </div>
                    <Button className='px-8 w-full' isLoading={pending} disabled={pending} type="submit">Ajouter</Button>
                </div>
            </form>
        </Card>
    )
}