// prisma.config.ts
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'TS_NODE_PROJECT=./tsconfig.seed.json node -r ts-node/register ./src/lib/prisma/seed.cjs',
  },
});
