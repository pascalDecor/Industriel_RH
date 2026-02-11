"use client";

import { baseApiURL, uploadApiURL } from '@/constant/api';
import { FormStateAddApplication, AddApplicationFormSchema, } from '@/lib/definitions'
import { Application } from '@/models/application';
import { HttpService } from '@/utils/http.services'
import { z } from 'zod';


const AddApplicationFormSchemaWithRecaptcha = AddApplicationFormSchema.extend({
    recaptchaToken: z.string().min(1, { message: "reCAPTCHA validation required." }),
});


export async function addCandidature(state: FormStateAddApplication, formData: FormData) {
    const fileCv = formData.get('cv') as File;
    const fileLetter = formData.get('coverLetter') as File;

    let imageCvPath = fileCv.name;
    let imageLetterPath = fileLetter.name;

    // Validate form fields
    const validatedFields = AddApplicationFormSchemaWithRecaptcha.safeParse({
        lastName: formData.get('name'),
        firstName: formData.get('firstName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        adresse: formData.get('adresse'),
        year_of_experience: parseInt((formData.get('year_of_experience') as string) ?? "0"),
        cv: imageCvPath,
        coverLetter: imageLetterPath,
        state: formData.get('state') ?? "pending",
        sectorId: formData.get('sector'),
        functionId: formData.get('function'),
        civilityId: formData.get('civility'),
        cityId: formData.get('city'),
        recaptchaToken: formData.get('recaptchaToken'),
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
        // Validate reCAPTCHA token server-side
        try {
            const recaptchaResponse = await fetch('/api/verify-recaptcha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: validatedFields.data.recaptchaToken,
                    action: 'application_form',
                }),
            });

            const recaptchaData = await recaptchaResponse.json();

            if (!recaptchaData.success) {
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

        // Upload cv
        if (fileCv.size > 0) {
            const formDataImage = new FormData();
            formDataImage.append('image', fileCv);

            const res = await fetch(uploadApiURL, {
                method: 'POST',
                body: formDataImage,
            });
            const result = await res.json();
            imageCvPath = result.file.url;
            console.log("imagePath", imageCvPath);
        }
        // 
        // Upload letter
        if (fileLetter.size > 0) {
            const formDataLetter = new FormData();
            formDataLetter.append('image', fileLetter);

            const resLetter = await fetch(uploadApiURL, {
                method: 'POST',
                body: formDataLetter,
            });
            const resultLetter = await resLetter.json();
            imageLetterPath = resultLetter.file.url;
            console.log("imagePath", imageLetterPath);
        }
        //
        if (imageCvPath.startsWith("http") && imageLetterPath.startsWith("http")) {
            // Remove recaptchaToken from data before sending to API
            const { recaptchaToken, ...applicationData } = validatedFields.data;

            const temp = await HttpService.add<Application>({
                url: "/applications",
                data: applicationData,
            }).then((res) => {
                console.log(res);
                return res;
            })
            return (temp as any).state;
        }
    }
}