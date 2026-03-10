import { form } from '$app/server';
import { type } from 'arktype';
import { db } from '$lib/server/db';
import { oidcClients } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

export const createOidcClient = form(
	type({
		name: 'string > 0',
		redirectUris: 'string > 0',
	}),
	async ({ name, redirectUris }) => {
		const uris = redirectUris
			.split('\n')
			.map((u) => u.trim())
			.filter(Boolean);
		await db.insert(oidcClients).values({
			clientId: crypto.randomUUID(),
			clientSecret: crypto.randomUUID(),
			name,
			redirectUris: JSON.stringify(uris),
		});
		redirect(303, '/applications');
	}
);
