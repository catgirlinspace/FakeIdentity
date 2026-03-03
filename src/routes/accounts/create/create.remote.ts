import {form} from '$app/server'
import {type} from 'arktype'
import {db} from '$lib/server/db'
import {accounts} from '$lib/server/db/schema'

export const createAccount = form(
	type({
		username: "string > 0",
		name: "string > 0",
	}),
	async ({ username, name }) => {
		await db.insert(accounts).values({username, name})
		return {success: true}
	}
)