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
		ariaLabel = 'SadSmiley icon',
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
	<path d="M8.00065 1.33331C4.32465 1.33331 1.33398 4.32398 1.33398 7.99998C1.33398 11.676 4.32465 14.6666 8.00065 14.6666C11.6767 14.6666 14.6673 11.676 14.6673 7.99998C14.6673 4.32398 11.6767 1.33331 8.00065 1.33331ZM8.00065 13.3333C5.05998 13.3333 2.66732 10.9406 2.66732 7.99998C2.66732 5.05931 5.05998 2.66665 8.00065 2.66665C10.9413 2.66665 13.334 5.05931 13.334 7.99998C13.334 10.9406 10.9413 13.3333 8.00065 13.3333Z" fill="currentColor"/>
	<path d="M5.66602 8C6.2183 8 6.66602 7.55228 6.66602 7C6.66602 6.44772 6.2183 6 5.66602 6C5.11373 6 4.66602 6.44772 4.66602 7C4.66602 7.55228 5.11373 8 5.66602 8Z" fill="currentColor"/>
	<path d="M10.3293 7.99067C10.879 7.99067 11.3247 7.54504 11.3247 6.99533C11.3247 6.44563 10.879 6 10.3293 6C9.77961 6 9.33398 6.44563 9.33398 6.99533C9.33398 7.54504 9.77961 7.99067 10.3293 7.99067Z" fill="currentColor"/>
	<path d="M5.31641 10H10.6671V11.3333H5.31641V10Z" fill="currentColor"/>
</svg>