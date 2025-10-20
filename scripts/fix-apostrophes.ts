/**
 * Script pour corriger les apostrophes échappées dans les traductions
 * Remplace \' par ' dans toutes les traductions FR et EN
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Début de la correction des apostrophes...\n');

  try {
    // Récupérer toutes les traductions
    const translations = await prisma.translation.findMany();

    console.log(`📊 ${translations.length} traductions à vérifier\n`);

    let updatedCount = 0;
    let unchangedCount = 0;

    for (const translation of translations) {
      const needsUpdate = translation.fr.includes("\\'") || translation.en.includes("\\'");

      if (needsUpdate) {
        // Remplacer \' par ' dans FR et EN
        const cleanFr = translation.fr.replace(/\\'/g, "'");
        const cleanEn = translation.en.replace(/\\'/g, "'");

        await prisma.translation.update({
          where: { id: translation.id },
          data: {
            fr: cleanFr,
            en: cleanEn
          }
        });

        console.log(`✅ Corrigé: ${translation.key}`);
        updatedCount++;
      } else {
        unchangedCount++;
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`   ✅ Corrigées: ${updatedCount}`);
    console.log(`   ⏭️  Inchangées: ${unchangedCount}`);
    console.log(`   📝 Total: ${translations.length}`);

    console.log('\n✨ Correction terminée !');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

main()
  .finally(() => prisma.$disconnect());
