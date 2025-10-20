/**
 * Script d'import automatique de toutes les traductions
 *
 * Ce script lit le fichier LanguageContext.tsx et extrait automatiquement
 * toutes les traductions pour les importer dans la base de données.
 *
 * Usage: npx tsx scripts/import-all-translations.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Fonction pour extraire les traductions depuis le fichier
function extractTranslations(filePath: string) {
  console.log('📖 Lecture du fichier LanguageContext.tsx...');

  const content = fs.readFileSync(filePath, 'utf-8');

  // Trouver l'objet translations
  const translationsMatch = content.match(/const translations: Record<Language, Record<string, string>> = \{([\s\S]*?)\n\};/);

  if (!translationsMatch) {
    throw new Error('Impossible de trouver l\'objet translations dans le fichier');
  }

  const translationsContent = translationsMatch[1];

  // Extraire FR et EN
  const frMatch = translationsContent.match(/fr: \{([\s\S]*?)\n  \},/);
  const enMatch = translationsContent.match(/en: \{([\s\S]*?)\n  \}/);

  if (!frMatch || !enMatch) {
    throw new Error('Impossible d\'extraire les traductions FR ou EN');
  }

  // Parser les clés/valeurs
  const frContent = frMatch[1];
  const enContent = enMatch[1];

  const translations: { [key: string]: { fr: string; en: string } } = {};

  // Regex pour capturer les paires clé/valeur
  // Supporte les chaînes simples et les chaînes avec échappement
  const keyValueRegex = /['"]([^'"]+)['"]\s*:\s*['"](.+?)['"]\s*,/gs;

  // Extraire FR
  let match;
  const frTranslations: { [key: string]: string } = {};
  while ((match = keyValueRegex.exec(frContent)) !== null) {
    frTranslations[match[1]] = match[2];
  }

  // Extraire EN
  const enTranslations: { [key: string]: string } = {};
  keyValueRegex.lastIndex = 0; // Reset regex
  while ((match = keyValueRegex.exec(enContent)) !== null) {
    enTranslations[match[1]] = match[2];
  }

  // Combiner
  const allKeys = new Set([...Object.keys(frTranslations), ...Object.keys(enTranslations)]);

  allKeys.forEach(key => {
    translations[key] = {
      fr: frTranslations[key] || key,
      en: enTranslations[key] || key
    };
  });

  return translations;
}

async function main() {
  try {
    console.log('🚀 Début de l\'import automatique des traductions...\n');

    // Chemin vers le fichier LanguageContext.tsx
    const languageContextPath = path.join(__dirname, '..', 'src', 'contexts', 'LanguageContext.tsx');

    // Extraire les traductions
    const translations = extractTranslations(languageContextPath);
    const keys = Object.keys(translations);

    console.log(`📊 Nombre total de traductions trouvées: ${keys.length}\n`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;

    for (const key of keys) {
      try {
        const { fr, en } = translations[key];

        // Extraire la catégorie depuis la clé
        const category = key.includes('.') ? key.split('.')[0] : null;

        // Vérifier si la traduction existe déjà
        const existingTranslation = await prisma.translation.findUnique({
          where: { key }
        });

        if (existingTranslation) {
          // Mettre à jour si les valeurs ont changé
          if (existingTranslation.fr !== fr || existingTranslation.en !== en) {
            await prisma.translation.update({
              where: { key },
              data: {
                fr,
                en,
                category
              }
            });
            console.log(`🔄 Traduction mise à jour: ${key}`);
            updatedCount++;
          } else {
            console.log(`⏭️  Traduction inchangée: ${key}`);
            skippedCount++;
          }
        } else {
          // Créer la traduction
          await prisma.translation.create({
            data: {
              key,
              category,
              fr,
              en,
              description: null
            }
          });
          console.log(`✅ Traduction importée: ${key}`);
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Erreur lors de l'import de ${key}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Résumé de l\'import:');
    console.log(`   ✅ Nouvelles: ${successCount}`);
    console.log(`   🔄 Mises à jour: ${updatedCount}`);
    console.log(`   ⏭️  Ignorées: ${skippedCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`   📝 Total: ${keys.length}`);

    console.log('\n✨ Import terminé !');
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur fatale:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
