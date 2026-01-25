import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { 
    path: 'prisma/migrations',
    seed: 'prisma/seed.js'
   },
  datasource: {
    url: env('DATABASE_URL'),
  },
  
})

// import { defineConfig } from '@prisma/config'

// export default defineConfig({
//   schema: 'prisma/schema.prisma',
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL!,
//     },
//   },
// })
