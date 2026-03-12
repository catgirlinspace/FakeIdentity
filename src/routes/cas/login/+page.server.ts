import { db } from '$lib/server/db';
import { accounts, casServices, casServiceTokens } from '$lib/server/db/schema';
import { isAllowAnyService } from '$lib/server/db/settings';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const service = url.searchParams.get('service');
	if (!service) {
		error(400, 'Missing service parameter');
	}

	const allowAny = await isAllowAnyService();
	if (!allowAny) {
		const registered = await db.select().from(casServices).where(eq(casServices.serviceUrl, service)).get();
		if (!registered) {
			error(400, 'Service URL is not registered');
		}
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

		const allowAny = await isAllowAnyService();
		const registered = await db.select().from(casServices).where(eq(casServices.serviceUrl, service)).get();
		if (allowAny) {
			if (!registered) {
				await db.insert(casServices).values({
					name: `Auto: ${service}`,
					serviceUrl: service,
				});
			}
		} else {
			if (!registered) {
				error(400, 'Service URL is not registered');
			}
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
