/**
 * Marque toutes les migrations existantes comme déjà appliquées (baseline).
 * À exécuter UNE SEULE FOIS sur une base qui a déjà le schéma mais pas _prisma_migrations.
 *
 * Usage: node scripts/prisma-baseline.js
 * (DATABASE_URL doit être défini dans l'environnement ou .env)
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const migrationsDir = path.join(__dirname, '..', 'prisma', 'migrations');
const entries = fs.readdirSync(migrationsDir, { withFileTypes: true });
const dirs = entries
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

if (dirs.length === 0) {
  console.error('Aucune migration trouvée dans prisma/migrations');
  process.exit(1);
}

console.log('Prisma baseline: marquage de', dirs.length, 'migrations comme appliquées...\n');

for (const name of dirs) {
  try {
    execSync(`npx prisma migrate resolve --applied "${name}"`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log('  ✓', name);
  } catch (err) {
    console.error('  ✗', name, err.message || err);
    process.exit(1);
  }
}

console.log('\nBaseline terminé. Vous pouvez maintenant utiliser `prisma migrate deploy`.');
