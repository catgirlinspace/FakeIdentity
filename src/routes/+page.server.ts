import type {PageServerLoad} from '../../.svelte-kit/types/src/routes/cas/login/$types'
import {db} from '$lib/server/db'
import {accounts} from '$lib/server/db/schema'

export const load: PageServerLoad = async ({ url }) => {
	const accountsList = await db.select().from(accounts);
	return { accounts: accountsList };
};