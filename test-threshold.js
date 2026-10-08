require('dotenv').config();
const { Pool } = require('pg');

async function tryInsert(pool, rows, label) {
  const values = [];
  const params = [];
  let ph = 1;
  for (const row of rows) {
    params.push(row.userNumber ?? null, row.userYear ?? null, row.userCity ?? null, row.userName ?? null, row.userLink ?? null);
    values.push(`($${ph++},$${ph++},$${ph++},$${ph++},$${ph++})`);
  }
  const sql = `INSERT INTO "Payment" ("userNumber","userYear","userCity","userName","userLink") VALUES ${values.join(',')}`;
  const t = Date.now();
  try {
    await pool.query(sql, params);
    console.log(`✅ ${label}: ${rows.length} rows OK (${Date.now() - t}ms)`);
  } catch (e) {
    console.log(`❌ ${label}: ${rows.length} rows FAILED: ${e.message}`);
  }
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000, max: 1 });
  const data = require('./prisma/data.json');

  // Try increasing sizes to find the drop threshold
  for (const size of [1, 5, 10, 25, 50, 100, 250, 500, 1000]) {
    await tryInsert(pool, data.slice(0, size), `batch-${size}`);
  }
  await pool.end();
}

main().catch(e => { console.error('MAIN FAILED:', e.message); process.exit(1); });

