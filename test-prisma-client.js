require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const connectionString = process.env.DIRECT_URL;
  console.log('Connecting with DIRECT_URL...');
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 10000 });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const result = await prisma.$queryRaw`SELECT NOW() as now`;
  console.log('Prisma Client Query result:', result);
  await prisma.$disconnect();
  await pool.end();
  console.log('SUCCESS');
}

main().catch((e) => {
  console.error('Prisma Client FAILED:', e.message || e);
  process.exit(1);
});

