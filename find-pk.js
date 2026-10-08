require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const c = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 15000,
  });
  c.on('error', () => {});
  await c.connect();

  // Где живёт ограничение "Payment_pkey"?
  const q1 = await c.query(
    `SELECT conname, conrelid::regclass AS tbl, contype
     FROM pg_constraint
     WHERE conname = 'Payment_pkey'`
  );
  console.log('Constraints named Payment_pkey:');
  q1.rows.forEach((r) => console.log(' ', r.conname, 'on', r.tbl, r.contype));

  // Все таблицы в схеме public
  const q2 = await c.query(
    `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`
  );
  console.log('All public tables:');
  q2.rows.forEach((r) => console.log(' ', r.tablename));

  // Все ограничения на таблицах public
  const q3 = await c.query(
    `SELECT c.conname, c.conrelid::regclass AS tbl, c.contype
     FROM pg_constraint c
     JOIN pg_class t ON t.oid = c.conrelid
     JOIN pg_namespace n ON n.oid = t.relnamespace
     WHERE n.nspname='public'
     ORDER BY tbl, conname`
  );
  console.log('All constraints in public:');
  q3.rows.forEach((r) => console.log(' ', r.conname, 'on', r.tbl, r.contype));

  await c.end();
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});

