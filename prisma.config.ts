// prisma.config.ts
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node -r ts-node/register ./src/lib/prisma/seed.cjs',
  },
});
