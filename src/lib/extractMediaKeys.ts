/**
 * Extrait les clés et chemins des médias depuis imagePathFinder.
 * Utilisé par l'API de synchronisation des médias (admin).
 */
import { imagePathFinder } from '@/utils/imagePathFinder';

export function getMediaKeysFromImagePathFinder(): {
  keys: string[];
  pathByKey: Record<string, string>;
} {
  const pathByKey: Record<string, string> = {};
  const keys: string[] = [];

  for (const key of Object.keys(imagePathFinder) as (keyof typeof imagePathFinder)[]) {
    const path = imagePathFinder[key];
    if (typeof path === 'string') {
      keys.push(key);
      pathByKey[key] = path;
    }
  }

  return { keys, pathByKey };
}
