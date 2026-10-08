require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 15000, max: 5 });
  const data = require('./prisma/data.json');
  console.log('Total records:', data.length);

  // Batch insert using pg directly (bypasses Prisma client, more control)
  const BATCH = 1000;
  let inserted = 0;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < data.length; i += BATCH) {
      const chunk = data.slice(i, i + BATCH);
      // Build parameterized insert
      const values = [];
      const params = [];
      let ph = 1;
      for (const row of chunk) {
        params.push(row.userNumber ?? null, row.userYear ?? null, row.userCity ?? null, row.userName ?? null, row.userLink ?? null);
        values.push(`($${ph++},$${ph++},$${ph++},$${ph++},$${ph++})`);
      }
      const sql = `INSERT INTO "Payment" ("userNumber","userYear","userCity","userName","userLink") VALUES ${values.join(',')} ON CONFLICT DO NOTHING`;
      await client.query(sql, params);
      inserted += chunk.length;
      if (i % 50000 === 0 || i + BATCH >= data.length) console.log(`Inserted ${inserted}/${data.length}`);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  console.log('SUCCESS - inserted', inserted);
  await pool.end();
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });

