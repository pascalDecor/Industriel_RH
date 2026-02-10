import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './src/lib/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes sensibles
  const protectedRoutes = ['/api-docs', '/api/swagger'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    try {
      // Récupérer le token depuis les cookies
      const token = request.cookies.get('token')?.value;
      
      if (!token) {
        return redirectToLogin(request);
      }

      // Vérifier le token
      const user = await verifyAccessToken(token);
      
      if (!user) {
        return redirectToLogin(request);
      }

      // Vérifier les privilèges pour l'accès interne
      const allowedRoles = ['admin', 'super_admin', 'developer', 'internal'];
      if (!allowedRoles.includes(user.role)) {
        // Pour les routes API, retourner une erreur JSON
        if (pathname.startsWith('/api/')) {
          return NextResponse.json(
            { 
              error: 'Access denied', 
              message: 'Insufficient privileges for internal access',
              code: 'INSUFFICIENT_PRIVILEGES'
            },
            { status: 403 }
          );
        }
        
        // Pour les pages, rediriger vers access-denied
        const url = request.nextUrl.clone();
        url.pathname = '/auth/access-denied';
        return NextResponse.redirect(url);
      }

      // Utilisateur autorisé, continuer
      return NextResponse.next();

    } catch (error) {
      console.error('Erreur middleware authentification:', error);
      
      // Pour les routes API, retourner une erreur JSON
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { 
            error: 'Authentication error', 
            message: 'Failed to verify authentication',
            code: 'AUTH_ERROR'
          },
          { status: 500 }
        );
      }
      
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Pour les routes API, retourner une erreur JSON au lieu de rediriger
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { 
        error: 'Authentication required', 
        message: 'Please log in to access this resource',
        code: 'AUTH_REQUIRED'
      },
      { status: 401 }
    );
  }
  
  // Pour les pages, rediriger vers la connexion
  url.pathname = '/auth/login';
  url.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/api-docs/:path*',
    '/api/swagger/:path*'
  ]
};