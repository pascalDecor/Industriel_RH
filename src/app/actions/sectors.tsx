"use client";

import { Sector } from "@/models/sector";
import { HttpService } from "@/utils/http.services";
import { z } from "zod";

// Definitions

export type FormState =
    | {
        errors?: {
            otp?: string[];
        };
        message?: string;
    }
    | undefined;

export const FormSchema = z.object({
    libelle: z
        .string()
        .min(2, { message: "Libelle must be at least 2 characters long" })
        .trim(),
    id: z.string()
});

export async function addSector(state: FormState, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        libelle: formData.get('libelle'),
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