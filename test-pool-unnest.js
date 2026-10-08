// Test: Pool-based UNNEST inserts (reuse connections) vs fresh-client per batch.
// Measures reliability & throughput on this unstable network.
require('dotenv').config();
const { Pool } = require('pg');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function poolTest() {
  const pool = new Pool({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 20000,
    max: 1,
  });
  pool.on('error', (e) => console.log('pool error event:', e.message));

  let base = 200000000;
  const BATCH = 50;
  const ROUNDS = 10;
  let ok = 0, fail = 0;

  for (let r = 0; r < ROUNDS; r++) {
    const ids = [], numbers = [], years = [], cities = [], names = [], links = [];
    for (let i = 0; i < BATCH; i++) {
      ids.push(base + i);
      numbers.push('T-' + (base + i));
      years.push(String(2000 + (i % 25)));
      cities.push('TestCity');
      names.push('N' + i);
      links.push('https://t.local/' + i);
    }
    base += BATCH;
    const t = Date.now();
    try {
      const sql = `INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
        SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])`;
      await pool.query(sql, [ids, numbers, years, cities, names, links]);
      ok++;
      console.log(`✅ round ${r + 1}: ${BATCH} rows OK (${Date.now() - t}ms) [pool reuse]`);
    } catch (e) {
      fail++;
      console.log(`❌ round ${r + 1}: FAILED (${Date.now() - t}ms): ${e.message}`);
    }
    await sleep(300);
  }
  console.log(`\nPool result: ok=${ok} fail=${fail}`);
  await pool.end().catch(() => {});
}

async function singleClientTest() {
  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000 });
  client.on('error', () => {});
  await client.connect();

  let base = 300000000;
  const BATCH = 50;
  const ROUNDS = 10;
  let ok = 0, fail = 0;

  for (let r = 0; r < ROUNDS; r++) {
    const ids = [], numbers = [], years = [], cities = [], names = [], links = [];
    for (let i = 0; i < BATCH; i++) {
      ids.push(base + i);
      numbers.push('T-' + (base + i));
      years.push(String(2000 + (i % 25)));
      cities.push('TestCity');
      names.push('N' + i);
      links.push('https://t.local/' + i);
    }
    base += BATCH;
    const t = Date.now();
    try {
      const sql = `INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
        SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])`;
      await client.query(sql, [ids, numbers, years, cities, names, links]);
      ok++;
      console.log(`✅ single r${r + 1}: ${BATCH} rows OK (${Date.now() - t}ms) [same client]`);
    } catch (e) {
      fail++;
      console.log(`❌ single r${r + 1}: FAILED (${Date.now() - t}ms): ${e.message}`);
      // connection may be dead; reconnect
      try { await client.end().catch(() => {}); } catch (_) {}
      break;
    }
    await sleep(300);
  }
  console.log(`\nSingleClient result: ok=${ok} fail=${fail}`);
  try { await client.end().catch(() => {}); } catch (_) {}
}

(async () => {
  console.log('=== TEST 1: Pool (reuse) ===');
  await poolTest();
  console.log('\n=== TEST 2: Single client ===');
  await singleClientTest();
})();

