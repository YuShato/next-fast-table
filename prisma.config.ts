import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { 
    path: 'prisma/migrations',
    seed: 'prisma/seed.js'
  },
  datasource: {
    url: process.env.DATABASE_URL, // Используем process.env.DATABASE_URL напрямую
  },
});

// import { defineConfig } from '@prisma/config'

// export default defineConfig({
//   schema: 'prisma/schema.prisma',
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL!,
//     },
//   },
// })
