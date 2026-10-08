require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: process.env.DIRECT_URL });
  await client.connect();
  const r = await client.query('SELECT count(*)::int AS total FROM "Payment"');
  console.log('Total rows in Payment:', r.rows[0].total);
  await client.end();
}

main().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});

