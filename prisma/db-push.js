#!/usr/bin/env node
/**
 * prisma/db-push.js — fallback для `npx prisma db push`
 * 
 * ПРИЧИНА: Prisma schema engine (Rust/quaint) не может завершить TLS-рукопожатие
 * с Neon на этой сети/провайдере (ошибка P1017), хотя JS-клиент pg работает.
 * Этот скрипт применяет схему напрямую через Prisma Client + driver adapter (pg),
 * полностью минуя Rust engine.
 *
 * Запуск:
 *   node prisma/db-push.js
 */
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DIRECT_URL;
if (!connectionString) throw new Error('DIRECT_URL is not set');

const pool = new Pool({ connectionString, connectionTimeoutMillis: 15000 });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Точное соответствие модели Payment в prisma/schema.prisma
const SCHEMA_COLUMNS = [
  { name: 'id',         ddl: '"id" SERIAL NOT NULL', pk: true },
  { name: 'userNumber', ddl: '"userNumber" TEXT',    pk: false },
  { name: 'userYear',   ddl: '"userYear" TEXT',      pk: false },
  { name: 'userCity',   ddl: '"userCity" TEXT',      pk: false },
  { name: 'userName',   ddl: '"userName" TEXT',      pk: false },
  { name: 'userLink',   ddl: '"userLink" TEXT',      pk: false },
];

async function main() {
  await prisma.$connect();
  console.log('✅ Connected to database');

  const exists = await prisma.$queryRawUnsafe(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'Payment'
    ) as "exists"
  `);

  if (!exists[0].exists) {
    // Создаём таблицу
    const cols = SCHEMA_COLUMNS.map((c) => c.ddl).join(',\n  ');
    const pk = SCHEMA_COLUMNS.filter((c) => c.pk).map((c) => `"${c.name}"`).join(', ');
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Payment" (
        ${cols},
        CONSTRAINT "Payment_pkey" PRIMARY KEY (${pk})
      )
    `);
    console.log('✅ Table "Payment" created');
  } else {
    console.log('ℹ️  Table "Payment" already exists');
  }

  // Проверяем соответствие колонок схеме
  const cols = await prisma.$queryRawUnsafe(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Payment'
  `);
  const actual = cols.map((c) => c.column_name);
  const expected = SCHEMA_COLUMNS.map((c) => c.name);
  const missing = expected.filter((c) => !actual.includes(c));
  const extra = actual.filter((c) => !expected.includes(c));
  if (missing.length) console.log('⚠️  Missing columns:', missing.join(', '));
  if (extra.length) console.log('⚠️  Extra columns:', extra.join(', '));
  if (!missing.length && !extra.length) console.log('✅ Schema matches prisma/schema.prisma');

  await prisma.$disconnect();
  await pool.end();
  console.log('🎉 Done');
}

main().catch(async (e) => {
  console.error('❌ FAILED:', e.message || e);
  await pool.end().catch(() => {});
  process.exit(1);
});

