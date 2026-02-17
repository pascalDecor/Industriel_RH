import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuthFromToken, hasSwaggerAccessServer } from '@/lib/auth-middleware';
import type { AuthApiUser } from '@/lib/auth-middleware';

/**
 * GET /api/debug-api-docs-access
 * À appeler une fois connecté pour voir pourquoi l'accès à /api-docs pourrait échouer.
 * Retourne : hasToken, authSuccess, user (sanitisé), hasSwaggerAccess.
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const out: {
    hasToken: boolean;
    authSuccess: boolean;
    error?: string;
    user?: { id: string; email: string; roleCode: string; role: string; roleLevel: number; isActive: boolean };
    hasSwaggerAccess: boolean;
  } = {
    hasToken: !!token,
    authSuccess: false,
    hasSwaggerAccess: false,
  };

  if (!token) {
    return NextResponse.json(out);
  }

  const authResult = await verifyAuthFromToken(token);
  out.authSuccess = authResult.success;
  if (authResult.error) out.error = authResult.error;

  if (authResult.success && authResult.user) {
    const u = authResult.user as AuthApiUser;
    out.user = {
      id: u.id,
      email: u.email,
      roleCode: u.roleCode,
      role: String(u.role),
      roleLevel: u.roleLevel,
      isActive: u.isActive,
    };
    out.hasSwaggerAccess = hasSwaggerAccessServer(u);
  }

  return NextResponse.json(out);
}
