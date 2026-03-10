import { db } from '$lib/server/db';
import { casServices, oidcAuthorizationCodes, oidcClients } from '$lib/server/db/schema';
import { isAllowAnyService, setSetting } from '$lib/server/db/settings';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [oidc, cas, allowAny] = await Promise.all([
		db.select().from(oidcClients),
		db.select().from(casServices),
		isAllowAnyService(),
	]);
	return { oidcClients: oidc, casServices: cas, allowAnyService: allowAny };
};

export const actions: Actions = {
	toggleAllowAny: async () => {
		const current = await isAllowAnyService();
		await setSetting('allowAnyService', current ? 'false' : 'true');
	},
	deleteOidcClient: async ({ request }) => {
		const formData = await request.formData();
		const clientId = formData.get('clientId') as string;
		await db.delete(oidcAuthorizationCodes).where(eq(oidcAuthorizationCodes.clientId, clientId));
		await db.delete(oidcClients).where(eq(oidcClients.clientId, clientId));
	},
	deleteCasService: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		await db.delete(casServices).where(eq(casServices.id, id));
	},
};
