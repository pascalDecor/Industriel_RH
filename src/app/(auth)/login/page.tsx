"use client";

import { signUp, signUpOTP } from '@/app/actions/auth'
import Button from '@/components/ui/button';
import FloatingLabelInput from '@/components/ui/input';
import InputError from '@/components/ui/inputError';
import { LocalStorageHelper } from '@/utils/localStorage.helper';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState, Suspense, startTransition } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function LoginForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    let [state, action, pending] = useActionState(signUp, undefined);
    const [stateOTP, actionOTP, pendingOTP] = useActionState(signUpOTP, undefined);

    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            console.error('reCAPTCHA not yet available');
            return;
        }

        // Capture form element before async call
        const form = e.currentTarget;
        setIsSubmitting(true);

        try {
            // Generate reCAPTCHA token
            const token = await executeRecaptcha('login_form');

            // Create FormData and add the token
            const formData = new FormData(form);
            formData.set('recaptchaToken', token);

            // useActionState exige que l'action soit appelée dans une transition
            startTransition(() => {
                action(formData);
            });
        } catch (error) {
            console.error('Error executing reCAPTCHA:', error);
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        console.log(state);
        if (state === true) {
            LocalStorageHelper.setBoolValue("isLoggedIn", true);
            LocalStorageHelper.setValue("email", email);
            setIsSubmitting(false);
        }
        else if (state !== undefined) {
            setIsSubmitting(false);
        }
        else {
            const isLoggedIn = LocalStorageHelper.getBoolValue("isLoggedIn");
            const emailStored = LocalStorageHelper.getValue("email");
            if (isLoggedIn && emailStored) {
                state = true;
                setEmail(emailStored);
            }
        }
        console.log("stateOTP", stateOTP);
        if (stateOTP === true) {
            LocalStorageHelper.removeKey("isLoggedIn");
            LocalStorageHelper.removeKey("email");
            setTimeout(() => router.push('/dashboard'), 500);
        }
    }, [state, action, pending, stateOTP, actionOTP, pendingOTP, router, email]);

    const handleResendOtp = async () => {
        const emailToUse = email || LocalStorageHelper.getValue("email");
        if (!emailToUse || isResending) return;
        setIsResending(true);
        setResendMessage(null);
        try {
            const response = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToUse })
            });
            const data = await response.json();
            if (response.ok) {
                setResendMessage('Code renvoyé par email');
            } else {
                setResendMessage(data.message || 'Erreur lors du renvoi');
            }
        } catch {
            setResendMessage('Erreur lors du renvoi');
        } finally {
            setIsResending(false);
        }
    };


    return (
        <div className='text-gray-800'>
            <h2 className="text-4xl font-bold text mb-3 text-gray-800">
                {"Welcome back!"}
            </h2>
            <p className="text-gray-500  mb-10">
                {"Connect to your account"}
            </p>
            {state === true ?
                <form action={actionOTP} className='w-100'>
                    <div className='mb-5'>
                        <label htmlFor="otp" className='mb-2 block text-sm text-gray-500'>Code OTP</label>
                        <FloatingLabelInput
                            error={stateOTP?.errors && stateOTP?.errors.otp && stateOTP.errors.otp.join(', ')}
                            label='Otp' name="otp" type="number" placeholder="Code OTP"
                            value={otp} onChange={(e) => setOTP(e.target.value)}
                        />
                    </div>
                    <Button className='px-8 w-full mb-3' isLoading={pendingOTP} disabled={pendingOTP} type="submit">Soumettre</Button>
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={isResending}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isResending ? 'Envoi en cours...' : 'Renvoyer le code'}
                        </button>
                        {resendMessage && (
                            <p className={`mt-2 text-sm ${resendMessage.startsWith('Code') ? 'text-green-600' : 'text-red-600'}`}>
                                {resendMessage}
                            </p>
                        )}
                    </div>
                </form> :
                <form onSubmit={handleLoginSubmit} className='w-100'>
                    <div className='mb-5'>
                        <label htmlFor="email" className='mb-2 block text-sm text-gray-500'>Email</label>
                        <FloatingLabelInput
                            error={state?.errors && state?.errors.email && state.errors.email.join(', ')}
                            label='Email' name="email" type="email" placeholder="Email"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='mb-10'>
                        <label htmlFor="password" className='mb-2 block text-sm text-gray-500'>Password</label>
                        <FloatingLabelInput error={state?.errors && state?.errors.password && ' '} label="password" name="password" type="password" />
                        <InputError messages={state?.errors?.password} inputName="password" />
                    </div>
                    <Button className='px-8 w-full' isLoading={(pending || pendingOTP || isSubmitting)} disabled={(pending || pendingOTP || isSubmitting)} type="submit">Sign in</Button>
                </form>}
        </div>
    )
}

export default function Login() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}