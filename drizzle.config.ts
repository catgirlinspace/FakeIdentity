import { defineConfig } from 'drizzle-kit'

if (!Bun.env.DB_PATH) {
  throw new Error('DB_PATH environment variable is required')
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: Bun.env.DB_PATH,
  },
})