import { NextRequest, NextResponse } from 'next/server';
import { getCookie } from './session';
import { verifyAccessToken } from './jwt';
import prisma from './connect_db';
import { UserRole, UserWithRole } from '@/types/server-auth';
import { apiBase } from '@/constant/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResult {
  authenticated: boolean;
  success: boolean;
  user?: AuthUser | UserWithRole;
  error?: string;
}

/**
 * Vérifie l'authentification de l'utilisateur (version legacy)
 */
export async function checkAuth(): Promise<AuthResult> {
  try {
    // 1. Récupère le token depuis les cookies
    const token = await getCookie("token");
    if (!token) {
      return { authenticated: false, success: false, error: 'Aucun token trouvé' };
    }

    // 2. Vérifie le JWT
    const decoded = await verifyAccessToken(token);
    if (!decoded) {
      return { authenticated: false, success: false, error: 'Token invalide' };
    }

    // 3. Récupère l'utilisateur en base pour vérifier qu'il existe toujours
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        isActive: true, 
        lastLogin: true, 
        avatarUrl: true, 
        createdAt: true, 
        updatedAt: true,
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

    console.log('User found:', user);
    
    if (!user) {
      return { authenticated: false, success: false, error: 'Utilisateur non trouvé' };
    }

    if (!user.isActive) {
      return { authenticated: false, success: false, error: 'Compte utilisateur désactivé' };
    }

    // Récupérer le rôle primaire ou le premier rôle actif
    const primaryRole = user.userRoles.find(ur => ur.isPrimary) || user.userRoles[0];
    
    if (!primaryRole) {
      // SÉCURITÉ: Aucun rôle trouvé - rejeter l'authentification
      // Un administrateur doit manuellement assigner un rôle à cet utilisateur
      console.error(`SÉCURITÉ: Utilisateur ${user.id} (${user.email}) n'a aucun rôle assigné. Accès refusé.`);
      return { 
        authenticated: false, 
        success: false, 
        error: 'Aucun rôle assigné. Contactez un administrateur pour obtenir les permissions nécessaires.' 
      };
    }

    return {
      authenticated: true,
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: primaryRole.role
      }
    };
  } catch (error) {
    console.error('Erreur lors de la vérification d\'authentification:', error);
    return { authenticated: false, success: false, error: 'Erreur de vérification' };
  }
}

/**
 * Vérifie l'authentification depuis une NextRequest (pour API routes)
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Récupérer le token depuis les cookies de la requête
    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie?.value;

    if (!token) {
      return { authenticated: false, success: false, error: 'Aucun token trouvé' };
    }

    // Vérifier le JWT
    const decoded = await verifyAccessToken(token);
    if (!decoded) {
      return { authenticated: false, success: false, error: 'Token invalide' };
    }

    // Récupérer l'utilisateur complet avec le nouveau système de rôles
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        lastLogin: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
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

    if (!user) {
      return { authenticated: false, success: false, error: 'Utilisateur non trouvé' };
    }

    if (!user.isActive) {
      return { authenticated: false, success: false, error: 'Compte utilisateur désactivé' };
    }

    // Récupérer le rôle primaire ou le premier rôle actif
    const primaryRole = user.userRoles.find(ur => ur.isPrimary) || user.userRoles[0];
    
    if (!primaryRole) {
      // SÉCURITÉ: Aucun rôle trouvé - rejeter l'authentification
      // Un administrateur doit manuellement assigner un rôle à cet utilisateur
      console.error(`SÉCURITÉ: Utilisateur ${user.id} (${user.email}) n'a aucun rôle assigné. Accès refusé.`);
      return { 
        authenticated: false, 
        success: false, 
        error: 'Aucun rôle assigné. Contactez un administrateur pour obtenir les permissions nécessaires.' 
      };
    }

    // Transformer en UserWithRole avec userRoles pour hasPermissionMultiRole (API)
    const userWithRole: UserWithRole & { userRoles: Array<{ role: string; isPrimary: boolean; isActive: boolean; expiresAt?: Date | null }> } = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: primaryRole.role as UserRole,
      isActive: user.isActive,
      lastLogin: user.lastLogin || undefined,
      avatarUrl: user.avatarUrl || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      userRoles: user.userRoles.map(ur => ({
        role: ur.role,
        isPrimary: ur.isPrimary,
        isActive: true,
        expiresAt: null
      }))
    };

    return {
      authenticated: true,
      success: true,
      user: userWithRole
    };

  } catch (error) {
    console.error('Erreur lors de la vérification d\'authentification:', error);
    return { authenticated: false, success: false, error: 'Erreur de vérification' };
  }
}

/**
 * Vérifie si l'utilisateur a un rôle administrateur
 */
export function isAdmin(user: AuthUser): boolean {
  return user.role === 'admin' || user.role === 'super_admin';
}

/**
 * Vérifie si l'utilisateur a accès aux outils internes
 */
export function hasInternalAccess(user: AuthUser): boolean {
  const allowedRoles = ['admin', 'super_admin', 'developer', 'internal'];
  return allowedRoles.includes(user.role);
}

/**
 * Middleware pour protéger les routes nécessitant une authentification
 */
export async function requireAuth(requireInternalAccess = false): Promise<AuthResult> {
  const authResult = await checkAuth();
  
  if (!authResult.authenticated) {
    return authResult;
  }

  // Si on requiert un accès interne, vérifier le rôle
  if (requireInternalAccess && authResult.user && !hasInternalAccess(authResult.user as AuthUser)) {
    return { 
      authenticated: false,
      success: false,
      error: 'Accès refusé - privilèges insuffisants' 
    };
  }

  return authResult;
}

/**
 * Crée une réponse de redirection vers la page de connexion
 */
export function createLoginRedirect(currentPath: string): NextResponse {
  const loginUrl = new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL || apiBase);
  loginUrl.searchParams.set('redirect', currentPath);
  
  return NextResponse.redirect(loginUrl);
}

/**
 * Crée une réponse d'erreur JSON
 */
export function createAuthErrorResponse(error: string, status = 401): NextResponse {
  return NextResponse.json(
    { 
      error: 'Authentication required', 
      message: error,
      code: 'AUTH_REQUIRED'
    },
    { status }
  );
}