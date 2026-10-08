require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000, max: 1 });
  const data = require('./prisma/data.json');
  const maxId = data.length - 1; // 395264

  // Сколько тестовых строк (они все за пределами диапазона data.json)
  const before = await pool.query(`SELECT COUNT(*)::int AS c, COUNT(*) FILTER (WHERE id > $1) AS extra FROM "Payment"`, [maxId]);
  console.log('Before cleanup:', before.rows[0]);

  if (before.rows[0].extra > 0) {
    const del = await pool.query(`DELETE FROM "Payment" WHERE id > $1`, [maxId]);
    console.log(`Deleted ${del.rowCount} test rows (id > ${maxId})`);
  }

  const after = await pool.query(`SELECT COUNT(*)::int AS c, MIN(id), MAX(id) FROM "Payment"`);
  console.log('After cleanup:', after.rows[0]);

  await pool.end();
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });

