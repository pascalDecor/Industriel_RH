import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './src/lib/jwt';

/** Rôles autorisés pour /api-docs et /api/swagger (codes en base = majuscules) */
const SWAGGER_ALLOWED_ROLES = ['SUPER_ADMIN', 'HR_DIRECTOR', 'HR_MANAGER', 'IT_ENGINEER'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ne protéger que /api-docs et /api/swagger ; laisser passer toutes les autres routes (dont /)
  if (pathname !== '/api-docs' && !pathname.startsWith('/api-docs/') && pathname !== '/api/swagger' && !pathname.startsWith('/api/swagger/')) {
    return NextResponse.next();
  }

  const raw = request.cookies.get('token')?.value;
  const token = typeof raw === 'string' ? raw.trim() : '';

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    const user = await verifyAccessToken(token);
    if (!user) {
      return redirectToLogin(request);
    }

    const role = (user.role as string) || '';
    if (!SWAGGER_ALLOWED_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/auth/access-denied', request.url));
    }

    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Authentication required', message: 'Please log in to access this resource', code: 'AUTH_REQUIRED' },
      { status: 401 }
    );
  }
  url.pathname = '/auth/login';
  url.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/api-docs', '/api-docs/:path*', '/api/swagger', '/api/swagger/:path*']
};
