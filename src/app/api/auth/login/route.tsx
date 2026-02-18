// pages/api/auth/login.ts

import bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import prisma from '@/lib/connect_db';
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';
import { loginRateLimit, getRequestIdentifier, checkRateLimit } from '@/lib/rateLimit';
import { logLoginFailed, logRateLimitExceeded, securityLogger, SecurityEventType, SecurityLevel } from '@/lib/securityLogger';
import { validateRecaptcha } from '@/lib/recaptcha';

export const POST = async (req: Request) => {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json({ message: 'Méthode non autorisée' }, { status: 405 });
        }

        // Vérifier le rate limiting
        const identifier = getRequestIdentifier(req);
        const rateLimitCheck = checkRateLimit(loginRateLimit, identifier);
        
        if (!rateLimitCheck.success) {
            logRateLimitExceeded(req, identifier);
            return NextResponse.json(
                { message: rateLimitCheck.error },
                { 
                    status: 429,
                    headers: rateLimitCheck.resetTime ? {
                        'Retry-After': Math.ceil((rateLimitCheck.resetTime - Date.now()) / 1000).toString()
                    } : {}
                }
            );
        }

        const { email, password, recaptchaToken } = await req.json();

        // Validation reCAPTCHA côté serveur (via route login)
        if (!recaptchaToken) {
            return NextResponse.json(
                { message: 'reCAPTCHA token is required' },
                { status: 400 }
            );
        }

        const recaptchaResult = await validateRecaptcha(recaptchaToken, 'login_form');
        if (!recaptchaResult.success) {
            return NextResponse.json(
                { message: 'reCAPTCHA validation failed. Please try again.' },
                { status: 400 }
            );
        }

        // Récupérer l'utilisateur correspondant à l'email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Si l'utilisateur n'existe pas, renvoyer une erreur
        if (!user) {
            loginRateLimit.recordAttempt(identifier, false);
            logLoginFailed(req, email, "Utilisateur inexistant");
            return NextResponse.json({ message: 'Identifiants invalides' }, { status: 401 });
        }

        // Comparer le mot de passe en utilisant bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            loginRateLimit.recordAttempt(identifier, false);
            logLoginFailed(req, email, "Mot de passe incorrect");
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

        // Enregistrer le succès de la première étape
        loginRateLimit.recordAttempt(identifier, true);
        
        // Log du succès de la première étape
        securityLogger.log(
            SecurityEventType.LOGIN_SUCCESS,
            SecurityLevel.INFO,
            `Première étape de connexion réussie pour ${email}`,
            req,
            { userId: user.id, email, metadata: { step: 'credentials_validated', otp: otp } }
        );
        
        return NextResponse.json({ message: 'Code OTP envoyé par email' }, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}
