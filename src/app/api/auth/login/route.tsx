// pages/api/auth/login.ts

import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import prisma from '@/lib/connect_db';
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';

export const POST = async (req: Request) => {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json({ message: 'Méthode non autorisée' }, { status: 405 });
        }

        const { email, password } = await req.json();

        // Récupérer l'utilisateur correspondant à l'email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Si l'utilisateur n'existe pas, renvoyer une erreur
        if (!user) {
            return NextResponse.json({ message: 'Identifiants invalides' }, { status: 401 });
        }

        // Comparer le mot de passe en utilisant bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ message: 'Identifiants invalides' }, { status: 401 });
        }

        // Générer un OTP (code à 6 chiffres)
        const otp = randomInt(100000, 999999).toString();
        const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes de validité

        // Stocker l'OTP et sa date d'expiration dans la base
        await prisma.user.update({
            where: { id: user.id },
            data: { otp, otpExpiration }
        });

        // Envoyer l'OTP par email
        await sendMail(
            user.email,
            'Votre code de vérification OTP',
            `Votre code de vérification est ${otp}. Il est valable 10 minutes.`
        );

        return NextResponse.json({ message: 'Code OTP envoyé par email' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
