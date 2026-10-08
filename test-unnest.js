// Validate UNNEST array-based bulk insert (6 params regardless of batch size)
require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const data = require('./prisma/data.json');
  // Insert a small chunk of NEW rows (ids 395265..395464) using UNNEST
  const chunk = data.slice(395265, 395465);
  const ids = chunk.map(r => r.id);
  const numbers = chunk.map(r => r.userNumber ?? null);
  const years = chunk.map(r => r.userYear ?? null);
  const cities = chunk.map(r => r.userCity ?? null);
  const names = chunk.map(r => r.userName ?? null);
  const links = chunk.map(r => r.userLink ?? null);

  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 30000,
    query_timeout: 120000,
  });
  client.on('error', () => {});
  await client.connect();
  const t = Date.now();
  try {
    const sql = `
      INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
      SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])
      ON CONFLICT ("id") DO NOTHING`;
    await client.query(sql, [ids, numbers, years, cities, names, links]);
    console.log('✅ UNNEST OK:', chunk.length, 'rows in', Date.now() - t, 'ms');
  } catch (e) {
    console.log('❌ UNNEST FAILED:', e.message);
  }
  await client.end().catch(() => {});
}

main().catch(e => { console.error('MAIN FAILED:', e.message); process.exit(1); });

