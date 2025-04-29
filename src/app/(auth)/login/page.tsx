"use client";

import { signUp, signUpOTP } from '@/app/actions/auth'
import Button from '@/components/ui/button';
import FloatingLabelInput from '@/components/ui/input';
import { LocalStorageHelper } from '@/utils/localStorage.helper';
import { redirect } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react'

export default function Login() {
    let [state, action, pending] = useActionState(signUp, undefined);
    let [stateOTP, actionOTP, pendingOTP] = useActionState(signUpOTP, undefined);

    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    

    useEffect(() => {
        console.log(state);
        if (state === true) {
            LocalStorageHelper.setBoolValue("isLoggedIn", true);
            LocalStorageHelper.setValue("email", email);
        }
        else{
            const isLoggedIn = LocalStorageHelper.getBoolValue("isLoggedIn");
            const emailStored = LocalStorageHelper.getValue("email");
            if(isLoggedIn && emailStored){
                state = true;
                setEmail(emailStored);
            }
        }
        console.log("stateOTP", stateOTP);
        if (stateOTP === true) {
            LocalStorageHelper.removeKey("isLoggedIn");
            LocalStorageHelper.removeKey("email");
            redirect('/dashboard');
        }
    }, [state, action, pending, stateOTP, actionOTP, pendingOTP]);


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
                    <Button className='px-8 w-full' disabled={pending} type="submit">Soumettre</Button>
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
                        {state?.errors?.password && <div className='bg-red-200 rounded-lg p-4 mt-3 text-sm'>
                            <p className='text-red-800 font-semibold mb-2'>Password must:</p>
                            <ul>
                                {state?.errors && state.errors.password.map(error => <li key={error}> - {error}</li>)}
                            </ul>
                        </div>}
                    </div>
                    <Button className='px-8 w-full'isLoading={pending || pendingOTP} disabled={pending || pendingOTP} type="submit">Sign in</Button>
                </form>}
        </div>
    )
}