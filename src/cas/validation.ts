import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { accountsTable, casServiceTicketsTable } from "@/db/schema.ts"

export async function validateCasTicket(ticket: string, service: string) {
	if (!ticket) {
		throw new Error("Ticket cannot be empty")
	}
	if (!service) {
		throw new Error("Service cannot be empty")
	}
	const ticketRecord = db
		.select()
		.from(casServiceTicketsTable)
		.where(
			and(
				eq(casServiceTicketsTable.ticket, ticket),
				eq(casServiceTicketsTable.service, service),
				eq(casServiceTicketsTable.isValid, true),
			),
		)
		.innerJoin(
			accountsTable,
			eq(accountsTable.id, casServiceTicketsTable.userId),
		)
		.get()
	if (!ticketRecord) {
		throw new Error("Ticket not found")
	}

	await db
		.update(casServiceTicketsTable)
		.set({ isValid: false })
		.where(eq(casServiceTicketsTable.ticket, ticket))

	return ticketRecord
}
