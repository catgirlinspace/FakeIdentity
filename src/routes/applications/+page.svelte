<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import { Pencil, Trash2 } from 'lucide-svelte';

	let { data } = $props();

	let allApps = $derived([
		...data.oidcClients.map((c) => ({ ...c, type: 'oidc' as const })),
		...data.casServices.map((s) => ({ ...s, type: 'cas' as const })),
	]);
</script>

<svelte:head>
	<title>Applications</title>
</svelte:head>

<h1 class="text-2xl font-bold">Applications</h1>
<span class="text-lg text-nas-purple-700">Manage OIDC clients and CAS services</span>

<div class="flex items-center gap-4 mt-4 p-4 bg-nas-purple-100 border border-nas-purple">
	<form method="POST" action="?/toggleAllowAny" use:enhance>
		<button
			type="submit"
			aria-label="Toggle allow any service"
			class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {data.allowAnyService ? 'bg-nas-purple-600' : 'bg-gray-300'}"
		>
			<span
				class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {data.allowAnyService ? 'translate-x-6' : 'translate-x-1'}"
			></span>
		</button>
	</form>
	<div>
		<p class="font-semibold">Allow any service</p>
		<p class="text-sm text-nas-purple-700">
			When enabled, OIDC and CAS endpoints accept any client/service URL without prior registration.
		</p>
	</div>
</div>

<div class="flex justify-end">
	<Button class="mt-5" type="link" href="/applications/create">+ New</Button>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
	{#each allApps as app (app.id)}
		<div class="bg-nas-purple-100 border border-nas-purple p-4">
			<div class="flex items-start justify-between">
				<div>
					<p class="text-xl font-semibold">{app.name}</p>
					{#if app.type === 'oidc'}
						<span class="inline-block text-xs font-semibold px-2 py-0.5 bg-purple-200 text-purple-800 mt-1">OIDC</span>
					{:else}
						<span class="inline-block text-xs font-semibold px-2 py-0.5 bg-green-200 text-green-800 mt-1">CAS</span>
					{/if}
				</div>
				<div class="flex items-center gap-1">
					<a href="/applications/{app.id}/edit" class="text-nas-purple-600 hover:text-nas-purple-800 p-1">
						<Pencil size={16} />
					</a>
					{#if app.type === 'oidc'}
						<form method="POST" action="?/deleteOidcClient" use:enhance>
							<input type="hidden" name="clientId" value={app.clientId} />
							<button type="submit" class="text-red-500 hover:text-red-700 p-1">
								<Trash2 size={16} />
							</button>
						</form>
					{:else}
						<form method="POST" action="?/deleteCasService" use:enhance>
							<input type="hidden" name="id" value={app.id} />
							<button type="submit" class="text-red-500 hover:text-red-700 p-1">
								<Trash2 size={16} />
							</button>
						</form>
					{/if}
				</div>
			</div>
			{#if app.type === 'oidc'}
				<p class="text-sm text-nas-purple-700 mt-2 break-all">
					<span class="font-medium">Client ID:</span> {app.clientId}
				</p>
				<p class="text-sm text-nas-purple-700 break-all">
					<span class="font-medium">Secret:</span> {app.clientSecret}
				</p>
			{:else}
				<p class="text-sm text-nas-purple-700 mt-2 break-all">
					<span class="font-medium">Service URL:</span> {app.serviceUrl}
				</p>
			{/if}
		</div>
	{/each}
</div>

{#if allApps.length === 0}
	<p class="text-nas-purple-500">No applications registered.</p>
{/if}
