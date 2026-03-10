import { form } from '$app/server';
import { type } from 'arktype';
import { db } from '$lib/server/db';
import { casServices } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const editCasService = form(
	type({
		id: 'string > 0',
		name: 'string > 0',
		serviceUrl: 'string > 0',
	}),
	async ({ id, name, serviceUrl }) => {
		await db
			.update(casServices)
			.set({ name, serviceUrl })
			.where(eq(casServices.id, id));
		redirect(303, '/applications');
	}
);
