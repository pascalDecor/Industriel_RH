// pages/api/auth/verify.ts

import prisma from '@/lib/connect_db';
import { NextResponse } from 'next/server';
import { setCookie } from '@/lib/session';
import { jwToken } from '@/lib/jwt';


export const POST = async (req: Request) => {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Méthode non autorisée' }, { status: 405 });
    }

    const { email, otp } = await req.json();

    // Récupérer l'utilisateur correspondant à l'email
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || !user.otp || !user.otpExpiration) {
        return NextResponse.json({ message: 'OTP invalide ou expiré' }, { status: 401 });
    }

    if (user.otp !== otp) {
        return NextResponse.json({ message: 'OTP incorrect' }, { status: 401 });
    }

    // Vérifier l'expiration de l'OTP
    if (new Date() > user.otpExpiration) {
        return NextResponse.json({ message: 'OTP expiré' }, { status: 401 });
    }

    // Optionnel : réinitialiser l'OTP pour éviter sa réutilisation
    await prisma.user.update({
        where: { id: user.id },
        data: { otp: null, otpExpiration: null }
    });

    const token = jwToken.sign({ userId: user.id, email: user.email });

    const res = NextResponse.json(
        { message: "Authentification réussie", user: user },
        { status: 200 }
    );

    setCookie(res, "token", token, 60 * 60 * 3);

    return res;
}
