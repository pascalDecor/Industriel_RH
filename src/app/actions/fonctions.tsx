"use client";

import { HttpService } from "@/utils/http.services";
import { z } from "zod";

// Definitions

export type FormState =
    | {
        errors?: {
            id?: string[];
            sectorId?: string[];
            libelle?: string[];
        };
        message?: string;
    }
    | boolean
    | undefined;

export const FormSchema = z.object({
    libelle: z
        .string()
        .min(2, { message: "Libelle doit être au moins 2 caractères" })
        .trim(),
    libelle_en: z
        .string()
        .min(2, { message: "Libelle en must be at least 2 characters long" }),
    id: z.string(),
    sectorId: z.string()
});

export async function addFonction(state: FormState, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        libelle: formData.get('libelle'),
        libelle_en: formData.get('libelle_en'),
        id: formData.get('id'),
        sectorId: formData.get('sectorId')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    else {
        const payload = {
            url: `/fonctions/${validatedFields.data.id}`,
            data: validatedFields.data,
        };
        const temp = await (
            validatedFields.data.id.length < 1 ?
                HttpService.add<Function>(payload) :
                HttpService.update<Function>(payload)).then((res) => {
                    return res;
                })
        return (temp as { state?: boolean }).state ?? false;
    }
}