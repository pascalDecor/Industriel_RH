"use client";

import { signUp, signUpOTP } from '@/app/actions/auth'
import Button from '@/components/ui/button';
import FloatingLabelInput from '@/components/ui/input';
import InputError from '@/components/ui/inputError';
import { LocalStorageHelper } from '@/utils/localStorage.helper';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react'

export default function Login() {
    let [state, action, pending] = useActionState(signUp, undefined);
    const [stateOTP, actionOTP, pendingOTP] = useActionState(signUpOTP, undefined);

    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/dashboard';


    useEffect(() => {
        console.log(state);
        if (state === true) {
            LocalStorageHelper.setBoolValue("isLoggedIn", true);
            LocalStorageHelper.setValue("email", email);
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

            // Attendre que les cookies soient propagés puis rediriger
            console.log(`Connexion réussie, redirection vers ${redirectTo} dans 500ms...`);
            setTimeout(() => {
                router.push(redirectTo);
            }, 500);
        }
    }, [state, action, pending, stateOTP, actionOTP, pendingOTP, router, email, redirectTo]);


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
                            error={state?.errors && state?.errors.otp && state.errors.otp.join(', ')}
                            label='Otp' name="otp" type="number" placeholder="Code OTP"
                            value={otp} onChange={(e) => setOTP(e.target.value)}
                        />
                    </div>
                    <Button className='px-8 w-full' disabled={pendingOTP} type="submit">Soumettre</Button>
                </form> :
                <form action={action} className='w-100'>
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
                    <Button className='px-8 w-full' isLoading={(pending || pendingOTP)} disabled={(pending || pendingOTP)} type="submit">Sign in</Button>
                </form>}
        </div>
    )
}