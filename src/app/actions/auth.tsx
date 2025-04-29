import { useLogin, useLoginOTP } from '@/hooks/useLogin'
import { SignUpFormSchema, FormState, FormStateOTP, SignUpOTPFormSchema } from '@/lib/definitions'
import { LocalStorageHelper } from '@/utils/localStorage.helper';

export async function signUp(state: FormState, formData: FormData) {
    // Validate form fields
    const validatedFields = SignUpFormSchema.safeParse({
        email: formData.get('email'),
        password :formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    else {
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