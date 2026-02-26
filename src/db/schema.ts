import { relations } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

// Define your tables here
// Example:
export const accountsTable = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	username: text("username").notNull(),
	name: text("name").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
		() => new Date(),
	),
})

export const casServiceTicketsTable = sqliteTable("cas_service_tickets", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	service: text("service").notNull(),
	ticket: text("token").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
		() => new Date(),
	),
	userId: integer("user_id").notNull(),
	isValid: integer("is_valid", { mode: "boolean" }).notNull().default(true),
})

export const casServiceTicketsRelations = relations(
	casServiceTicketsTable,
	({ one }) => ({
		user: one(accountsTable, {
			fields: [casServiceTicketsTable.userId],
			references: [accountsTable.id],
		}),
	}),
)

export type Account = typeof accountsTable.$inferInsert
export type CasServiceTicket = typeof casServiceTicketsTable.$inferInsert
