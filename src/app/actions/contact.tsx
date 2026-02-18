"use client";

import { FormStateAddConntact } from '@/lib/definitions';
import { validateRecaptcha } from '@/lib/recaptcha';
import { Contact } from '@/models/contact';
import { HttpService } from '@/utils/http.services';
import z from 'zod';


const addContactFormSchema = z.object({
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters long." })
        .trim(),
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters long." })
        .trim(),

    companyName: z.string().min(2, { message: "Be at least 2 characters long" }).trim(),
    jobTitle: z.string().min(2, { message: "Be at least 2 characters long" }).trim(),
    workEmail: z.string().email({ message: "Please enter a valid email." }).trim(),
    workPhone: z
        .string()
        .min(7, { message: "Be at least 10 characters long" })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .trim(),
    postalCode: z.string().min(2, { message: "Be at least 2 characters long" }).trim(),
    message: z.string().min(2, { message: "Be at least 2 characters long" }).trim(),
    status: z.string().trim().default("pending"),
    priority: z.string().trim().default("normal"),
    recaptchaToken: z.string().min(1, { message: "reCAPTCHA validation required." }),
});

export async function addContact(state: FormStateAddConntact, formData: FormData) {

    // Validate form fields
    const validatedFields = addContactFormSchema.safeParse({
        lastName: formData.get('lastName'),
        firstName: formData.get('firstName'),
        companyName: formData.get('companyName'),
        jobTitle: formData.get('jobTitle'),
        workEmail: formData.get('workEmail'),
        workPhone: formData.get('workPhone'),
        postalCode: formData.get('postalCode'),
        message: formData.get('message'),
        recaptchaToken: formData.get('recaptchaToken'),
    })

    console.log("validatedFields", validatedFields.data);

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    else {
        // Validate reCAPTCHA token server-side (appel direct pour éviter fetch relative en prod)
        try {
            const recaptchaResult = await validateRecaptcha(
                validatedFields.data.recaptchaToken,
                'contact_form'
            );
            if (!recaptchaResult.success) {
                return {
                    errors: {
                        recaptchaToken: ['reCAPTCHA validation failed. Please try again.'],
                    },
                };
            }
        } catch (error) {
            console.error('reCAPTCHA verification error:', error);
            return {
                errors: {
                    recaptchaToken: ['reCAPTCHA verification error. Please try again.'],
                },
            };
        }

        // Remove recaptchaToken from data before sending to API
        const { recaptchaToken, ...contactData } = validatedFields.data;

        const temp = await HttpService.add<Contact>({
            url: "/contacts",
            data: contactData,
        }).then((res) => {
            console.log(res);
            return res;
        })
        return (temp as any).state;
    }
}
