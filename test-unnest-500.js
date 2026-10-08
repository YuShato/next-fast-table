// Test UNNEST with 500 rows on a FRESH connection
require('dotenv').config();
const { Client } = require('pg');

async function testSize(size, label) {
  const data = require('./prisma/data.json');
  const chunk = data.slice(0, size);
  const ids = chunk.map(r => r.id);
  const numbers = chunk.map(r => r.userNumber ?? null);
  const years = chunk.map(r => r.userYear ?? null);
  const cities = chunk.map(r => r.userCity ?? null);
  const names = chunk.map(r => r.userName ?? null);
  const links = chunk.map(r => r.userLink ?? null);

  // Use fresh connection, but with ON CONFLICT DO NOTHING to avoid duplicates
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 15000,
    query_timeout: 60000,
  });
  client.on('error', () => {});
  const t = Date.now();
  try {
    await client.connect();
    await client.query('SELECT 1');
    const sql = `
      INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
      SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])
      ON CONFLICT ("id") DO NOTHING`;
    await client.query(sql, [ids, numbers, years, cities, names, links]);
    const elapsed = Date.now() - t;
    console.log(`✅ ${label} size=${size}: OK in ${elapsed}ms (${Math.round(size/elapsed*1000)} rec/s)`);
    await client.end().catch(() => {});
    return true;
  } catch (e) {
    console.log(`❌ ${label} size=${size}: FAILED in ${Date.now()-t}ms: ${e.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

(async () => {
  for (const size of [200, 500, 1000]) {
    await testSize(size, `R1`);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('\nDone.');
})().catch(e => { console.error('MAIN FAILED:', e.message); process.exit(1); });
