import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// Strip channel_binding from a Postgres connection string.
// Neon does not support SCRAM channel binding; including
// channel_binding=require makes the Prisma engine's connection
// closed by the server (P1017). The pg driver tolerates it, but
// the Prisma engine does not.
function cleanUrl(url: string): string {
  try {
    const u = new URL(url)
    u.searchParams.delete('channel_binding')
    return u.toString()
  } catch {
    return url
  }
}

const rawUrl = process.env.DIRECT_URL
if (!rawUrl) {
  throw new Error('DIRECT_URL is not set')
}
const directUrl = cleanUrl(rawUrl)

console.log('DIRECT_URL:', directUrl)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { 
    path: 'prisma/migrations',
    seed: 'prisma/seed.js'
   },
  datasource: {
    url: directUrl,
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
