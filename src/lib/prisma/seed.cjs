const createSectors = require('./seeders/createSectors.ts');
const { PrismaClient } = require("@prisma/client");
const createSpecialites = require('./seeders/createSpecialites.ts');
const createCivilities = require('./seeders/createCivilities.ts');
const createCities = require('./seeders/createCities.ts');
const createCountries = require('./seeders/createCountries.ts');
const createTags = require('./seeders/createTags.ts');
const createNotices = require('./seeders/createNotices.ts');

const prisma = new PrismaClient();

async function main() {
  // Exécution séquentielle des seeders
  await createSpecialites(prisma);
  await createSectors(prisma);
  await createCivilities(prisma);
  await createCountries(prisma);
  await createCities(prisma);
  await createTags(prisma);
  await createNotices(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
