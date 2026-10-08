// Verify pg handles array serialization with Cyrillic + special chars correctly.
require('dotenv').config();
const { Client } = require('pg');

async function main() {
  const data = require('./prisma/data.json');
  // Take 3 sample rows that include Cyrillic and any special characters
  const samples = [data[0], data[1], data[100], data[1000], data[50000]];
  console.log('Sample rows (raw):');
  for (const s of samples) console.log(' ', JSON.stringify(s));

  // Simulate exactly what the seed will pass to pg
  const ids = samples.map(r => r.id);
  const numbers = samples.map(r => r.userNumber ?? null);
  const years = samples.map(r => r.userYear ?? null);
  const cities = samples.map(r => r.userCity ?? null);
  const names = samples.map(r => r.userName ?? null);
  const links = samples.map(r => r.userLink ?? null);

  const client = new Client({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000 });
  client.on('error', () => {});
  await client.connect();

  const t = Date.now();
  const sql = `
    INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
    SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])
    ON CONFLICT ("id") DO NOTHING
    RETURNING "id", "userNumber", "userYear", "userCity", "userName", "userLink"`;
  const res = await client.query(sql, [ids, numbers, years, cities, names, links]);
  console.log(`\n✅ UNNEST INSERT OK (${Date.now() - t}ms), returned rows:`);
  for (const row of res.rows) console.log(' ', JSON.stringify(row));

  // Now read them back and compare to expected
  const back = await client.query(`SELECT * FROM "Payment" WHERE id = ANY($1::int[])`, [ids]);
  console.log('\nRead-back rows:');
  const byId = new Map(back.rows.map(r => [r.id, r]));
  let ok = true;
  for (const s of samples) {
    const got = byId.get(s.id);
    const norm = (v) => v === null || v === undefined ? null : String(v);
    const match =
      got &&
      norm(got.userNumber) === norm(s.userNumber) &&
      norm(got.userYear) === norm(s.userYear) &&
      norm(got.userCity) === norm(s.userCity) &&
      norm(got.userName) === norm(s.userName) &&
      norm(got.userLink) === norm(s.userLink);
    if (!match) { ok = false; console.log(`  ❌ MISMATCH id=${s.id}: expected=${JSON.stringify(s)} got=${JSON.stringify(got)}`); }
    else console.log(`  ✅ id=${s.id} matches`);
  }
  console.log('\nRESULT:', ok ? 'ALL MATCH ✅' : 'MISMATCHES FOUND ❌');
  await client.end().catch(() => {});
}

main().catch((e) => {
  console.error('MAIN FAILED:', e.message);
  process.exit(1);
});

