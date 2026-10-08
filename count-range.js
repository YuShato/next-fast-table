require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const c = new Client({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 15000 });
  c.on('error', () => {});
  await c.connect();
  const r = await c.query('select count(*)::int as c, max(id) as max_id from "Payment" where id >= 200000000 and id < 200000000 + 1000000');
  console.log('test rows in 200M range:', r.rows[0].c, 'max:', r.rows[0].max_id);
  await c.end().catch(() => {});
}

main().catch((e) => {
  console.error('ERR:', e.message);
  process.exit(1);
});

