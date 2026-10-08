require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DIRECT_URL;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Запускает один SQL на свежем соединении (сеть рвёт соединения —
// поэтому каждое действие на новом клиенте с ретраями)
async function run(sql, label, retries = 6) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const c = new Client({
      connectionString,
      connectionTimeoutMillis: 30000,
      statement_timeout: 120000,
      query_timeout: 120000,
    });
    c.on('error', () => {});
    try {
      await c.connect();
      const res = await c.query(sql);
      await c.end().catch(() => {});
      console.log('✅', label, 'OK');
      return res;
    } catch (e) {
      await c.end().catch(() => {});
      console.log(`⚠️ [${label}] попытка ${attempt}/${retries}: ${e.message}`);
      if (attempt === retries) throw e;
      await sleep(2000 * attempt);
    }
  }
}

async function main() {
  // 1. Удаляем строки с NULL id — они не соответствуют данным из Excel
  await run(`DELETE FROM "Payment" WHERE id IS NULL`, 'delete NULL ids');

  // 2. Проверяем уникальность id
  const dups = await run(
    `SELECT COUNT(*)::int AS c FROM (SELECT id FROM "Payment" GROUP BY id HAVING COUNT(*)>1) t`,
    'check duplicates'
  );
  if (dups && dups.rows[0].c > 0) {
    console.error('❌ Дубликаты id найдены:', dups.rows[0].c);
    process.exit(1);
  }
  console.log('ℹ️  Дубликатов id нет');

  // 3. Если на "Payment_backup" висит констрейнт Payment_pkey —
  //    переименовываем его, чтобы освободить имя для настоящей таблицы
  const hasPkOnBackup = await run(
    `SELECT COUNT(*)::int AS c
     FROM pg_constraint
     WHERE conname = 'Payment_pkey'
       AND conrelid = '"Payment_backup"'::regclass`,
    'check Payment_backup pkey'
  );
  if (hasPkOnBackup && hasPkOnBackup.rows[0].c > 0) {
    await run(
      `ALTER TABLE "Payment_backup" RENAME CONSTRAINT "Payment_pkey" TO "Payment_backup_pkey"`,
      'rename backup pkey'
    );
  }

  // 4. Проверяем, нет ли уже PK на "Payment"
  const hasPkOnPayment = await run(
    `SELECT COUNT(*)::int AS c
     FROM pg_constraint
     WHERE conrelid = '"Payment"'::regclass AND contype='p'`,
    'check Payment pkey'
  );

  // 5. Добавляем PRIMARY KEY на "Payment"
  if (hasPkOnPayment && hasPkOnPayment.rows[0].c === 0) {
    await run(
      `ALTER TABLE "Payment" ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")`,
      'add PRIMARY KEY to Payment'
    );
  } else {
    console.log('ℹ️  PK на "Payment" уже есть');
  }

  // 6. Финальная проверка
  const info = await run(
    `SELECT (SELECT COUNT(*) FROM "Payment")::int AS cnt,
            (SELECT COUNT(*) FROM pg_constraint WHERE conrelid='"Payment"'::regclass AND contype='p')::int AS pk_count`,
    'final check'
  );
  if (info) console.log('📊', info.rows[0]);

  console.log('🎉 Готово');
}

main().catch((e) => {
  console.error('❌ FAILED:', e.message);
  process.exit(1);
});

