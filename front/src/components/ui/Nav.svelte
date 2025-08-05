<script lang="ts">
	import type { TLink } from "$src/lib/types/TLink";
	import type { Snippet } from "svelte";
	import { twMerge } from "tailwind-merge";
	import NavLink from "./NavLink.svelte";
	import Popover from "./Popover.svelte";
    import Nav from './Nav.svelte'

    const { links, before, after, class: className, skipPortal }: {links: TLink[], before?: Snippet<[]>, after?: Snippet<[]>, children?:()=>any, skipPortal?:boolean }&any = $props();
</script>

{#snippet linkWrap(props: TLink, skipPortal: boolean = false, className?: string)}
	{#if Array.isArray(props.submenu)}
		<Popover
			trigger={'mouseenter'}
			horizontal="right"
			vertical={'top-border'}
			popoverClass={'!rounded-lg'}
			{skipPortal}
			showArrow={true}
		>
			{#snippet popoverContent()}
				<Nav
					class="gap-0 overflow-hidden rounded-lg dark:bg-default dark:text-default"
                    links={props.submenu}
				/>
			{/snippet}
            <NavLink {...props} class={className}/>
		</Popover>
	{:else}
		<NavLink {...props} class={className}/>
	{/if}
{/snippet}

<div class={twMerge("flex flex-col gap-1", className)}>
    {@render before?.()}
    {#each links as link }
        {@render linkWrap(link, !!skipPortal, className)}  
    {/each}  
    {@render after?.()}
</div>