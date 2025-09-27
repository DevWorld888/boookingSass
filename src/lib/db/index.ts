
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { users } from './schema'

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  return connectionString
}

// Lazy initialization of the database connection
let _db: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (!_db) {
    const connectionString = getConnectionString()
    // Disable prefetch as it is not supported for "Transaction" pool mode
    const client = postgres(connectionString, { prepare: false })
    _db = drizzle(client)
  }
  return _db
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>]
  }
});

// Export a function to get users instead of top-level await
export async function getAllUsers() {
  return await db.select().from(users);
}
        