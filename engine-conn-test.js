// Test Prisma schema engine native connection with various URL configurations
const { spawn } = require('child_process');
const path = require('path');

const enginePath = path.join(__dirname, 'node_modules', '@prisma', 'engines', 'schema-engine-windows.exe');

const host = 'ep-frosty-dew-a4gvwvk7.us-east-1.aws.neon.tech';
const poolerHost = 'ep-frosty-dew-a4gvwvk7-pooler.us-east-1.aws.neon.tech';
const user = 'default';
const pass = 'dx2KaDstUw5u';
const db = 'verceldb';

const urls = [
  { name: 'direct-ssl-require', url: `postgresql://${user}:${pass}@${host}/${db}?sslmode=require` },
  { name: 'direct-no-ssl-params', url: `postgresql://${user}:${pass}@${host}/${db}` },
  { name: 'direct-ssl-no-verify', url: `postgresql://${user}:${pass}@${host}/${db}?sslmode=no-verify` },
  { name: 'direct-ssl-verify-full', url: `postgresql://${user}:${pass}@${host}/${db}?sslmode=verify-full` },
  { name: 'direct-ssl-disable', url: `postgresql://${user}:${pass}@${host}/${db}?sslmode=disable` },
  { name: 'pooler-ssl-require', url: `postgresql://${user}:${pass}@${poolerHost}/${db}?sslmode=require` },
  { name: 'pooler-ssl-noverify', url: `postgresql://${user}:${pass}@${poolerHost}/${db}?sslmode=no-verify` },
  { name: 'direct-ip4-noverify', url: `postgresql://${user}:${pass}@34.196.24.162:5432/${db}?sslmode=no-verify` },
  { name: 'direct-require+verify-full', url: `postgresql://${user}:${pass}@${host}/${db}?sslmode=require&ssl=true` },
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
    const timer = setTimeout(() => { proc.kill(); }, 20000);
    proc.stdout.on('data', d => { out += d.toString(); });
    proc.stderr.on('data', d => { err += d.toString(); });
    proc.on('close', (code) => {
      clearTimeout(timer);
      const combined = (out + err).trim();
      resolve({ name, code, result: combined.slice(0, 600) });
    });
  });
}

(async () => {
  for (const t of urls) {
    const r = await run(t.url, t.name);
    console.log(`\n=== ${r.name} (exit ${r.code}) ===`);
    console.log(r.result || '(no output)');
  }
})();

