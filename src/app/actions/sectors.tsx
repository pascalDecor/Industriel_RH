"use client";

import { Sector } from "@/models/sector";
import { HttpService } from "@/utils/http.services";
import { z } from "zod";

// Definitions

export type FormState =
    | {
        errors?: {
            id?: string[];
            libelle?: string[];
            libelle_en?: string[];
            description?: string[];
            description_en?: string[];
        };
        message?: string;
    }
    | boolean
    | undefined;

export const FormSchema = z.object({
    libelle: z
        .string()
        .min(2, { message: "Le libellé doit être au moins 2 caractères" })
        .trim(),
    libelle_en: z.string().optional(),
    description: z.string().optional(),
    description_en: z.string().optional(),
    id: z.string()
});

export async function addSector(state: FormState, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        libelle: formData.get('libelle'),
        libelle_en: formData.get('libelle_en') || undefined,
        description: formData.get('description') || undefined,
        description_en: formData.get('description_en') || undefined,
        id: formData.get('id')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    else {
        const payload = {
            url: `/sectors/${validatedFields.data.id}`,
            data: validatedFields.data,
        };
        const temp = await (
            validatedFields.data.id.length < 1 ?
                HttpService.add<Sector>(payload) :
                HttpService.update<Sector>(payload)).then((res) => {
                    return res;
                })
        return (temp as { state?: boolean }).state ?? false;
    }
}