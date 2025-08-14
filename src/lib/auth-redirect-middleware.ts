import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';
import prisma from '@/lib/connect_db';

/**
 * Middleware pour vérifier si l'utilisateur doit changer son mot de passe
 * et le rediriger vers la page appropriée
 */
export async function checkMustChangePassword(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Récupérer le token depuis les cookies
    const tokenCookie = request.cookies.get('token');
    if (!tokenCookie?.value) {
      return null; // Pas de token, laisser passer (sera géré par d'autres middlewares)
    }

    // Vérifier le JWT
    const decoded = await verifyAccessToken(tokenCookie.value);
    if (!decoded) {
      return null; // Token invalide, laisser passer
    }

    // Vérifier si l'utilisateur doit changer son mot de passe
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        mustChangePassword: true,
        tempPasswordExpires: true,
        firstLoginToken: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return null; // Utilisateur non trouvé ou inactif, laisser passer
    }

    // Si l'utilisateur doit changer son mot de passe
    if (user.mustChangePassword) {
      const currentPath = request.nextUrl.pathname;
      
      // Ne pas rediriger si on est déjà sur la page de première connexion
      if (currentPath.startsWith('/auth/first-login')) {
        return null;
      }

      // Ne pas rediriger les pages d'API
      if (currentPath.startsWith('/api/')) {
        return null;
      }

      // Vérifier si le mot de passe temporaire a expiré
      if (user.tempPasswordExpires && new Date() > user.tempPasswordExpires) {
        // Rediriger vers une page d'erreur ou de contact admin
        const url = new URL('/auth/password-expired', request.url);
        return NextResponse.redirect(url);
      }

      // Si l'utilisateur a un token de première connexion, rediriger vers la page de première connexion
      if (user.firstLoginToken) {
        const url = new URL('/auth/first-login', request.url);
        url.searchParams.set('token', user.firstLoginToken);
        return NextResponse.redirect(url);
      }

      // Sinon, rediriger vers une page de changement de mot de passe générique
      const url = new URL('/auth/change-password', request.url);
      return NextResponse.redirect(url);
    }

    return null; // Tout va bien, laisser passer
  } catch (error) {
    console.error('Erreur dans le middleware de vérification du changement de mot de passe:', error);
    return null; // En cas d'erreur, laisser passer
  }
}

/**
 * Vérifie si une route nécessite une vérification du changement de mot de passe
 */
export function shouldCheckPasswordChange(pathname: string): boolean {
  // Ne pas vérifier pour les routes publiques
  const publicRoutes = [
    '/auth/login',
    '/auth/logout',
    '/auth/first-login',
    '/auth/password-expired',
    '/auth/change-password',
    '/_next',
    '/favicon.ico',
    '/static'
  ];

  return !publicRoutes.some(route => pathname.startsWith(route));
}