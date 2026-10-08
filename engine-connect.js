// Test the Prisma schema engine's native connection (JSON-RPC over stdio)
const { spawn } = require('child_process');
const path = require('path');

const enginePath = path.join(__dirname, 'node_modules', '@prisma', 'engines', 'schema-engine-windows.exe');
const url = process.env.DIRECT_URL || 'postgresql://default:dx2KaDstUw5u@ep-frosty-dew-a4gvwvk7.us-east-1.aws.neon.tech/verceldb?sslmode=require';

const schema = `generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = "${url}"
}
model Payment {
  id         Int     @id @default(autoincrement())
  userNumber String?
  userYear   String?
  userCity   String?
  userName   String?
  userLink   String?
}`;

const datasourceJson = JSON.stringify({ activeProvider: 'postgresql', url });
const proc = spawn(enginePath, ['--datasource', datasourceJson], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, RUST_LOG: 'debug' },
});

let stdout = '';
let stderr = '';
proc.stdout.on('data', d => { stdout += d.toString(); });
proc.stderr.on('data', d => { stderr += d.toString(); });

const rpc = (method, params) => JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) + '\n';

// Send getDatabaseDescription to trigger a connection
proc.stdin.write(rpc('introspect', { schema, baseConfig: { datasource: { activeProvider: 'postgresql', url } } }));

setTimeout(() => {
  proc.kill();
  console.log('=== STDOUT ===');
  console.log(stdout.slice(0, 4000));
  console.log('=== STDERR ===');
  console.log(stderr.slice(0, 4000));
  process.exit(0);
}, 25000);

