<script lang="ts">
	import {createAccount} from './create.remote'
	import Button from '$lib/components/Button.svelte'
</script>

<svelte:head>
    <title>Create Account</title>
</svelte:head>

<h1 class="text-2xl font-bold">Create Account</h1>
<span class="text-lg text-nas-purple-700">Create a new fake identity to use for signing into services</span>

<form {...createAccount} class="flex flex-col gap-2">
    <label>
        <span class="block text-sm text-nas-purple-600">Username</span>
        <input {...createAccount.fields.username.as('text')} class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3" />
    </label>
    <label>
        <span class="block text-sm text-nas-purple-600">Name</span>
        <input {...createAccount.fields.name.as('text')} class="p-2 border border-nas-purple w-full sm:w-2/3 md:w-1/2 lg:w-1/3" />
    </label>
    <Button>Create</Button>
</form>