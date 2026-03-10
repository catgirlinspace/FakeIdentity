import { db } from '$lib/server/db';
import { accounts, oidcAuthorizationCodes, oidcClients } from '$lib/server/db/schema';
import { isAllowAnyService } from '$lib/server/db/settings';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const responseType = url.searchParams.get('response_type');
	const clientId = url.searchParams.get('client_id');
	const redirectUri = url.searchParams.get('redirect_uri');
	const scope = url.searchParams.get('scope');
	const state = url.searchParams.get('state');
	const nonce = url.searchParams.get('nonce');

	if (!clientId) {
		error(400, 'Missing client_id parameter');
	}

	if (!redirectUri) {
		error(400, 'Missing redirect_uri parameter');
	}

	const allowAny = await isAllowAnyService();
	const client = await db.select().from(oidcClients).where(eq(oidcClients.clientId, clientId)).get();

	if (allowAny) {
		// Accept any client; use registered name if available, otherwise fall back to clientId
		const clientName = client?.name ?? clientId;

		if (responseType !== 'code') {
			error(400, 'Unsupported response_type (must be "code")');
		}
		if (!scope || !scope.split(' ').includes('openid')) {
			error(400, 'scope must include "openid"');
		}

		const accountsList = await db.select().from(accounts);
		return {
			accounts: accountsList,
			clientName,
			clientId,
			redirectUri,
			scope,
			state: state ?? '',
			nonce: nonce ?? '',
		};
	}

	// Strict mode: validate client and redirect_uri
	if (!client) {
		error(400, 'Unknown client_id');
	}

	const allowedUris: string[] = JSON.parse(client.redirectUris);
	if (!allowedUris.includes(redirectUri)) {
		error(400, 'redirect_uri not registered for this client');
	}

	if (responseType !== 'code') {
		error(400, 'Unsupported response_type (must be "code")');
	}

	if (!scope || !scope.split(' ').includes('openid')) {
		error(400, 'scope must include "openid"');
	}

	const accountsList = await db.select().from(accounts);

	return {
		accounts: accountsList,
		clientName: client.name,
		clientId,
		redirectUri,
		scope,
		state: state ?? '',
		nonce: nonce ?? '',
	};
};

export const actions: Actions = {
	authorize: async ({ request }) => {
		const formData = await request.formData();
		const accountId = formData.get('accountId') as string;
		const clientId = formData.get('clientId') as string;
		const redirectUri = formData.get('redirectUri') as string;
		const state = formData.get('state') as string;
		const nonce = formData.get('nonce') as string;
		const grantedScopes = formData.get('grantedScopes') as string;

		if (!accountId) {
			return { error: 'No account selected' };
		}

		const allowAny = await isAllowAnyService();
		let client = await db.select().from(oidcClients).where(eq(oidcClients.clientId, clientId)).get();

		if (allowAny) {
			// Auto-insert client if it doesn't exist (to satisfy FK on authorization codes)
			if (!client) {
				await db.insert(oidcClients).values({
					clientId,
					clientSecret: crypto.randomUUID(),
					name: `Auto: ${clientId}`,
					redirectUris: JSON.stringify([redirectUri]),
				});
			}
		} else {
			if (!client) {
				error(400, 'Unknown client_id');
			}

			const allowedUris: string[] = JSON.parse(client.redirectUris);
			if (!allowedUris.includes(redirectUri)) {
				error(400, 'redirect_uri not registered for this client');
			}
		}

		// Validate granted scopes
		const granted = grantedScopes.split(' ').filter(Boolean);
		if (!granted.includes('openid')) {
			error(400, 'openid scope is required');
		}

		const code = crypto.randomUUID();

		await db.insert(oidcAuthorizationCodes).values({
			code,
			clientId,
			redirectUri,
			accountId,
			scope: granted.join(' '),
			nonce: nonce || null,
			expiresAt: Math.floor(Date.now() / 1000) + 600, // 10 minutes
		});

		const target = new URL(redirectUri);
		target.searchParams.set('code', code);
		if (state) {
			target.searchParams.set('state', state);
		}

		redirect(302, target.toString());
	}
};
