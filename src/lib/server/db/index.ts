import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DB_PATH) throw new Error('DB_PATH is not set');

export const db = drizzle(env.DB_PATH, { schema });
