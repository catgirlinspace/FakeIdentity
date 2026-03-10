<script lang="ts">
	import { editOidcClient } from './editOidcClient.remote';
	import { editCasService } from './editCasService.remote';
	import Button from '$lib/components/Button.svelte';
	import { X } from 'lucide-svelte';

	let { data } = $props();

	let redirectUris = $state<string[]>(
		data.type === 'oidc' ? JSON.parse(data.app.redirectUris) : []
	);

	function addUri() {
		redirectUris.push('');
	}

	function removeUri(index: number) {
		redirectUris.splice(index, 1);
	}
</script>

<svelte:head>
	<title>Edit Application</title>
</svelte:head>

<h1 class="text-2xl font-bold">Edit Application</h1>
<span class="text-lg text-nas-purple-700">Update application settings</span>

{#if data.type === 'oidc'}
	<form {...editOidcClient} class="flex flex-col gap-2 mt-4">
		<input type="hidden" name="id" value={data.app.id} />
		<label>
			<span class="block text-sm text-nas-purple-600">Name</span>
			<input
				{...editOidcClient.fields.name.as('text')}
				value={data.app.name}
				class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
			/>
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

		<div class="mt-2">
			<span class="block text-sm text-nas-purple-600">Client ID</span>
			<input type="text" value={data.app.clientId} readonly class="p-2 border border-nas-purple bg-gray-100 w-full sm:w-2/3 md:w-1/2 lg:w-1/3" />
		</div>
		<div>
			<span class="block text-sm text-nas-purple-600">Client Secret</span>
			<input type="text" value={data.app.clientSecret} readonly class="p-2 border border-nas-purple bg-gray-100 w-full sm:w-2/3 md:w-1/2 lg:w-1/3" />
		</div>

		<Button>Save Changes</Button>
	</form>
{:else}
	<form {...editCasService} class="flex flex-col gap-2 mt-4">
		<input type="hidden" name="id" value={data.app.id} />
		<label>
			<span class="block text-sm text-nas-purple-600">Name</span>
			<input
				{...editCasService.fields.name.as('text')}
				value={data.app.name}
				class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
			/>
		</label>
		<label>
			<span class="block text-sm text-nas-purple-600">Service URL</span>
			<input
				{...editCasService.fields.serviceUrl.as('text')}
				value={data.app.serviceUrl}
				class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3"
			/>
		</label>
		<Button>Save Changes</Button>
	</form>
{/if}
