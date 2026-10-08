require('dotenv').config();
const { Client } = require('pg');

const base = process.env.DIRECT_URL;

async function testFamily(family) {
  const client = new Client({
    connectionString: base,
    connectionTimeoutMillis: 15000,
    family, // 4 or 6
  });
  try {
    await client.connect();
    const res = await client.query('SELECT NOW() as now');
    console.log(`family=${family} -> SUCCESS`, res.rows[0]);
    await client.end();
    return true;
  } catch (e) {
    console.log(`family=${family} -> FAILED: ${e.message}`);
    try { await client.end(); } catch (_) {}
    return false;
  }
}

(async () => {
  const dns = require('dns').promises;
  const host = 'ep-frosty-dew-a4gvwvk7.us-east-1.aws.neon.tech';
  const addr = await dns.lookup(host, { all: true });
  console.log('DNS results:', addr);
  console.log('---');
  await testFamily(4);
  await testFamily(6);
})();

