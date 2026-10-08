require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const c = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 15000,
  });
  c.on('error', () => {});
  await c.connect();

  const r = await c.query(
    `SELECT column_name, data_type, is_nullable, column_default
     FROM information_schema.columns
     WHERE table_schema='public' AND table_name='Payment'
     ORDER BY ordinal_position`
  );
  console.log('COLUMNS:');
  r.rows.forEach((x) =>
    console.log(' ', x.column_name, x.data_type, 'nullable=' + x.is_nullable, 'default=' + (x.column_default || '-'))
  );

  const p = await c.query(
    `SELECT conname, contype FROM pg_constraint
     WHERE conrelid = '"Payment"'::regclass`
  );
  console.log('CONSTRAINTS:');
  p.rows.forEach((x) => console.log(' ', x.conname, x.contype));

  const i = await c.query(
    `SELECT indexname, indexdef FROM pg_indexes WHERE tablename='Payment'`
  );
  console.log('INDEXES:');
  i.rows.forEach((x) => console.log(' ', x.indexname, '|', x.indexdef));

  const cnt = await c.query('SELECT COUNT(*)::int AS c, MIN(id) AS mn, MAX(id) AS mx FROM "Payment"');
  console.log('COUNT:', cnt.rows[0]);

  const nulls = await c.query('SELECT COUNT(*)::int AS c FROM "Payment" WHERE id IS NULL');
  console.log('NULL ids:', nulls.rows[0].c);

  const dups = await c.query(
    `SELECT COUNT(*)::int AS c FROM (SELECT id FROM "Payment" GROUP BY id HAVING COUNT(*)>1) t`
  );
  console.log('Duplicate id groups:', dups.rows[0].c);

  await c.end();
}

main().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});

