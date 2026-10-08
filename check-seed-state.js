require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  // 1. data.json rows count
  const dataPath = path.join('prisma', 'data.json');
  if (fs.existsSync(dataPath)) {
    const arr = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    console.log('data.json rows:', arr.length);
    if (arr.length > 0) {
      console.log('  first id:', arr[0].id, 'last id:', arr[arr.length - 1].id);
    }
  } else {
    console.log('data.json: NOT FOUND');
  }

  // 2. seed-checkpoint.json
  const cpPath = path.join('prisma', 'seed-checkpoint.json');
  console.log('seed-checkpoint.json exists:', fs.existsSync(cpPath));
  if (fs.existsSync(cpPath)) {
    console.log('  content:', fs.readFileSync(cpPath, 'utf8').slice(0, 300));
  }

  // 3. DB max id and count
  const client = new Client({ connectionString: process.env.DIRECT_URL });
  await client.connect();
  const r = await client.query('SELECT count(*)::int AS total, COALESCE(max(id),0)::int AS max_id FROM "Payment"');
  console.log('Payment count:', r.rows[0].total, 'max id:', r.rows[0].max_id);
  await client.end();
}

main().catch((e) => {
  console.error('ERR', e.message);
  process.exit(1);
});

