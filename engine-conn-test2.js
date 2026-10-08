// Confirm the working URL combination for Prisma schema engine
const { spawn } = require('child_process');
const path = require('path');

const enginePath = path.join(__dirname, 'node_modules', '@prisma', 'engines', 'schema-engine-windows.exe');

const host = 'ep-frosty-dew-a4gvwvk7.us-east-1.aws.neon.tech';
const poolerHost = 'ep-frosty-dew-a4gvwvk7-pooler.us-east-1.aws.neon.tech';
const user = 'default';
const pass = 'dx2KaDstUw5u';
const db = 'verceldb';

const urls = [
  { name: 'pooler-noverify', url: `postgresql://${user}:${pass}@${poolerHost}/${db}?sslmode=no-verify` },
  { name: 'pooler-noverify+cb', url: `postgresql://${user}:${pass}@${poolerHost}/${db}?sslmode=no-verify&channel_binding=require` },
  { name: 'direct-noverify', url: `postgresql://${user}:${pass}@${host}/${db}?sslmode=no-verify` },
  { name: 'pooler-require-nocb', url: `postgresql://${user}:${pass}@${poolerHost}/${db}?sslmode=require` },
  { name: 'pooler-verify-full', url: `postgresql://${user}:${pass}@${poolerHost}/${db}?sslmode=verify-full` },
];

function run(url, name) {
  return new Promise((resolve) => {
    const ds = JSON.stringify({ activeProvider: 'postgresql', url });
    const proc = spawn(enginePath, ['--datasource', ds, 'cli', 'can-connect-to-database'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, RUST_LOG: 'error' },
    });
    let out = '';
    let err = '';
    const timer = setTimeout(() => { proc.kill(); }, 30000);
    proc.stdout.on('data', d => { out += d.toString(); });
    proc.stderr.on('data', d => { err += d.toString(); });
    proc.on('close', (code) => {
      clearTimeout(timer);
      const combined = (out + err).trim();
      resolve({ name, code, result: combined.slice(0, 400) });
    });
    proc.on('error', (e) => { clearTimeout(timer); resolve({ name, code: 'ERR', result: e.message }); });
  });
}

(async () => {
  for (const t of urls) {
    const r = await run(t.url, t.name);
    console.log(`\n=== ${r.name} (exit ${r.code}) ===`);
    console.log(r.result || '(no output)');
  }
})();

