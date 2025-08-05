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
		xl: 'w-7 h-7'
	};

	let {
		size = ctx.size || 'md',
		color = ctx.color || 'currentColor',
		strokeWidth = ctx.strokeWidth || '1',
		class: className,
		ariaLabel = 'Play icon',
		...restProps
	}: OutlineProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 9 10"
	fill="currentColor"
	{color}
	{...restProps}
	class={twMerge(sizes[size], className)}
	aria-label={ariaLabel}
    stroke-width={strokeWidth}
>
	<path d="M8.23903 5.88448C8.81763 5.43679 8.81763 4.56327 8.23903 4.11557C6.49046 2.76259 4.53793 1.69617 2.45453 0.956223L2.07392 0.821044C1.34576 0.562429 0.576631 1.05509 0.478054 1.80674C0.202628 3.90687 0.202628 6.09319 0.478054 8.19332C0.576631 8.94497 1.34576 9.43763 2.07392 9.17902L2.45453 9.04384C4.53793 8.30389 6.49046 7.23747 8.23903 5.88448Z" fill="currentColor" />
</svg>