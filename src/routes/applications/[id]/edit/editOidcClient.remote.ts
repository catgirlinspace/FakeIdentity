import { form } from '$app/server';
import { type } from 'arktype';
import { db } from '$lib/server/db';
import { oidcClients } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const editOidcClient = form(
	type({
		id: 'string > 0',
		name: 'string > 0',
		redirectUris: 'string > 0',
	}),
	async ({ id, name, redirectUris }) => {
		const uris = redirectUris
			.split('\n')
			.map((u) => u.trim())
			.filter(Boolean);
		await db
			.update(oidcClients)
			.set({ name, redirectUris: JSON.stringify(uris) })
			.where(eq(oidcClients.id, id));
		redirect(303, '/applications');
	}
);
