<script>
	import Button from "$lib/components/Button.svelte";

	const {data} = $props();
</script>

<svelte:head>
    <title>Accounts</title>
</svelte:head>

<h1 class="text-2xl font-bold">Accounts</h1>
<span class="text-lg text-nas-purple-700">Manage fake identities used for signing into services</span>

<Button class="float-right" type="link" href="/accounts/create">+ New</Button>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
    {#each data.accounts as account}
        <div class="bg-nas-purple-100 border border-nas-purple p-4">
            <p class="text-xl font-semibold">{account.name}</p>
            <p class="text-nas-purple-700">@{account.username}</p>
        </div>
    {/each}
</div>

{#if data.accounts.length === 0}
    <p class="text-nas-purple-500">No accounts found.</p>
{/if}