<script lang="ts">
	import { getContext } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import type { OutlineBaseProps, OutlineProps } from './types';

	const ctx: OutlineBaseProps = getContext('iconCtx') ?? {};
	const sizes = {
		xs: 'w-3 h-3',
		sm: 'w-4 h-4',
		md: 'w-5 h-5',
		lg: 'w-6 h-6',
		xl: 'w-8 h-8'
	};

	let {
		size = ctx.size || 'md',
		color = ctx.color || 'currentColor',
		strokeWidth = ctx.strokeWidth || '1',
		class: className,
		ariaLabel = 'Barcode icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 20 20"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
>
    <path d="M4.995 10C4.995 12.761 7.241 15.007 10.002 15.007C12.763 15.007 15.009 12.761 15.009 10C15.009 7.239 12.763 4.993 10.002 4.993C7.241 4.993 4.995 7.239 4.995 10ZM9 17H11V20H9V17ZM9 0H11V3H9V0ZM0 9H3V11H0V9ZM17 9H20V11H17V9ZM3.637 17.778L2.223 16.364L4.344 14.243L5.758 15.657L3.637 17.778ZM14.242 4.344L16.364 2.222L17.778 3.636L15.656 5.758L14.242 4.344ZM4.344 5.759L2.223 3.637L3.638 2.223L5.758 4.345L4.344 5.759ZM17.778 16.364L16.364 17.778L14.242 15.656L15.656 14.242L17.778 16.364Z" fill="currentColor"/>
</svg>