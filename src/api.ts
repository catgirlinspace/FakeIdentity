import { Elysia, t } from "elysia"
import { xml } from "elysia-xml"
import { validateCasTicket } from "@/cas/validation.ts"
import { db } from "@/db"
import { accountsTable, casServiceTicketsTable } from "@/db/schema.ts"

export const api = new Elysia({ prefix: "/api" })
	.get("/hello", () => ({
		message: "Hello, world!",
		method: "GET",
	}))
	.put("/hello", () => ({
		message: "Hello, world!",
		method: "PUT",
	}))
	.get("/hello/:name", ({ params }) => ({
		message: `Hello, ${params.name}!`,
	}))
	.get("/accounts", () => {
		return db.select().from(accountsTable).all()
	})
	.post(
		"/cas/authenticate",
		async ({ body }) =>
			(
				await db
					.insert(casServiceTicketsTable)
					.values({
						service: body.service,
						ticket: `ST-${crypto.randomUUID()}`,
						userId: body.userId,
					})
					.returning({ ticket: casServiceTicketsTable.ticket })
			)[0]!,
		{ body: t.Object({ service: t.String(), userId: t.Integer() }) },
	)
	.all("/cas/validate", async ({ query }) => {
		try {
			const validatedTicket = await validateCasTicket(
				query.ticket!,
				query.service!,
			)
			return `yes\n${validatedTicket.users.username}\n`
		} catch (_error) {
			return "no\n"
		}
	})
	.all("/cas/serviceValidate", async ({ query }) => {
		try {
			const validatedTicket = await validateCasTicket(
				query.ticket!,
				query.service!,
			)
			return `<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
 <cas:authenticationSuccess>
  <cas:user>${validatedTicket.users.username}</cas:user>
 </cas:authenticationSuccess>
</cas:serviceResponse>
`
		} catch (_error) {
			return `<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
 <cas:authenticationFailure code="INVALID_TICKET">
    Ticket ${query.ticket} not recognized
  </cas:authenticationFailure>
</cas:serviceResponse>`
		}
	})

export type ApiApp = typeof api
