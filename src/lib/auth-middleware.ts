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

/** Utilisateur retourné par verifyAuth (permissions chargées depuis la base) */
export interface AuthApiUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: Date;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  roleCode: string;
  roleLevel: number;
}

export interface AuthResult {
  authenticated: boolean;
  success: boolean;
  user?: AuthUser | UserWithRole | AuthApiUser;
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
    const primaryRole = user.userRoles.find((ur: { isPrimary: boolean }) => ur.isPrimary) || user.userRoles[0];
    
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

/** Niveau du rôle HR_DIRECTOR (pour accès Swagger côté serveur) */
const HR_DIRECTOR_LEVEL = 6;

/**
 * Vérifie si l'utilisateur (AuthApiUser) a accès à la doc Swagger (côté serveur)
 */
export function hasSwaggerAccessServer(user: AuthApiUser): boolean {
  if (!user?.isActive) return false;
  // SUPER_ADMIN : par roleCode (base) ou par role (enum/string)
  if (user.roleCode === 'SUPER_ADMIN') return true;
  if (String(user.role) === 'SUPER_ADMIN') return true;
  if (user.permissions?.includes('api.access')) return true;
  if (typeof user.roleLevel === 'number' && user.roleLevel >= HR_DIRECTOR_LEVEL) return true;
  return false;
}

/**
 * Vérifie l'authentification à partir d'un token (pour Server Components / layout)
 * Utilise la même logique que verifyAuth mais sans NextRequest.
 */
export async function verifyAuthFromToken(token: string): Promise<AuthResult> {
  try {
    const decoded = await verifyAccessToken(token);
    if (!decoded) {
      return { authenticated: false, success: false, error: 'Token invalide' };
    }
    return loadAuthUserById(decoded.id);
  } catch (error) {
    console.error('verifyAuthFromToken:', error);
    return { authenticated: false, success: false, error: 'Erreur de vérification' };
  }
}

/**
 * Charge l'utilisateur avec rôles/permissions et construit AuthApiUser (partagé verifyAuth / verifyAuthFromToken)
 */
async function loadAuthUserById(userId: string): Promise<AuthResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
        where: { isActive: true },
        select: {
          role: true,
          isPrimary: true,
          assignedRole: {
            select: {
              code: true,
              level: true,
              rolePermissions: {
                select: { permission: { select: { code: true } } }
              }
            }
          }
        },
        orderBy: { isPrimary: 'desc' }
      }
    }
  });

  if (!user) {
    return { authenticated: false, success: false, error: 'Utilisateur non trouvé' };
  }
  if (!user.isActive) {
    return { authenticated: false, success: false, error: 'Compte utilisateur désactivé' };
  }

  const primaryRole = user.userRoles.find((ur: { isPrimary: boolean }) => ur.isPrimary) || user.userRoles[0];
  if (!primaryRole) {
    console.error(`SÉCURITÉ: Utilisateur ${user.id} (${user.email}) n'a aucun rôle assigné.`);
    return {
      authenticated: false,
      success: false,
      error: 'Aucun rôle assigné.'
    };
  }

  const permissionCodes = new Set<string>();
  let maxRoleLevel = 0;
  type Ur = { assignedRole?: { level?: number; rolePermissions?: Array<{ permission: { code?: string } }> } };
  for (const ur of user.userRoles as Ur[]) {
    const role = ur.assignedRole;
    if (role?.rolePermissions) {
      for (const rp of role.rolePermissions) {
        if (rp.permission?.code) permissionCodes.add(rp.permission.code);
      }
    }
    if (role && typeof role.level === 'number' && role.level > maxRoleLevel) {
      maxRoleLevel = role.level;
    }
  }

  const roleCode = primaryRole.assignedRole?.code ?? String(primaryRole.role);
  const userForApi: AuthApiUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: primaryRole.role as UserRole,
    isActive: user.isActive,
    lastLogin: user.lastLogin ?? undefined,
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    permissions: Array.from(permissionCodes),
    roleCode,
    roleLevel: maxRoleLevel
  };

  return {
    authenticated: true,
    success: true,
    user: userForApi
  };
}

/**
 * Vérifie l'authentification depuis une NextRequest (pour API routes)
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie?.value;

    if (!token) {
      return { authenticated: false, success: false, error: 'Aucun token trouvé' };
    }

    return verifyAuthFromToken(token);
  } catch (error) {
    console.error('verifyAuth:', error);
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
 * Évite la boucle redirect : ne jamais utiliser /auth/login ou /login comme cible.
 */
function safeRedirectPath(currentPath: string): string {
  if (currentPath === '/auth/login' || currentPath.startsWith('/auth/login?') || currentPath === '/login' || currentPath.startsWith('/login?')) {
    return '/';
  }
  return currentPath;
}

/**
 * Crée une réponse de redirection vers la page de connexion
 */
export function createLoginRedirect(currentPath: string): NextResponse {
  const loginUrl = new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL || apiBase);
  loginUrl.searchParams.set('redirect', safeRedirectPath(currentPath));
  
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