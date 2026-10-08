// Test COPY-based bulk load using pg-copy-streams (v7 API: pcs.from)
require('dotenv').config();
const { Client } = require('pg');
const pcs = require('pg-copy-streams');
const { Readable } = require('stream');

function rowsToCsv(rows) {
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  let out = 'id,userNumber,userYear,userCity,userName,userLink\n';
  for (const r of rows) {
    out += [r.id, esc(r.userNumber), esc(r.userYear), esc(r.userCity), esc(r.userName), esc(r.userLink)].join(',') + '\n';
  }
  return out;
}

async function copyOnce(rows, label) {
  const client = new Client({
    connectionString: process.env.DIRECT_URL,
    connectionTimeoutMillis: 15000,
    query_timeout: 120000,
  });
  client.on('error', () => {});
  const t = Date.now();
  try {
    await client.connect();
    await client.query('SELECT 1');
    const csv = rowsToCsv(rows);
    const rs = Readable.from([csv]);
    // v7 API: pcs.from returns a Writable stream for COPY FROM STDIN
    const ingest = client.query(pcs.from('COPY "Payment" FROM STDIN WITH (FORMAT csv, HEADER true)'));
    await new Promise((resolve, reject) => {
      rs.pipe(ingest);
      ingest.on('finish', resolve);
      ingest.on('error', reject);
    });
    console.log(`✅ ${label}: ${rows.length} rows OK in ${Date.now() - t}ms`);
    await client.end().catch(() => {});
    return true;
  } catch (e) {
    console.log(`❌ ${label}: ${rows.length} rows FAILED in ${Date.now() - t}ms: ${e.message}`);
    await client.end().catch(() => {});
    return false;
  }
}

(async () => {
  const data = require('./prisma/data.json');
  let base = 500000000;
  for (const size of [100, 500, 1000, 5000, 10000]) {
    const rows = data.slice(0, size).map((r, i) => ({
      id: base + i,
      userNumber: r.userNumber,
      userYear: r.userYear,
      userCity: r.userCity,
      userName: r.userName,
      userLink: r.userLink,
    }));
    const ok = await copyOnce(rows, `size-${size}`);
    base += size;
    if (!ok) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log('\nDone.');
})().catch((e) => { console.error('MAIN FAILED:', e.message); process.exit(1); });
