import type {RequestHandler} from '@sveltejs/kit'
import {db} from '$lib/server/db'
import {accounts, casServiceTokens} from '$lib/server/db/schema'
import {and, eq} from 'drizzle-orm'

export const GET: RequestHandler = async ({ url }) => {
	const ticket = url.searchParams.get('ticket')

	if (!ticket) {
		return new Response("no\n")
	}

	const service = url.searchParams.get('service')

	if (!service) {
		return new Response("no\n")
	}

	const tokens = await db.select().from(casServiceTokens).where(and(
		eq(casServiceTokens.isValid, true),
		eq(casServiceTokens.service, service),
		eq(casServiceTokens.token, ticket)
	)).innerJoin(accounts, eq(casServiceTokens.accountId, accounts.id))
	const token = tokens[0]

	if (!token) {
		return new Response("no\n")
	}

	await db.update(casServiceTokens).set({isValid: false}).where(eq(casServiceTokens.token, token.cas_service_tokens.token))

	if (token.cas_service_tokens.service !== service) {
		return new Response("no\n");
	}

	return new Response(`yes
${token.accounts.username}
`)
}

export const POST: RequestHandler = GET


