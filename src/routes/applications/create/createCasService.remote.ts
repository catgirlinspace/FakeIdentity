import { form } from '$app/server';
import { type } from 'arktype';
import { db } from '$lib/server/db';
import { casServices } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

export const createCasService = form(
	type({
		name: 'string > 0',
		serviceUrl: 'string > 0',
	}),
	async ({ name, serviceUrl }) => {
		await db.insert(casServices).values({ name, serviceUrl });
		redirect(303, '/applications');
	}
);
