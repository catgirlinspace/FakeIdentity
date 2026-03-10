<script lang="ts">
	import { createOidcClient } from './createOidcClient.remote';
	import { createCasService } from './createCasService.remote';
	import Button from '$lib/components/Button.svelte';
	import { X } from 'lucide-svelte';

	let activeTab = $state<'oidc' | 'cas'>('oidc');
	let redirectUris = $state<string[]>(['']);

	function addUri() {
		redirectUris.push('');
	}

	function removeUri(index: number) {
		redirectUris.splice(index, 1);
	}
</script>

<svelte:head>
	<title>Create Application</title>
</svelte:head>

<h1 class="text-2xl font-bold">Create Application</h1>
<span class="text-lg text-nas-purple-700">Register a new OIDC client or CAS service</span>

<div class="flex gap-0 mt-4">
	<button
		class="px-4 py-2 font-semibold border border-nas-purple {activeTab === 'oidc' ? 'bg-nas-purple-600 text-nas-pink-50' : 'bg-white text-nas-purple-700'}"
		onclick={() => (activeTab = 'oidc')}
	>
		OIDC Client
	</button>
	<button
		class="px-4 py-2 font-semibold border border-nas-purple border-l-0 {activeTab === 'cas' ? 'bg-nas-purple-600 text-nas-pink-50' : 'bg-white text-nas-purple-700'}"
		onclick={() => (activeTab = 'cas')}
	>
		CAS Service
	</button>
</div>

{#if activeTab === 'oidc'}
	<form {...createOidcClient} class="flex flex-col gap-2 mt-4">
		<label>
			<span class="block text-sm text-nas-purple-600">Name</span>
			<input {...createOidcClient.fields.name.as('text')} class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3" />
		</label>
		<div>
			<span class="block text-sm text-nas-purple-600">Redirect URIs</span>
			{#each redirectUris as uri, i (i)}
				<div class="flex items-center gap-2 mt-1">
					<input
						type="text"
						bind:value={redirectUris[i]}
						placeholder="https://example.com/callback"
						class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
					/>
					<button type="button" onclick={() => removeUri(i)} class="text-red-500 hover:text-red-700 p-1">
						<X size={16} />
					</button>
				</div>
			{/each}
			<button type="button" onclick={addUri} class="text-sm text-nas-purple-600 hover:text-nas-purple-800 mt-2">
				+ Add redirect URI
			</button>
			<input type="hidden" name="redirectUris" value={redirectUris.filter(u => u.trim()).join('\n')} />
		</div>
		<p class="text-sm text-nas-purple-500">Client ID and secret will be auto-generated.</p>
		<Button>Create OIDC Client</Button>
	</form>
{:else}
	<form {...createCasService} class="flex flex-col gap-2 mt-4">
		<label>
			<span class="block text-sm text-nas-purple-600">Name</span>
			<input {...createCasService.fields.name.as('text')} class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3" />
		</label>
		<label>
			<span class="block text-sm text-nas-purple-600">Service URL</span>
			<input {...createCasService.fields.serviceUrl.as('text')} class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3" />
		</label>
		<Button>Create CAS Service</Button>
	</form>
{/if}
