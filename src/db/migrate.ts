import { migrate } from 'drizzle-orm/bun-sqlite/migrator'
import { db } from './index'

export function runMigrations() {
  migrate(db, { migrationsFolder: './drizzle' })
  console.log('✅ Migrations applied.')
}

if (import.meta.main) {
  runMigrations()
}