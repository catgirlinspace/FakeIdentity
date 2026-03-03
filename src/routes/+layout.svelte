<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-nas-purple-50 text-nas-purple-950">
	<nav class="border-b border-gray-200 bg-white p-4 md:p-8">
		<div class="container mx-auto flex gap-4">
			<a href="/" class="font-medium text-nas-purple-500">
				FakeIdentity
			</a>
			<div class="grow"></div>
			<a
				href="/"
				class=" hover:text-nas-purple-500 transition-colors {page.url.pathname === '/' ? 'text-nas-purple-400 font-semibold' : 'text-gray-900'}"
			>
				Accounts
			</a>
			<a
				href="/applications"
				class="hover:text-nas-purple-500 transition-colors {page.url.pathname === '/applications' ? 'text-nas-purple-400 font-semibold' : 'text-gray-900'}"
			>
				Applications
			</a>
		</div>
	</nav>
	<main>
		<div class="container mx-auto p-4 sm:p-8">
			{@render children()}
		</div>
	</main>
</div>
