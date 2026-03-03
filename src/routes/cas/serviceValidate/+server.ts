import type {RequestHandler} from '@sveltejs/kit'
import {db} from '$lib/server/db'
import {accounts, casServiceTokens} from '$lib/server/db/schema'
import {and, eq} from 'drizzle-orm'

export const GET: RequestHandler = async ({ url }) => {
	const ticket = url.searchParams.get('ticket')

	if (!ticket) {
		return new Response(`<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
 <cas:authenticationFailure code="INVALID_REQUEST">
    Ticket not provided
  </cas:authenticationFailure>
</cas:serviceResponse>`, { status: 400 })
	}

	const service = url.searchParams.get('service')

	if (!service) {
		return new Response(`<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
 <cas:authenticationFailure code="INVALID_REQUEST">
    Service not provided
  </cas:authenticationFailure>
</cas:serviceResponse>`, { status: 400 })
	}

	const tokens = await db.select().from(casServiceTokens).where(and(
		eq(casServiceTokens.isValid, true),
		eq(casServiceTokens.service, service),
		eq(casServiceTokens.token, ticket)
	)).innerJoin(accounts, eq(casServiceTokens.accountId, accounts.id))
	const token = tokens[0]

	if (!token) {
		return new Response(`<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
 <cas:authenticationFailure code="INVALID_TICKET">
    Ticket ${ticket} not recognized
  </cas:authenticationFailure>
</cas:serviceResponse>`, { status: 400 })
	}

	await db.update(casServiceTokens).set({isValid: false}).where(eq(casServiceTokens.token, token.cas_service_tokens.token))

	if (token.cas_service_tokens.service !== service) {
		return new Response(`<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
 <cas:authenticationFailure code="INVALID_SERVICE">
   	Service ${service} does not match the service the ticket was issued for.
  </cas:authenticationFailure>
</cas:serviceResponse>`, { status: 400 })
	}

	return new Response(`<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
 <cas:authenticationSuccess>
  <cas:user>${token.accounts.username}</cas:user>
 </cas:authenticationSuccess>
</cas:serviceResponse>
`)
}

export const POST: RequestHandler = GET
