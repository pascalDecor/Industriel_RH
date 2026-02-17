/**
 * Cache partagé pour la liste des fonctions (GET).
 * Invalider après POST / PUT / DELETE pour que la liste soit à jour.
 */
const functionsCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 20 * 60 * 1000; // 20 minutes

export function getFunctionsCached(key: string): { data: unknown } | null {
  const cached = functionsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { data: cached.data };
  }
  if (cached) functionsCache.delete(key);
  return null;
}

export function setFunctionsCached(key: string, data: unknown): void {
  functionsCache.set(key, { data, timestamp: Date.now() });
}

export function invalidateFunctionsCache(): void {
  functionsCache.clear();
}
