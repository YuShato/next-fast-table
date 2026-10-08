require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000, max: 1 });
  const data = require('./prisma/data.json');

  // For each content-key, count occurrences only among data.json ids (0..395264)
  // Use a temp approach: count total rows vs count of rows matching data.json by id
  console.log('Total rows in table:', (await pool.query('SELECT COUNT(*)::int c FROM "Payment"')).rows[0].c);

  // Approach: use btree on the natural key? No.
  // Simpler: check if there are rows with identical full content but multiple ids - fetch via a hash.
  const r = await pool.query(`
    SELECT COUNT(*)::int AS extra FROM (
      SELECT md5(concat_ws('|', "userNumber","userYear","userCity","userName","userLink")) AS h
      FROM "Payment"
      GROUP BY h
      HAVING COUNT(*) > 1
    ) d
  `);
  console.log('Content-hash groups with >1 row:', r.rows[0].extra);

  await pool.end();
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });

