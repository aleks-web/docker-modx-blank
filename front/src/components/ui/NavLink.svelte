<script lang="ts">
	import { page } from '$app/state';
	import { ChevronRight } from '$icons';
	import { goto } from '$lib/support/request';
	import type { TLink } from '$src/lib/types/TLink';
	import { twMerge } from 'tailwind-merge';

	const props: TLink & { onclick?: (e: any) => void } & any = $props();
	let clickHandler = $state((e: any) => {
		if (props.path) {
			e.preventDefault();
			e.stopPropagation();
			goto(props.path);
		}
	});
	if (props.onclick) {
		clickHandler = props.onclick;
	}
	const isLink = () => props.path;
</script>

<svelte:element
		this={isLink() ? 'a' : 'div'}
		role={isLink() ? 'link' : 'button'}
		href={isLink() ? props.path : null}
		onclick={clickHandler}
		class:active={page.url.pathname.includes('' + props.path)}
		class={twMerge(
			`flex cursor-pointer items-center justify-between overflow-hidden rounded-lg pr-3
                transition-all
                hover:bg-[var(--clr-main)] hover:text-white
                md:text-[12px] lg:text-[14px] dark:text-default
               [.active]:bg-[var(--clr-main)] [.active]:font-bold [.active]:text-white`,
			props.className
		)}
        data-path={props.path}
	>
    <span class="flex h-[45px] items-center justify-center pl-[12px]">
        {#if props.icon}
            <span class="mr-[12px] box-content flex h-[45px] items-center justify-center leading-[0]">
                <span class="flex w-[18px] max-w-[18px]"><props.icon /></span>
            </span>
        {/if}
        <span class="pr-4 leading-[12px] group-[.full]:block">{props.name}</span>
    </span>

    {#if Array.isArray(props.submenu)}
        <span class=" group-[.full]:block"><ChevronRight size="xs" class={'fill-current'} /></span>
    {/if}
</svelte:element>