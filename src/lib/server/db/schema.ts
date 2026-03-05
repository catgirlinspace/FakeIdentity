import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const accounts = sqliteTable('accounts', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	username: text('username').notNull(),
	name: text('name').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const oidcClients = sqliteTable('oidc_clients', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	clientId: text('client_id').notNull().unique(),
	clientSecret: text('client_secret').notNull(),
	name: text('name').notNull(),
	redirectUris: text('redirect_uris').notNull(), // JSON array
});

export const oidcAuthorizationCodes = sqliteTable('oidc_authorization_codes', {
	id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
	code: text('code').notNull().unique(),
	clientId: text('client_id').notNull().references(() => oidcClients.clientId),
	redirectUri: text('redirect_uri').notNull(),
	accountId: text('account_id').notNull().references(() => accounts.id),
	scope: text('scope').notNull(),
	nonce: text('nonce'),
	expiresAt: integer('expires_at').notNull(),
	isUsed: integer('is_used', { mode: 'boolean' }).notNull().default(false),
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
