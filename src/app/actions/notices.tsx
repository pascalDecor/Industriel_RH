"use client";

import { Notice } from "@/models/notice";
import { HttpService } from "@/utils/http.services";
import { z } from "zod";

// Definitions

export type FormState =
    | {
        errors?: {
            id?: string[];
            author?: string[];
            content?: string[];
            stars?: string[];
        };
        message?: string;
    }
    | boolean
    | undefined;

export const FormSchema = z.object({
    content: z
        .string()
        .min(2, { message: "Content must be at least 2 characters long" })
        .trim(),
    id: z.string(),
    stars: z.number().min(1, { message: "Be at least 1 character long" }),
    author: z.string().min(2, { message: "Auhtor must be at least 2 characters long" }).trim()
});

export async function addNotice(state: FormState, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        content: formData.get('content'),
        id: formData.get('id'),
        author: formData.get('author'),
        stars: parseInt((formData.get('stars') as string) ?? "0"),
    })
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    else {
        const payload = {
            url: `/notices/${validatedFields.data.id}`,
            data: validatedFields.data,
        };
        const temp = await (
            validatedFields.data.id.length < 1 ?
                HttpService.add<Notice>(payload) :
                HttpService.update<Notice>(payload)).then((res) => {
                    return res;
                })
        return (temp as { state?: boolean }).state ?? false;
    }
}