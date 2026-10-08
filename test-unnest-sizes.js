// Test larger UNNEST batch sizes on fresh ids to find the reliable threshold.
require('dotenv').config();
const { Client } = require('pg');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tryOnce(size, baseId, label) {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 20000,
    query_timeout: 90000,
  });
  client.on('error', () => {});
  const rows = [];
  for (let i = 0; i < size; i++) {
    rows.push({
      id: baseId + i,
      userNumber: 'TEST-' + (baseId + i),
      userYear: String(2000 + (i % 25)),
      userCity: 'TestCity',
      userName: 'TestName' + i,
      userLink: 'https://test.local/' + i,
    });
  }
  const ids = rows.map(r => r.id);
  const numbers = rows.map(r => r.userNumber);
  const years = rows.map(r => r.userYear);
  const cities = rows.map(r => r.userCity);
  const names = rows.map(r => r.userName);
  const links = rows.map(r => r.userLink);

  const t = Date.now();
  try {
    await client.connect();
    await client.query('SELECT 1');
    const sql = `
      INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
      SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])`;
    await client.query(sql, [ids, numbers, years, cities, names, links]);
    console.log(`✅ ${label} size=${size}: OK in ${Date.now() - t}ms`);
    await client.end().catch(() => {});
    return true;
  } catch (e) {
    console.log(`❌ ${label} size=${size}: FAILED (${Date.now() - t}ms): ${e.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

async function main() {
  let base = 200000000;
  const sizes = [25, 50, 100, 200, 500];
  for (let round = 1; round <= 3; round++) {
    console.log(`\n=== Round ${round} ===`);
    for (const size of sizes) {
      await tryOnce(size, base, `R${round}`);
      base += size;
      await sleep(400);
    }
  }
  console.log('\nDone.');
}

main().catch((e) => {
  console.error('MAIN FAILED:', e.message);
  process.exit(1);
});

