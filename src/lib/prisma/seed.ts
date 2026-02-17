import { PrismaClient } from '@prisma/client';

import createSectors from './seeders/createSectors';
import createDefaultConsultingSector from './seeders/createDefaultConsultingSector';
import createSpecialites from './seeders/createSpecialites';
import createCivilities from './seeders/createCivilities';
import createCities from './seeders/createCities';
import createCountries from './seeders/createCountries';
import createTags from './seeders/createTags';
import createNotices from './seeders/createNotices';
import createUsers from './seeders/createUsers';
import createTeamMembers from './seeders/createTeamMembers';

const prisma = new PrismaClient();

async function main() {
  await createSpecialites(prisma);
  await createSectors(prisma);
  await createDefaultConsultingSector(prisma);
  await createCivilities(prisma);
  await createCountries(prisma);
  await createCities(prisma);
  await createTags(prisma);
  await createNotices(prisma);
  await createTeamMembers(prisma);
  await createUsers(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
