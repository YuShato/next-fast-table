require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const c = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 15000,
  });
  c.on('error', () => {});
  await c.connect();
  const r = await c.query('SELECT count(*)::int as c, max(id) as max_id FROM "Payment"');
  console.log('count:', r.rows[0].c, 'max_id:', r.rows[0].max_id);
  await c.end().catch(() => {});
}

main().catch((e) => {
  console.error('ERR:', e.message);
  process.exit(1);
});

