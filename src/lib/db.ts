import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  var prisma: PrismaClient | undefined
}

// Neon does not support SCRAM channel binding. `channel_binding=require`
// in the connection string is harmless for the pg driver, but it is safer
// to drop it so all consumers use the same cleaned URL.
function cleanUrl(url: string): string {
  try {
    const u = new URL(url)
    u.searchParams.delete('channel_binding')
    return u.toString()
  } catch {
    return url
  }
}

function createClient() {
  const connectionString = process.env.DIRECT_URL
  if (!connectionString) throw new Error('DIRECT_URL is not set')

  const pool = new Pool({ connectionString: cleanUrl(connectionString) })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const db = globalThis.prisma || createClient()
export default db

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
