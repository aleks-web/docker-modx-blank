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
	viewBox="0 0 16 16"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
>

    <path d="M8.47184 1.52866C8.40998 1.46669 8.33651 1.41754 8.25564 1.384C8.17476 1.35045 8.08807 1.33319 8.00051 1.33319C7.91295 1.33319 7.82626 1.35045 7.74538 1.384C7.6645 1.41754 7.59103 1.46669 7.52918 1.52866L1.52918 7.52866C1.43597 7.62189 1.3725 7.74067 1.34679 7.86997C1.32107 7.99927 1.33428 8.13329 1.38472 8.25509C1.43517 8.37689 1.5206 8.481 1.6302 8.55426C1.73981 8.62752 1.86868 8.66663 2.00051 8.66666H2.66718V13.3333C2.66718 14.0687 3.26518 14.6667 4.00051 14.6667H12.0005C12.7358 14.6667 13.3338 14.0687 13.3338 13.3333V8.66666H14.0005C14.1325 8.66695 14.2616 8.62802 14.3714 8.55482C14.4812 8.48162 14.5668 8.37744 14.6173 8.25551C14.6678 8.13358 14.6809 7.99939 14.655 7.86998C14.6291 7.74057 14.5654 7.62177 14.4718 7.52866L8.47184 1.52866ZM12.0012 13.3333H4.00051V6.94266L8.00051 2.94266L12.0005 6.94266V9.99999L12.0012 13.3333Z" fill="currentColor"></path><path d="M8.66732 6.66669H7.33398V8.66669H5.33398V10H7.33398V12H8.66732V10H10.6673V8.66669H8.66732V6.66669Z" fill="currentColor"></path>
</svg>