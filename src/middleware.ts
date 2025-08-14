import { NextRequest, NextResponse } from 'next/server';
import { jwToken } from '@/lib/jwt';

const PUBLIC_ROUTES = [
  '/login',
  '/api/auth/login',
  '/api/auth/login/complete',
  '/_next',
  '/favicon.ico',
  // Routes publiques du front office
  '/',
  '/about',
  '/contact',
  '/hire-talent',
  '/find-jobs',
  '/consulting-solutions',
  '/salary-guide',
  '/quebec-tax-calculator',
  '/morgage-calculator',
  '/valid-cnesst',
  '/discover-insights',
  '/privacy-policy',
  '/terme-of-conditions',
  '/terme-of-use',
  // APIs publiques
  '/api/sectors',
  '/api/notices',
  '/api/fonctions',
  '/api/specialites',
  '/api/articles',
  '/api/tags',
  '/api/contacts',
  '/api/job-search',
  '/api/salary-calculations',
  '/api/tax-calculations',
  '/api/mortgage-calculations',
  '/api/cnesst-validations',
  '/api/search-insights',
];

const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
];

const API_ROUTES = [
  '/api/auth/session',
  '/api/auth/logout',
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route));
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permettre l'accès aux routes publiques
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Vérifier l'authentification seulement pour les routes protégées
  if (!isProtectedRoute(pathname) && !isApiRoute(pathname)) {
    return NextResponse.next();
  }

  // Vérifier le token d'authentification
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Rediriger vers la page de connexion pour les routes protégées
    if (!isApiRoute(pathname)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Retourner 401 pour les API routes
    return NextResponse.json(
      { error: 'Non autorisé - Token manquant' },
      { status: 401 }
    );
  }

  try {
    // Vérifier la validité du token
    const decoded = await jwToken.verify(token);
    
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      throw new Error('Token invalide');
    }

    // Ajouter les informations utilisateur aux headers pour les API routes
    if (isApiRoute(pathname)) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decoded.id);
      requestHeaders.set('x-user-email', decoded.email || '');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
    
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    
    // Supprimer le token invalide
    const response = isApiRoute(pathname) 
      ? NextResponse.json(
          { error: 'Non autorisé - Token invalide' },
          { status: 401 }
        )
      : NextResponse.redirect(new URL('/login', request.url));
    
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf :
     * - api/auth/login et api/auth/login/complete (routes publiques)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};