require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');

function normalize(v) {
  return v === null || v === undefined ? '' : String(v);
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000, max: 1 });
  const data = require('./prisma/data.json');

  // Build expected: id -> content signature from data.json
  const expected = new Map();
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    expected.set(i, [normalize(row.userNumber), normalize(row.userYear), normalize(row.userCity), normalize(row.userName), normalize(row.userLink)].join('|'));
  }

  console.log('data.json records:', data.length);

  // Fetch only ids and use count-based approach:
  // 1. Count rows in table with id in [0, data.length-1]
  // 2. Count distinct ids
  // 3. Sample-check a few thousand rows against expected content
  const maxId = data.length - 1;

  const cnt = await pool.query(`SELECT COUNT(*)::int AS c FROM "Payment" WHERE id BETWEEN 0 AND $1`, [maxId]);
  console.log('Rows in table with id in data.json range:', cnt.rows[0].c);
  console.log('Expected:', data.length);

  const dist = await pool.query(`SELECT COUNT(DISTINCT id)::int AS c FROM "Payment" WHERE id BETWEEN 0 AND $1`, [maxId]);
  console.log('Distinct ids in range:', dist.rows[0].c);

  // Sample check: fetch a random sample of 5000 rows within range and compare content
  const sample = await pool.query(`
    SELECT id, "userNumber","userYear","userCity","userName","userLink"
    FROM "Payment"
    WHERE id BETWEEN 0 AND $1
    ORDER BY random()
    LIMIT 5000
  `, [maxId]);
  let mismatch = 0;
  for (const r of sample.rows) {
    const exp = expected.get(r.id);
    const act = [normalize(r.userNumber), normalize(r.userYear), normalize(r.userCity), normalize(r.userName), normalize(r.userLink)].join('|');
    if (exp !== act) mismatch++;
  }
  console.log('Sample checked:', sample.rowCount, 'Mismatches:', mismatch);

  await pool.end();
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });

