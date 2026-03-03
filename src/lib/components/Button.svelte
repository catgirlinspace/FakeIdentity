<script lang="ts">
    import type {Snippet} from 'svelte'

    type Props = {
        onclick?: () => void;
		children: Snippet;
		class?: string;
    } & (
	    { type?: 'button'; } | {
        type: 'link';
		href: string;
    })

    let { onclick, children, class: className, ...props }: Props = $props();
</script>

{#if props.type === 'link'}
    <a href={props.href} class="bg-nas-purple-600 hover:bg-nas-purple-700 text-nas-pink-50 p-2 {className}">
        {@render children()}
    </a>
{:else}
    <button {onclick} class="bg-nas-purple-600 hover:bg-nas-purple-700 text-nas-pink-50 p-2 {className}">
        {@render children()}
    </button>
{/if}
