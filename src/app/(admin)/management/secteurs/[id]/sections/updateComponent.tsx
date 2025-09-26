"use client";


import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/ui/inputFile";
import FloatingLabelTextarea from "@/components/ui/textarea";
import { Section } from "@/models/section";
import { HttpService } from "@/utils/http.services";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { baseApiURL } from "@/constant/api";

export function UpdateDescriptionSectorComponent({ section, onChange, libelle,libelle_en, value, value_en }: { section: Section, onChange: (state: any) => void, libelle: string, libelle_en: string, value: string, value_en: string | undefined }) {

    const [loading, setLoading] = useState(false);
    const [temp, setTemp] = useState(value);
    const [temp_en, setTemp_en] = useState(value_en);
    useEffect(() => {
        setTemp(value);
        setTemp_en(value_en);
    }, []);


    const handleUpdate = () => {
        setLoading(true);
        HttpService.update<Section>({
            url: `/sections/${section.id}`,
            data: { [libelle]: temp, [libelle_en]: temp_en },
            fromJson: (json: any) => Section.fromJSON(json)
        }).then((res) => {
            console.log(res);
            setLoading(false);
            if (res) {
                if (onChange) {
                    onChange(res);
                }
            }
        })
    }
    return (
        <Card className="p-5 w-100 shadow-2xl">
            <p className="text-sm text-slate-700">
                Mettre à jour {libelle}
            </p>
            <form action={handleUpdate}>
                <div className="w-full items-center">
                    <FloatingLabelTextarea value={temp} name={libelle} onChange={(e) => { console.log(e.target.value); setTemp(e.target.value); }} label={libelle} className="w-full" />
                    <FloatingLabelTextarea value={temp_en} name={libelle_en} onChange={(e) => { console.log(e.target.value); setTemp_en(e.target.value); }} label={libelle_en} className="w-full" />
                </div>
                <Button isLoading={loading} className="w-full">Mettre à jour</Button>
            </form>
        </Card>
    )
}


export function UpdateImageSectorComponent({ section, onChange }: { section: Section, onChange: (state: any) => void }) {

    const [loading, setLoading] = useState(false);
    const [temp, setTemp] = useState(section.image);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTemp(section.image);
    }, []);


    const handleUpload = async (e: File) => {
        if (e) {

            if (inputRef.current) {
                const dt = new DataTransfer();
                dt.items.add(e);
                inputRef.current.files = dt.files;
            }
        }
    };


    const handleUpdate = async () => {
        setLoading(true);
        // Upload image
        const formDataImage = new FormData();
        formDataImage.append('image', file!);

        const res = await fetch(baseApiURL + '/upload', {
            method: 'POST',
            body: formDataImage,
        });
        const result = await res.json();
        const imagePath = result.file.url;
        console.log("imagePath", imagePath);
        // 
        HttpService.update<Section>({
            url: `/sections/${section.id}`,
            data: { "image": imagePath },
            fromJson: (json: any) => Section.fromJSON(json)
        }).then((res) => {
            console.log(res);
            setLoading(false);
            if (res) {
                if (onChange) {
                    onChange(res);
                }
            }
        })
    }
    return (
        <Card className="p-5 w-100 shadow-2xl">
            <p className="text-sm text-slate-700">
                Mettre à jour l'image
            </p>
            <form action={handleUpdate}>
                <div className="w-full items-center">
                    <input type="file" hidden name="image" accept="image/*" ref={inputRef} onChange={(e) => handleUpload(e.target.files![0])} />
                    <FileUpload showPreview={false} className='w-full'
                        label='Ajouter une image'

                        accept={{ 'image': ["image/*"] }}
                        onFileSelect={(fileUp) => {
                            handleUpload(fileUp as File);
                            setFile(fileUp);
                            setTemp(URL.createObjectURL(fileUp!));
                        }} />
                    {
                        (inputRef.current && inputRef.current.files && inputRef.current.files[0]) &&
                        <Image loading="lazy" src={temp} alt={section.libelle} width={400} height={400} className="w-full mt-5 rounded-lg" />
                    }
                </div>
                <Button isLoading={loading} className="w-full mt-5">Mettre à jour</Button>
            </form>
        </Card>
    )
}