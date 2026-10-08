#!/usr/bin/env node
/**
 * prisma/seed.js — надёжный seed для нестабильной сети до Neon (us-east-1).
 *
 * Исправляет ошибку "Client has encountered a connection error and is not queryable":
 * раньше все 415 788 строк вставлялись ОДНИМ createMany → соединение рвалось.
 *
 * Новая стратегия (проверена тестами test-reliable-batch.js / test-unnest.js):
 *   - НОВЫЙ Client на каждый батч (свежее TCP-соединение = 100% надёжно).
 *   - INSERT ... SELECT * FROM unnest(...) — 6 параметров при любом размере батча.
 *   - Батч по умолчанию 50 строк (SEED_BATCH_SIZE).
 *   - Retry батча с новым соединением + экспоненциальный backoff.
 *
 * Требование заказчика: при расхождении количества записей в БД и data.json —
 * ПОЛНАЯ перезапись (TRUNCATE RESTART IDENTITY) и заливка заново.
 *
 * Чекпоинт prisma/seed-checkpoint.json позволяет возобновить после обрыва.
 *
 * Запуск: node prisma/seed.js
 */
require('dotenv').config();

const { Client } = require('pg');
const xlsx = require('xlsx');
const crypto = require('crypto');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const BATCH_SIZE = parseInt(process.env.SEED_BATCH_SIZE || '50', 10);
const MAX_ATTEMPTS = 10;
const BASE_BACKOFF_MS = 2000;
const CHECKPOINT_PATH = path.join(__dirname, 'seed-checkpoint.json');
const DATA_PATH = path.join(__dirname, 'data.json');
const EXCEL_PATH = path.join(__dirname, 'my-data.xlsx');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Соединение
// ---------------------------------------------------------------------------
function getConnectionString() {
  const raw = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!raw) throw new Error('DIRECT_URL (или DATABASE_URL) не задан в .env');
  return raw;
}

// Neon не поддерживает SCRAM channel binding; sslmode=require/prefer в pg 8.x
// являются алиасами verify-full и шлют warning — нормализуем явно.
function cleanUrl(url) {
  try {
    const u = new URL(url);
    u.searchParams.delete('channel_binding');
    u.searchParams.set('sslmode', 'verify-full');
    return u.toString();
  } catch {
    return url;
  }
}

function createClient() {
  const c = new Client({
    connectionString: cleanUrl(getConnectionString()),
    connectionTimeoutMillis: 20000,
    query_timeout: 45000,
    keepalive: true,
    keepalivesIdle: 10000,
    keepalivesInterval: 10000,
  });
  // Игнорируем фоновые ошибки «соединение умерло» — обрабатываем их в retry.
  c.on('error', () => {});
  return c;
}

// Выполняет запрос на НОВОМ соединении с автоматическим retry при обрыве.
// Каждый retry пересоздаёт соединение (это и есть надёжный паттерн из тестов).
async function query(text, params) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const client = createClient();
    try {
      await client.connect();
      return await client.query(text, params);
    } catch (e) {
      lastError = e;
      // Постоянные SQL-ошибки (нарушение целостности, синтаксис, нет таблицы)
      // повторять бессмысленно — бросаем сразу.
      const permanent =
        typeof e.code === 'string' && /^(23|22|42|26|0A|40)[0-9A-Z]{3}$/.test(e.code);
      if (permanent) throw e;
      console.warn(`⚠️  Попытка ${attempt}/${MAX_ATTEMPTS} не удалась: ${e.message}`);
      if (attempt < MAX_ATTEMPTS) await sleep(BASE_BACKOFF_MS * attempt);
    } finally {
      await client.end().catch(() => {});
    }
  }
  throw lastError;
}

