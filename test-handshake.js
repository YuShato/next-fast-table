// Measure connection handshake time for sslmode=require vs no-verify
require('dotenv').config();
const { Client } = require('pg');

async function measure(connStr, label, rounds) {
  let total = 0;
  for (let i = 0; i < rounds; i++) {
    const t = Date.now();
    const c = new Client({ connectionString: connStr, connectionTimeoutMillis: 15000 });
    c.on('error', () => {});
    try {
      await c.connect();
      await c.query('SELECT 1');
      total += Date.now() - t;
      await c.end().catch(() => {});
    } catch (e) {
      console.log(`❌ ${label} round ${i + 1}: ${e.message}`);
      await c.end().catch(() => {});
    }
  }
  console.log(`${label}: avg handshake ${Math.round(total / rounds)}ms over ${rounds} rounds`);
}

(async () => {
  const base = process.env.DIRECT_URL;
  await measure(base, 'require', 5);
  const noVerify = base.replace(/sslmode=[^&]*/, 'sslmode=no-verify');
  await measure(noVerify, 'no-verify', 5);
})();

