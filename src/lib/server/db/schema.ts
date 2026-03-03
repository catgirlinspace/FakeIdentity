import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	username: text('username').notNull(),
	name: text('name').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const casServiceTokens = sqliteTable('cas_service_tokens', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	service: text('service').notNull(),
	token: text('token').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	isValid: integer('is_valid', { mode: 'boolean' }).notNull().default(true),
	accountId: text('account_id').references(() => accounts.id),
});
