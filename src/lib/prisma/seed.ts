import { PrismaClient } from "@prisma/client";
import createSpecialites from "./seeders/createSpecialites";
import createSectors from "./seeders/createSectors";
import createCivilities from "./seeders/createCivilities";
import createCities from "./seeders/createCities";
import createCountries from "./seeders/createCountries";
import createTags from "./seeders/createTags";
import createNotices from "./seeders/createNotices";
import createUsers from "./seeders/createUsers";

const prisma = new PrismaClient();

async function main() {
  await createSpecialites(prisma);
  await createSectors(prisma);
  await createCivilities(prisma);
  await createCountries(prisma);
  await createCities(prisma);
  await createTags(prisma);
  await createNotices(prisma);
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
