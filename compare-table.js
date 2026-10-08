require('dotenv').config();
const { Pool } = require('pg');

function normalize(v) {
  return v === null || v === undefined ? null : String(v);
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DIRECT_URL, connectionTimeoutMillis: 20000, max: 1 });
  const data = require('./prisma/data.json');

  var expected = new Map();
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var hash = JSON.stringify([
      normalize(row.userNumber),
      normalize(row.userYear),
      normalize(row.userCity),
      normalize(row.userName),
      normalize(row.userLink)
    ]);
    expected.set(i, hash);
  }

  console.log('data.json records:', data.length);

  const res = await pool.query('SELECT id, "userNumber", "userYear", "userCity", "userName", "userLink" FROM "Payment" ORDER BY id');
  console.log('DB total rows:', res.rowCount);

  var badInRange = 0;
  var outOfRange = 0;
  var missing = 0;
  var samples = [];

  var dbMap = new Map();
  for (var j = 0; j < res.rows.length; j++) {
    dbMap.set(res.rows[j].id, res.rows[j]);
  }

  expected.forEach(function (hash, id) {
    var row = dbMap.get(id);
    if (!row) {
      missing++;
      if (samples.length < 10) samples.push({ id: id, issue: 'MISSING' });
      return;
    }
    var dbHash = JSON.stringify([
      normalize(row.userNumber),
      normalize(row.userYear),
      normalize(row.userCity),
      normalize(row.userName),
      normalize(row.userLink)
    ]);
    if (dbHash !== hash) {
      badInRange++;
      if (samples.length < 10) samples.push({ id: id, issue: 'CONTENT_MISMATCH', db: row });
    }
  });

  for (var k = 0; k < res.rows.length; k++) {
    var r = res.rows[k];
    if (!expected.has(r.id)) {
      outOfRange++;
      if (samples.length < 10) samples.push({ id: r.id, issue: 'NOT_IN_DATAJSON', row: r });
    }
  }

  console.log('Missing (in data.json, not in DB):', missing);
  console.log('Content mismatches (in range):', badInRange);
  console.log('Rows with id not in data.json:', outOfRange);
  console.log('Samples:', JSON.stringify(samples, null, 2));

  await pool.end();
}

main().catch(function (e) {
  console.error('FAILED:', e.message);
  process.exit(1);
});

