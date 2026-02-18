"use client";

import { useLogin, useLoginOTP } from '@/hooks/useLogin'
import { SignUpFormSchema, FormState, FormStateOTP, SignUpOTPFormSchema } from '@/lib/definitions'
import { validateRecaptcha } from '@/lib/recaptcha'
import { LocalStorageHelper } from '@/utils/localStorage.helper';

export async function signUp(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignUpFormSchema.safeParse({
        email: formData.get('email'),
        password :formData.get('password'),
        recaptchaToken: formData.get('recaptchaToken'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    else {
        // Validate reCAPTCHA token server-side (appel direct pour éviter fetch relative en prod)
        if (validatedFields.data.recaptchaToken) {
            try {
                const recaptchaResult = await validateRecaptcha(
                    validatedFields.data.recaptchaToken,
                    'login_form'
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
        }

        const email = formData.get('email')?.toString() ?? '';
        const password = formData.get('password')?.toString() ?? '';
        return useLogin({email: email, password:password}).then((res) => {
            console.log(res);
                return res;
        })
    }
}

export async function signUpOTP(state: FormStateOTP, formData: FormData) {
    // Validate form fields
    const validatedFields = SignUpOTPFormSchema.safeParse({
        otp: formData.get('otp')
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    else {
        const otp = formData.get('otp')?.toString() ?? '';
        const email = LocalStorageHelper.getValue("email");
        return useLoginOTP({email: email, otp:otp}).then((res) => {
            console.log(res);
                return res;
        })
    }
}