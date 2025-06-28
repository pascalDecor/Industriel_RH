"use client";

import { baseApiURL } from '@/constant/api';
import { Hire } from '@/models/hire';
import { HttpService } from '@/utils/http.services'
import { z } from 'zod';

type FormStateAddHire =
    | {
        errors?: {
            lastName?: string[];
            firstName?: string[];
            email?: string[];
            phone?: string[];
            adresse?: string[];
            number_of_positions?: string[];
            details_of_positions?: string[];
            state?: string[];
            document_support?: string[];
            company_name?: string[];
            civilityId?: string[];
            company_website?: string[];
        };
        message?: string;
    }
    | undefined;

const AddHireFormSchema = z.object({
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters long." })
        .trim(),
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters long." })
        .trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    phone: z
        .string()
        .min(7, { message: "Be at least 10 characters long" })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .trim(),
    details_of_positions: z.object({}),
    company_name: z
        .string()
        .min(2, { message: "Be at least 2 characters long" })
        .trim(),
    number_of_positions: z
        .number().min(1, { message: "Be at least 1 character long" }),
    company_website: z.string().url({ message: "Please enter a valid url." }).trim(),
    document_support: z.string().min(2, { message: "Please chose a document at least 5 MO." }).trim(),
    state: z.string().trim(),
    sectors: z
        .object({
            connect: z
                .array(z.object({ id: z.string() }))
                .min(1, { message: "At least one sector is required." })
        })
        .optional()
        .default({ connect: [] }),
    civilityId: z.string().trim(),
});


export async function addHire(state: FormStateAddHire, formData: FormData) {
    const documentSupport = formData.get('document_support') as File;
    const details_of_positions = JSON.parse(formData.get('details_of_positions')?.toString() ?? '{}');

    console.log("details_of_positions", details_of_positions);

    let documentSupportPath = documentSupport.name;

    // Validate form fields
    const validatedFields = AddHireFormSchema.safeParse({
        lastName: formData.get('name'),
        firstName: formData.get('firstName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        number_of_positions: parseInt((formData.get('number_of_positions') as string) ?? "0"),
        document_support: documentSupportPath,
        details_of_positions: details_of_positions,
        company_name: formData.get('company_name'),
        company_website: formData.get('company_website'),
        state: formData.get('state') ?? "pending",
        civilityId: formData.get('civility'),
        sectors: {
            connect: formData.get('sectors')
                ?.toString()
                .split(',')
                .filter(Boolean)
                .map((s) => ({ id: s.trim() })),
        },
    });

    console.log("validatedFields data", validatedFields.data);
    console.log("validatedFields", validatedFields.error);

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    else {
        // Upload cv
        if (documentSupport.size > 0) {
            const formDataImage = new FormData();
            formDataImage.append('image', documentSupport);

            const res = await fetch(baseApiURL + '/upload', {
                method: 'POST',
                body: formDataImage,
            });
            const result = await res.json();
            documentSupportPath = result.file.url;
            console.log("imagePath", documentSupportPath);
        }
        // 

         validatedFields.data.details_of_positions = details_of_positions;

        if (documentSupportPath.startsWith("http")) {
            const temp = await HttpService.add<Hire>({
                url: "/hires",
                data: {...validatedFields.data, document_support: documentSupportPath},
            }).then((res) => {
                console.log(res);
                return res;
            })
            return (temp as any).state;
        }
    }
}