import { db } from '$lib/server/db';
import { casServices, oidcClients } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [oidc] = await db.select().from(oidcClients).where(eq(oidcClients.id, params.id));
	if (oidc) {
		return { type: 'oidc' as const, app: oidc };
	}

	const [cas] = await db.select().from(casServices).where(eq(casServices.id, params.id));
	if (cas) {
		return { type: 'cas' as const, app: cas };
	}

	error(404, 'Application not found');
};
