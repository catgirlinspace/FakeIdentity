import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string): Promise<string | null> {
	const row = await db.select().from(settings).where(eq(settings.key, key)).get();
	return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
	await db
		.insert(settings)
		.values({ key, value })
		.onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function isAllowAnyService(): Promise<boolean> {
	const value = await getSetting('allowAnyService');
	return value !== 'false';
}
