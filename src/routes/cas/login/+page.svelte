<script lang="ts">
	import {enhance} from '$app/forms'
	import {LoaderCircle} from 'lucide-svelte'

	let {data, form} = $props()
	let canSelect = $state(true)
	let loadingAccountId = $state<string | null>(null)
</script>

{#if form?.error}
    <p class="text-red-500 text-center">{form.error}</p>
{/if}

<h1 class="text-2xl font-bold text-center">CAS Authentication</h1>
<p class="text-lg text-center">
    Authenticating to CAS service
    <a
            href={data.service}
            class="underline text-nas-purple-500"
            target="_blank"
            rel="noopener noreferrer external"
    >
        {data.service}
    </a>
</p>

<p class="text-gray-500 text-center">Select a user to authenticate as...</p>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center mt-4">
    {#each data.accounts as account (account.id)}
        <div class="bg-nas-purple-100 border border-nas-purple p-4">
            <h2 class="text-xl font-semibold">{account.name}</h2>
            <p class="text-nas-purple-700">@{account.username}</p>
            <div class="p-6 pt-0">
                <form
                        method="POST"
                        action="?/authenticate&service={data.service}"
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
                    <button
                            type="submit"
                            class="w-full text-sm font-semibold py-2 px-4 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
    <title>CAS Authentication</title>
</svelte:head>