// ---------------------------------------------------------------------------
// Чекпоинт
// ---------------------------------------------------------------------------
function readCheckpoint() {
  try {
    if (fsSync.existsSync(CHECKPOINT_PATH)) {
      return JSON.parse(fsSync.readFileSync(CHECKPOINT_PATH, 'utf8'));
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function writeCheckpoint(cp) {
  await fs.writeFile(CHECKPOINT_PATH, JSON.stringify(cp));
}

async function clearCheckpoint() {
  try {
    await fs.unlink(CHECKPOINT_PATH);
  } catch {
    /* ignore */
  }
}

// Быстрый хеш данных, чтобы понять, что содержимое изменилось (не только count).
function hashData(arr) {
  const sample = arr.slice(0, 1000).concat(arr.slice(-1000));
  return crypto.createHash('sha1').update(JSON.stringify(sample)).digest('hex');
}

// ---------------------------------------------------------------------------
// Работа с БД
// ---------------------------------------------------------------------------
async function getDbState() {
  const r = await query(
    'SELECT count(*)::int AS count, COALESCE(MAX(id), -1)::int AS max_id FROM "Payment"'
  );
  return { count: r.rows[0].count, maxId: r.rows[0].max_id };
}

async function insertChunk(chunk) {
  const ids = chunk.map((r) => r.id);
  const numbers = chunk.map((r) => r.userNumber ?? null);
  const years = chunk.map((r) => r.userYear ?? null);
  const cities = chunk.map((r) => r.userCity ?? null);
  const names = chunk.map((r) => r.userName ?? null);
  const links = chunk.map((r) => r.userLink ?? null);

  const sql = `
    INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
    SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])
    ON CONFLICT ("id") DO NOTHING`;
  await query(sql, [ids, numbers, years, cities, names, links]);
}

async function ensureSequence() {
  await query(
    `SELECT setval(pg_get_serial_sequence('"Payment"', 'id'),
                   COALESCE((SELECT MAX(id) FROM "Payment"), 1))`
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  // 1. Excel → data.json
  console.log(`📖 Чтение ${path.basename(EXCEL_PATH)}...`);
  const fileBuffer = await fs.readFile(EXCEL_PATH);
  const myData = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheet = myData.Sheets[myData.SheetNames[0]];
  let jsonData = xlsx.utils.sheet_to_json(sheet);

  jsonData.forEach((item, index) => {
    item.id = index;
    item.userYear = item.userYear == null ? null : String(item.userYear);
  });

  await fs.writeFile(DATA_PATH, JSON.stringify(jsonData, null, 2));
  console.log(`📄 data.json обновлён: ${jsonData.length} записей`);

  const total = jsonData.length;
  const expectedMaxId = total - 1;
  const dataHash = hashData(jsonData);

  // 2. Состояние БД
  await query('SELECT 1');
  console.log('🔌 Подключено к базе');
  const { count, maxId } = await getDbState();
  console.log(`🗄️  В БД: ${count} записей (MAX id=${maxId}); в data.json: ${total}`);

  const cp = readCheckpoint();
  const countMatches = count === total && maxId === expectedMaxId;
  const canResume =
    cp &&
    cp.dataHash === dataHash &&
    cp.total === total &&
    cp.nextIndex === count &&
    maxId === cp.nextIndex - 1;

  let startIndex;
  if (canResume) {
    startIndex = cp.nextIndex;
    console.log(`♻️  Чекпоинт валиден (nextIndex=${cp.nextIndex}), продолжаю заливку...`);
  } else if (!countMatches) {
    console.log('⚠️  Расхождение в количестве записей → ПОЛНАЯ ПЕРЕЗАПИСЬ (TRUNCATE)...');
    await query('TRUNCATE TABLE "Payment" RESTART IDENTITY');
    await writeCheckpoint({ total, nextIndex: 0, dataHash });
    startIndex = 0;
    console.log('🧹 Таблица очищена. Начинаю заливку с нуля.');
  } else {
    console.log('✅ Количество записей совпадает — база актуальна, заливка не нужна.');
    await clearCheckpoint();
    return;
  }

  // 3. Пакетная вставка (новый Client на каждый батч)
  const startedAt = Date.now();
  for (let i = startIndex; i < total; i += BATCH_SIZE) {
    const chunk = jsonData.slice(i, i + BATCH_SIZE);
    await insertChunk(chunk);
    await writeCheckpoint({ total, nextIndex: i + chunk.length, dataHash });

    const batchNum = Math.floor(i / BATCH_SIZE);
    if (batchNum % 100 === 0 || i + BATCH_SIZE >= total) {
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      console.log(`📦 ${Math.min(i + BATCH_SIZE, total)}/${total} (прошло ${elapsed}s)`);
    }
  }

  // 4. Финальная проверка
  const final = await getDbState();
  console.log(`🔎 Финальная проверка: в БД ${final.count}, ожидалось ${total}`);
  if (final.count !== total || final.maxId !== expectedMaxId) {
    throw new Error(`Количество не совпадает после заливки: ${final.count} != ${total}`);
  }
  await ensureSequence();
  await clearCheckpoint();
  const totalSec = Math.round((Date.now() - startedAt) / 1000);
  console.log(
    `🎉 Seed завершён: ${total} записей за ${Math.floor(totalSec / 60)}м ${totalSec % 60}с`
  );
}

main()
  .catch((e) => {
    console.error('❌ Ошибка в main:', e.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    console.log('🔌 Готово');
  });

