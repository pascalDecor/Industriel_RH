import { SignJWT, jwtVerify } from 'jose';

// Clés secrètes - en production, utiliser des variables d'environnement
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key-change-in-production'
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_SECRET || 'default-refresh-secret-key-change-in-production'
);

// Interface pour les données utilisateur
interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Interface pour le payload JWT
interface JWTPayload extends UserPayload {
  iat: number;
  exp: number;
  type: 'access' | 'refresh';
}

/**
 * Génère un access token (courte durée)
 */
export async function generateAccessToken(payload: UserPayload): Promise<string> {
  return await new SignJWT({ ...payload, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // 2 heures (plus pratique)
    .sign(JWT_SECRET);
}

/**
 * Génère un refresh token (longue durée)
 */
export async function generateRefreshToken(payload: UserPayload): Promise<string> {
  return await new SignJWT({ ...payload, type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 jours
    .sign(REFRESH_SECRET);
}

/**
 * Génère les deux tokens en une seule fois
 */
export async function generateTokens(payload: UserPayload): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(payload),
    generateRefreshToken(payload)
  ]);

  return { accessToken, refreshToken };
}

/**
 * Vérifie un access token
 */
export async function verifyAccessToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Vérifier que c'est bien un access token
    if (payload.type !== 'access') {
      return null;
    }
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string
    };
  } catch (error) {
    console.error('Erreur de vérification access token:', error);
    return null;
  }
}

/**
 * Vérifie un refresh token
 */
export async function verifyRefreshToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    
    // Vérifier que c'est bien un refresh token
    if (payload.type !== 'refresh') {
      return null;
    }
    
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string
    };
  } catch (error) {
    console.error('Erreur de vérification refresh token:', error);
    return null;
  }
}

/**
 * Décode un token sans vérification (utile pour débugger)
 */
export function decodeToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT malformé');
    }
    
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );
    
    return payload;
  } catch (error) {
    console.error('Erreur de décodage token:', error);
    return null;
  }
}

/**
 * Vérifie si un token est expiré (sans vérification de signature)
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

// Maintien de la compatibilité avec l'ancienne API
export const jwToken = {
  sign: async (payload: any, secret?: string) => {
    return await generateAccessToken(payload);
  },
  verify: async (token: string, secret?: string) => {
    return await verifyAccessToken(token);
  }
};
