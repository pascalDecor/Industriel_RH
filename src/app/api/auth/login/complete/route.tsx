// pages/api/auth/verify.ts

import prisma from '@/lib/connect_db';
import { NextResponse } from 'next/server';
import { setCookie } from '@/lib/session';
import { generateTokens } from '@/lib/jwt';
import { otpRateLimit, getRequestIdentifier, checkRateLimit } from '@/lib/rateLimit';
import { logLoginSuccess, logRateLimitExceeded, securityLogger, SecurityEventType, SecurityLevel } from '@/lib/securityLogger';

export const POST = async (req: Request) => {
    try {
        if (req.method !== 'POST') {
            return NextResponse.json({ message: 'Méthode non autorisée' }, { status: 405 });
        }

        // Vérifier le rate limiting pour les tentatives OTP
        const identifier = getRequestIdentifier(req);
        const rateLimitCheck = checkRateLimit(otpRateLimit, identifier);

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

        const { email, otp } = await req.json();

        // Récupérer l'utilisateur correspondant à l'email avec ses rôles
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                userRoles: {
                    where: {
                        isActive: true
                    },
                    select: {
                        role: true,
                        isPrimary: true
                    },
                    orderBy: {
                        isPrimary: 'desc'
                    }
                }
            }
        });

        if (!user || !user.otp || !user.otpExpiration) {
            otpRateLimit.recordAttempt(identifier, false);
            securityLogger.log(
                SecurityEventType.OTP_FAILED,
                SecurityLevel.WARNING,
                `OTP invalide ou expiré pour ${email}`,
                req,
                { email, metadata: { reason: 'invalid_or_expired' } }
            );
            return NextResponse.json({ message: 'OTP invalide ou expiré' }, { status: 401 });
        }

        if (user.otp !== otp) {
            otpRateLimit.recordAttempt(identifier, false);
            securityLogger.log(
                SecurityEventType.OTP_FAILED,
                SecurityLevel.WARNING,
                `OTP incorrect pour ${email}`,
                req,
                { userId: user.id, email, metadata: { reason: 'incorrect_otp' } }
            );
            return NextResponse.json({ message: 'OTP incorrect' }, { status: 401 });
        }

        // Vérifier l'expiration de l'OTP
        if (new Date() > user.otpExpiration) {
            otpRateLimit.recordAttempt(identifier, false);
            securityLogger.log(
                SecurityEventType.OTP_FAILED,
                SecurityLevel.WARNING,
                `OTP expiré pour ${email}`,
                req,
                { userId: user.id, email, metadata: { reason: 'expired' } }
            );
            return NextResponse.json({ message: 'OTP expiré' }, { status: 401 });
        }

        // Réinitialiser l'OTP pour éviter sa réutilisation
        await prisma.user.update({
            where: { id: user.id },
            data: { otp: null, otpExpiration: null, lastLogin: new Date() }
        });

        // Récupérer le rôle primaire ou le premier rôle actif
        const primaryRole = user.userRoles.find(ur => ur.isPrimary) || user.userRoles[0];
        const userRole = primaryRole?.role || 'CONSULTANT';

        // Générer les tokens JWT avec refresh token
        const { accessToken, refreshToken } = await generateTokens({
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: userRole
        });

        // Filtrer les données sensibles
        const { password, otp: userOtp, otpExpiration, ...safeUser } = user;

        const res = NextResponse.json(
            { message: "Authentification réussie", user: safeUser },
            { status: 200 }
        );

        // Définir les cookies sécurisés
        setCookie(res, "token", accessToken, 60 * 60); // 15 minutes
        setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60); // 7 jours

        // Enregistrer le succès
        otpRateLimit.recordAttempt(identifier, true);

        // Log de la connexion complète réussie
        logLoginSuccess(req, user.id, user.email);

        return res;
    } catch (error) {
        console.error('Erreur lors de la vérification OTP:', error);
        return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
    }
}
