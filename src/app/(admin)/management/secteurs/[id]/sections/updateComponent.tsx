"use client";

import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FloatingLabelTextarea from "@/components/ui/textarea";
import { Section } from "@/models/section";
import { HttpService } from "@/utils/http.services";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePicker } from "@/app/(admin)/management/team-members/ImagePicker";
import { useImage } from "@/hooks/useImage";
import { toast } from "react-hot-toast";

/** Indique si la valeur est une clé média (et non une URL/path). */
function isMediaKey(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  return !value.startsWith("/") && !value.startsWith("http://") && !value.startsWith("https://");
}

/** Aperçu quand la section utilise une clé média (médiathèque). */
function SectionImageByKey({
  imageKey,
  alt,
  fallback,
  width,
  height,
  className,
}: {
  imageKey: string;
  alt: string;
  fallback?: string;
  width: number;
  height: number;
  className?: string;
}) {
  const { src, isLoading } = useImage(imageKey, "fr");
  if (isLoading || !src) return <div className={`bg-slate-200 animate-pulse ${className || ""}`} style={{ width, height }} />;
  return <Image loading="lazy" src={src} alt={alt} width={width} height={height} className={className} />;
}

/** Aperçu d'image de section : gère clé média (useImage) ou URL/path directe. */
export function SectionImagePreview({
  image,
  alt,
  fallback,
  width = 400,
  height = 400,
  className,
}: {
  image: string | null | undefined;
  alt: string;
  fallback?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (isMediaKey(image)) {
    return <SectionImageByKey imageKey={image!} alt={alt} fallback={fallback} width={width!} height={height!} className={className} />;
  }
  const src = image || fallback;
  if (!src) return <div className={`bg-slate-200 animate-pulse ${className || ""}`} style={{ width, height }} />;
  return <Image loading="lazy" src={src} alt={alt} width={width!} height={height!} className={className} />;
}

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


export function UpdateImageSectorComponent({ section, onChange }: { section: Section; onChange: (state: any) => void }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSelect = (key: string) => {
        setLoading(true);
        HttpService.update<Section>({
            url: `/sections/${section.id}`,
            data: { image: key },
            fromJson: (json: any) => Section.fromJSON(json),
        })
            .then((res) => {
                if (res && onChange) onChange(res);
                toast.success("Image mise à jour");
            })
            .catch(() => toast.error("Erreur lors de la mise à jour"))
            .finally(() => setLoading(false));
        setPickerOpen(false);
    };

    const handleRemove = () => {
        setLoading(true);
        HttpService.update<Section>({
            url: `/sections/${section.id}`,
            data: { image: "" },
            fromJson: (json: any) => Section.fromJSON(json),
        })
            .then((res) => {
                if (res && onChange) onChange(res);
                toast.success("Image retirée");
            })
            .catch(() => toast.error("Erreur lors de la mise à jour"))
            .finally(() => setLoading(false));
    };

    const currentKey = section.image && isMediaKey(section.image) ? section.image : null;

    return (
        <Card className="p-5 w-100 shadow-2xl">
            <p className="text-sm text-slate-700 mb-3">Mettre à jour l&apos;image</p>
            <div className="w-full space-y-3">
                {(section.image || currentKey) && (
                    <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                        <SectionImagePreview
                            image={section.image}
                            alt={section.libelle}
                            width={400}
                            height={400}
                            className="w-full rounded-lg"
                        />
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" size="sm" onClick={() => setPickerOpen(true)} disabled={loading}>
                        {section.image || currentKey ? "Changer l'image" : "Sélectionner une image"}
                    </Button>
                    {(section.image || currentKey) && (
                        <Button type="button" variant="secondary" size="sm" onClick={handleRemove} disabled={loading}>
                            Retirer
                        </Button>
                    )}
                </div>
            </div>
            <ImagePicker
                open={pickerOpen}
                onOpenChange={setPickerOpen}
                currentKey={currentKey}
                onSelect={handleSelect}
                uploadKeyPrefix={`section_${section.id}`}
            />
        </Card>
    );
}