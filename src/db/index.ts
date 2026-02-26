import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './schema'

if (!Bun.env.DB_PATH) {
  throw new Error('DB_PATH environment variable is required')
}

const sqlite = new Database(Bun.env.DB_PATH, { create: true })
sqlite.run('PRAGMA journal_mode=WAL;')

export const db = drizzle(sqlite, { schema })
export { schema }