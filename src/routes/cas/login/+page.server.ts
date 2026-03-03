import { db } from '$lib/server/db';
import { accounts, casServiceTokens } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const service = url.searchParams.get('service');
	if (!service) {
		error(400, 'Missing service parameter');
	}

	const accountsList = await db.select().from(accounts);
	return { accounts: accountsList, service };
};

export const actions: Actions = {
	authenticate: async ({ request, url }) => {
		const service = url.searchParams.get('service');
		if (!service) {
			error(400, 'Missing service parameter');
		}

		const formData = await request.formData();
		const accountId = formData.get('accountId') as string;

		if (!accountId) {
			return { error: 'No account selected' };
		}

		const ticket = `ST-${crypto.randomUUID()}`;

		await db.insert(casServiceTokens).values({
			service,
			token: ticket,
			accountId
		});

		redirect(302, `${service}?ticket=${ticket}`);
	}
};