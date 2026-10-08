// Test if keepalive + periodic SELECT 1 keeps the connection alive for many batches
require('dotenv').config();
const { Client } = require('pg');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 15000,
    query_timeout: 45000,
    keepalive: true,
    keepalivesInterval: 10000, // 10 sec keepalive (pg defaults)
  });
  client.on('error', () => {});
  await client.connect();
  console.log('Connected');

  const data = require('./prisma/data.json');
  // Use ids 400000000+ for test data (fresh range)
  let base = 400000000;

  for (let batch = 1; batch <= 20; batch++) {
    const chunk = data.slice(0, 50);
    const ids = chunk.map((r, i) => base + i);
    const numbers = chunk.map(r => r.userNumber ?? null);
    const years = chunk.map(r => r.userYear ?? null);
    const cities = chunk.map(r => r.userCity ?? null);
    const names = chunk.map(r => r.userName ?? null);
    const links = chunk.map(r => r.userLink ?? null);

    const t = Date.now();
    try {
      const sql = `
        INSERT INTO "Payment" ("id","userNumber","userYear","userCity","userName","userLink")
        SELECT * FROM unnest($1::int[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[])`;
      await client.query(sql, [ids, numbers, years, cities, names, links]);
      console.log(`✅ batch ${batch}: 50 rows OK (${Date.now() - t}ms)`);
      base += 50;
      // Keepalive: send SELECT 1 every 5 batches
      if (batch % 5 === 0) {
        await client.query('SELECT 1');
        console.log('  ↳ keepalive ping');
      }
    } catch (e) {
      console.log(`❌ batch ${batch}: FAILED (${Date.now() - t}ms): ${e.message}`);
      // Try to reconnect
      await client.end().catch(() => {});
      console.log('  ↳ reconnecting...');
      const c2 = new Client({
        connectionString: process.env.DIRECT_URL,
        connectionTimeoutMillis: 15000,
        query_timeout: 45000,
        keepalive: true,
        keepalivesInterval: 10000,
      });
      c2.on('error', () => {});
      await c2.connect();
      console.log('  ↳ reconnected');
      // We can't reassign const, but we'll just continue with the test
      break;
    }
  }

  await client.end().catch(() => {});
  console.log('Done.');
}

main().catch((e) => {
  console.error('MAIN FAILED:', e.message);
  process.exit(1);
});
