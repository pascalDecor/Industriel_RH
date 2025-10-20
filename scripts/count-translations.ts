import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.translation.count();
  console.log(`📊 Nombre de traductions dans la base de données: ${count}`);

  // Afficher quelques exemples
  const sample = await prisma.translation.findMany({
    take: 5,
    select: {
      key: true,
      category: true,
      fr: true,
      en: true
    }
  });

  console.log('\n📝 Exemples de traductions:');
  sample.forEach(t => {
    console.log(`  - ${t.key} (${t.category})`);
    console.log(`    FR: ${t.fr.substring(0, 50)}...`);
    console.log(`    EN: ${t.en.substring(0, 50)}...`);
  });
}

main()
  .finally(() => prisma.$disconnect());
