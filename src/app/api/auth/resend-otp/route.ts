import { randomInt } from 'crypto';
import prisma from '@/lib/connect_db';
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';
import { checkRateLimit, resendOtpRateLimit } from '@/lib/rateLimit';

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email requis' },
        { status: 400 }
      );
    }

    const identifier = `resend-otp:${email.trim()}`;
    const rateLimitCheck = checkRateLimit(resendOtpRateLimit, identifier);

    if (!rateLimitCheck.success) {
      return NextResponse.json(
        { message: rateLimitCheck.error || 'Trop de demandes. Réessayez plus tard.' },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Aucun compte associé à cet email' },
        { status: 404 }
      );
    }

    const otp = randomInt(100000, 999999).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiration }
    });

    await sendMail(
      user.email,
      'Votre code de vérification OTP',
      `Votre nouveau code de vérification est ${otp}. Il est valable 10 minutes.`
    );

    resendOtpRateLimit.recordAttempt(identifier, false);

    return NextResponse.json(
      { message: 'Nouveau code OTP envoyé par email' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors du renvoi OTP:', error);
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
};
