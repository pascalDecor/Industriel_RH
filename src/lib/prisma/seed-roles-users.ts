/**
 * Seed uniquement : rôles, permissions (RolePermission) et utilisateur par défaut.
 * Usage : npm run seed:roles-users
 */
import { PrismaClient } from '@prisma/client';

import createRolesAndPermissions from './seeders/createRolesAndPermissions';
import createUsers from './seeders/createUsers';

const prisma = new PrismaClient();

async function main() {
  await createRolesAndPermissions(prisma);
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
