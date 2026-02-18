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

const confirm = process.env.PRISMA_BASELINE_CONFIRM;
if (confirm !== 'YES') {
  console.error(
    [
      'Ce script modifie l’historique des migrations (_prisma_migrations).',
      'Il doit être exécuté UNE SEULE FOIS sur une base existante.',
      '',
      'Pour confirmer, relance avec:',
      '  PRISMA_BASELINE_CONFIRM=YES node scripts/prisma-baseline.js',
      '',
      'Optionnel: limiter jusqu’à une migration (incluse) avec:',
      '  PRISMA_BASELINE_UNTIL=20260217110000_add_is_default_consulting_solutions',
    ].join('\n')
  );
  process.exit(1);
}

const until = process.env.PRISMA_BASELINE_UNTIL;
const selectedDirs = until ? dirs.filter((d) => d <= until) : dirs;

console.log(
  'Prisma baseline: marquage de',
  selectedDirs.length,
  'migration(s) comme appliquées...\n'
);
if (until) {
  console.log('Limite PRISMA_BASELINE_UNTIL =', until, '\n');
}

for (const name of selectedDirs) {
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
