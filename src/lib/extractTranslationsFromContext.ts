import * as fs from 'fs';
import * as path from 'path';

export type DefaultTranslations = { fr: Record<string, string>; en: Record<string, string> };

/**
 * Extrait les traductions par défaut depuis LanguageContext.tsx (source de vérité).
 * Utilisé par l'API de synchronisation et peut être utilisé par les scripts.
 */
export function getDefaultTranslations(projectRoot?: string): DefaultTranslations {
  const root = projectRoot ?? process.cwd();
  const filePath = path.join(root, 'src', 'contexts', 'LanguageContext.tsx');

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier introuvable: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  const translationsMatch = content.match(
    /const translations: Record<Language, Record<string, string>> = \{([\s\S]*?)\n\};/
  );

  if (!translationsMatch) {
    throw new Error('Impossible de trouver l\'objet translations dans LanguageContext.tsx');
  }

  const translationsContent = translationsMatch[1];

  const frMatch = translationsContent.match(/fr: \{([\s\S]*?)\n  \},/);
  const enMatch = translationsContent.match(/en: \{([\s\S]*?)\n  \}/);

  if (!frMatch || !enMatch) {
    throw new Error('Impossible d\'extraire les blocs fr ou en');
  }

  const parseBlock = (blockContent: string): Record<string, string> => {
    const result: Record<string, string> = {};
    // Clé et valeur entre guillemets ; valeur peut contenir \' ou \"
    const keyValueRegex = /['"]([^'"]+)['"]\s*:\s*['"]((?:[^'"\\]|\\.)*?)['"]\s*,/gs;
    let match;
    while ((match = keyValueRegex.exec(blockContent)) !== null) {
      const value = match[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
      result[match[1]] = value;
    }
    return result;
  };

  const fr = parseBlock(frMatch[1]);
  const en = parseBlock(enMatch[1]);

  const allKeys = new Set([...Object.keys(fr), ...Object.keys(en)]);
  const frOut: Record<string, string> = {};
  const enOut: Record<string, string> = {};
  allKeys.forEach((key) => {
    frOut[key] = fr[key] ?? en[key] ?? key;
    enOut[key] = en[key] ?? fr[key] ?? key;
  });

  return { fr: frOut, en: enOut };
}
