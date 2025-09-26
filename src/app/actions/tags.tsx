"use client";

import { Tag } from "@/models/tag";
import { HttpService } from "@/utils/http.services";
import { z } from "zod";

// Definitions

export type FormState =
    | {
        errors?: {
            id?: string[];
            libelle?: string[];
        };
        message?: string;
    }
    | boolean
    | undefined;

export const FormSchema = z.object({
    libelle: z
        .string()
        .min(2, { message: "Le libellé du tag doit être au moins 2 caractères" })
        .trim(),
    libelle_en: z
        .string()
        .min(2, { message: "Libelle en must be at least 2 characters long" }),
    id: z.string()
});

export async function addTag(state: FormState, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        libelle: formData.get('libelle'),
        libelle_en: formData.get('libelle_en'),
        id: formData.get('id')
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    else {
        const payload = {
            url: `/tags/${validatedFields.data.id}`,
            data: validatedFields.data,
        };
        const temp = await (
            validatedFields.data.id.length < 1 ?
                HttpService.add<Tag>(payload) :
                HttpService.update<Tag>(payload)).then((res) => {
                    return res;
                })
        return (temp as { state?: boolean }).state ?? false;
    }
}