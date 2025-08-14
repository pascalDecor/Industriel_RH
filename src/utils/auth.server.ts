import { apiBase } from '@/constant/api';
import { verifyAuth } from '@/lib/auth-middleware';
import { NextRequest } from 'next/server';

/**
 * Récupère l'utilisateur authentifié depuis la session côté serveur
 * @param request - La requête Next.js (optionnelle, sera créée automatiquement si non fournie)
 * @returns L'utilisateur authentifié ou null
 */
export async function getCurrentUser(request?: NextRequest) {
  try {
    // Si aucune requête n'est fournie, créer une requête basique
    // Ceci est un workaround pour les Server Actions qui n'ont pas accès direct à la requête
    const req = request || new NextRequest(new URL(apiBase));
    
    const authResult = await verifyAuth(req);
    
    if (!authResult.success || !authResult.user) {
      return null;
    }

    return authResult.user;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

/**
 * Récupère l'ID de l'utilisateur authentifié depuis la session
 * @param request - La requête Next.js (optionnelle)
 * @returns L'ID de l'utilisateur ou null
 */
export async function getCurrentUserId(request?: NextRequest): Promise<string | null> {
  const user = await getCurrentUser(request);
  return user?.id || null;
}