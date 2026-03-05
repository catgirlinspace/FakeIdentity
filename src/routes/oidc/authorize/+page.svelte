<script lang="ts">
	import { enhance } from '$app/forms';
	import { LoaderCircle } from 'lucide-svelte';

	let { data, form } = $props();
	let canSelect = $state(true);
	let loadingAccountId = $state<string | null>(null);

	let requestedScopes = $derived(data.scope.split(' '));
	let excludedScopes = $state<string[]>([]);
	let grantedScopes = $derived(requestedScopes.filter((s) => !excludedScopes.includes(s)));
	let grantedScopesString = $derived(grantedScopes.join(' '));

	function toggleScope(scope: string) {
		if (scope === 'openid') return;
		if (excludedScopes.includes(scope)) {
			excludedScopes = excludedScopes.filter((s) => s !== scope);
		} else {
			excludedScopes = [...excludedScopes, scope];
		}
	}
</script>

{#if form?.error}
	<p class="text-red-500 text-center">{form.error}</p>
{/if}

<h1 class="text-2xl font-bold text-center">OIDC Authorization</h1>
<p class="text-lg text-center">
	<span class="font-semibold">{data.clientName}</span> is requesting access
</p>

<div class="flex flex-wrap gap-3 justify-center mt-4">
	{#each requestedScopes as scope (scope)}
		<label class="flex items-center gap-2 px-3 py-1 border border-nas-purple cursor-pointer select-none"
			   class:bg-nas-purple-100={grantedScopes.includes(scope)}
		>
			<input
				type="checkbox"
				checked={grantedScopes.includes(scope)}
				disabled={scope === 'openid'}
				onchange={() => toggleScope(scope)}
			/>
			{scope}
		</label>
	{/each}
</div>

<p class="text-gray-500 text-center mt-4">Select a user to authorize as...</p>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center mt-4">
	{#each data.accounts as account (account.id)}
		<div class="bg-nas-purple-100 border border-nas-purple p-4">
			<h2 class="text-xl font-semibold">{account.name}</h2>
			<p class="text-nas-purple-700">@{account.username}</p>
			<div class="p-6 pt-4">
				<form
					method="POST"
					action="?/authorize"
					use:enhance={() => {
						canSelect = false;
						loadingAccountId = account.id;
						return async ({ update }) => {
							await update();
							canSelect = true;
							loadingAccountId = null;
						};
					}}
				>
					<input type="hidden" name="accountId" value={account.id} />
					<input type="hidden" name="clientId" value={data.clientId} />
					<input type="hidden" name="redirectUri" value={data.redirectUri} />
					<input type="hidden" name="state" value={data.state} />
					<input type="hidden" name="nonce" value={data.nonce} />
					<input type="hidden" name="grantedScopes" value={grantedScopesString} />
					<button
						type="submit"
						class="w-full text-sm font-semibold py-2 px-4 bg-nas-purple-600 hover:bg-nas-purple-700 text-nas-pink-50 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!canSelect}
					>
						{#if loadingAccountId === account.id}
							<LoaderCircle class="animate-spin mx-auto" />
						{:else}
							Select
						{/if}
					</button>
				</form>
			</div>
		</div>
	{/each}
</div>

<svelte:head>
	<title>OIDC Authorization</title>
</svelte:head>
