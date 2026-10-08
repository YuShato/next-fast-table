require('dotenv').config();
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000, max: 1 });
  const data = require('./prisma/data.json');
  const total = data.length;
  const maxId = total - 1; // id = index

  // Сколько строк из data.json (id 0..maxId) уже есть в таблице
  const r = await pool.query(`SELECT COUNT(*)::int AS c FROM "Payment" WHERE id <= $1`, [maxId]);
  console.log(`data.json records: ${total}`);
  console.log(`rows in table with id<=${maxId}: ${r.rows[0].c}`);
  console.log(`missing: ${total - r.rows[0].c}`);

  // Также проверим дубликаты по id среди диапазона data.json (лишние повторы)
  const dup = await pool.query(`
    SELECT COUNT(*)::int AS c FROM (
      SELECT id FROM "Payment" WHERE id <= $1 GROUP BY id HAVING COUNT(*) > 1
    ) t
  `, [maxId]);
  console.log(`duplicate ids in data range: ${dup.rows[0].c}`);

  // Строки сверх диапазона data.json (артефакты предыдущих тестов)
  const extra = await pool.query(`SELECT COUNT(*)::int AS c FROM "Payment" WHERE id > $1`, [maxId]);
  console.log(`rows with id > ${maxId}: ${extra.rows[0].c}`);

  await pool.end();
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });

