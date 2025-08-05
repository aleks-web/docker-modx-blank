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
		ariaLabel = 'Logout icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	fill="none"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
    stroke-width={strokeWidth}
>
	<path d="M13 16L18 12L13 8V11H4V13H13V16Z" fill="currentColor" />
	<path d="M20 3H11C9.897 3 9 3.897 9 5V9H11V5H20V19H11V15H9V19C9 20.103 9.897 21 11 21H20C21.103 21 22 20.103 22 19V5C22 3.897 21.103 3 20 3Z" fill="currentColor" />
</svg>