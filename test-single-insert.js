require('dotenv').config();
const { Client } = require('pg');

async function tryOnce(connStr, label) {
  const c = new Client({ connectionString: connStr, connectionTimeoutMillis: 20000 });
  c.on('error', () => {});
  const t = Date.now();
  try {
    await c.connect();
    await c.query('SELECT 1');
    const r = await c.query(
      `INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT ("id") DO NOTHING`,
      [999999999, 'TEST-SINGLE-INSERT', '2026', 'TestCity', 'TestName', 'test-link']
    );
    console.log(`✅ ${label}: insert OK (${Date.now() - t}ms)`);
  } catch (e) {
    console.log(`❌ ${label}: FAILED (${Date.now() - t}ms): ${e.message}`);
  } finally {
    await c.end().catch(() => {});
  }
}

async function main() {
  const base = process.env.DIRECT_URL;
  const variants = [
    { name: 'direct', connStr: base },
    { name: 'sslmode=disable', connStr: base.replace(/sslmode=[^&]*/, 'sslmode=disable') },
    { name: 'sslmode=no-verify', connStr: base.replace(/sslmode=[^&]*/, 'sslmode=no-verify') },
  ];

  for (let round = 1; round <= 3; round++) {
    console.log(`\n=== Round ${round} ===`);
    for (const v of variants) {
      await tryOnce(v.connStr, v.name);
    }
  }
}

main().catch((e) => {
  console.error('MAIN FAILED:', e.message);
  process.exit(1);
});

