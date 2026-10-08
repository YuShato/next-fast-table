// Аналог `npx prisma migrate reset` через pg-драйвер.
// Обходит Rust-движок Prisma (который может падать с P1017).
//
// Шаги (как у prisma migrate reset):
//   1. DROP SCHEMA public CASCADE + CREATE SCHEMA public  (полный сброс данных)
//   2. Применение всех миграций из prisma/migrations/*/migration.sql
//   3. Удаление чекпоинта seed (prisma/seed-checkpoint.json)
//   4. Запуск prisma/seed.js
//
// Запуск (с подтверждением, как в prisma migrate reset):
//   node prisma/migrate-reset.js --force
//
require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const migrationsDir = path.join(__dirname, 'migrations');
const checkpointPath = path.join(__dirname, 'seed-checkpoint.json');

// ВАЖНО: без --force скрипт отказывается работать, чтобы случайно не стереть данные.
if (!process.argv.includes('--force')) {
  console.error('⚠️  Это УНИЧТОЖИТ ВСЕ ДАННЫЕ в базе (DROP SCHEMA public CASCADE)!');
  console.error('Запустите с подтверждением:');
  console.error('  node prisma/migrate-reset.js --force');
  process.exit(1);
}

async function main() {
  const connectionString = process.env.DIRECT_URL;
  if (!connectionString) throw new Error('DIRECT_URL is not set');

  const client = new Client({ connectionString });
  await client.connect();
  console.log('🔌 Connected to database');

  try {
    // 1. Полный сброс схемы и данных
    console.log('🧹 Dropping and recreating public schema...');
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('✅ Schema reset');

    // 2. Применяем миграции по порядку (так же, как prisma migrate deploy)
    const migrationDirs = fs
      .readdirSync(migrationsDir)
      .filter((d) => d !== 'migration_lock.toml')
      .sort();

    if (migrationDirs.length === 0) {
      console.log('ℹ️  No migrations found, nothing to apply');
    }

    for (const dir of migrationDirs) {
      const sqlFile = path.join(migrationsDir, dir, 'migration.sql');
      if (fs.existsSync(sqlFile)) {
        const sql = fs.readFileSync(sqlFile, 'utf8');
        console.log(`📦 Applying migration: ${dir}`);
        await client.query(sql);
        console.log(`✅ Applied ${dir}`);
      }
    }
  } finally {
    await client.end();
    console.log('🔌 Disconnected');
  }

  // 3. Удаляем чекпоинт, чтобы seed начался с нуля
  if (fs.existsSync(checkpointPath)) {
    fs.unlinkSync(checkpointPath);
    console.log('🧹 Seed checkpoint removed');
  }

  // 4. Запускаем seed (как prisma migrate reset запускает seed)
  console.log('🌱 Running seed...');
  const seedResult = spawnSync(process.execPath, [path.join(__dirname, 'seed.js')], {
    stdio: 'inherit',
    env: { ...process.env },
  });

  if (seedResult.status !== 0) {
    console.error(`❌ Seed failed with exit code ${seedResult.status}`);
    process.exit(seedResult.status ?? 1);
  }

  console.log('✅ Reset complete');
}

main().catch((err) => {
  console.error('❌ Reset failed:', err.message);
  process.exit(1);
});
