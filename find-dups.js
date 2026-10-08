require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000, max: 1 });
  const data = require('./prisma/data.json');
  const maxId = data.length - 1;

  // 1. Дубликаты по содержимому (все 5 полей) в пределах диапазона data.json
  const dupRows = await pool.query(`
    SELECT count, cnt FROM (
      SELECT ("userNumber","userYear","userCity","userName","userLink")::text as count, COUNT(*)::int as cnt
      FROM "Payment" WHERE id <= $1
      GROUP BY 1 HAVING COUNT(*) > 1
    ) t
  `, [maxId]);
  console.log('Distinct duplicate content-groups:', dupRows.rowCount);
  console.log('Extra rows (sum(cnt-1)):', dupRows.rows.reduce((a, r) => a + (r.cnt - 1), 0));

  // 2. Примеры строк, участвующих в дубликатах (несколько)
  const sample2 = await pool.query(`
    SELECT id, "userNumber","userYear","userCity","userName","userLink"
    FROM "Payment"
    WHERE id <= $1
      AND ("userNumber","userYear","userCity","userName","userLink") IN (
        SELECT "userNumber","userYear","userCity","userName","userLink"
        FROM "Payment"
        WHERE id <= $1
        GROUP BY 1,2,3,4,5
        HAVING COUNT(*) > 1
      )
    ORDER BY "userName"
    LIMIT 15
  `, [maxId, maxId]);
  console.log('\nSample rows involved in duplicates:');
  for (const r of sample2.rows) console.log(JSON.stringify(r));

  await pool.end();
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });

